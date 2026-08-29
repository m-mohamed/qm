// Foam collar and expanding ripple rings around each buoy's waterline.
//
// The FFT ocean is spectral — it cannot react to objects — so interaction is
// layered on top, the standard technique. Each ring vertex rides the same
// displacement texture the ocean grid samples, so the collar conforms to the
// rendered surface exactly; foam brightness follows how hard the sea is
// working the buoy (fed back from the mooring dynamics).

struct WakeUniforms {
  viewProj: mat4x4f,
  patchSize: f32,
  heightScale: f32,
  choppyScale: f32,
  time: f32,
}

@group(0) @binding(0) var<uniform> u: WakeUniforms;
@group(0) @binding(1) var disp: texture_2d<f32>;
@group(0) @binding(2) var dispSamp: sampler;

struct VertexIn {
  @location(0) ring: vec3f, // unit dir x, unit dir z, radial t (0 inner, 1 outer)
  @location(1) wake: vec4f, // anchor x, anchor z, buoy scale, agitation
}

struct VertexOut {
  @builtin(position) clip: vec4f,
  @location(0) t: f32,
  @location(1) world: vec2f,
  @location(2) agitation: f32,
}

fn sampleDisp(uv: vec2f) -> vec3f {
  return textureSampleLevel(disp, dispSamp, uv, 0.0).xyz;
}

@vertex fn vs_main(input: VertexIn) -> VertexOut {
  // Hull flank is ~2.6 model units; the wake reaches out to ~2.5 hull radii.
  let radius = input.wake.z * mix(2.62, 6.6, input.ring.z);
  let base = input.wake.xy + vec2f(input.ring.x, input.ring.y) * radius;
  let d = sampleDisp(base / u.patchSize);
  let world = vec3f(
    base.x + d.x * u.choppyScale,
    d.y * u.heightScale + 0.14,
    base.y + d.z * u.choppyScale,
  );

  var out: VertexOut;
  out.clip = u.viewProj * vec4f(world, 1.0);
  out.t = input.ring.z;
  out.world = world.xz;
  out.agitation = input.wake.w;
  return out;
}

fn hash2(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

fn vnoise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let s = f * f * (3.0 - 2.0 * f);
  let a = hash2(i);
  let b = hash2(i + vec2f(1.0, 0.0));
  let c = hash2(i + vec2f(0.0, 1.0));
  let d = hash2(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, s.x), mix(c, d, s.x), s.y);
}

@fragment fn fs_main(input: VertexOut) -> @location(0) vec4f {
  // Collar: dense froth against the hull, dissolving outward.
  let collar = pow(1.0 - input.t, 2.4);

  // Ripples radiating away from the hull.
  let phase = fract(input.t * 3.0 - u.time * 0.45 + hash2(floor(input.world)) * 0.05);
  let rings = smoothstep(0.0, 0.14, phase) * (1.0 - smoothstep(0.2, 0.52, phase)) * (1.0 - input.t) * 0.55;

  // Noise breaks the pattern into patches so it reads as foam, not a decal.
  let n = vnoise(input.world * 0.85 + vec2f(u.time * 0.22, -u.time * 0.13));
  let breakup = smoothstep(0.25, 0.75, n);

  let strength = 0.42 + 0.58 * input.agitation;
  let alpha = clamp((collar + rings) * breakup * strength, 0.0, 0.85);
  let color = vec3f(0.93, 0.9, 0.85) * (0.85 + 0.45 * n);
  return vec4f(color, alpha);
}
