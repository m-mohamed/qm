// Venture buoys: definitions and moored-buoy dynamics.
//
// Each venture is a lighted buoy moored at a fixed anchor. Every frame the
// renderer feeds this module the FFT displacement samples read back from the
// GPU probe target; the dynamics integrate a damped heave/sway response and
// ease the hull toward the local wave normal, so the buoys lag and lean the
// way a real moored buoy does instead of gluing themselves to the surface.

export type BuoyDef = {
  readonly id: string;
  readonly anchor: readonly [number, number]; // world x/z, matches old island spots
  readonly scale: number;
  readonly light: readonly [number, number, number];
  readonly blinkPeriod: number; // seconds; lighthouse-style flash cycle
  readonly yawRate: number; // rad/s slow mooring drift
};

// Navigation-light colors: white/amber safe-water for Manifest, green
// starboard for Pro Limo, red port for PlateOps.
export const BUOYS: readonly BuoyDef[] = [
  {
    id: "manifest",
    anchor: [30, -54],
    scale: 2.4,
    light: [1.0, 0.85, 0.6],
    blinkPeriod: 2.4,
    yawRate: 0.05,
  },
  {
    id: "prolimo",
    anchor: [-2, 10],
    scale: 2.0,
    light: [0.35, 1.0, 0.45],
    blinkPeriod: 3.0,
    yawRate: -0.07,
  },
  {
    id: "plateops",
    anchor: [29, 24],
    scale: 1.75,
    light: [1.0, 0.28, 0.2],
    blinkPeriod: 2.7,
    yawRate: 0.06,
  },
] as const;

export const PROBE_WIDTH = 16; // texels in the probe target; 3 per buoy used
export const PROBE_SAMPLES_PER_BUOY = 3; // center, +x neighbor, +z neighbor
const PROBE_EPS = 1 / 256; // one displacement texel in UV space

export type WaveParams = {
  readonly patchSize: number;
  readonly heightScale: number;
  readonly choppyScale: number;
};

export type BuoyFrame = {
  /** Per-instance GPU data: mat4 column-major + light rgb + blink period. */
  readonly instanceData: Float32Array<ArrayBuffer>;
  /** Per-buoy decal data: anchor x/z, scale, agitation, light rgb, period. */
  readonly wakeData: Float32Array<ArrayBuffer>;
  /** World-space label anchor per buoy id (above the lantern). */
  readonly labelAnchors: ReadonlyMap<string, readonly [number, number, number]>;
};

const FLOATS_PER_INSTANCE = 20;
const GRAVITY = 9.81; // matches the simulation's deep-water dispersion units

type BuoyState = {
  /** World height of the hull's design waterline. */
  wl: number;
  vy: number;
  /** Sway offsets from the mooring anchor. */
  x: number;
  z: number;
  up: [number, number, number];
  yaw: number;
  lastWater: number;
  waterVel: number;
  hasWater: boolean;
  agitation: number;
};

export function probeUniform(params: WaveParams): {
  anchorA: [number, number, number, number];
  anchorB: [number, number, number, number];
} {
  const uv = (buoy: BuoyDef): [number, number] => [
    buoy.anchor[0] / params.patchSize,
    buoy.anchor[1] / params.patchSize,
  ];
  const [u0, v0] = uv(BUOYS[0]);
  const [u1, v1] = uv(BUOYS[1]);
  const [u2, v2] = uv(BUOYS[2]);
  return {
    anchorA: [u0, v0, u1, v1],
    anchorB: [u2, v2, PROBE_EPS, 0],
  };
}

