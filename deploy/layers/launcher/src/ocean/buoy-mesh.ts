// Procedural navigation buoy, generated at module load.
// One canonical builder feeds both the runtime geometry and the GLB export
// tool (tools/generate-buoy.mjs). Colors are stored as sRGB; consumers convert
// to linear where needed (GPU vertex data, glTF).
//
// Proportions follow a real lighted mooring buoy: counterweight and tail tube
// below the waterline, can-shaped hull with rub rails, a four-leg braced
// lattice tower with a radar reflector, a railed top platform with solar
// panels, and a caged lantern. Rest waterline sits at y ≈ -0.35.

export type BuoyMeshPart = {
  readonly positions: number[];
  readonly normals: number[];
  readonly colors: number[];
  tris: number;
};

export type BuoyMesh = {
  readonly body: BuoyMeshPart;
  readonly lantern: BuoyMeshPart;
  readonly mastTop: number;
  readonly keelBottom: number;
  readonly waterline: number;
};

type Vec3 = readonly [number, number, number];

const SEG = 20;
const EPS = 1e-6;

const COL = {
  hullRed: [0.7, 0.17, 0.1],
  hullRust: [0.4, 0.17, 0.12],
  deckRed: [0.6, 0.15, 0.1],
  tubeDark: [0.2, 0.12, 0.1],
  iron: [0.15, 0.145, 0.155],
  steel: [0.55, 0.56, 0.58],
  solar: [0.07, 0.09, 0.16],
  lantern: [1.0, 0.84, 0.55],
} as const;

// --- vector helpers ---------------------------------------------------------

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm = (a: Vec3): Vec3 => {
  const l = Math.hypot(a[0], a[1], a[2]);
  return l > EPS ? scale(a, 1 / l) : [0, 1, 0];
};

// Deterministic per-face weathering.
function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- flat-shaded mesh builder ------------------------------------------------

function createPart(): BuoyMeshPart {
  return { positions: [], normals: [], colors: [], tris: 0 };
}

function addTri(part: BuoyMeshPart, a: Vec3, b: Vec3, c: Vec3, color: Vec3): void {
  const n = norm(cross(sub(b, a), sub(c, a)));
  for (const p of [a, b, c]) {
    part.positions.push(p[0], p[1], p[2]);
    part.normals.push(n[0], n[1], n[2]);
    part.colors.push(color[0], color[1], color[2]);
  }
  part.tris += 1;
}

function addQuadOriented(part: BuoyMeshPart, a: Vec3, b: Vec3, c: Vec3, d: Vec3, refNormal: Vec3, color: Vec3): void {
  const n = cross(sub(b, a), sub(c, a));
  if (dot(n, refNormal) >= 0) {
    addTri(part, a, b, c, color);
    addTri(part, a, c, d, color);
  } else {
    addTri(part, a, c, b, color);
    addTri(part, a, d, c, color);
  }
}

const ringPoint = (r: number, y: number, j: number): Vec3 => {
  const t = (j / SEG) * Math.PI * 2;
  return [r * Math.cos(t), y, r * Math.sin(t)];
};

type ColorFn = (yMid: number) => Vec3;

function lathe(
  part: BuoyMeshPart,
  profile: readonly (readonly [number, number])[],
  colorFn: ColorFn,
  jitter = 0,
  rng?: () => number,
): void {
  const tint = (base: Vec3): Vec3 => {
    if (!jitter || !rng) return base;
    const f = 1 + (rng() - 0.5) * jitter;
    return [base[0] * f, base[1] * f, base[2] * f];
  };
  for (let i = 0; i < profile.length - 1; i++) {
    const [r0, y0] = profile[i];
    const [r1, y1] = profile[i + 1];
    if (r0 < EPS && r1 < EPS) continue;
    const base = colorFn((y0 + y1) / 2);
    for (let j = 0; j < SEG; j++) {
      const color = tint(base);
      if (r0 < EPS) {
        addTri(part, [0, y0, 0], ringPoint(r1, y1, j), ringPoint(r1, y1, j + 1), color);
      } else if (r1 < EPS) {
        addTri(part, [0, y1, 0], ringPoint(r0, y0, j + 1), ringPoint(r0, y0, j), color);
      } else {
        const p00 = ringPoint(r0, y0, j);
        const p01 = ringPoint(r0, y0, j + 1);
        const p10 = ringPoint(r1, y1, j);
        const p11 = ringPoint(r1, y1, j + 1);
        addTri(part, p00, p11, p01, color);
        addTri(part, p00, p10, p11, color);
      }
    }
  }
}

