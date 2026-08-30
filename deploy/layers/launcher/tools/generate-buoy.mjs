#!/usr/bin/env bun
// Exports the runtime buoy mesh (src/ocean/buoy-mesh.ts) as a glTF 2.0 binary
// and renders flat-shaded SVG previews. The page itself builds the mesh at
// load; this tool exists so the design can be inspected in any glTF viewer.
// Run with bun (it imports the TypeScript builder directly).

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildBuoyMesh } from "../src/ocean/buoy-mesh.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_GLB = resolve(HERE, "..", "assets", "buoy.glb");
const PREVIEW_DIR = process.env.BUOY_PREVIEW_DIR
  ? resolve(process.env.BUOY_PREVIEW_DIR)
  : resolve(HERE, "..", "assets");

const mesh = buildBuoyMesh();
const WATER_Y = mesh.waterline;

// ---------------------------------------------------------------------------
// Vector helpers (previews only)

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => {
  const l = Math.hypot(a[0], a[1], a[2]);
  return l > 1e-6 ? scale(a, 1 / l) : [0, 1, 0];
};

// ---------------------------------------------------------------------------
// GLB writer

const srgbToLinear = (values) => values.map((v) => Math.pow(v, 2.2));

function toGlb(parts) {
  const json = {
    asset: { version: "2.0", generator: "sw-capital-buoy-generator" },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name: "buoy" }],
    meshes: [{ name: "buoy", primitives: [] }],
    materials: [
      {
        name: "body",
        pbrMetallicRoughness: {
          baseColorFactor: [1, 1, 1, 1],
          metallicFactor: 0.05,
          roughnessFactor: 0.85,
        },
      },
      {
        name: "lantern",
        pbrMetallicRoughness: {
          baseColorFactor: [1, 1, 1, 1],
          metallicFactor: 0,
          roughnessFactor: 0.3,
        },
        emissiveFactor: [1, 0.72, 0.35],
      },
    ],
    accessors: [],
    bufferViews: [],
    buffers: [],
  };

  const binParts = [];
  let binLength = 0;

  const pushView = (bytes, target) => {
    const pad = (4 - (binLength % 4)) % 4;
    if (pad) {
      binParts.push(Buffer.alloc(pad));
      binLength += pad;
    }
    const view = { buffer: 0, byteOffset: binLength, byteLength: bytes.byteLength };
    if (target) view.target = target;
    json.bufferViews.push(view);
    binParts.push(Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength));
    binLength += bytes.byteLength;
    return json.bufferViews.length - 1;
  };

  parts.forEach((part, materialIndex) => {
    const pos = new Float32Array(part.positions);
    const nrm = new Float32Array(part.normals);
    const col = new Float32Array(srgbToLinear(part.colors));
    const vertexCount = pos.length / 3;
    if (vertexCount > 65535) throw new Error("uint16 index overflow — reduce detail");
    const idx = new Uint16Array(vertexCount);
    for (let i = 0; i < vertexCount; i++) idx[i] = i;

    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < pos.length; i += 3) {
      for (let k = 0; k < 3; k++) {
        min[k] = Math.min(min[k], pos[i + k]);
        max[k] = Math.max(max[k], pos[i + k]);
      }
    }

    const posView = pushView(pos, 34962);
    const nrmView = pushView(nrm, 34962);
    const colView = pushView(col, 34962);
    const idxView = pushView(idx, 34963);

    const accessor = (bufferView, componentType, count, type, extra = {}) => {
      json.accessors.push({ bufferView, componentType, count, type, ...extra });
      return json.accessors.length - 1;
    };

    json.meshes[0].primitives.push({
      attributes: {
        POSITION: accessor(posView, 5126, vertexCount, "VEC3", { min, max }),
        NORMAL: accessor(nrmView, 5126, vertexCount, "VEC3"),
        COLOR_0: accessor(colView, 5126, vertexCount, "VEC3"),
      },
      indices: accessor(idxView, 5123, vertexCount, "SCALAR"),
      material: materialIndex,
      mode: 4,
    });
  });

  json.buffers.push({ byteLength: binLength });

  let jsonText = JSON.stringify(json);
  while (Buffer.byteLength(jsonText) % 4 !== 0) jsonText += " ";
  const jsonBuf = Buffer.from(jsonText);
  const binPad = (4 - (binLength % 4)) % 4;
  const binBuf = Buffer.concat([...binParts, Buffer.alloc(binPad)]);

  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); // "glTF"
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonBuf.length + 8 + binBuf.length, 8);

  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonBuf.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4); // JSON

  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(binBuf.length, 0);
  binHeader.writeUInt32LE(0x004e4942, 4); // BIN

  return Buffer.concat([header, jsonHeader, jsonBuf, binHeader, binBuf]);
}

