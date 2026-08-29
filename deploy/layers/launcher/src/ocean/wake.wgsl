// Water decals around each buoy, conforming to the vGPU displacement field
// exactly as the ocean grid samples it. Two passes share this module:
//
//   vs_main/fs_main — foam collar, ripple rings, and a contact-shadow that
//     grounds the hull on the water (alpha blend).
//   vs_pool/fs_pool — the navigation light's pool on the surface, pulsing
//     with the lantern flash and blooming after dark (additive blend).
//
// The FFT ocean is spectral and cannot react to objects; layering decals on
// the surface is the standard interaction technique.

import { perlin2d } from "@vgpu/wgsl-std/noise/perlin";

struct WakeUniforms {
  viewProj: mat4x4f,
  patchSize: f32,
  heightScale: f32,
  choppyScale: f32,
  time: f32,
  night: f32,
}

@group(0) @binding(0) var<uniform> u: WakeUniforms;
@group(0) @binding(1) var disp: texture_2d<f32>;
@group(0) @binding(2) var dispSamp: sampler;

struct VertexIn {
  @location(0) ring: vec3f, // unit dir x, unit dir z, radial t (0 inner, 1 outer)
  @location(1) deco0: vec4f, // anchor x, anchor z, buoy scale, agitation
  @location(2) deco1: vec4f, // light r, g, b, blink period
}

struct VertexOut {
  @builtin(position) clip: vec4f,
  @location(0) t: f32,
  @location(1) world: vec2f,
  @location(2) agitation: f32,
  @location(3) light: vec4f,
}

fn sampleDisp(uv: vec2f) -> vec3f {
  return textureSampleLevel(disp, dispSamp, uv, 0.0).xyz;
}

fn surfacePoint(base: vec2f) -> vec3f {
  let d = sampleDisp(base / u.patchSize);
  return vec3f(
    base.x + d.x * u.choppyScale,
    d.y * u.heightScale + 0.14,
    base.y + d.z * u.choppyScale,
  );
}

fn project(input: VertexIn, radius: f32) -> VertexOut {
  let base = input.deco0.xy + vec2f(input.ring.x, input.ring.y) * radius;
  let world = surfacePoint(base);
  var out: VertexOut;
  out.clip = u.viewProj * vec4f(world, 1.0);
  out.t = input.ring.z;
  out.world = world.xz;
  out.agitation = input.deco0.w;
  out.light = input.deco1;
  return out;
}

fn flashCurve(period: f32) -> f32 {
  let phase = fract(u.time / max(period, 0.5));
  return smoothstep(0.0, 0.06, phase) * (1.0 - smoothstep(0.16, 0.34, phase));
}

fn hash2(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

// --- foam collar + contact shadow -------------------------------------------

@vertex fn vs_main(input: VertexIn) -> VertexOut {
  // Hull flank is ~2.6 model units; the wake reaches out to ~2.5 hull radii.
  return project(input, input.deco0.z * mix(2.62, 6.6, input.ring.z));
}

@fragment fn fs_main(input: VertexOut) -> @location(0) vec4f {
  // Collar: dense froth against the hull, dissolving outward.
  let collar = pow(1.0 - input.t, 2.4);

  // Ripples radiating away from the hull.
  let phase = fract(input.t * 3.0 - u.time * 0.45 + hash2(floor(input.world)) * 0.05);
  let rings = smoothstep(0.0, 0.14, phase) * (1.0 - smoothstep(0.2, 0.52, phase)) * (1.0 - input.t) * 0.55;

  // Noise breaks the pattern into patches so it reads as foam, not a decal.
  let n = perlin2d(input.world * 0.85 + vec2f(u.time * 0.22, -u.time * 0.13)) * 0.5 + 0.5;
  let breakup = smoothstep(0.25, 0.75, n);

  let strength = 0.42 + 0.58 * input.agitation;
  let foamAlpha = clamp((collar + rings) * breakup * strength, 0.0, 0.85);
  let foamColor = vec3f(0.93, 0.9, 0.85) * (0.85 + 0.45 * n);

  // Contact shadow: the hull occludes sky light on the water beside it.
  let shadowAlpha = pow(1.0 - input.t, 2.8) * mix(0.3, 0.14, u.night);
  let shadowColor = vec3f(0.01, 0.02, 0.035);

  let alpha = clamp(foamAlpha + shadowAlpha * (1.0 - foamAlpha), 0.0, 0.9);
  let color = mix(shadowColor, foamColor, foamAlpha / max(alpha, 1e-4));
  return vec4f(color, alpha);
}

// --- navigation-light pool ---------------------------------------------------

@vertex fn vs_pool(input: VertexIn) -> VertexOut {
  return project(input, input.deco0.z * mix(0.3, 9.0, input.ring.z));
}

@fragment fn fs_pool(input: VertexOut) -> @location(0) vec4f {
  let flash = flashCurve(input.light.w);
  // A faint standing glow plus the flash, both mostly a night phenomenon.
  let energy = mix(0.06, 1.0, u.night) * (0.5 + flash * 2.0);

  // The pool shimmers where the water does.
  let n = perlin2d(input.world * 1.6 + vec2f(u.time * 0.35, u.time * 0.27)) * 0.5 + 0.5;
  let shimmer = 0.65 + 0.7 * n;

  let falloff = pow(1.0 - input.t, 2.1);
  let glow = input.light.rgb * energy * falloff * shimmer * 1.6;
  return vec4f(glow, 1.0);
}
