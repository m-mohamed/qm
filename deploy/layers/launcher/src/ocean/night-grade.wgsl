// Day-for-night grade, chained between the vendored HDR scene target and the
// vendored composite. Identity when night = 0, moonlight when night = 1.
//
// The vendored sky renders a sun with a broad warm halo; a moon is a small
// crisp cool disk with almost none. At night this pass suppresses the halo
// around the light's screen position (handed in from the CPU) and composites
// a proper moon disk there, while navigation lights keep their hue.

struct GradeUniforms {
  night: f32,
  aspect: f32,
  moonPos: vec2f,
  moonRadius: f32,
}

@group(0) @binding(0) var<uniform> u: GradeUniforms;
@group(0) @binding(1) var src: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;

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

  // A crisp, faintly warm-white moon with a tight rim glow.
  let disk = 1.0 - smoothstep(u.moonRadius * 0.88, u.moonRadius, d);
  let rim = pow(clamp(1.0 - (d - u.moonRadius) / (u.moonRadius * 2.2), 0.0, 1.0), 3.0);
  night += vec3f(0.95, 0.97, 1.0) * 2.7 * disk;
  night += vec3f(0.7, 0.78, 0.95) * 0.3 * rim * (1.0 - disk);

  return vec4f(mix(hdr, night, u.night), 1.0);
}
