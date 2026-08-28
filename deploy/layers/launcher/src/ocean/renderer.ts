import { clock, frameLoop, surface, type Gpu, type Surface } from "vgpu";
import { perspectiveCamera } from "vgpu/scene";

import { buildOcean, OCEAN_CAMERA, type OceanScene } from "./scene";

export type ViewSnapshot = {
  readonly viewProjection: Float32Array;
  readonly size: readonly [number, number];
};

type RendererOptions = {
  readonly canvas: HTMLCanvasElement;
  readonly onView: (snapshot: ViewSnapshot) => void;
};

export function createRenderer({ canvas, onView }: RendererOptions) {
  let disposed = false;
  let failed = false;
  let gpu: Gpu | undefined;
  let output: Surface | undefined;
  let scene: OceanScene | undefined;
  let camera: ReturnType<typeof perspectiveCamera> | undefined;
  let loop: { stop(): void } | undefined;
  let unsubscribeResize: (() => void) | undefined;

  function dispose(): void {
    if (disposed) return;
    disposed = true;
    runCleanups([() => loop?.stop(), () => unsubscribeResize?.(), () => gpu?.dispose()]);
  }

  function fail(error: unknown): never {
    failed = true;
    try {
      dispose();
    } catch {
      // Teardown must not replace the render, resize, or initialization error.
    }
    throw error;
  }

  function guard<T>(action: () => T): T {
    try {
      return action();
    } catch (error) {
      return fail(error);
    }
  }

  function notifyView(): void {
    if (!camera) return;
    onView({
      viewProjection: camera.viewProjection,
      size: [Math.max(1, canvas.clientWidth), Math.max(1, canvas.clientHeight)],
    });
  }

  function resizeScene(): void {
    guard(() => {
      if (!scene || !camera || !output) return;
      scene.resize(output.size);
      camera.set({ aspect: output.size[0] / output.size[1] });
      notifyView();
    });
  }

  const initialize = async () => {
    const { init } = await import("vgpu");
    if (disposed) return;
    const nextGpu = await init();
    if (disposed) {
      nextGpu.dispose();
      return;
    }

    gpu = nextGpu;
    output = surface(gpu, canvas, { dpr: [1, 2] });
    scene = buildOcean(gpu, output.size);
    camera = perspectiveCamera({
      ...OCEAN_CAMERA,
      aspect: output.size[0] / output.size[1],
    });
    unsubscribeResize = output.onResize(resizeScene);
    notifyView();

    const time = clock(gpu);
    loop = frameLoop(gpu, (currentFrame) => {
      guard(() => {
        if (disposed || !output || !scene || !camera) return;
        scene.simulate(time.deltaTime);
        scene.updateCamera(camera.viewProjection, camera.worldPosition);
        currentFrame.pass({ target: scene.hdr, clear: scene.clear }, (pass) => {
          pass.draw(scene!.skydome);
          pass.draw(scene!.ocean);
          pass.draw(scene!.islands);
        });
        currentFrame.pass(output, scene.composite);
      });
    });
  };

  const ready = initialize().catch((error: unknown) => {
    if (disposed && !failed) return;
    fail(error);
  });

  return { ready, dispose };
}

function runCleanups(cleanups: readonly (() => void)[]): void {
  const errors: unknown[] = [];
  for (const cleanup of cleanups) {
    try {
      cleanup();
    } catch (error) {
      errors.push(error);
    }
  }
  if (errors.length) throw errors[0];
}
