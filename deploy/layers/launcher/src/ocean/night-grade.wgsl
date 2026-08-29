// Day-for-night grade, chained between the vendored HDR scene target and the
// vendored composite. Identity when night = 0, moonlight when night = 1.
//
// The vendored sky renders a sun with a broad warm halo; a moon is a small
// crisp cool disk with almost none. At night this pass suppresses the halo
// around the light's screen position (handed in from the CPU) and composites
// a proper moon disk there, while navigation lights keep their hue.

import { fbmPerlin2d, perlin2d } from "@vgpu/wgsl-std/noise/perlin";

struct GradeUniforms {
  night: f32,
  aspect: f32,
  moonPos: vec2f,
  moonRadius: f32,
}

@group(0) @binding(0) var<uniform> u: GradeUniforms;
@group(0) @binding(1) var src: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;

// Lunar surface in unit-disk coordinates: maria, craters, regolith grain,
// and limb shading. Returns a brightness factor. Noise comes from the
// official @vgpu/wgsl-std perlin module; craters are a fixed, curated map.
fn moonSurface(p: vec2f) -> f32 {
  let nz = sqrt(max(1.0 - dot(p, p), 0.0));

  // Regolith grain.
  var shade = 0.92 + 0.09 * perlin2d(p * 16.0 + vec2f(3.7, 8.1));

  // Maria: the broad dark basins. The ACES pass compresses highlights hard,
  // so the darkening must be deep to survive to the screen.
  let m = fbmPerlin2d(p * 1.7 + vec2f(5.2, 2.4), 3, 2.17, 0.5);
  shade *= 1.0 - smoothstep(-0.05, 0.35, m) * 0.6;

  // Craters: bright rims, bowls shadowed toward one side.
  var craters = array<vec3f, 7>(
    vec3f(-0.32, 0.28, 0.16),
    vec3f(0.22, -0.35, 0.2),
    vec3f(0.45, 0.18, 0.11),
    vec3f(-0.12, -0.08, 0.09),
    vec3f(0.05, 0.48, 0.12),
    vec3f(-0.52, -0.3, 0.1),
    vec3f(0.6, -0.05, 0.07),
  );
  for (var i = 0; i < 7; i++) {
    let crater = craters[i];
    let d = length(p - crater.xy);
    let rim = exp(-pow((d - crater.z) / (crater.z * 0.3), 2.0)) * 0.14;
    let bowl = 1.0 - smoothstep(0.0, crater.z * 0.85, d);
    let toward = normalize(p - crater.xy + vec2f(1e-4, 0.0));
    let bias = dot(toward, vec2f(-0.707, -0.707)) * 0.5 + 0.5;
    shade += rim - bowl * 0.4 * (0.5 + 0.5 * bias);
  }

  // Limb darkening keeps the sphere readable.
  shade *= 0.68 + 0.32 * nz;
  return clamp(shade, 0.28, 1.15);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let hdr = textureSampleLevel(src, samp, uv, 0.0).rgb;

  // Scotopic shift: desaturate, cool, crush the midtones.
  let lum = dot(hdr, vec3f(0.2126, 0.7152, 0.0722));
  var night = mix(vec3f(lum), hdr, 0.3) * vec3f(0.36, 0.5, 0.86) * 0.26;

  // Concentrated emitters — navigation lights — keep intensity and hue.
  let peak = max(hdr.r, max(hdr.g, hdr.b));
  let keep = smoothstep(2.0, 4.5, peak);
  night = mix(night, hdr * vec3f(0.8, 0.87, 1.05), keep);

  // Flatten the sun's broad halo into dark sky around the moon position.
  let dv = (uv - u.moonPos) * vec2f(u.aspect, 1.0);
  let d = length(dv);
  let halo = 1.0 - smoothstep(u.moonRadius * 1.6, 0.4, d);
  night = mix(night, min(night, vec3f(0.085, 0.1, 0.16)), halo * 0.92);

  // A crisp moon with maria, craters, and limb shading; tight rim glow.
  let disk = 1.0 - smoothstep(u.moonRadius * 0.92, u.moonRadius, d);
  let rim = pow(clamp(1.0 - (d - u.moonRadius) / (u.moonRadius * 2.2), 0.0, 1.0), 3.0);
  let surface = moonSurface(dv / u.moonRadius);
  night += vec3f(0.95, 0.97, 1.0) * 2.1 * disk * surface;
  night += vec3f(0.7, 0.78, 0.95) * 0.3 * rim * (1.0 - disk);

  return vec4f(mix(hdr, night, u.night), 1.0);
}
