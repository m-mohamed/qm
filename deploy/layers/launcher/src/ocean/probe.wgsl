// Samples the FFT displacement field at the buoy anchors into a tiny target
// so the CPU can read wave height and slope back for the mooring dynamics.
// Texel layout: 3 texels per buoy — center, +x neighbor, +z neighbor.

struct ProbeUniforms {
  anchorA: vec4f, // buoy0 uv, buoy1 uv
  anchorB: vec4f, // buoy2 uv, uv epsilon, unused
}

@group(0) @binding(0) var<uniform> u: ProbeUniforms;
@group(0) @binding(1) var disp: texture_2d<f32>;
@group(0) @binding(2) var dispSamp: sampler;

const WIDTH: f32 = 16.0;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let x = u32(uv.x * WIDTH);
  let buoy = x / 3u;
  let which = x % 3u;

  var base = u.anchorB.xy;
  if (buoy == 0u) {
    base = u.anchorA.xy;
  } else if (buoy == 1u) {
    base = u.anchorA.zw;
  }

  let e = u.anchorB.z;
  var offset = vec2f(0.0, 0.0);
  if (which == 1u) {
    offset = vec2f(e, 0.0);
  } else if (which == 2u) {
    offset = vec2f(0.0, e);
  }

  return textureSampleLevel(disp, dispSamp, base + offset, 0.0);
}