export function createBuoyDynamics(mastTop: number, waterline: number) {
  const states: BuoyState[] = BUOYS.map(() => ({
    wl: 0,
    vy: 0,
    x: 0,
    z: 0,
    up: [0, 1, 0],
    yaw: 0,
    lastWater: 0,
    waterVel: 0,
    hasWater: false,
    agitation: 0,
  }));
  const instanceData = new Float32Array(BUOYS.length * FLOATS_PER_INSTANCE);
  const wakeData = new Float32Array(BUOYS.length * 8);
  const labelAnchors = new Map<string, readonly [number, number, number]>();
  let sinceProbe = 0;

  function step(
    dt: number,
    probe: Float32Array | null,
    params: WaveParams,
    probeFresh: boolean,
  ): BuoyFrame {
    const clamped = Math.min(Math.max(dt, 0), 1 / 20);
    sinceProbe += clamped;
    for (let i = 0; i < BUOYS.length; i++) {
      const def = BUOYS[i];
      const state = states[i];

      // Water particle + normal at the anchor, from the probe readback. The
      // displaced particle is exactly a point on the rendered vGPU surface,
      // so following it keeps the buoy on the water as drawn.
      let swayX = 0;
      let swayZ = 0;
      let waterY = 0;
      let normal: [number, number, number] = [0, 1, 0];
      if (probe) {
        const base = i * PROBE_SAMPLES_PER_BUOY * 4;
        const dC = [probe[base], probe[base + 1], probe[base + 2]];
        const dX = [probe[base + 4], probe[base + 5], probe[base + 6]];
        const dZ = [probe[base + 8], probe[base + 9], probe[base + 10]];
        swayX = dC[0] * params.choppyScale;
        waterY = dC[1] * params.heightScale;
        swayZ = dC[2] * params.choppyScale;
        // Same finite-difference tangents the water shader uses.
        const dwx = params.patchSize / 256;
        const tX = [
          dwx + (dX[0] - dC[0]) * params.choppyScale,
          (dX[1] - dC[1]) * params.heightScale,
          (dX[2] - dC[2]) * params.choppyScale,
        ];
        const tZ = [
          (dZ[0] - dC[0]) * params.choppyScale,
          (dZ[1] - dC[1]) * params.heightScale,
          dwx + (dZ[2] - dC[2]) * params.choppyScale,
        ];
        let nx = tZ[1] * tX[2] - tZ[2] * tX[1];
        let ny = tZ[2] * tX[0] - tZ[0] * tX[2];
        let nz = tZ[0] * tX[1] - tZ[1] * tX[0];
        if (ny < 0) {
          nx = -nx;
          ny = -ny;
          nz = -nz;
        }
        const l = Math.hypot(nx, ny, nz) || 1;
        normal = [nx / l, ny / l, nz / l];
      }

      // Water vertical velocity, differenced only when a fresh readback lands
      // (the probe cadence is slower than the frame rate), then low-passed.
      if (!state.hasWater) {
        state.wl = waterY;
        state.lastWater = waterY;
        state.hasWater = true;
      }
      if (probeFresh && sinceProbe > 0) {
        const rawVel = (waterY - state.lastWater) / sinceProbe;
        state.lastWater = waterY;
        state.waterVel += (rawVel - state.waterVel) * (1 - Math.exp(-sinceProbe / 0.12));
      }

      // Heave: velocity feed-forward tracker. Field measurements of moored
      // buoys show heave gain ≈ 1 with near-zero phase lag below the natural
      // frequency — a buoy follows the swell and only attenuates fast chop.
      const wn = 3.4 / Math.sqrt(def.scale);
      const zeta = 0.85;
      let ay = (waterY - state.wl) * wn * wn + 2 * zeta * wn * (state.waterVel - state.vy);
      // Nothing pulls a buoy down faster than gravity; buoyancy on a shoulder
      // of green water can shove it up much harder.
      ay = Math.max(-GRAVITY, Math.min(ay, GRAVITY * 3));
      state.vy += ay * clamped;
      state.wl += state.vy * clamped;

      // Hard limits: the waterline may lift a sliver clear on a dropping
      // face, and a steep crest may wash over the hull — but a buoy never
      // hovers and never submarines.
      const liftLimit = waterY + 0.2 * def.scale;
      const washLimit = waterY - 1.1 * def.scale;
      if (state.wl > liftLimit) {
        state.wl = liftLimit;
        state.vy = Math.min(state.vy, state.waterVel);
      } else if (state.wl < washLimit) {
        state.wl = washLimit;
        state.vy = Math.max(state.vy, state.waterVel);
      }

      // Surge/sway ride the particle orbit; the mooring keeps it centered.
      const swayEase = 1 - Math.exp(-clamped / 0.2);
      state.x += (swayX - state.x) * swayEase;
      state.z += (swayZ - state.z) * swayEase;

      // Lean toward the wave normal, but never fully — ballast rights the hull.
      const leanTarget: [number, number, number] = [normal[0] * 0.6, 1, normal[2] * 0.6];
      const ease = 1 - Math.exp(-clamped / 0.3);
      state.up[0] += (leanTarget[0] - state.up[0]) * ease;
      state.up[1] += (leanTarget[1] - state.up[1]) * ease;
      state.up[2] += (leanTarget[2] - state.up[2]) * ease;
      state.yaw += def.yawRate * clamped;

      // Foam works harder when the buoy fights the water.
      const strain = Math.min(1, Math.abs(state.vy - state.waterVel) * 0.6);
      state.agitation += (strain - state.agitation) * (1 - Math.exp(-clamped / 0.7));

      // Model origin sits so the design waterline lands on the tracked height.
      const originY = state.wl - waterline * def.scale;
      writeInstance(instanceData, i * FLOATS_PER_INSTANCE, def, state, originY);
      wakeData[i * 8] = def.anchor[0];
      wakeData[i * 8 + 1] = def.anchor[1];
      wakeData[i * 8 + 2] = def.scale;
      wakeData[i * 8 + 3] = state.agitation;
      wakeData[i * 8 + 4] = def.light[0];
      wakeData[i * 8 + 5] = def.light[1];
      wakeData[i * 8 + 6] = def.light[2];
      wakeData[i * 8 + 7] = def.blinkPeriod;
      const upLen = Math.hypot(state.up[0], state.up[1], state.up[2]) || 1;
      labelAnchors.set(def.id, [
        def.anchor[0] + state.x + (state.up[0] / upLen) * mastTop * def.scale,
        originY + (state.up[1] / upLen) * (mastTop + 2.2) * def.scale,
        def.anchor[1] + state.z + (state.up[2] / upLen) * mastTop * def.scale,
      ]);
    }
    if (probeFresh) sinceProbe = 0;
    return { instanceData, wakeData, labelAnchors };
  }

  return { step };
}

