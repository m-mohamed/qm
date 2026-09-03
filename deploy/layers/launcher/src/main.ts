import { BUOYS } from "./ocean/buoys";
import { createRenderer, type ViewSnapshot } from "./ocean/renderer";

const body = document.body;
const canvas = document.querySelector<HTMLCanvasElement>("#ocean-canvas");
const buoyLinks = new Map(
  [...document.querySelectorAll<HTMLElement>("[data-island]")].map((element) => [element.dataset.island, element]),
);

const intro = document.querySelector<HTMLElement>(".studio-intro");

function positionBuoyLinks({ viewProjection, size, anchors }: ViewSnapshot): void {
  // On narrow screens the labels must clear the intro copy.
  const minTop = size[0] < 700 && intro ? Math.max(138, intro.getBoundingClientRect().bottom + 26) : 138;
  for (const buoy of BUOYS) {
    const element = buoyLinks.get(buoy.id);
    if (!element) continue;
    // Before the first simulated frame, park the label above the mooring spot.
    const anchor = anchors?.get(buoy.id) ?? [buoy.anchor[0], 7 * buoy.scale, buoy.anchor[1]];
    const [left, top] = project(anchor, viewProjection, size);
    const halfWidth = Math.max(88, element.offsetWidth / 2);
    const safeLeft = clamp(left, halfWidth + 10, size[0] - halfWidth - 10);
    const safeTop = clamp(top, minTop, size[1] - 110);
    element.style.setProperty("--island-left", `${safeLeft.toFixed(2)}px`);
    element.style.setProperty("--island-top", `${safeTop.toFixed(2)}px`);
  }
}

function project(
  point: readonly [number, number, number],
  matrix: Float32Array,
  size: readonly [number, number],
): readonly [number, number] {
  const [x, y, z] = point;
  const clipX = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12];
  const clipY = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
  const clipW = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
  const inverseW = clipW === 0 ? 1 : 1 / clipW;
  return [(clipX * inverseW * 0.5 + 0.5) * size[0], (-clipY * inverseW * 0.5 + 0.5) * size[1]];
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

const supportsWebGpu = "gpu" in navigator && Boolean((navigator as Navigator & { gpu?: unknown }).gpu);

let debugPanel: HTMLPreElement | null = null;

function reportDebug(stage: string, error: unknown): void {
  if (window.location.hash !== "#debug") return;
  if (!debugPanel) {
    debugPanel = document.createElement("pre");
    debugPanel.style.cssText =
      "position:fixed;left:8px;right:8px;bottom:8px;z-index:99;max-height:40vh;overflow:auto;" +
      "margin:0;padding:10px;background:rgba(0,0,0,.82);color:#9fe08d;font:11px/1.4 monospace;white-space:pre-wrap;";
    document.body.append(debugPanel);
  }
  const detail = error instanceof Error ? `${error.name}: ${error.message}\n${error.stack ?? ""}` : String(error);
  debugPanel.textContent = `${debugPanel.textContent}[ocean ${stage}] ${detail}\n`.slice(-2400);
}

function revertToFallback(stage: string, error: unknown): void {
  console.error("The live ocean stopped.", error);
  body.dataset.ocean = "fallback";
  delete body.dataset.islands;
  reportDebug(stage, error);
}

if (!canvas || !supportsWebGpu) {
  body.dataset.ocean = "fallback";
  if (!supportsWebGpu) reportDebug("gate", "navigator.gpu is unavailable");
} else {
  const renderer = createRenderer({
    canvas,
    onView: positionBuoyLinks,
    onFatal: (error) => revertToFallback("frame", error),
    onDiag: (line) => reportDebug("vitals", line),
    onGpu: (gpu) => {
      if (window.location.hash !== "#debug") return;
      reportDebug("info", `ua: ${navigator.userAgent}`);
      // WebGPU validation failures are asynchronous: draws silently no-op
      // instead of throwing. Surface them on-page for phone diagnosis.
      const wrapper = (gpu as unknown as { device?: unknown }).device;
      const raw =
        wrapper && typeof wrapper === "object" && "raw" in wrapper ? (wrapper as { raw?: unknown }).raw : wrapper;
      const device = raw as
        | {
            addEventListener?: (type: string, listener: (event: { error?: { message?: string } }) => void) => void;
          }
        | undefined;
      device?.addEventListener?.("uncapturederror", (event) => {
        reportDebug("gpu", event.error?.message ?? "uncaptured GPU error");
      });
    },
  });
  // The theme toggle doubles as day/night for the scene: dark mode raises the
  // moon and hands the sea to the buoy lights.
  const root = document.documentElement;
  const syncNight = () => renderer.setNight(root.dataset.theme === "dark");
  syncNight();
  const themeObserver = new MutationObserver(syncNight);
  themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  try {
    await renderer.ready;
    requestAnimationFrame(() => {
      body.dataset.ocean = "ready";
      body.dataset.islands = "ready";
    });
    window.addEventListener("pagehide", () => renderer.dispose(), { once: true });
  } catch (error) {
    revertToFallback("init", error);
    renderer.dispose();
  }
}