function disc(
  part: BuoyMeshPart,
  r: number,
  y: number,
  facingUp: boolean,
  color: Vec3,
  jitter = 0,
  rng?: () => number,
): void {
  for (let j = 0; j < SEG; j++) {
    const f = jitter && rng ? 1 + (rng() - 0.5) * jitter : 1;
    const c: Vec3 = [color[0] * f, color[1] * f, color[2] * f];
    const pj = ringPoint(r, y, j);
    const pj1 = ringPoint(r, y, j + 1);
    if (facingUp) addTri(part, [0, y, 0], pj1, pj, c);
    else addTri(part, [0, y, 0], pj, pj1, c);
  }
}

function cylinder(
  part: BuoyMeshPart,
  r: number,
  y0: number,
  y1: number,
  color: Vec3,
  opts: { capTop?: boolean; capBottom?: boolean } = {},
): void {
  lathe(
    part,
    [
      [r, y0],
      [r, y1],
    ],
    () => color,
  );
  if (opts.capTop) disc(part, r, y1, true, color);
  if (opts.capBottom) disc(part, r, y0, false, color);
}

function torus(part: BuoyMeshPart, R: number, tube: number, y: number, segTube: number, color: Vec3): void {
  const point = (j: number, k: number): Vec3 => {
    const t = (j / SEG) * Math.PI * 2;
    const p = (k / segTube) * Math.PI * 2;
    const rr = R + tube * Math.cos(p);
    return [rr * Math.cos(t), y + tube * Math.sin(p), rr * Math.sin(t)];
  };
  const outward = (j: number, k: number): Vec3 => {
    const t = ((j + 0.5) / SEG) * Math.PI * 2;
    const p = ((k + 0.5) / segTube) * Math.PI * 2;
    return [Math.cos(p) * Math.cos(t), Math.sin(p), Math.cos(p) * Math.sin(t)];
  };
  for (let j = 0; j < SEG; j++) {
    for (let k = 0; k < segTube; k++) {
      addQuadOriented(part, point(j, k), point(j + 1, k), point(j + 1, k + 1), point(j, k + 1), outward(j, k), color);
    }
  }
}

function orientedBox(part: BuoyMeshPart, center: Vec3, u: Vec3, v: Vec3, w: Vec3, half: Vec3, color: Vec3): void {
  const corner = (su: number, sv: number, sw: number): Vec3 =>
    add(center, add(scale(u, su * half[0]), add(scale(v, sv * half[1]), scale(w, sw * half[2]))));
  const faces: readonly [Vec3, Vec3, Vec3, Vec3, Vec3][] = [
    [corner(1, -1, -1), corner(1, 1, -1), corner(1, 1, 1), corner(1, -1, 1), u],
    [corner(-1, -1, -1), corner(-1, 1, -1), corner(-1, 1, 1), corner(-1, -1, 1), scale(u, -1)],
    [corner(-1, 1, -1), corner(1, 1, -1), corner(1, 1, 1), corner(-1, 1, 1), v],
    [corner(-1, -1, -1), corner(1, -1, -1), corner(1, -1, 1), corner(-1, -1, 1), scale(v, -1)],
    [corner(-1, -1, 1), corner(1, -1, 1), corner(1, 1, 1), corner(-1, 1, 1), w],
    [corner(-1, -1, -1), corner(1, -1, -1), corner(1, 1, -1), corner(-1, 1, -1), scale(w, -1)],
  ];
  for (const [a, b, c, d, ref] of faces) addQuadOriented(part, a, b, c, d, ref, color);
}

