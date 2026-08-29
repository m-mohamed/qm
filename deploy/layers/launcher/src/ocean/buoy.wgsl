// Instanced venture buoys: rigid hulls posed by the CPU mooring dynamics,
// shaded to match the island/ocean look, with a blinking navigation light.

import { skyColor } from "./sky.wgsl";

struct BuoyUniforms {
  viewProj: mat4x4f,
  camPos: vec3f,
  time: f32,
  sunDir: vec3f,
  night: f32,
}

@group(0) @binding(0) var<uniform> u: BuoyUniforms;

struct VertexIn {
  @location(0) position: vec3f,
  @location(1) normal: vec3f,
  @location(2) color: vec3f,
  @location(3) emissive: f32,
  @location(4) m0: vec4f,
  @location(5) m1: vec4f,
  @location(6) m2: vec4f,
  @location(7) m3: vec4f,
  @location(8) light: vec4f,
}

struct VertexOut {
  @builtin(position) clip: vec4f,
  @location(0) world: vec3f,
  @location(1) normal: vec3f,
  @location(2) color: vec3f,
  @location(3) emissive: f32,
  @location(4) light: vec4f,
}

@vertex fn vs_main(input: VertexIn) -> VertexOut {
  let model = mat4x4f(input.m0, input.m1, input.m2, input.m3);
  let world = model * vec4f(input.position, 1.0);
  // Uniform scale per instance, so rotating the normal by the upper 3x3 and
  // renormalizing is exact.
  let n = normalize((model * vec4f(input.normal, 0.0)).xyz);

  var out: VertexOut;
  out.clip = u.viewProj * world;
  out.world = world.xyz;
  out.normal = n;
  out.color = input.color;
  out.emissive = input.emissive;
  out.light = input.light;
  return out;
}

@fragment fn fs_main(input: VertexOut) -> @location(0) vec4f {
  let n = normalize(input.normal);
  let sun = normalize(u.sunDir);
  let view = normalize(u.camPos - input.world);
  let diffuse = max(dot(n, sun), 0.0);
  let sky = 0.32 + max(n.y, 0.0) * 0.34;
  let halfVector = normalize(sun + view);
  let specular = pow(max(dot(n, halfVector), 0.0), 34.0) * 0.16;

  let direction = normalize(input.world - u.camPos);
  let horizon = skyColor(normalize(vec3f(direction.x, 0.04, direction.z)), u.sunDir);

  var color = input.color * (sky + diffuse * 0.72);
  color += vec3f(1.0, 0.66, 0.34) * specular;

  // Sky rim lifts the silhouette edges against the bright water.
  let rim = pow(1.0 - max(dot(n, view), 0.0), 3.0);
  color += horizon * rim * 0.16;

  // Navigation light: a lighthouse-style flash driven by the sim clock, with
  // a pilot glow between flashes. Both swell hard after dark.
  if (input.emissive > 0.5) {
    let period = max(input.light.w, 0.5);
    let phase = fract(u.time / period);
    let flash = smoothstep(0.0, 0.06, phase) * (1.0 - smoothstep(0.16, 0.34, phase));
    let pilot = mix(0.4, 2.6, u.night);
    let peak = mix(6.0, 13.0, u.night);
    color = input.light.rgb * (pilot + flash * peak);
  }

  let distanceToCamera = length(u.camPos - input.world);
  let fog = smoothstep(205.0, 420.0, distanceToCamera);
  color = mix(color, horizon, fog * 0.82);

  return vec4f(color, 1.0);
}
