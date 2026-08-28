import { skyColor } from "./sky.wgsl";

struct IslandUniforms {
  viewProj: mat4x4f,
  camPos: vec3f,
  _pad0: f32,
  sunDir: vec3f,
  _pad1: f32,
}

@group(0) @binding(0) var<uniform> u: IslandUniforms;

struct VertexIn {
  @location(0) position: vec3f,
  @location(1) normal: vec3f,
  @location(2) color: vec3f,
}

struct VertexOut {
  @builtin(position) clip: vec4f,
  @location(0) world: vec3f,
  @location(1) normal: vec3f,
  @location(2) color: vec3f,
}

@vertex fn vs_main(input: VertexIn) -> VertexOut {
  var out: VertexOut;
  out.clip = u.viewProj * vec4f(input.position, 1.0);
  out.world = input.position;
  out.normal = input.normal;
  out.color = input.color;
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

  var color = input.color * (sky + diffuse * 0.72);
  color += vec3f(1.0, 0.66, 0.34) * specular;

  let distanceToCamera = length(u.camPos - input.world);
  let fog = smoothstep(205.0, 420.0, distanceToCamera);
  let direction = normalize(input.world - u.camPos);
  let horizon = skyColor(normalize(vec3f(direction.x, 0.04, direction.z)), u.sunDir);
  color = mix(color, horizon, fog * 0.82);

  return vec4f(color, 1.0);
}