// ---------------------------------------------------------------------------
// GLB self-check: re-read the file and verify structure + bounds.

function validateGlb(path) {
  const buf = readFileSync(path);
  if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error("bad magic");
  if (buf.readUInt32LE(4) !== 2) throw new Error("bad version");
  if (buf.readUInt32LE(8) !== buf.length) throw new Error("length mismatch");
  const jsonLen = buf.readUInt32LE(12);
  if (buf.readUInt32LE(16) !== 0x4e4f534a) throw new Error("first chunk not JSON");
  const doc = JSON.parse(buf.subarray(20, 20 + jsonLen).toString());
  const binStart = 20 + jsonLen + 8;
  if (buf.readUInt32LE(20 + jsonLen + 4) !== 0x004e4942) throw new Error("second chunk not BIN");

  let totalTris = 0;
  for (const prim of doc.meshes[0].primitives) {
    const posAcc = doc.accessors[prim.attributes.POSITION];
    const view = doc.bufferViews[posAcc.bufferView];
    const floats = new Float32Array(buf.buffer, buf.byteOffset + binStart + view.byteOffset, posAcc.count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < floats.length; i += 3) {
      for (let k = 0; k < 3; k++) {
        min[k] = Math.min(min[k], floats[i + k]);
        max[k] = Math.max(max[k], floats[i + k]);
      }
    }
    for (let k = 0; k < 3; k++) {
      if (Math.abs(min[k] - posAcc.min[k]) > 1e-4 || Math.abs(max[k] - posAcc.max[k]) > 1e-4) {
        throw new Error("accessor min/max does not match binary data");
      }
    }
    totalTris += doc.accessors[prim.indices].count / 3;
  }
  const bounds = doc.accessors[doc.meshes[0].primitives[0].attributes.POSITION];
  return {
    bytes: buf.length,
    primitives: doc.meshes[0].primitives.length,
    tris: totalTris,
    bounds: { min: bounds.min, max: bounds.max },
  };
}

// ---------------------------------------------------------------------------
// SVG preview renderer: painter's algorithm, flat lambert, sunset backdrop.