// Column-major model matrix: translate · orient(up, yaw) · uniform scale.
function writeInstance(
  out: Float32Array,
  offset: number,
  def: BuoyDef,
  state: BuoyState,
  originY: number,
): void {
  const upLen = Math.hypot(state.up[0], state.up[1], state.up[2]) || 1;
  const uy: [number, number, number] = [state.up[0] / upLen, state.up[1] / upLen, state.up[2] / upLen];
  const cos = Math.cos(state.yaw);
  const sin = Math.sin(state.yaw);
  // Forward reference spun by yaw, then orthogonalized against up.
  const f0: [number, number, number] = [sin, 0, cos];
  const fDotUp = f0[0] * uy[0] + f0[1] * uy[1] + f0[2] * uy[2];
  let fx = f0[0] - uy[0] * fDotUp;
  let fy = f0[1] - uy[1] * fDotUp;
  let fz = f0[2] - uy[2] * fDotUp;
  const fLen = Math.hypot(fx, fy, fz) || 1;
  fx /= fLen;
  fy /= fLen;
  fz /= fLen;
  const rx = uy[1] * fz - uy[2] * fy;
  const ry = uy[2] * fx - uy[0] * fz;
  const rz = uy[0] * fy - uy[1] * fx;

  const s = def.scale;
  // Columns: right, up, forward, translation.
  out[offset + 0] = rx * s;
  out[offset + 1] = ry * s;
  out[offset + 2] = rz * s;
  out[offset + 3] = 0;
  out[offset + 4] = uy[0] * s;
  out[offset + 5] = uy[1] * s;
  out[offset + 6] = uy[2] * s;
  out[offset + 7] = 0;
  out[offset + 8] = fx * s;
  out[offset + 9] = fy * s;
  out[offset + 10] = fz * s;
  out[offset + 11] = 0;
  out[offset + 12] = def.anchor[0] + state.x;
  out[offset + 13] = originY;
  out[offset + 14] = def.anchor[1] + state.z;
  out[offset + 15] = 1;
  out[offset + 16] = def.light[0];
  out[offset + 17] = def.light[1];
  out[offset + 18] = def.light[2];
  out[offset + 19] = def.blinkPeriod;
}
