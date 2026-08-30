// Liveness probe: copies one pixel from the graded scene into a 1x1 target
// the CPU can read back. WebKit can silently no-op GPU passes without any
// error event, so the page verifies that real color is actually being
// rendered — a dead pipeline leaves only the pass clear color (black).

@group(0) @binding(0) var src: texture_2d<f32>;
@group(0) @binding(1) var samp: sampler;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  return textureSampleLevel(src, samp, vec2f(0.5, 0.55), 0.0);
}