function renderSvg(parts, camera, out, { width = 900, height = 1150 } = {}) {
  const { position, target, fov } = camera;
  const fwd = norm(sub(target, position));
  const right = norm(cross(fwd, [0, 1, 0]));
  const up = cross(right, fwd);
  const f = 1 / Math.tan((fov * Math.PI) / 180 / 2);
  const aspect = width / height;

  const project = (p) => {
    const d = sub(p, position);
    const v = [dot(d, right), dot(d, up), dot(d, fwd)];
    if (v[2] < 0.05) return null;
    return [(0.5 + (0.5 * f * v[0]) / aspect / v[2]) * width, (0.5 - (0.5 * f * v[1]) / v[2]) * height, v[2]];
  };

  const sun = norm([0.55, 0.35, 0.75]);
  const faces = [];
  parts.forEach((part, mi) => {
    const emissive = mi === 1;
    for (let t = 0; t < part.tris; t++) {
      const i = t * 9;
      const a = part.positions.slice(i, i + 3);
      const b = part.positions.slice(i + 3, i + 6);
      const c = part.positions.slice(i + 6, i + 9);
      const n = part.normals.slice(i, i + 3);
      const centroid = scale(add(add(a, b), c), 1 / 3);
      if (dot(n, sub(position, centroid)) <= 0) continue;
      const pa = project(a);
      const pb = project(b);
      const pc = project(c);
      if (!pa || !pb || !pc) continue;
      let color;
      if (emissive) {
        color = [1, 0.92, 0.68];
      } else {
        const base = part.colors.slice(i, i + 3);
        const diff = Math.max(dot(n, sun), 0);
        color = base.map(
          (v, k) => v * (0.36 + 0.72 * diff) * [1.06, 0.98, 0.9][k] + [0.02, 0.03, 0.07][k] * (1 - diff),
        );
      }
      const hex = `#${color
        .map((v) =>
          Math.round(Math.min(1, Math.max(0, v)) * 255)
            .toString(16)
            .padStart(2, "0"),
        )
        .join("")}`;
      faces.push({
        depth: dot(sub(centroid, position), fwd),
        points: `${pa[0].toFixed(1)},${pa[1].toFixed(1)} ${pb[0].toFixed(1)},${pb[1].toFixed(1)} ${pc[0].toFixed(1)},${pc[1].toFixed(1)}`,
        hex,
      });
    }
  });
  faces.sort((p, q) => q.depth - p.depth);

  const waterScreen = project([0, WATER_Y, 0]);
  const waterTop = waterScreen ? waterScreen[1] : height * 0.72;
  const lanternScreen = project([0, 5.3, 0]);

  const polys = faces.map((fc) => `<polygon points="${fc.points}" fill="${fc.hex}"/>`).join("\n  ");

  const halo = lanternScreen
    ? `<circle cx="${lanternScreen[0].toFixed(1)}" cy="${lanternScreen[1].toFixed(1)}" r="${(
        2600 / lanternScreen[2]
      ).toFixed(1)}" fill="url(#halo)"/>`
    : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#20264c"/>
      <stop offset="0.55" stop-color="#a34a26"/>
      <stop offset="0.78" stop-color="#e88a4a"/>
    </linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d97a40"/>
      <stop offset="0.25" stop-color="#5a3a3f"/>
      <stop offset="1" stop-color="#131c33"/>
    </linearGradient>
    <radialGradient id="halo">
      <stop offset="0" stop-color="#ffdf9e" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#ffdf9e" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="sun">
      <stop offset="0" stop-color="#ffe9b8"/>
      <stop offset="0.4" stop-color="#f7b05c" stop-opacity="0.85"/>
      <stop offset="1" stop-color="#f7b05c" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${waterTop.toFixed(1)}" fill="url(#sky)"/>
  <circle cx="${width * 0.24}" cy="${(waterTop - height * 0.045).toFixed(1)}" r="${height * 0.11}" fill="url(#sun)"/>
  ${polys}
  <rect y="${waterTop.toFixed(1)}" width="${width}" height="${(height - waterTop).toFixed(1)}" fill="url(#sea)" opacity="0.86"/>
  <ellipse cx="${width / 2}" cy="${waterTop.toFixed(1)}" rx="${width * 0.26}" ry="${height * 0.016}" fill="none" stroke="#f2c78e" stroke-opacity="0.5" stroke-width="3"/>
  <ellipse cx="${width / 2}" cy="${(waterTop + height * 0.02).toFixed(1)}" rx="${width * 0.34}" ry="${height * 0.022}" fill="none" stroke="#f2c78e" stroke-opacity="0.22" stroke-width="2"/>
  ${halo}
</svg>
`;
  writeFileSync(out, svg);
}

// ---------------------------------------------------------------------------

mkdirSync(dirname(OUT_GLB), { recursive: true });
mkdirSync(PREVIEW_DIR, { recursive: true });
writeFileSync(OUT_GLB, toGlb([mesh.body, mesh.lantern]));
const report = validateGlb(OUT_GLB);

renderSvg(
  [mesh.body, mesh.lantern],
  {
    position: [10.5, 2.4, 13.8],
    target: [0, 0.7, 0],
    fov: 34,
  },
  join(PREVIEW_DIR, "buoy-preview-hero.svg"),
);
renderSvg(
  [mesh.body, mesh.lantern],
  {
    position: [15.5, 1.2, 2.1],
    target: [0, 0.9, 0],
    fov: 32,
  },
  join(PREVIEW_DIR, "buoy-preview-profile.svg"),
);

console.log(
  [
    `buoy.glb written: ${OUT_GLB}`,
    `  size: ${(report.bytes / 1024).toFixed(1)} KB`,
    `  primitives: ${report.primitives} (body + emissive lantern)`,
    `  triangles: ${report.tris}`,
    `  bounds y: ${report.bounds.min[1].toFixed(2)} … ${report.bounds.max[1].toFixed(2)}  (height ${(report.bounds.max[1] - report.bounds.min[1]).toFixed(2)})`,
    `  beam: ${(report.bounds.max[0] - report.bounds.min[0]).toFixed(2)}`,
    `previews: ${join(PREVIEW_DIR, "buoy-preview-hero.svg")}, ${join(PREVIEW_DIR, "buoy-preview-profile.svg")}`,
  ].join("\n"),
);