// Square-section member between two points; cross-section axes derived from
// the radial direction so tower legs and braces sit naturally.
function strut(part: BuoyMeshPart, a: Vec3, b: Vec3, half: number, color: Vec3): void {
  const w = norm(sub(b, a));
  const radial = norm([a[0] + b[0], 0, a[2] + b[2]]);
  const u = norm(sub(radial, scale(w, dot(radial, w))));
  const v = cross(w, u);
  const len = Math.hypot(...sub(b, a)) / 2;
  const center = scale(add(a, b), 0.5);
  orientedBox(part, center, u, v, w, [half, half, len], color);
}

// --- the buoy ----------------------------------------------------------------

export function buildBuoyMesh(): BuoyMesh {
  const body = createPart();
  const lantern = createPart();
  const rng = mulberry32(7);

  // Counterweight bulb + tail tube.
  lathe(
    body,
    [
      [0, -5.0],
      [0.5, -4.7],
      [0.58, -4.15],
      [0.34, -3.9],
      [0.3, -1.6],
    ],
    () => COL.tubeDark as Vec3,
    0.06,
    rng,
  );

  // Skirt + can hull, rust below the waterline, weathered red above.
  lathe(
    body,
    [
      [0.3, -1.6],
      [1.9, -1.05],
      [2.42, -0.8],
      [2.5, -0.15],
      [2.46, 0.55],
      [2.2, 0.9],
      [1.75, 1.05],
    ],
    (y) => (y < -0.45 ? (COL.hullRust as Vec3) : (COL.hullRed as Vec3)),
    0.14,
    rng,
  );
  disc(body, 1.75, 1.05, true, COL.deckRed as Vec3, 0.1, rng);

  // Rub rails.
  torus(body, 2.56, 0.11, 0.6, 6, COL.iron as Vec3);
  torus(body, 2.52, 0.09, -0.5, 6, COL.hullRust as Vec3);

  // Tower: four legs, ring braces, diagonals.
  const legAngle = (k: number) => (k / 4) * Math.PI * 2 + Math.PI / 4;
  const legPoint = (k: number, r: number, y: number): Vec3 => {
    const t = legAngle(k);
    return [r * Math.cos(t), y, r * Math.sin(t)];
  };
  const legRadius = (y: number) => 1.3 + ((0.62 - 1.3) * (y - 1.05)) / (4.5 - 1.05);
  for (let k = 0; k < 4; k++) {
    strut(body, legPoint(k, 1.3, 1.05), legPoint(k, 0.62, 4.5), 0.075, COL.iron as Vec3);
  }
  for (let k = 0; k < 4; k++) {
    strut(body, legPoint(k, legRadius(2.5), 2.5), legPoint(k + 1, legRadius(2.5), 2.5), 0.045, COL.iron as Vec3);
    strut(body, legPoint(k, legRadius(1.35), 1.35), legPoint(k + 1, legRadius(3.6), 3.6), 0.04, COL.iron as Vec3);
  }

  // Radar reflector.
  {
    const center: Vec3 = [0, 3.45, 0];
    const rx = 0.5;
    const ry = 0.65;
    const top = add(center, [0, ry, 0]);
    const bottom = add(center, [0, -ry, 0]);
    const eq: Vec3[] = [
      add(center, [rx, 0, 0]),
      add(center, [0, 0, rx]),
      add(center, [-rx, 0, 0]),
      add(center, [0, 0, -rx]),
    ];
    for (let i = 0; i < 4; i++) {
      const a = eq[i];
      const b = eq[(i + 1) % 4];
      addTri(body, top, b, a, COL.steel as Vec3);
      addTri(body, bottom, a, b, COL.steel as Vec3);
    }
  }

  // Top platform with railing.
  cylinder(body, 0.98, 4.5, 4.64, COL.iron as Vec3, { capTop: true, capBottom: true });
  for (let k = 0; k < 4; k++) {
    const t = legAngle(k);
    const p: Vec3 = [0.9 * Math.cos(t), 0, 0.9 * Math.sin(t)];
    strut(body, [p[0], 4.64, p[2]], [p[0], 5.28, p[2]], 0.028, COL.iron as Vec3);
  }
  torus(body, 0.9, 0.032, 5.28, 4, COL.iron as Vec3);

  // Solar panels, tilted outward between the stanchions.
  for (const deg of [30, 150, 270]) {
    const t = (deg * Math.PI) / 180;
    const out: Vec3 = [Math.cos(t), 0, Math.sin(t)];
    const tangent: Vec3 = [-Math.sin(t), 0, Math.cos(t)];
    const tilt = (35 * Math.PI) / 180;
    const n = norm(add(scale(out, Math.sin(tilt)), [0, Math.cos(tilt), 0]));
    const slope = norm(cross(tangent, n));
    orientedBox(body, add(scale(out, 0.58), [0, 4.94, 0]), tangent, slope, n, [0.32, 0.24, 0.02], COL.solar as Vec3);
  }

  // Pedestal, caged lantern, roof with vent.
  cylinder(body, 0.2, 4.64, 5.0, COL.iron as Vec3);
  cylinder(body, 0.4, 4.94, 5.0, COL.iron as Vec3, { capTop: true });
  cylinder(lantern, 0.34, 5.0, 5.58, COL.lantern as Vec3);
  for (let k = 0; k < 6; k++) {
    const t = (k / 6) * Math.PI * 2 + Math.PI / 12;
    const p: Vec3 = [0.38 * Math.cos(t), 0, 0.38 * Math.sin(t)];
    strut(body, [p[0], 4.98, p[2]], [p[0], 5.6, p[2]], 0.024, COL.iron as Vec3);
  }
  lathe(
    body,
    [
      [0.5, 5.58],
      [0.3, 5.8],
      [0.1, 5.92],
      [0.1, 6.06],
      [0.04, 6.1],
      [0, 6.22],
    ],
    () => COL.iron as Vec3,
  );
  disc(body, 0.5, 5.58, false, COL.iron as Vec3);

  return { body, lantern, mastTop: 6.22, keelBottom: -5.0, waterline: -0.35 };
}

