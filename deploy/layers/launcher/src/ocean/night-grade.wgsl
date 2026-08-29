// Day-for-night grade, chained between the vendored HDR scene target and the
// vendored composite. Identity when night = 0, moonlight when night = 1.
//
// The cinematography trick: darken and cool the scene while protecting bright
// emitters. The sun disk (raised high via the official sunElevation param)
// reads as the moon, its glitter path becomes moonlight on the water, and the
// buoys' navigation lights keep their hue and blaze against the dark sea.

struct GradeUniforms {
  night: f32,
}

@group(0) @binding(0) var<uniform> u: GradeUniforms;
@group(0) @binding(1) var src: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let hdr = textureSampleLevel(src, samp, uv, 0.0).rgb;

  // Scotopic shift: desaturate, cool, crush the midtones.
  let lum = dot(hdr, vec3f(0.2126, 0.7152, 0.0722));
  var night = mix(vec3f(lum), hdr, 0.3) * vec3f(0.36, 0.5, 0.86) * 0.3;

  // Bright emitters — moon, glitter path, navigation lights — keep their
  // intensity and hue, only cooled slightly.
  let peak = max(hdr.r, max(hdr.g, hdr.b));
  let keep = smoothstep(0.9, 2.2, peak);
  night = mix(night, hdr * vec3f(0.8, 0.87, 1.05), keep);

  return vec4f(mix(hdr, night, u.night), 1.0);
}
