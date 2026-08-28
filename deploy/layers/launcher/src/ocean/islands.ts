export type IslandDefinition = {
  readonly id: "manifest" | "prolimo" | "plateops";
  readonly center: readonly [number, number, number];
  readonly anchor: readonly [number, number, number];
  readonly radius: number;
  readonly seed: number;
  readonly palette: {
    readonly cliff: readonly [number, number, number];
    readonly sand: readonly [number, number, number];
    readonly meadow: readonly [number, number, number];
    readonly ridge: readonly [number, number, number];
    readonly rock: readonly [number, number, number];
  };
};

export const ISLANDS: readonly IslandDefinition[] = [
  {
    id: "manifest",
    center: [30, 0, -54],
    anchor: [30, 17, -54],
    radius: 15,
    seed: 11,
    palette: {
      cliff: [0.3, 0.21, 0.13],
      sand: [0.66, 0.49, 0.3],
      meadow: [0.24, 0.3, 0.14],
      ridge: [0.35, 0.36, 0.2],
      rock: [0.34, 0.3, 0.24],
    },
  },
  {
    id: "prolimo",
    center: [-2, 0, 10],
    anchor: [-2, 13, 10],
    radius: 12,
    seed: 29,
    palette: {
      cliff: [0.32, 0.21, 0.12],
      sand: [0.72, 0.52, 0.29],
      meadow: [0.3, 0.27, 0.12],
      ridge: [0.42, 0.34, 0.17],
      rock: [0.38, 0.29, 0.2],
    },
  },
  {
    id: "plateops",
    center: [29, 0, 24],
    anchor: [29, 3.5, 24],
    radius: 13,
    seed: 47,
    palette: {
      cliff: [0.28, 0.21, 0.16],
      sand: [0.63, 0.46, 0.29],
      meadow: [0.23, 0.27, 0.17],
      ridge: [0.31, 0.31, 0.22],
      rock: [0.32, 0.27, 0.23],
    },
  },
] as const;

type Vec3 = [number, number, number];
type Color = readonly [number, number, number];

const SEGMENTS = 40;

/**
 * Procedural terrain follows the public ThreeUI Landscape scene's useful
 * pattern: one rough, vertex-coloured mesh plus sparse field detail. The
 * geometry and placement here are purpose-built for this vGPU ocean.
 */
export function buildIslandVertices(): Float32Array {
  const packed: number[] = [];
  for (const island of ISLANDS) addIsland(packed, island);
  return new Float32Array(packed);
}

function addIsland(packed: number[], island: IslandDefinition): void {
  const random = mulberry32(island.seed);
  const outline = Array.from({ length: SEGMENTS }, (_, index) => {
    const angle = (index / SEGMENTS) * Math.PI * 2;
    return (
      1 +
      Math.sin(angle * 3 + island.seed * 0.37) * 0.11 +
      Math.sin(angle * 5 - island.seed * 0.19) * 0.065 +
      (random() - 0.5) * 0.085
    );
  });
  const rings = [
    ring(island, outline, 1.04, -0.8, 0.42),
    ring(island, outline, 1.02, 2.6, 0.34),
    ring(island, outline, 0.88, 3.5, 0.3),
    ring(island, outline, 0.73, 4.5, 0.27),
    ring(island, outline, 0.57, 5.7, 0.23),
    ring(island, outline, 0.42, 6.7, 0.18),
    ring(island, outline, 0.27, 7.6, 0.13),
    ring(island, outline, 0.12, 8.2, 0.07),
  ];
  const colors = [
    island.palette.cliff,
    island.palette.sand,
    island.palette.meadow,
    tint(island.palette.meadow, 0.96),
    island.palette.ridge,
    tint(island.palette.ridge, 0.92),
    island.palette.rock,
  ];

  for (let level = 0; level < rings.length - 1; level += 1) {
    const outer = rings[level];
    const inner = rings[level + 1];
    const color = colors[level];
    for (let index = 0; index < SEGMENTS; index += 1) {
      const next = (index + 1) % SEGMENTS;
      const shade = 0.87 + random() * 0.2;
      const faceColor = tint(color, shade);
      addTriangle(packed, outer[index], inner[next], outer[next], faceColor);
      addTriangle(packed, outer[index], inner[index], inner[next], tint(faceColor, 0.94));
    }
  }

  const crown: Vec3 = [
    island.center[0] + (random() - 0.5) * island.radius * 0.08,
    8.55,
    island.center[2] + (random() - 0.5) * island.radius * 0.05,
  ];
  const inner = rings.at(-1)!;
  for (let index = 0; index < SEGMENTS; index += 1) {
    const next = (index + 1) % SEGMENTS;
    addTriangle(packed, inner[index], crown, inner[next], tint(island.palette.ridge, 0.92 + random() * 0.16));
  }

  addFieldDetails(packed, island, random);
}