// Flat annulus for the wake foam ring: (dir.x, dir.z, radial t) triples,
// non-indexed triangles. The wake vertex shader shapes and displaces it.
export function buildWakeRing(segments = 48): Float32Array {
  const data = new Float32Array(segments * 6 * 3);
  let offset = 0;
  const push = (j: number, t: number) => {
    const angle = (j / segments) * Math.PI * 2;
    data[offset++] = Math.cos(angle);
    data[offset++] = Math.sin(angle);
    data[offset++] = t;
  };
  for (let j = 0; j < segments; j++) {
    push(j, 0);
    push(j + 1, 0);
    push(j + 1, 1);
    push(j, 0);
    push(j + 1, 1);
    push(j, 1);
  }
  return data;
}

// Interleaved GPU vertex data: position(3) + normal(3) + linear color(3) +
// emissive flag(1), 40-byte stride. Body first, lantern appended.
export function buoyVertexData(mesh: BuoyMesh): Float32Array {
  const parts: readonly (readonly [BuoyMeshPart, number])[] = [
    [mesh.body, 0],
    [mesh.lantern, 1],
  ];
  let vertexCount = 0;
  for (const [part] of parts) vertexCount += part.positions.length / 3;
  const data = new Float32Array(vertexCount * 10);
  let offset = 0;
  for (const [part, emissive] of parts) {
    const count = part.positions.length / 3;
    for (let i = 0; i < count; i++) {
      data[offset++] = part.positions[i * 3];
      data[offset++] = part.positions[i * 3 + 1];
      data[offset++] = part.positions[i * 3 + 2];
      data[offset++] = part.normals[i * 3];
      data[offset++] = part.normals[i * 3 + 1];
      data[offset++] = part.normals[i * 3 + 2];
      data[offset++] = Math.pow(part.colors[i * 3], 2.2);
      data[offset++] = Math.pow(part.colors[i * 3 + 1], 2.2);
      data[offset++] = Math.pow(part.colors[i * 3 + 2], 2.2);
      data[offset++] = emissive;
    }
  }
  return data;
}
