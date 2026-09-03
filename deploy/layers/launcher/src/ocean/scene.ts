import { compute, draw, effect, geometry, sampler, storage, target, type Gpu } from "vgpu";
import { sphere } from "vgpu/scene";

import bakeShader from "./bake.wgsl";
import { buildBuoyMesh, buildWakeRing, buoyVertexData } from "./buoy-mesh";
import buoyWgsl from "./buoy.wgsl";
import { BUOYS, PROBE_WIDTH, probeUniform } from "./buoys";
import compositeWgsl from "./composite.wgsl";
import fftColWgsl from "./fft-col.wgsl";
import fftRowWgsl from "./fft-row.wgsl";
import nightGradeWgsl from "./night-grade.wgsl";
import oceanSurfaceWgsl from "./ocean-surface.wgsl";
import probeWgsl from "./probe.wgsl";
import vitalsWgsl from "./vitals.wgsl";
import wakeWgsl from "./wake.wgsl";
import skydomeWgsl from "./skydome.wgsl";
import spectrumInitWgsl from "./spectrum-init.wgsl";
import spectrumUpdateWgsl from "./spectrum-update.wgsl";

export const OCEAN_CAMERA = {
  fov: 48,
  near: 1,
  far: 8000,
  position: [0, 24, 128] as const,
  target: [0, 5, 0] as const,
};

export const DEFAULT_PARAMS = {
  windSpeed: 24,
  windAngle: 18,
  amplitude: 4,
  patchSize: 265,
  heightScale: 34,
  choppyScale: 14,
  foamScale: 0.5,
  sunElevation: 6.5,
  sunAzimuth: 236,
  timeScale: 1,
};

export type OceanParams = typeof DEFAULT_PARAMS;
type Destroyable = { destroy(): void };
type Size = readonly [number, number];

const N = 256;
const COMPLEX_BYTES = N * N * 2 * 4;
const VEC4_BYTES = N * N * 4 * 4;
const GRID = 512;
const WORLD_SIZE = 1000;
const SKY_RADIUS = 6000;
const DEG = Math.PI / 180;
const CLEAR = [0.02, 0.02, 0.04, 1] as const;