function ring(
  island: IslandDefinition,
  outline: readonly number[],
  scale: number,
  height: number,
  noise: number,
): Vec3[] {
  return outline.map((irregularity, index) => {
    const angle = (index / SEGMENTS) * Math.PI * 2;
    const radius = island.radius * scale * (0.9 + irregularity * 0.1);
    return [
      island.center[0] + Math.cos(angle) * radius,
      height + Math.sin(angle * 4 + island.seed) * noise,
      island.center[2] + Math.sin(angle) * radius * 0.64,
    ];
  });
}

function addFieldDetails(packed: number[], island: IslandDefinition, random: () => number): void {
  for (let index = 0; index < 6; index += 1) {
    const angle = random() * Math.PI * 2;
    const reach = island.radius * (0.12 + random() * 0.42);
    const x = island.center[0] + Math.cos(angle) * reach;
    const z = island.center[2] + Math.sin(angle) * reach * 0.64;
    const normalized = reach / island.radius;
    const ground = 8.1 - normalized * 4.9;
    const size = 0.42 + random() * 0.62;
    addRock(packed, [x, ground, z], size, tint(island.palette.rock, 0.78 + random() * 0.3));
  }

  for (let index = 0; index < 4; index += 1) {
    const angle = random() * Math.PI * 2;
    const reach = island.radius * (0.14 + random() * 0.25);
    const x = island.center[0] + Math.cos(angle) * reach;
    const z = island.center[2] + Math.sin(angle) * reach * 0.64;
    const normalized = reach / island.radius;
    const ground = 8 - normalized * 4.6;
    addCypress(packed, [x, ground, z], 0.92 + random() * 0.5, island.palette.meadow);
  }
}

function addRock(packed: number[], center: Vec3, size: number, color: Color): void {
  const [x, y, z] = center;
  const points: Vec3[] = [
    [x - size, y, z - size * 0.65],
    [x + size * 0.8, y, z - size * 0.5],
    [x + size, y, z + size * 0.55],
    [x - size * 0.7, y, z + size * 0.72],
  ];
  const peak: Vec3 = [x + size * 0.08, y + size * 1.55, z - size * 0.04];
  for (let index = 0; index < points.length; index += 1) {
    addTriangle(packed, points[index], peak, points[(index + 1) % points.length], color);
  }
}

function addCypress(packed: number[], center: Vec3, height: number, color: Color): void {
  const [x, y, z] = center;
  const radius = height * 0.24;
  const base = Array.from({ length: 6 }, (_, index): Vec3 => {
    const angle = (index / 6) * Math.PI * 2;
    return [x + Math.cos(angle) * radius, y, z + Math.sin(angle) * radius];
  });
  const peak: Vec3 = [x, y + height * 2.3, z];
  for (let index = 0; index < base.length; index += 1) {
    addTriangle(packed, base[index], peak, base[(index + 1) % base.length], tint(color, 0.58 + (index % 2) * 0.13));
  }
}

function addTriangle(packed: number[], a: Vec3, b: Vec3, c: Vec3, color: Color): void {
  const normal = faceNormal(a, b, c);
  for (const point of [a, b, c]) packed.push(...point, ...normal, ...color);
}

function faceNormal(a: Vec3, b: Vec3, c: Vec3): Vec3 {
  const ux = b[0] - a[0];
  const uy = b[1] - a[1];
  const uz = b[2] - a[2];
  const vx = c[0] - a[0];
  const vy = c[1] - a[1];
  const vz = c[2] - a[2];
  const x = uy * vz - uz * vy;
  const y = uz * vx - ux * vz;
  const z = ux * vy - uy * vx;
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
}

function tint(color: Color, amount: number): [number, number, number] {
  return color.map((channel) => Math.min(1, Math.max(0, channel * amount))) as [number, number, number];
}

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}