export function buildOcean(gpu: Gpu, size: Size) {
  const resources = new Set<object>();
  const own = <T extends object>(resource: T): T => {
    resources.add(resource);
    return resource;
  };
  const release = (resource: object): void => {
    resources.delete(resource);
    (resource as Destroyable).destroy();
  };

  try {
    const params: OceanParams = { ...DEFAULT_PARAMS };
    let nightCurrent = 0;
    let nightTarget = 0;
    // The moon must land inside the fixed camera's frustum: low over the
    // water, swung toward the center of frame, with its glitter path facing
    // the viewer.
    const dayElevation = DEFAULT_PARAMS.sunElevation;
    const dayAzimuth = DEFAULT_PARAMS.sunAzimuth;
    const moonElevation = 12;
    const moonAzimuth = 258;
    const windDir = (): [number, number] => {
      const angle = params.windAngle * DEG;
      return [Math.cos(angle), Math.sin(angle)];
    };
    const sunDir = (): [number, number, number] => {
      const elevation = params.sunElevation * DEG;
      const azimuth = params.sunAzimuth * DEG;
      return [Math.cos(elevation) * Math.cos(azimuth), Math.sin(elevation), Math.cos(elevation) * Math.sin(azimuth)];
    };
    const simUniform = (time: number) => ({
      windDir: windDir(),
      windSpeed: params.windSpeed,
      amplitude: params.amplitude,
      patchSize: params.patchSize,
      time,
    });
    const skyUniform = (viewProj: Float32Array, camPos: readonly [number, number, number], sun = sunDir()) => ({
      viewProj,
      camPos,
      radius: SKY_RADIUS,
      sunDir: sun,
    });

    let h0 = own(storage(gpu, VEC4_BYTES, "read-write"));
    const specX = own(storage(gpu, COMPLEX_BYTES, "read-write"));
    const specY = own(storage(gpu, COMPLEX_BYTES, "read-write"));
    const specZ = own(storage(gpu, COMPLEX_BYTES, "read-write"));
    const tmpX = own(storage(gpu, COMPLEX_BYTES, "read-write"));
    const tmpY = own(storage(gpu, COMPLEX_BYTES, "read-write"));
    const tmpZ = own(storage(gpu, COMPLEX_BYTES, "read-write"));
    const displacement = own(storage(gpu, VEC4_BYTES, "read-write"));

    const initPass = compute(gpu, spectrumInitWgsl, {
      set: { h0, sim: simUniform(0) },
    });
    const updatePass = compute(gpu, spectrumUpdateWgsl, {
      set: { h0, specX, specY, specZ, sim: simUniform(0) },
    });
    const rowPass = compute(gpu, fftRowWgsl, {
      set: {
        inX: specX,
        inY: specY,
        inZ: specZ,
        outX: tmpX,
        outY: tmpY,
        outZ: tmpZ,
      },
    });
    const colPass = compute(gpu, fftColWgsl, {
      set: { inX: tmpX, inY: tmpY, inZ: tmpZ, disp: displacement },
    });

    const displacementTarget = own(target(gpu, { size: [N, N], format: "rgba16float" }));
    const displacementSampler = sampler(gpu, {
      addressModeU: "repeat",
      addressModeV: "repeat",
      minFilter: "linear",
      magFilter: "linear",
    });
    const bake = effect(gpu, bakeShader, {
      set: { disp: displacement },
    });

    const skyGeometry = own(geometry(gpu, sphere({ radius: 1 })));
    const identity = new Float32Array(16);
    const skydome = draw(gpu, {
      shader: skydomeWgsl,
      geometry: skyGeometry,
      cull: "front",
      set: { u: skyUniform(identity, [0, 0, 0]) },
    });
    const ocean = draw(gpu, {
      shader: oceanSurfaceWgsl,
      cull: "none",
      constants: { GRID },
      vertices: 6 * GRID * GRID,
      set: {
        u: oceanUniform(identity, [0, 0, 0]),
        disp: displacementTarget,
        dispSamp: displacementSampler,
      },
    });
    const buoyMesh = buildBuoyMesh();
    const buoyVertices = buoyVertexData(buoyMesh);
    const buoyInstances = new Float32Array(BUOYS.length * 20);
    const buoyGeometry = own(
      geometry(gpu, {
        label: "sw-capital-buoys",
        buffers: [
          {
            data: buoyVertices.buffer as ArrayBuffer,
            stride: 40,
            attributes: {
              position: "float32x3",
              normal: "float32x3",
              color: "float32x3",
              emissive: "float32",
            },
          },
          {
            data: buoyInstances.buffer as ArrayBuffer,
            stride: 80,
            stepMode: "instance",
            attributes: {
              m0: "float32x4",
              m1: "float32x4",
              m2: "float32x4",
              m3: "float32x4",
              light: "float32x4",
            },
          },
        ],
      }),
    );
    const buoys = draw(gpu, {
      shader: buoyWgsl,
      geometry: buoyGeometry,
      cull: "back",
      set: {
        u: buoyUniform(identity, [0, 0, 0], sunDir(), 0),
      },
    });

    // Tiny probe target the CPU reads back for the buoy mooring dynamics.
    const probeTarget = own(target(gpu, { size: [PROBE_WIDTH, 1], format: "rgba16float" }));
    const probe = effect(gpu, probeWgsl, {
      set: {
        u: probeUniform(params),
        disp: displacementTarget,
        dispSamp: displacementSampler,
      },
    });

    // Water decals: foam collar + contact shadow (alpha) and the navigation
    // light's pool (additive), sharing one geometry and instance stream.
    const wakeInstances = new Float32Array(BUOYS.length * 8);
    const wakeGeometry = own(
      geometry(gpu, {
        label: "sw-capital-wakes",
        buffers: [
          {
            data: buildWakeRing().buffer as ArrayBuffer,
            stride: 12,
            attributes: { ring: "float32x3" },
          },
          {
            data: wakeInstances.buffer as ArrayBuffer,
            stride: 32,
            stepMode: "instance",
            attributes: { deco0: "float32x4", deco1: "float32x4" },
          },
        ],
      }),
    );
    const wake = draw(gpu, {
      shader: wakeWgsl,
      geometry: wakeGeometry,
      cull: "none",
      blend: "alpha",
      depth: { write: false },
      set: {
        u: wakeUniform(identity, 0),
        disp: displacementTarget,
        dispSamp: displacementSampler,
      },
    });
    const lightPool = draw(gpu, {
      shader: wakeWgsl,
      geometry: wakeGeometry,
      entry: { vertex: "vs_pool", fragment: "fs_pool" },
      cull: "none",
      blend: "additive",
      depth: { write: false },
      set: {
        u: wakeUniform(identity, 0),
        disp: displacementTarget,
        dispSamp: displacementSampler,
      },
    });

    let hdr = own(
      target(gpu, {
        size: [size[0], size[1]],
        format: "rgba16float",
        depth: true,
      }),
    );
    let graded = own(
      target(gpu, {
        size: [size[0], size[1]],
        format: "rgba16float",
      }),
    );
    const linearSampler = sampler(gpu, {
      minFilter: "linear",
      magFilter: "linear",
    });
    // Day-for-night sits between the vendored HDR scene and the vendored
    // composite; at night = 0 it is a pass-through.
    const grade = effect(gpu, nightGradeWgsl, {
      set: { u: { night: 0 }, src: hdr, samp: linearSampler },
    });
    const composite = effect(gpu, compositeWgsl, {
      set: { src: graded, samp: linearSampler },
    });
    // 1x1 liveness probe: proves real color is coming out of the pipeline.
    const vitalsTarget = own(target(gpu, { size: [1, 1], format: "rgba16float" }));
    const vitals = effect(gpu, vitalsWgsl, {
      set: { src: graded, samp: linearSampler },
    });
    let simTime = 0;
    let destroyed = false;

    initPass.set({ sim: simUniform(0) });
    initPass.dispatch(N / 8, N / 8);

    return {
      params,
      get hdr() {
        return hdr;
      },
      skydome,
      ocean,
      buoys,
      wake,
      lightPool,
      composite,
      grade,
      get graded() {
        return graded;
      },
      clear: CLEAR,
      buoyMastTop: buoyMesh.mastTop,
      buoyWaterline: buoyMesh.waterline,
      setNight(targetValue: number) {
        nightTarget = Math.min(1, Math.max(0, targetValue));
      },
      updateBuoys(instances: Float32Array<ArrayBuffer>) {
        buoyGeometry.buffers[1].write(instances);
      },
      updateWake(instances: Float32Array<ArrayBuffer>) {
        wakeGeometry.buffers[1].write(instances);
      },
      readProbe() {
        return probeTarget.readFloats();
      },
      checkVitals() {
        vitals.draw(vitalsTarget);
        return vitalsTarget.readFloats();
      },
      rebuildSpectrum() {
        const nextH0 = own(storage(gpu, VEC4_BYTES, "read-write"));
        try {
          const nextPass = compute(gpu, spectrumInitWgsl, {
            set: { h0: nextH0, sim: simUniform(0) },
          });
          nextPass.dispatch(N / 8, N / 8);
          updatePass.set({ h0: nextH0 });
        } catch (error) {
          rethrow(error, () => release(nextH0));
        }
        const previous = h0;
        h0 = nextH0;
        release(previous);
      },
      simulate(dt: number) {
        simTime += dt * params.timeScale;
        // Ease day/night; the sun climbs into the pale moon via the official
        // sunElevation param — the vendored sky/water shaders do the rest.
        nightCurrent += (nightTarget - nightCurrent) * (1 - Math.exp(-dt / 1.2));
        params.sunElevation = dayElevation + (moonElevation - dayElevation) * nightCurrent;
        params.sunAzimuth = dayAzimuth + (moonAzimuth - dayAzimuth) * nightCurrent;
        updatePass.set({ sim: simUniform(simTime) });
        updatePass.dispatch(N / 8, N / 8);
        rowPass.dispatch(N, 1);
        colPass.dispatch(N, 1);
        bake.draw(displacementTarget);
        probe.draw(probeTarget);
      },
      updateCamera(viewProj: Float32Array, camPos: Float32Array) {
        const position: [number, number, number] = [camPos[0], camPos[1], camPos[2]];
        const sun = sunDir();
        skydome.set({ u: skyUniform(viewProj, position, sun) });
        ocean.set({ u: oceanUniform(viewProj, position, sun) });
        buoys.set({ u: buoyUniform(viewProj, position, sun, simTime, nightCurrent) });
        const decalUniform = wakeUniform(viewProj, simTime);
        wake.set({ u: decalUniform });
        lightPool.set({ u: decalUniform });

        // Project the light direction to screen space so the night grade can
        // replace the sun's halo with a crisp moon at the right spot.
        const px = position[0] + sun[0] * 5000;
        const py = position[1] + sun[1] * 5000;
        const pz = position[2] + sun[2] * 5000;
        const cw = viewProj[3] * px + viewProj[7] * py + viewProj[11] * pz + viewProj[15];
        let moonU = -10;
        let moonV = -10;
        if (cw > 0) {
          const cx = viewProj[0] * px + viewProj[4] * py + viewProj[8] * pz + viewProj[12];
          const cy = viewProj[1] * px + viewProj[5] * py + viewProj[9] * pz + viewProj[13];
          moonU = (cx / cw) * 0.5 + 0.5;
          moonV = 1 - ((cy / cw) * 0.5 + 0.5);
        }
        grade.set({
          u: {
            night: nightCurrent,
            aspect: hdr.size[0] / Math.max(1, hdr.size[1]),
            moonPos: [moonU, moonV],
            moonRadius: 0.05,
          },
        });
      },
      resize(size: Size) {
        if (hdr.size[0] === size[0] && hdr.size[1] === size[1]) return;
        const nextHdr = own(
          target(gpu, {
            size: [size[0], size[1]],
            format: "rgba16float",
            depth: true,
          }),
        );
        const nextGraded = own(
          target(gpu, {
            size: [size[0], size[1]],
            format: "rgba16float",
          }),
        );
        try {
          grade.set({ src: nextHdr, samp: linearSampler });
          composite.set({ src: nextGraded, samp: linearSampler });
          vitals.set({ src: nextGraded, samp: linearSampler });
        } catch (error) {
          rethrow(error, () => {
            release(nextGraded);
            release(nextHdr);
          });
        }
        const previousHdr = hdr;
        const previousGraded = graded;
        hdr = nextHdr;
        graded = nextGraded;
        release(previousHdr);
        release(previousGraded);
      },
      destroy() {
        if (destroyed) return;
        destroyed = true;
        const owned = [...resources].reverse();
        resources.clear();
        destroyResources(owned);
      },
    };

    function oceanUniform(viewProj: Float32Array, camPos: readonly [number, number, number], sun = sunDir()) {
      return {
        viewProj,
        camPos,
        worldSize: WORLD_SIZE,
        sunDir: sun,
        patchSize: params.patchSize,
        heightScale: params.heightScale,
        choppyScale: params.choppyScale,
        foamScale: params.foamScale,
      };
    }

    function buoyUniform(
      viewProj: Float32Array,
      camPos: readonly [number, number, number],
      sun: readonly [number, number, number],
      time: number,
      night = 0,
    ) {
      return { viewProj, camPos, time, sunDir: sun, night };
    }

    function wakeUniform(viewProj: Float32Array, time: number) {
      return {
        viewProj,
        patchSize: params.patchSize,
        heightScale: params.heightScale,
        choppyScale: params.choppyScale,
        time,
        night: nightCurrent,
      };
    }
  } catch (error) {
    rethrow(error, () => destroyResources([...resources].reverse()));
  }
}

export type OceanScene = ReturnType<typeof buildOcean>;

function destroyResources(resources: readonly object[]): void {
  const errors: unknown[] = [];
  for (const resource of resources) {
    try {
      (resource as Destroyable).destroy();
    } catch (error) {
      errors.push(error);
    }
  }
  if (errors.length) throw errors[0];
}

function rethrow(error: unknown, cleanup: () => void): never {
  try {
    cleanup();
  } catch {
    // Cleanup must not replace the construction, rebuild, or resize error.
  }
  throw error;
}
