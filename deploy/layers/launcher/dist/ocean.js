const Gr = [
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
      rock: [0.34, 0.3, 0.24]
    }
  },
  {
    id: "prolimo",
    center: [-14, 0, 8],
    anchor: [-14, 13, 8],
    radius: 12,
    seed: 29,
    palette: {
      cliff: [0.32, 0.21, 0.12],
      sand: [0.72, 0.52, 0.29],
      meadow: [0.3, 0.27, 0.12],
      ridge: [0.42, 0.34, 0.17],
      rock: [0.38, 0.29, 0.2]
    }
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
      rock: [0.32, 0.27, 0.23]
    }
  }
], le = 40;
function ts() {
  const t = [];
  for (const e of Gr) ns(t, e);
  return new Float32Array(t);
}
function ns(t, e) {
  const n = as(e.seed), r = Array.from({ length: le }, (c, u) => {
    const l = u / le * Math.PI * 2;
    return 1 + Math.sin(l * 3 + e.seed * 0.37) * 0.11 + Math.sin(l * 5 - e.seed * 0.19) * 0.065 + (n() - 0.5) * 0.085;
  }), i = [
    ne(e, r, 1.04, -0.8, 0.42),
    ne(e, r, 1.02, 2.6, 0.34),
    ne(e, r, 0.88, 3.5, 0.3),
    ne(e, r, 0.73, 4.5, 0.27),
    ne(e, r, 0.57, 5.7, 0.23),
    ne(e, r, 0.42, 6.7, 0.18),
    ne(e, r, 0.27, 7.6, 0.13),
    ne(e, r, 0.12, 8.2, 0.07)
  ], s = [
    e.palette.cliff,
    e.palette.sand,
    e.palette.meadow,
    de(e.palette.meadow, 0.96),
    e.palette.ridge,
    de(e.palette.ridge, 0.92),
    e.palette.rock
  ];
  for (let c = 0; c < i.length - 1; c += 1) {
    const u = i[c], l = i[c + 1], f = s[c];
    for (let d = 0; d < le; d += 1) {
      const p = (d + 1) % le, g = 0.87 + n() * 0.2, m = de(f, g);
      Re(t, u[d], l[p], u[p], m), Re(t, u[d], l[d], l[p], de(m, 0.94));
    }
  }
  const o = [
    e.center[0] + (n() - 0.5) * e.radius * 0.08,
    8.55,
    e.center[2] + (n() - 0.5) * e.radius * 0.05
  ], a = i.at(-1);
  for (let c = 0; c < le; c += 1) {
    const u = (c + 1) % le;
    Re(t, a[c], o, a[u], de(e.palette.ridge, 0.92 + n() * 0.16));
  }
  rs(t, e, n);
}
function ne(t, e, n, r, i) {
  return e.map((s, o) => {
    const a = o / le * Math.PI * 2, c = t.radius * n * (0.9 + s * 0.1);
    return [
      t.center[0] + Math.cos(a) * c,
      r + Math.sin(a * 4 + t.seed) * i,
      t.center[2] + Math.sin(a) * c * 0.64
    ];
  });
}
function rs(t, e, n) {
  for (let r = 0; r < 6; r += 1) {
    const i = n() * Math.PI * 2, s = e.radius * (0.12 + n() * 0.42), o = e.center[0] + Math.cos(i) * s, a = e.center[2] + Math.sin(i) * s * 0.64, u = 8.1 - s / e.radius * 4.9, l = 0.42 + n() * 0.62;
    is(t, [o, u, a], l, de(e.palette.rock, 0.78 + n() * 0.3));
  }
  for (let r = 0; r < 4; r += 1) {
    const i = n() * Math.PI * 2, s = e.radius * (0.14 + n() * 0.25), o = e.center[0] + Math.cos(i) * s, a = e.center[2] + Math.sin(i) * s * 0.64, u = 8 - s / e.radius * 4.6;
    ss(t, [o, u, a], 0.92 + n() * 0.5, e.palette.meadow);
  }
}
function is(t, e, n, r) {
  const [i, s, o] = e, a = [
    [i - n, s, o - n * 0.65],
    [i + n * 0.8, s, o - n * 0.5],
    [i + n, s, o + n * 0.55],
    [i - n * 0.7, s, o + n * 0.72]
  ], c = [i + n * 0.08, s + n * 1.55, o - n * 0.04];
  for (let u = 0; u < a.length; u += 1)
    Re(t, a[u], c, a[(u + 1) % a.length], r);
}
function ss(t, e, n, r) {
  const [i, s, o] = e, a = n * 0.24, c = Array.from({ length: 6 }, (l, f) => {
    const d = f / 6 * Math.PI * 2;
    return [i + Math.cos(d) * a, s, o + Math.sin(d) * a];
  }), u = [i, s + n * 2.3, o];
  for (let l = 0; l < c.length; l += 1)
    Re(t, c[l], u, c[(l + 1) % c.length], de(r, 0.58 + l % 2 * 0.13));
}
function Re(t, e, n, r, i) {
  const s = os(e, n, r);
  for (const o of [e, n, r]) t.push(...o, ...s, ...i);
}
function os(t, e, n) {
  const r = e[0] - t[0], i = e[1] - t[1], s = e[2] - t[2], o = n[0] - t[0], a = n[1] - t[1], c = n[2] - t[2], u = i * c - s * a, l = s * o - r * c, f = r * a - i * o, d = Math.hypot(u, l, f) || 1;
  return [u / d, l / d, f / d];
}
function de(t, e) {
  return t.map((n) => Math.min(1, Math.max(0, n * e)));
}
function as(t) {
  return () => {
    t |= 0, t = t + 1831565813 | 0;
    let e = Math.imul(t ^ t >>> 15, 1 | t);
    return e = e + Math.imul(e ^ e >>> 7, 61 | e) ^ e, ((e ^ e >>> 14) >>> 0) / 4294967296;
  };
}
let kt = class extends Error {
  code;
  severity;
  fix;
  where;
  cause;
  detail;
  constructor(e) {
    super(e.message, { cause: e.cause }), this.name = "VGPUError", this.code = e.code, this.severity = e.severity ?? "error", this.fix = e.fix, this.where = e.where, this.cause = e.cause, this.detail = e.detail;
  }
};
class W extends kt {
  constructor(e) {
    super({ ...e, severity: "error" }), this.name = "ValidationError";
  }
}
function cs(t) {
  return new kt({
    code: "VGPU-FEATURE-UNSUPPORTED",
    message: `Adapter does not support requested feature(s): ${t.map((e) => `"${e}"`).join(", ")}.`,
    fix: "Remove the unsupported name(s) from init({ requiredFeatures: [...] }) or run on an adapter that supports them; gate optional code paths on device.features after init.",
    where: "init"
  });
}
function us(t, e) {
  if (!t)
    return;
  const n = (e ?? []).filter((r) => !t.has(r));
  if (n.length)
    throw cs(n);
}
const fs = {
  map_read: 1,
  map_write: 2,
  copy_src: 4,
  copy_dst: 8,
  index: 16,
  vertex: 32,
  uniform: 64,
  storage: 128,
  indirect: 256,
  query_resolve: 512
};
function qe(t) {
  const e = globalThis.GPUBufferUsage;
  return t.reduce((n, r) => n | ls(r, e), 0);
}
function ls(t, e) {
  const n = t.toUpperCase();
  return e?.[n] ?? fs[t];
}
function _n() {
  return globalThis.GPUMapMode?.READ ?? 1;
}
const ds = {
  copy_src: 1,
  copy_dst: 2,
  texture_binding: 4,
  storage_binding: 8,
  render_attachment: 16
};
function hs(t) {
  const e = globalThis.GPUTextureUsage;
  return t.reduce((n, r) => n | ps(r, e), 0);
}
function ps(t, e) {
  const n = t.toUpperCase();
  return e?.[n] ?? ds[t];
}
function Dr(t) {
  return "__vgpuMockBytes" in t;
}
function kn(t) {
  return "__vgpuMockBytes" in t;
}
let ms = 1;
function Et(t) {
  return Object.freeze({ kind: t, id: ms++ });
}
class $t {
  callbacks = /* @__PURE__ */ new Set();
  destroyed = !1;
  onDestroy(e, n) {
    return this.destroyed ? (n(e), () => {
    }) : (this.callbacks.add(n), () => {
      this.callbacks.delete(n);
    });
  }
  emit(e) {
    if (this.destroyed)
      return !1;
    this.destroyed = !0;
    const n = [...this.callbacks];
    this.callbacks.clear();
    for (const r of n)
      r(e);
    return !0;
  }
}
class ae {
  device;
  gpu;
  options;
  ownership;
  destroySignal = new $t();
  identity = Et("buffer");
  destroyed = !1;
  constructor(e, n, r, i = "owned") {
    this.device = e, this.gpu = n, this.options = r, this.ownership = i, Object.defineProperty(this, "assertUsable", { value: (s) => this.#e(s) });
  }
  get resourceIdentity() {
    return this.identity;
  }
  onDestroy(e) {
    return this.destroySignal.onDestroy(this, e);
  }
  #e(e = "Buffer") {
    if (this.destroyed)
      throw new W({
        code: "VGPU-BUFFER-DISPOSED",
        message: "Buffer is destroyed.",
        where: e,
        fix: "Wrap or create a live GPUBuffer before using it."
      });
    this.device.assertUsable(e);
  }
  write(e, n = 0) {
    this.#e("Buffer.write"), this.ownership === "external" && this.validateExternalOperation("write", n, e.byteLength, "copy_dst");
    try {
      this.device.queue.writeBuffer(this.gpu, n, e);
    } catch (r) {
      throw this.ownership !== "external" ? r : He("Buffer.write", "The external GPUBuffer rejected the write operation.", r);
    }
  }
  async read(e, n = 0) {
    this.#e("Buffer.read"), this.ownership === "external" && this.validateExternalOperation("read", n, e, "copy_src");
    try {
      const r = await this.device.readback.read(this.gpu, e, n);
      return this.#e("Buffer.read"), r;
    } catch (r) {
      throw r instanceof W || this.ownership !== "external" ? r : He("Buffer.read", "The external GPUBuffer rejected the read operation.", r);
    }
  }
  destroy() {
    this.destroyed || (this.destroyed = !0, this.destroySignal.emit(this), this.ownership === "owned" && !Dr(this.gpu) && this.gpu.destroy());
  }
  dispose() {
    this.destroy();
  }
  validateExternalOperation(e, n, r, i) {
    if (!(Number.isSafeInteger(n) && n >= 0 && n % 4 === 0 && Number.isSafeInteger(r) && r >= 0 && r % 4 === 0 && n <= this.options.size && r <= this.options.size - n))
      throw He(`Buffer.${e}`, "External buffer offsets and lengths must be non-negative, 4-byte aligned, and within the buffer size.");
    if ((this.gpu.usage & qe([i])) === 0)
      throw He(`Buffer.${e}`, `External buffer is missing ${i.toUpperCase()} usage.`);
  }
}
function He(t, e, n) {
  return new W({
    code: "VGPU-EXTERNAL-BUFFER-VALIDATION",
    message: e,
    where: t,
    cause: n,
    fix: "Use a buffer with the required usage flags and an aligned in-range operation."
  });
}
function gs(t) {
  if (ys(t))
    throw xs();
  const e = { version: 1, mappings: [] }, n = {
    version: 1,
    modules: [{ path: "<runtime>", text: t }],
    diagnostics: [],
    sourceMap: e,
    cacheKey: bs(t)
  };
  return {
    kind: "wgsl",
    wgsl: t,
    source: { text: t, path: "<runtime>", imports: [] },
    ast: n,
    sourceMap: e,
    diagnostics: [],
    cacheKey: n.cacheKey,
    entryPoints: ws(t),
    stats: { lines: t.split(/\r?\n/).length, bytes: new TextEncoder().encode(t).byteLength, bindGroups: 0 }
  };
}
function bs(t) {
  let e = 2166136261;
  for (let n = 0; n < t.length; n++)
    e = Math.imul(e ^ t.charCodeAt(n), 16777619);
  return { default: `vgpu-wgsl-1:${(e >>> 0).toString(16).padStart(8, "0")}` };
}
function ws(t) {
  const e = [], n = /@(vertex|fragment|compute)\s+fn\s+([A-Za-z_][A-Za-z0-9_]*)/g;
  for (const r of t.matchAll(n))
    e.push(r[2]);
  return e;
}
function ys(t) {
  const e = t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").trimStart();
  return e.startsWith("import ") || e.startsWith("import{");
}
function xs() {
  const t = new Error("Runtime WGSL strings cannot contain import statements. Use a build-time loader or @vgpu/wgsl/runtime.");
  return t.name = "VGPUWGSLRuntimeImportError", t.code = "VGPU-WGSL-RUNTIME-IMPORT", t.severity = "error", t.source = "wgsl", t;
}
const En = qe(["copy_dst", "map_read"]);
class vs {
  device;
  constructor(e) {
    this.device = e;
  }
  async read(e, n, r) {
    if (Dr(e))
      return e.__vgpuMockBytes.slice(r, r + n).buffer;
    const i = this.device.createBuffer({
      size: n,
      usage: En
    });
    try {
      const s = this.device.createCommandEncoder();
      s.copyBufferToBuffer(e, r, i, 0, n), this.device.queue.submit([s.finish()]), await i.mapAsync(_n());
      const o = i.getMappedRange().slice(0);
      return $n(i), o;
    } finally {
      In(i);
    }
  }
  async readTexture(e, n, r) {
    const [i, s] = n, o = gt(r, "Readback.readTexture"), a = o.bytesPerPixel, c = Ss(i * a, 256), u = c * s, l = this.device.createBuffer({ size: u, usage: En });
    let f;
    try {
      const d = this.device.createCommandEncoder();
      d.copyTextureToBuffer({ texture: e }, { buffer: l, bytesPerRow: c, rowsPerImage: s }, { width: i, height: s }), this.device.queue.submit([d.finish()]), await l.mapAsync(_n());
      const p = new Uint8Array(l.getMappedRange());
      f = new Uint8Array(i * s * a);
      for (let g = 0; g < s; g++) {
        const m = g * c, v = g * i * a;
        f.set(p.subarray(m, m + i * a), v);
      }
      $n(l);
    } finally {
      In(l);
    }
    return o.swizzle === "bgra-to-rgba" && Ur(f), f;
  }
  destroy() {
  }
}
function $n(t) {
  try {
    t.unmap();
  } catch {
  }
}
function In(t) {
  try {
    t.destroy();
  } catch {
  }
}
function Ss(t, e) {
  return Math.ceil(t / e) * e;
}
const Pn = {
  r8unorm: { bytesPerPixel: 1, components: 1, componentType: "unorm8" },
  rg8unorm: { bytesPerPixel: 2, components: 2, componentType: "unorm8" },
  rgba8unorm: { bytesPerPixel: 4, components: 4, componentType: "unorm8" },
  "rgba8unorm-srgb": { bytesPerPixel: 4, components: 4, componentType: "unorm8" },
  bgra8unorm: { bytesPerPixel: 4, components: 4, componentType: "unorm8", swizzle: "bgra-to-rgba" },
  "bgra8unorm-srgb": { bytesPerPixel: 4, components: 4, componentType: "unorm8", swizzle: "bgra-to-rgba" },
  r16float: { bytesPerPixel: 2, components: 1, componentType: "float16" },
  rg16float: { bytesPerPixel: 4, components: 2, componentType: "float16" },
  rgba16float: { bytesPerPixel: 8, components: 4, componentType: "float16" },
  r32float: { bytesPerPixel: 4, components: 1, componentType: "float32" },
  rg32float: { bytesPerPixel: 8, components: 2, componentType: "float32" },
  rgba32float: { bytesPerPixel: 16, components: 4, componentType: "float32" }
};
function gt(t, e) {
  const n = Pn[t];
  if (n)
    return n;
  throw new W({
    code: "VGPU-CORE-UNSUPPORTED-FORMAT",
    message: `Texture.read does not support format ${t}. Supported formats: ${Object.keys(Pn).join(", ")}.`,
    where: e
  });
}
function _s(t, e, n = "Texture.readFloats") {
  const r = gt(e, n), i = r.bytesPerPixel / r.components, s = Math.floor(t.byteLength / i), o = new Float32Array(s), a = new DataView(t.buffer, t.byteOffset, t.byteLength);
  for (let c = 0; c < s; c++)
    r.componentType === "unorm8" ? o[c] = a.getUint8(c) / 255 : r.componentType === "float16" ? o[c] = ks(a.getUint16(c * 2, !0)) : o[c] = a.getFloat32(c * 4, !0);
  return o;
}
function ks(t) {
  const e = t & 32768 ? -1 : 1, n = t >> 10 & 31, r = t & 1023;
  return n === 0 ? e * r * 2 ** -24 : n === 31 ? r === 0 ? e * Number.POSITIVE_INFINITY : Number.NaN : e * (r + 1024) * 2 ** (n - 25);
}
function Es(t, e, n) {
  const r = t.slice(0, e[0] * e[1] * n.bytesPerPixel);
  return n.swizzle === "bgra-to-rgba" && Ur(r), r;
}
function Ur(t) {
  for (let e = 0; e < t.length; e += 4) {
    const n = t[e];
    t[e] = t[e + 2], t[e + 2] = n;
  }
}
function $s(t) {
  return { size: t, usage: qe(["copy_src", "copy_dst"]) };
}
class Is {
  gpu;
  guard;
  constructor(e, n = () => {
  }) {
    this.gpu = e, this.guard = n;
  }
  writeBuffer(e, n, r) {
    this.guard("Queue.writeBuffer"), this.gpu.writeBuffer(e, n, r);
  }
  async flush() {
    this.guard("Queue.flush"), await this.gpu.onSubmittedWorkDone?.(), this.guard("Queue.flush");
  }
}
class Ps {
  gpu;
  resolved;
  constructor(e, n) {
    this.gpu = e, this.resolved = n;
  }
  dispose() {
  }
  get kind() {
    return this.resolved.kind;
  }
  get source() {
    return this.resolved.source;
  }
  get code() {
    return this.resolved.wgsl;
  }
  get entryPoints() {
    return this.resolved.entryPoints;
  }
  get stats() {
    return this.resolved.stats;
  }
}
const Cs = /* @__PURE__ */ Symbol.for("vgpu/Texture"), Ts = /* @__PURE__ */ Symbol.for("vgpu/Texture/resizeLock");
class Te {
  device;
  ownership;
  [Cs] = !0;
  destroySignal = new $t();
  identity = Et("texture");
  currentGpu;
  currentOptions;
  defaultView = null;
  resizeLock;
  destroyed = !1;
  constructor(e, n, r, i = "owned") {
    this.device = e, this.ownership = i, this.currentGpu = n, this.currentOptions = r, Object.defineProperty(this, Ts, {
      value: (s) => {
        this.resizeLock = s;
      }
    });
  }
  get gpu() {
    return this.currentGpu;
  }
  get options() {
    return this.currentOptions;
  }
  get size() {
    return this.options.size;
  }
  get format() {
    return this.options.format;
  }
  get usage() {
    return this.options.usage;
  }
  get mipLevelCount() {
    return this.options.mipLevelCount ?? 1;
  }
  get sampleCount() {
    return this.options.sampleCount ?? 1;
  }
  get dimension() {
    return this.options.dimension ?? "2d";
  }
  get viewFormats() {
    return this.options.viewFormats ?? [];
  }
  get label() {
    return this.options.label;
  }
  get resourceIdentity() {
    return this.identity;
  }
  onDestroy(e) {
    return this.destroySignal.onDestroy(this, e);
  }
  get view() {
    return this.assertAlive(), this.defaultView ??= this.createView(), this.defaultView;
  }
  createView(e) {
    return this.assertAlive("Texture.createView"), this.gpu.createView(e);
  }
  resize(e) {
    if (this.assertAlive(), this.ownership === "external")
      throw new W({
        code: "VGPU-CORE-EXTERNAL-TEXTURE",
        message: "Texture wraps an externally owned GPUTexture and cannot be resized.",
        where: "Texture.resize"
      });
    if (this.resizeLock)
      throw new W({
        code: "VGPU-CORE-TEXTURE-RESIZE-LOCKED",
        message: this.resizeLock,
        where: "Texture.resize"
      });
    const n = this.options.size[2] ?? 1, r = e[2] ?? n;
    if (this.options.size[0] === e[0] && this.options.size[1] === e[1] && n === r)
      return !1;
    const i = e[2] === void 0 && this.options.size[2] === void 0 ? [e[0], e[1]] : [e[0], e[1], r], s = { ...this.options, size: i }, o = this.gpu;
    return this.currentGpu = this.device.gpu.createTexture(Rr(s)), this.currentOptions = s, this.defaultView = null, o.destroy(), !0;
  }
  /**
   * Raw, unpadded texel bytes in this texture's own format (row stride padding removed).
   * `byteLength` is `width * height * bytesPerPixel(format)`; `bgra*` bytes are swizzled to RGBA order.
   * Use `readFloats()` for float formats to get decoded component values.
   */
  async read() {
    this.assertAlive("Texture.read");
    const e = gt(this.options.format, "Texture.read");
    if (kn(this.gpu))
      return Es(this.gpu.__vgpuMockBytes, this.options.size, e);
    const n = await this.device.readback.readTexture(this.gpu, this.options.size, this.options.format);
    return this.assertAlive("Texture.read"), n;
  }
  /**
   * Texel components decoded to f32, row-major, `width * height * components(format)` long.
   * `float16`/`float32` formats keep their HDR values (no clamping); `unorm8` formats are
   * normalized to `[0, 1]` without srgb gamma conversion.
   */
  async readFloats() {
    return gt(this.options.format, "Texture.readFloats"), _s(await this.read(), this.options.format);
  }
  destroy() {
    this.destroyed || (this.destroyed = !0, this.defaultView = null, this.destroySignal.emit(this), this.ownership !== "external" && (kn(this.gpu) || this.gpu.destroy()));
  }
  dispose() {
    this.destroy();
  }
  assertAlive(e = "Texture") {
    if (this.destroyed)
      throw new W({ code: "VGPU-CORE-TEXTURE-DESTROYED", message: "Texture is destroyed", where: e });
    this.device.assertUsable?.(e);
  }
}
function Rr(t) {
  const e = {
    label: t.label,
    size: { width: t.size[0], height: t.size[1], depthOrArrayLayers: t.size[2] ?? 1 },
    format: t.format,
    usage: hs(t.usage)
  };
  return t.mipLevelCount !== void 0 && (e.mipLevelCount = t.mipLevelCount), t.sampleCount !== void 0 && (e.sampleCount = t.sampleCount), t.dimension !== void 0 && (e.dimension = t.dimension), t.viewFormats !== void 0 && (e.viewFormats = [...t.viewFormats]), e;
}
class Fs {
  gpu;
  adapterInfo;
  queue;
  /** @internal — use Buffer.read() and Texture.read() instead */
  readback;
  isCompatibilityMode;
  scopes = [];
  ownership;
  state = "alive";
  lossInfo;
  observeLoss = !0;
  constructor(e, n = null, r = "owned", i = {}) {
    this.gpu = e, this.adapterInfo = n, Object.defineProperty(this, "assertUsable", { value: (a) => this.#e(a) }), this.ownership = typeof r == "string" ? r : "owned";
    const s = typeof r == "string" ? i : r;
    this.isCompatibilityMode = s.isCompatibilityMode ?? !1, this.queue = new Is(e.queue, (a) => this.#e(a)), this.readback = new vs(e);
    const o = e.lost;
    o && typeof o.then == "function" && Promise.resolve(o).then((a) => {
      !this.observeLoss || this.state !== "alive" || (this.lossInfo = a, this.state = "lost");
    }, () => {
    });
  }
  get limits() {
    return this.#e("Device.limits"), this.gpu.limits;
  }
  get features() {
    return this.#e("Device.features"), this.gpu.features;
  }
  createShader(e) {
    this.#e("Device.createShader");
    const n = typeof e == "string" ? gs(e) : e;
    return new Ps(this.gpu.createShaderModule({ code: n.wgsl }), n);
  }
  createTexture(e) {
    return this.#e("Device.createTexture"), new Te(this, this.gpu.createTexture(Rr(e)), e);
  }
  createBuffer(e) {
    this.#e("Device.createBuffer");
    const n = As(e);
    n && this.captureError(n);
    const r = n ? $s(Math.max(4, e.size || 4)) : Ms(e);
    return new ae(this, this.gpu.createBuffer(r), e);
  }
  /** Wraps a caller-owned GPUBuffer without taking ownership of its native lifetime. */
  wrapBuffer(e) {
    if (this.#e("Device.wrapBuffer"), !Gs(e))
      throw new W({
        code: "VGPU-EXTERNAL-BUFFER-INVALID",
        message: "Device.wrapBuffer requires a GPUBuffer with finite size and usage properties.",
        where: "Device.wrapBuffer",
        fix: "Pass a live GPUBuffer created for this GPUDevice."
      });
    const n = {
      size: e.size,
      usage: Us(e.usage),
      ...e.label ? { label: e.label } : {}
    };
    return new ae(this, e, n, "external");
  }
  pushErrorScope(e) {
    this.#e("Device.pushErrorScope"), this.scopes.push([]), this.gpu.pushErrorScope?.(e);
  }
  async popErrorScope() {
    this.#e("Device.popErrorScope");
    const e = this.scopes.pop(), n = await this.gpu.popErrorScope?.();
    return this.#e("Device.popErrorScope"), e?.[0] ?? Ls(n) ?? null;
  }
  #e(e) {
    if (this.state === "alive")
      return;
    if (this.state === "disposed")
      throw new W({
        code: "VGPU-DEVICE-DISPOSED",
        message: "The GPU device wrapper has been disposed.",
        where: e,
        fix: "Create a new Gpu instance before performing more work."
      });
    const n = this.lossInfo?.reason, r = this.lossInfo?.message;
    throw new W({
      code: "VGPU-DEVICE-LOST",
      message: `The GPU device was lost${n ? ` (${n})` : ""}${r ? `: ${r}` : "."}`,
      where: e,
      cause: this.lossInfo
    });
  }
  destroy() {
    if (this.state === "disposed")
      return;
    const e = this.state === "lost";
    this.state = "disposed", this.observeLoss = !1, this.scopes.length = 0, this.readback.destroy(), this.ownership === "owned" && !e && this.gpu.destroy();
  }
  dispose() {
    this.destroy();
  }
  captureError(e) {
    const n = this.scopes.at(-1);
    if (n)
      n.push(e);
    else
      throw e;
  }
}
function As(t) {
  return !Number.isFinite(t.size) || t.size <= 0 ? Cn("Buffer size must be greater than zero.") : t.usage.length === 0 ? Cn("Buffer usage must not be empty.") : null;
}
function Cn(t) {
  return new W({ code: "VGPU-CORE-INVALID-USAGE", message: t, where: "Device.createBuffer" });
}
function Ms(t) {
  return { label: t.label, size: t.size, usage: qe(t.usage) };
}
function Ls(t) {
  return t ? new W({ code: "VGPU-CORE-VALIDATION", message: t.message, where: "GPUDevice.popErrorScope", cause: t }) : null;
}
function Gs(t) {
  if (typeof t != "object" && typeof t != "function" || t === null)
    return !1;
  const e = t;
  return Number.isSafeInteger(e.size) && (e.size ?? -1) >= 0 && Number.isSafeInteger(e.usage) && (e.usage ?? -1) >= 0 && typeof e.destroy == "function";
}
const Ds = ["map_read", "map_write", "copy_src", "copy_dst", "index", "vertex", "uniform", "storage", "indirect", "query_resolve"];
function Us(t) {
  return Ds.filter((e) => (t & qe([e])) !== 0);
}
const Vr = /* @__PURE__ */ new WeakMap(), Rs = /* @__PURE__ */ new WeakMap();
function Vs(t, e) {
  return Vr.set(t, Ns(e)), t;
}
function Ve(t) {
  return Vr.get(t);
}
function Nr(t) {
  return Rs.get(t);
}
function Ns(t) {
  return { entries: t.entries.map((e) => ({ ...e })) };
}
let w = class extends kt {
};
function zs(t, e, n, r, i, s) {
  const o = e === "vertex" ? "Vertex" : "Fragment", a = e === "vertex" ? "VERTEX" : "FRAGMENT", c = `maxStorageBuffersIn${o}Stage`;
  return new w({
    code: `VGPU-LIMIT-STORAGE-${a}`,
    message: `${o} entry '${n}' in '${t}' uses ${r} storage buffer(s), but device limit ${c} is ${i}.`,
    fix: e === "vertex" ? `Request init({ requiredLimits: { ${c}: ${r} } }) if the adapter supports it, or move vertex data to geometry(gpu, ...) vertex streams.` : `Request init({ requiredLimits: { ${c}: ${r} } }) if the adapter supports it, or reduce fragment storage buffers.`,
    where: `${t}.pipelineLayout`,
    detail: { stage: e, entryPoint: n, count: r, limit: i, bindings: s.map(({ name: u, group: l, binding: f }) => ({ name: u, group: l, binding: f })) }
  });
}
function Os(t, e, n, r, i) {
  return new w({
    code: "VGPU-SET-TEXTURE-FILTERABILITY",
    message: `${r} (${n}) cannot satisfy filtering texture '${e.name}' @group(${e.group}) @binding(${e.binding}).`,
    fix: "Use a filterable format; request float32-filterable for rgba32float when supported; or use textureLoad without a sampler.",
    where: `${t}.set`,
    detail: { format: n, group: e.group, binding: e.binding, bindingName: e.name, resourceName: r, samplerName: i?.name, samplerGroup: i?.group, samplerBinding: i?.binding }
  });
}
function Bs(t, e) {
  const n = vo(t, e);
  return new w({
    code: "VGPU-R1-BINDING-NEVER-SET",
    message: `Unset \`${e.name}\` @group(${e.group}) @binding(${e.binding}) in '${t}'. Fix: ${n}; or ${t}.group(${e.group}, bindGroup).`,
    where: `${t}.draw`
  });
}
function zr(t, e) {
  const n = e === "lib" ? "lib-owned by its first JS set()" : "user-owned by its first resource set()", r = e === "lib" ? `Fix: pass a resource from the start: wave.set({ ${t}: new Uniform(gpu.device, { size: 4 }) }).` : `Fix: pass JS values from the first set(): wave.set({ ${t}: jsValue }).`;
  return new w({
    code: "VGPU-R1-OWNERSHIP-FLIP",
    message: `\`${t}\` is ${n}; ownership cannot change. ${r}`,
    where: "set"
  });
}
function js(t, e) {
  return new w({
    code: "VGPU-R4-GROUP-CLAIMED",
    message: `group ${e} of '${t}' is claimed; set() cannot update it.`,
    fix: `Call set() first, or build from ${t}.layout(${e}); pass dynamic offsets to p.draw().`,
    where: `${t}.set`
  });
}
function Ws(t, e, n, r) {
  return new w({
    code: "VGPU-R4-GROUP-INCOMPATIBLE",
    message: `claimed group ${e} in '${t}' is incompatible: ${n}.`,
    fix: `Build from ${t}.layout(${e}, { dynamicOffsets? }) then call ${t}.group(${e}, bindGroup).`,
    where: `${t}.group`,
    cause: r
  });
}
function Ie(t, e, n) {
  return new w({
    code: "VGPU-R4-GROUP-VALIDATION",
    message: `WebGPU rejected claimed group ${e} in '${t}'.`,
    fix: `Build from ${t}.layout(${e}); pass offsets via p.draw(draw, { offsets: { ${e}: [...] } }).`,
    where: `${t}.draw`,
    cause: n,
    detail: { drawLabel: t, group: e }
  });
}
function Tn(t, e) {
  return new w({
    code: "VGPU-BLEND-INVALID",
    message: `Invalid blend '${String(e)}' in '${t}'.`,
    fix: 'Use "alpha", "additive", "premultiplied", or { color, alpha? } components.',
    where: "draw"
  });
}
function Fn(t, e) {
  return new w({
    code: "VGPU-BLEND-CONSTANT-INVALID",
    message: `Invalid blendConstant in '${t}': ${e}`,
    fix: 'Use [r, g, b, a] finite numbers with a blend whose color or alpha uses "constant"/"one-minus-constant"; omit it to keep the pass default (0, 0, 0, 0).',
    where: "draw"
  });
}
function An(t, e) {
  return new w({
    code: "VGPU-WRITEMASK-INVALID",
    message: `Invalid writeMask ${e} in '${t}'.`,
    fix: "Use an array of r/g/b/a; omit it for all channels.",
    where: "draw"
  });
}
function Ot(t, e, n = "draw") {
  return new w({
    code: "VGPU-COLORS-INVALID",
    message: `Invalid colors in '${t}': ${e}`,
    fix: "Use one { blend?, writeMask? } or null entry per color attachment of the target, aligned by index; omit colors to apply the top-level blend/writeMask to every attachment.",
    where: n
  });
}
function qs(t, e) {
  return new w({
    code: "VGPU-CULL-INVALID",
    message: `Invalid cull '${String(e)}' in '${t}'.`,
    fix: 'Use "none", "front", or "back"; omit it for no culling.',
    where: "draw"
  });
}
function Ks(t, e) {
  return new w({
    code: "VGPU-FRONTFACE-INVALID",
    message: `Invalid frontFace '${String(e)}' in '${t}'.`,
    fix: 'Use "ccw" or "cw"; omit it for counter-clockwise.',
    where: "draw"
  });
}
function Mn(t, e) {
  return new w({
    code: "VGPU-UNCLIPPED-DEPTH-INVALID",
    message: `Invalid unclippedDepth in '${t}': ${e}`,
    fix: 'Use a boolean. unclippedDepth: true needs the "depth-clip-control" device feature — request it with init({ requiredFeatures: ["depth-clip-control"] }) on an adapter that supports it. Omit the option to keep depth clipping.',
    where: "draw"
  });
}
function H(t, e) {
  return new w({
    code: "VGPU-DEPTH-INVALID",
    message: `Invalid depth in '${t}': ${e}`,
    fix: 'Use false or { write?, compare?, bias?, biasSlopeScale?, biasClamp? }; omit it for { write: true, compare: "less-equal" }.',
    where: "draw"
  });
}
function ke(t, e, n = "draw") {
  return new w({
    code: "VGPU-STENCIL-INVALID",
    message: `Invalid stencil in '${t}': ${e}`,
    fix: `Use { front?, back?, readMask?, writeMask?, ref? } with GPUCompareFunction/GPUStencilOperation faces and u32 masks, against a target whose depth format has a stencil aspect (depth: "depth24plus-stencil8"); omit it for WebGPU's pass-through defaults.`,
    where: n
  });
}
function at(t, e, n = "draw") {
  return new w({
    code: "VGPU-MULTISAMPLE-INVALID",
    message: `Invalid multisample in '${t}': ${e}`,
    fix: "Use { alphaToCoverage?, mask? }: alphaToCoverage needs a target created with msaa: true, and mask must be an integer in [0, 0xFFFFFFFF] (bits above the target's sampleCount are ignored). Omit multisample for full-coverage defaults.",
    where: n
  });
}
function Ze(t, e, n = "draw") {
  return new w({
    code: "VGPU-CONSTANTS-INVALID",
    message: `Invalid constants in '${t}': ${e}`,
    fix: "Key WGSL `override` constants by name, or by the decimal string of N when the declaration has @id(N); values are finite numbers or booleans, converted to the override's WGSL type (bool/i32/u32/f32/f16). Every override without a default value must be provided. Omit constants to keep the WGSL defaults.",
    where: n
  });
}
function ct(t, e, n = "draw") {
  return new w({
    code: "VGPU-ENTRY-INVALID",
    message: `Invalid entry in '${t}': ${e}`,
    fix: "Name an entry point declared in the shader with the matching stage — { vertex?, fragment? } strings for draw, one @compute name string for compute. Omit entry (or a field) to use the first entry point of that stage.",
    where: n
  });
}
function he(t, e, n) {
  return new w({
    code: "VGPU-INDIRECT-INVALID",
    message: `Invalid indirect in '${t}': ${e}`,
    fix: "Pass a storage buffer created with storage(gpu, bytes, { indirect: true }) — bare, or as { buffer, offset? } with a 4-aligned byte offset — sized so the GPU-read arguments fit: 16 bytes for drawIndirect, 20 for drawIndexedIndirect, 12 for dispatchWorkgroupsIndirect. Omit indirect to use CPU-side counts.",
    where: n
  });
}
function Ys() {
  return new w({
    code: "VGPU-PASS-PRESERVE-MSAA",
    message: "clear:false cannot preserve MSAA; use a non-MSAA target.",
    fix: "Use non-MSAA for accumulation.",
    where: "Frame.pass"
  });
}
function Ln(t, e = "expected a number in [0, 1].", n = 'Use 1 (default), or 0 with depth: { compare: "greater" } for reversed-Z.') {
  return new w({
    code: "VGPU-PASS-CLEARDEPTH-INVALID",
    message: `clearDepth received ${String(t)}; ${e}`,
    fix: n,
    where: "Frame.pass"
  });
}
function Z(t) {
  return new w({
    code: "VGPU-PASS-VIEWPORT-INVALID",
    message: `Invalid viewport: ${t}`,
    fix: "Use { x?, y?, width, height, minDepth?, maxDepth? } finite numbers within device limits; omit it for the full target.",
    where: "Frame.pass"
  });
}
function Ft(t) {
  return new w({
    code: "VGPU-PASS-SCISSOR-INVALID",
    message: `Invalid scissor: ${t}`,
    fix: "Use [x, y, width, height] non-negative integers with x + width and y + height within the target's current pixel size; omit it for the full target.",
    where: "Frame.pass"
  });
}
function Xs() {
  return new w({
    code: "VGPU-PASS-PRESERVE-CLEARDEPTH",
    message: "clear:false preserves depth; clearDepth cannot apply.",
    fix: "Remove clearDepth, or let the pass clear.",
    where: "Frame.pass"
  });
}
function Gn(t) {
  return new w({
    code: "VGPU-PASS-CLEARSTENCIL-INVALID",
    message: `clearStencil ${t}`,
    fix: `Use an integer in [0, 0xFFFFFFFF] on a target whose depth format has a stencil aspect, e.g. depth: "depth24plus-stencil8"; the value is masked to the stencil aspect's bit width.`,
    where: "Frame.pass"
  });
}
function Hs() {
  return new w({
    code: "VGPU-PASS-PRESERVE-CLEARSTENCIL",
    message: "clear:false preserves stencil; clearStencil cannot apply.",
    fix: "Remove clearStencil, or let the pass clear.",
    where: "Frame.pass"
  });
}
function me(t, e, n = "Frame.pass") {
  return new w({
    code: "VGPU-PASS-DEPTH-READONLY",
    message: `depthReadOnly ${t}`,
    fix: e,
    where: n
  });
}
function Zs() {
  return new w({
    code: "VGPU-PASS-DEPTH-READONLY-MSAA",
    message: `depthReadOnly cannot read an MSAA target's depth: multisampled depth is stored with storeOp "discard", so a read-only pass tests against discarded contents.`,
    fix: "Use a non-MSAA target for read-only depth, or drop depthReadOnly and let the pass own its depth.",
    where: "Frame.pass"
  });
}
function Qs(t, e, n = "timer") {
  return new w({
    code: "VGPU-TIMER-INVALID",
    message: `Invalid timer use: ${t}`,
    fix: e,
    where: n
  });
}
function Js(t, e, n = "visibility") {
  return new w({
    code: "VGPU-VIS-INVALID",
    message: `Invalid visibility use: ${t}`,
    fix: e,
    where: n
  });
}
function eo() {
  return new w({
    code: "VGPU-QUERY-NO-VISIBILITY",
    message: "occlusion() needs the pass to be opened with a visibility instance; the render pass has no occlusionQuerySet to write into.",
    fix: "Open the pass with f.pass({ target, visibility: vis }, ...) using the visibility(gpu) instance that created the query handle.",
    where: "FramePass.occlusion"
  });
}
function to() {
  return new w({
    code: "VGPU-QUERY-NESTED",
    message: "occlusion() cannot nest inside an active occlusion() body; WebGPU allows one active occlusion query per pass at a time.",
    fix: "Encode each occlusion scope sequentially: p.occlusion(a, ...); p.occlusion(b, ...).",
    where: "FramePass.occlusion"
  });
}
function Bt(t = "Frame.pass") {
  return new w({
    code: "VGPU-TARGET-REQUIRED",
    message: "Target required. Fix: pass surface(gpu, canvas) or target(gpu, { size }) as { target }.",
    where: t
  });
}
function Y(t, e, n, r) {
  return new w({ code: t, message: `${t}: ${n}`, fix: r, where: e });
}
function G(t, e) {
  return Y("VGPU-MESH-LAYOUT-INVALID", t, e, "Fix attributes/formats/offsets; use non-numeric names and 4-aligned stride <= 2048.");
}
function Dn(t, e) {
  return Y("VGPU-MESH-LIMIT-EXCEEDED", t, e, "Use <= 8 buffers and <= 16 attributes (or the device limits).");
}
function Un(t, e) {
  return Y("VGPU-MESH-LOCATION-CONFLICT", t, `Duplicate geometry @location(${e}).`, "Use unique locations, or omit them for name matching.");
}
function Or(t, e) {
  return Y("VGPU-MESH-DATA-MISALIGNED", t, e, "Fix: repack data, set matching stride, or give raw buffers an explicit count.");
}
function Pe(t, e) {
  return Y("VGPU-MESH-RANGE-INVALID", t, e, "Use index ranges for indexed geometries, vertex ranges otherwise, within geometry counts.");
}
function Ee(t, e) {
  return Y("VGPU-MESH-WRITE-RANGE", t, e, "Write within the buffer byteLength, or create a larger geometry.");
}
function no(t, e, n = []) {
  return Y("VGPU-MESH-ATTRIBUTE-UNMATCHED", t, `Geometry attribute '${e}' has no shader input.`, `Use shader name${n.length ? ` (${n.join(",")})` : ""} or { location:n }.`);
}
function ro(t, e, n) {
  return Y("VGPU-MESH-ATTRIBUTE-UNMATCHED", t, `Geometry attribute '${e}' matches locations ${n.join(",")}.`, "Rename inputs or set { location:n }.");
}
function io(t, e, n = []) {
  return Y("VGPU-MESH-INPUT-MISSING", t, `Geometry lacks shader input '${e}'.`, `Add/remove it. Geometry attributes: ${n.join(",") || "none"}.`);
}
function so(t, e, n, r) {
  return Y("VGPU-MESH-FORMAT-MISMATCH", t, `Attribute '${e}' ${n} != shader ${r}.`, "Match the float/sint/uint shader base type; widths may differ.");
}
function oo(t) {
  return new w({
    code: "VGPU-PIPELINE-LAYOUT-GAP",
    message: `Pipeline bind group ${t} is missing.`,
    fix: "Use consecutive @group() indices starting at 0.",
    where: "pipeline layout"
  });
}
function Le(t, e, n) {
  return new w({
    code: "VGPU-COMPILE-FAILED",
    message: "WebGPU pipeline compilation failed.",
    fix: "Check WGSL, vertex layouts, and target signature.",
    where: t,
    cause: e,
    detail: n ? { signature: n } : void 0
  });
}
function Rn(t) {
  return new w({
    code: "VGPU-COMPILE-DISPOSED",
    message: "GPU disposed during pipeline compilation.",
    where: t
  });
}
function Qe(t, e) {
  return new w({
    code: "VGPU-COMPILE-SIGNATURE-INVALID",
    message: `Invalid TargetSignature: ${e}`,
    fix: "Pass { colors, depth?, sampleCount?:1|4 } or a Target.",
    where: t
  });
}
function ao(t) {
  return new w({
    code: "VGPU-TARGET-DEPTH-STENCIL-ONLY",
    message: `depth received '${t}'; stencil-only depth targets are not supported yet.`,
    fix: 'Use a format with a depth aspect such as "depth24plus" or "depth24plus-stencil8".',
    where: "target"
  });
}
function Br() {
  return new w({
    code: "VGPU-TARGET-SIZE-REQUIRED",
    message: "Target size required. Fix: target(gpu, { size: [w,h] }); update surface-derived targets in onResize.",
    where: "target"
  });
}
function jr(t) {
  return new w({
    code: "VGPU-SURFACE-NOT-IN-FRAME",
    message: "Surface targets are only available inside frame(gpu).",
    fix: "surface passes must run inside frame(gpu, ...); precompile against an offscreen target(gpu, ...) instead",
    where: t
  });
}
function co() {
  return new w({
    code: "VGPU-SURFACE-CONTEXT",
    message: "Canvas WebGPU context failed. Fix: check navigator.gpu and remove any existing 2d/webgl context.",
    where: "surface"
  });
}
function uo(t) {
  return new w({
    code: "VGPU-SURFACE-DUPLICATE",
    message: `Canvas already has surface${t ? ` '${t}'` : ""}. Fix: reuse or dispose it.`,
    where: "surface"
  });
}
function fo(t) {
  return new w({
    code: "VGPU-SURFACE-DISPOSED",
    message: `Surface '${t ?? "surface"}' is disposed. Fix: call surface(gpu, canvas).`,
    where: "surface"
  });
}
function lo() {
  return new w({
    code: "VGPU-SURFACE-AUTORESIZE-UNSUPPORTED",
    message: "autoResize needs clientWidth. Fix: call surface.resize([w,h]) for OffscreenCanvas; onResize still fires.",
    where: "surface"
  });
}
function ho(t) {
  return new w({
    code: "VGPU-SURFACE-RESIZE-REENTRANT",
    message: `Cannot resize this surface${t ? ` '${t}'` : ""} in onResize. Fix: resize derived targets only.`,
    where: "surface.resize"
  });
}
function po(t) {
  return new w({
    code: "VGPU-CLEAR-COLOR-INVALID",
    message: `Invalid ${t}: expected four finite numbers.`,
    fix: "Assign [r, g, b, a] or a GPUColor object ({ r, g, b, a }).",
    where: t
  });
}
function mo(t) {
  return new w({
    code: "VGPU-CLOCK-DELTA-INVALID",
    message: `clock.advance() received ${String(t)}; expected a finite, non-negative number of seconds.`,
    fix: "Pass the elapsed seconds, e.g. clock(gpu).advance(1 / 60); use frame(gpu) alone to advance with wall-clock time.",
    where: "clock.advance"
  });
}
function Wr() {
  return new w({
    code: "VGPU-FRAME-REENTRANT",
    message: "Nested frame(gpu) is invalid. Fix: queue work for the next frame.",
    where: "frame"
  });
}
function Vn(t) {
  return new w({
    code: "VGPU-FRAME-CANCELED",
    message: "the frame was canceled; its command encoder was dropped and nothing more can be encoded or submitted on it.",
    fix: "Open a new frame(gpu) for further work; cancel() is the last operation on a frame.",
    where: t
  });
}
function go(t) {
  return new w({
    code: "VGPU-FRAME-PASS-ACTIVE",
    message: "the frame cannot be canceled while a pass callback is active.",
    fix: "Return from the frame.pass(...) callback first, then call frame.cancel(); this keeps pass descriptor resources alive until the pass is closed.",
    where: t
  });
}
function bo(t) {
  return new w({
    code: "VGPU-FRAME-SUBMITTED",
    message: "the frame was already submitted; submitted GPU work cannot be canceled.",
    fix: "Call cancel() only on a frame you decided not to submit; the frame you did submit needs no cleanup.",
    where: t
  });
}
function J(t, e, n) {
  return new w({
    code: "VGPU-R1-BINDING-INCOMPATIBLE-RESOURCE",
    message: `binding \`${t.name}\` @group(${t.group}) @binding(${t.binding}) needs ${e}.`,
    fix: n,
    where: "set"
  });
}
function D(t, e, n) {
  return new w({ code: "VGPU-RING1-UNSUPPORTED", message: e, fix: n, where: t });
}
function Je(t) {
  return yo(t) && t.version !== 1 ? new w({
    code: "VGPU-SHADER-SOURCE-INVALID",
    message: `VGPU-SHADER-SOURCE-INVALID: unsupported ShaderSource v${String(t.version)}; expected v1. Fix: update vgpu or regenerate it.`,
    where: "shader source"
  }) : new w({
    code: "VGPU-SHADER-SOURCE-INVALID",
    message: `VGPU-SHADER-SOURCE-INVALID: expected WGSL or { version, wgsl }, got ${xo(t)}. Fix: configure @vgpu/wgsl loader-vite or loader-webpack.`,
    where: "shader source"
  });
}
function wo(t) {
  return new w({
    code: "VGPU-R1-STORAGE-ALIASING",
    message: "`src` and writable `dst` alias. Fix: alternate them with pingPongStorage(gpu).",
    where: t
  });
}
function yo(t) {
  return typeof t == "object" && t !== null && "version" in t;
}
function xo(t) {
  if (typeof t != "object" || t === null)
    return typeof t;
  try {
    const e = JSON.stringify(t);
    return e.length > 80 ? `${e.slice(0, 77)}...` : e;
  } catch {
    return "object";
  }
}
function vo(t, e) {
  switch (e.kind) {
    case "sampler":
      return `${t}.set({${e.name}:sampler(gpu)})`;
    case "texture":
      return `${t}.set({${e.name}:scene.color})`;
    case "buffer":
      return e.addressSpace === "uniform" ? `${t}.set({${e.name}:{ /* values */ }})` : `${t}.set({${e.name}:buffer})`;
    default:
      return `${t}.set({${e.name}:resource})`;
  }
}
const Nn = ["scheduler", "resource", "service"];
function Ke(t) {
  return { name: t };
}
const qr = /* @__PURE__ */ new WeakMap();
function So(t) {
  const e = qr.get(t);
  if (!e)
    throw new w({
      code: "VGPU-GPU-FOREIGN",
      message: "This object was not created by init(); it has no vgpu kernel.",
      fix: "Pass the gpu returned by init() from vgpu, vgpu/node or vgpu/mock.",
      where: "gpu"
    });
  return e;
}
class _o {
  device;
  #e = /* @__PURE__ */ new Map();
  #t = new Map(Nn.map((e) => [e, /* @__PURE__ */ new Set()]));
  #n = /* @__PURE__ */ new Set();
  #r = /* @__PURE__ */ new Set();
  #s = /* @__PURE__ */ new Set();
  #i = !1;
  constructor(e) {
    this.device = e;
  }
  get disposed() {
    return this.#i;
  }
  service(e, n) {
    const r = this.#e.get(e);
    if (r !== void 0)
      return r;
    const i = n(this);
    return this.#e.set(e, i), i;
  }
  peekService(e) {
    return this.#e.get(e);
  }
  own(e, n) {
    const r = this.#t.get(e);
    return r.add(n), () => {
      r.delete(n);
    };
  }
  addErrorListener(e) {
    return this.#n.add(e), () => {
      this.#n.delete(e);
    };
  }
  reportError(e) {
    if (this.#i)
      return Promise.resolve();
    const n = Promise.resolve().then(() => {
      const r = [...this.#n];
      if (!r.length) {
        console.error(e);
        return;
      }
      for (const i of r)
        try {
          i(e);
        } catch (s) {
          console.error(s);
        }
    });
    return this.trackDelivery(n);
  }
  trackDelivery(e) {
    const n = Promise.resolve(e).then(() => {
    }, (r) => {
      console.error(r);
    });
    return this.#r.add(n), n.finally(() => this.#r.delete(n)), n;
  }
  registerSettledSource(e) {
    return this.#s.add(e), () => {
      this.#s.delete(e);
    };
  }
  async settled() {
    const e = [
      ...this.#r,
      ...[...this.#s].flatMap((n) => n())
    ];
    await Promise.allSettled(e);
  }
  dispose() {
    if (!this.#i) {
      this.#i = !0;
      for (const e of Nn) {
        const n = this.#t.get(e);
        for (const r of [...n])
          r();
        n.clear();
      }
      this.#e.clear(), this.#s.clear(), this.#n.clear(), this.device.dispose();
    }
  }
}
function ko(t) {
  const e = new _o(t), n = {
    device: t,
    gpu: t.gpu,
    get disposed() {
      return e.disposed;
    },
    onError: (r) => e.addErrorListener(r),
    settled: () => e.settled(),
    dispose: () => {
      e.dispose();
    }
  };
  return qr.set(n, e), n;
}
async function Eo(t, e = {}, n) {
  return ko(await $o(t, e, n));
}
async function $o(t, e, n) {
  return e.adapter || n ? (e.adapter ?? n()).requestDevice(e) : Io(e);
}
async function Io(t) {
  const n = await globalThis.navigator.gpu?.requestAdapter({ powerPreference: t.powerPreference });
  if (!n)
    throw D("init", "navigator.gpu.requestAdapter() returned null.");
  us(n.features, t.requiredFeatures);
  const r = await n.requestDevice({ requiredFeatures: t.requiredFeatures, requiredLimits: t.requiredLimits });
  return new Fs(r, n.info ?? null);
}
function F(t, e) {
  t.assertUsable(e);
}
function zn(t, e) {
  t.assertUsable(e);
}
const Kr = /* @__PURE__ */ Symbol("vgpu.bindingResource");
function Po(t) {
  return typeof (typeof t == "object" && t !== null ? t[Kr] : void 0) == "function" ? t : void 0;
}
const Ce = /* @__PURE__ */ Symbol("vgpu.geometry.layoutResolver");
function X(t, e) {
  const n = So(t);
  if (n.disposed)
    throw Yr(e);
  return n;
}
function Yr(t) {
  return new w({
    code: "VGPU-GPU-DISPOSED",
    message: `${t}() ran after gpu.dispose(); the device and everything it owned are gone.`,
    fix: "Create resources before disposing the gpu, or init() a new one.",
    where: t
  });
}
function Xr(t, e, n, r) {
  const i = t.own("resource", () => n(e));
  return r?.(i), e;
}
class Hr {
  vertexCount;
  indexCount;
  instanceCount;
  vertexBuffers;
  indexBuffer;
  indexFormat;
  vertexBufferLayouts;
  topology;
  stripIndexFormat;
  buffers;
  #e;
  #t;
  #n;
  #r = /* @__PURE__ */ new Map();
  #s = /* @__PURE__ */ new Set();
  #i = !1;
  constructor(e, n) {
    const r = "geometry";
    if (n.buffers.length > 8)
      throw Dn(r, `${n.buffers.length} vertex buffers exceed limit 8.`);
    let i = 0;
    const s = /* @__PURE__ */ new Set(), o = n.buffers.map((d, p) => {
      const g = Mo(e, d, `${r}.buffers[${p}]`);
      i += g.attributes.length;
      for (const m of g.attributes)
        if (m.location !== void 0) {
          if (s.has(m.location))
            throw Un(`${r}.buffers[${p}]`, m.location);
          s.add(m.location);
        }
      return g;
    }), a = e.gpu.limits.maxVertexAttributes;
    if (i > a)
      throw Dn(r, `${i} attributes exceed device limit ${a}.`);
    const c = n.topology ?? "triangle-list";
    if (!Do.has(c))
      throw G(r, `Invalid topology: ${String(c)}.`);
    const u = Lo(e, n, r), l = Bn(o, "vertex"), f = Bn(o, "instance");
    jn(o, "vertex", n.vertexCount ?? l, r), jn(o, "instance", n.instanceCount ?? f, r), At(r, "vertexCount", n.vertexCount, l), At(r, "instanceCount", n.instanceCount, f), At(r, "indexCount", n.indexCount, u.count), this.topology = c, this.stripIndexFormat = c.endsWith("strip") ? u.format : void 0, this.#n = o, this.vertexBufferLayouts = Object.freeze(o.map((d) => d.layout)), this.vertexBuffers = Object.freeze(o.map((d) => d.gpu)), this.buffers = Object.freeze(o.map((d, p) => new Co(`${r}.buffers[${p}]`, d))), this.vertexCount = n.vertexCount ?? l, this.instanceCount = n.instanceCount ?? f, this.indexBuffer = u.gpu, this.indexFormat = u.format, this.indexCount = n.indexCount ?? u.count, this.#e = u.owned, this.#t = u.byteLength, Go(this);
  }
  /** @internal Resolves named attributes for one reflected vertex entry point. */
  [Ce](e, n) {
    if (this.#i)
      throw G(n, "Geometry is destroyed; create a live geometry.");
    const r = e.map((u) => `${u.name}:${u.location}:${ut(u.type)}`).join("|"), i = this.#r.get(r);
    if (i)
      return i;
    const s = /* @__PURE__ */ new Set(), o = this.#n.flatMap((u) => u.attributes.map((l) => l.name)), a = this.#n.map((u) => {
      const l = [...u.layout.attributes], f = u.attributes.map((d, p) => {
        const g = d.location === void 0 ? e.filter((y) => y.name === d.name) : [];
        if (d.location === void 0 && g.length === 0)
          throw no(n, d.name, e.map((y) => y.name));
        if (g.length > 1)
          throw ro(n, d.name, g.map((y) => y.location));
        const m = d.location ?? g[0].location;
        if (s.has(m))
          throw Un(n, m);
        s.add(m);
        const v = e.find((y) => y.location === m);
        if (v && Vo(d.format) !== ut(v.type))
          throw so(n, d.name, d.format, ut(v.type));
        return Object.freeze({ ...l[p], shaderLocation: m });
      });
      return Object.freeze({ arrayStride: u.layout.arrayStride, ...u.layout.stepMode ? { stepMode: u.layout.stepMode } : {}, attributes: Object.freeze(f) });
    });
    for (const u of e)
      if (!s.has(u.location))
        throw io(n, u.name, o);
    const c = Object.freeze(a);
    return this.#r.set(r, c), c;
  }
  /** Creates a frozen range view sharing this geometry's buffers and layout identity. */
  slice(e = {}) {
    return new To(this, e);
  }
  /** Updates bytes in vertex buffer stream 0 without resizing it. */
  write(e, n = 0) {
    const r = this.buffers[0];
    if (!r)
      throw Ee("geometry.write", "No vertex buffer 0; add one before writing.");
    r.write(e, n);
  }
  /** Updates bytes in the owned index buffer without resizing it. */
  writeIndices(e, n = 0) {
    if (this.#i)
      throw Ee("geometry.writeIndices", "Geometry is destroyed; create a new geometry before writing.");
    if (!this.#e || this.#t === void 0)
      throw Ee("geometry.writeIndices", "No owned index buffer; write caller-owned buffers directly.");
    Qr("geometry.writeIndices", this.#t, e.byteLength, n), this.#e.write(e, n);
  }
  /** Destroys buffers owned by this geometry; caller-owned buffers are untouched. */
  destroy() {
    if (!this.#i) {
      this.#i = !0;
      for (const e of this.buffers)
        e.destroyOwned();
      this.#e?.destroy();
      for (const e of [...this.#s])
        e();
      this.#s.clear();
    }
  }
  /**
   * @internal Ownership hook: runs once, right after `destroy()` freed the buffers, so the owner
   * that registered this geometry with the kernel can drop its teardown registration.
   */
  onDestroy(e) {
    return this.#i ? (e(), () => {
    }) : (this.#s.add(e), () => {
      this.#s.delete(e);
    });
  }
}
class Co {
  where;
  inner;
  gpu;
  stride;
  stepMode;
  #e = { destroyed: !1 };
  constructor(e, n) {
    this.where = e, this.inner = n, this.gpu = n.gpu, this.stride = n.stride, this.stepMode = n.stepMode, Object.freeze(this);
  }
  write(e, n = 0) {
    if (this.#e.destroyed)
      throw Ee(this.where, "Geometry is destroyed; create a new geometry before writing.");
    if (!this.inner.owned || this.inner.byteLength === void 0)
      throw Ee(this.where, "Caller-owned buffer; write it directly.");
    Qr(this.where, this.inner.byteLength, Zr(e), n), this.inner.owned.write(e, n);
  }
  destroyOwned() {
    this.#e.destroyed = !0, this.inner.owned?.destroy();
  }
}
class To {
  geometry;
  vertexCount;
  indexCount;
  instanceCount;
  vertexBuffers;
  indexBuffer;
  indexFormat;
  vertexBufferLayouts;
  topology;
  stripIndexFormat;
  firstIndex;
  baseVertex;
  firstVertex;
  [Ce](e, n) {
    return this.geometry[Ce](e, n);
  }
  constructor(e, n) {
    if (this.geometry = e, this.vertexBuffers = e.vertexBuffers, this.indexBuffer = e.indexBuffer, this.indexFormat = e.indexFormat, this.vertexBufferLayouts = e.vertexBufferLayouts, this.topology = e.topology, this.stripIndexFormat = e.stripIndexFormat, e.indexBuffer) {
      if (n.firstVertex !== void 0 || n.vertexCount !== void 0)
        throw Pe("geometry.slice", "Indexed slice needs firstIndex/indexCount/baseVertex; omit vertex range fields.");
      const r = n.firstIndex ?? 0, i = e.indexCount ?? 0, s = n.indexCount ?? i - r;
      oe("geometry.slice", "firstIndex", r, i), oe("geometry.slice", "indexCount", s, i - r), oe("geometry.slice", "baseVertex", n.baseVertex ?? 0, Number.MAX_SAFE_INTEGER), this.firstIndex = r, this.indexCount = s, this.baseVertex = n.baseVertex ?? 0, this.vertexCount = e.vertexCount;
    } else {
      if (n.firstIndex !== void 0 || n.indexCount !== void 0 || n.baseVertex !== void 0)
        throw Pe("geometry.slice", "Non-indexed slice needs firstVertex/vertexCount; omit index range fields.");
      const r = n.firstVertex ?? 0, i = e.vertexCount ?? 0, s = n.vertexCount ?? i - r;
      oe("geometry.slice", "firstVertex", r, i), oe("geometry.slice", "vertexCount", s, i - r), this.firstVertex = r, this.vertexCount = s, this.indexCount = e.indexCount;
    }
    oe("geometry.slice", "instanceCount", n.instanceCount ?? e.instanceCount ?? 0, Number.MAX_SAFE_INTEGER), this.instanceCount = n.instanceCount ?? e.instanceCount, Object.freeze(this);
  }
}
function jt(t, e) {
  const n = X(t, "geometry"), r = Fo(e) ? e.build(n.device) : e;
  return Ao(n, new Hr(n.device, r));
}
function Fo(t) {
  return "build" in t && typeof t.build == "function";
}
function Ao(t, e) {
  return Xr(t, e, (n) => n.destroy(), (n) => {
    e.onDestroy(n);
  });
}
function On(t) {
  if (t === "unorm10-10-10-2" || t === "unorm8x4-bgra")
    return 4;
  const e = /^(float|uint|sint|unorm|snorm)(8|16|32)(?:x([234]))?$/.exec(t);
  if (!e)
    return 0;
  const [, n, r, i] = e;
  return (r === "32" ? /norm/.test(n) : !i || i === "3" || r === "8" && n === "float") ? 0 : Number(r) / 8 * Number(i ?? 1);
}
function Mo(t, e, n) {
  if (e.data !== void 0 && e.buffer !== void 0)
    throw G(n, "Choose data or buffer, not both.");
  const r = e.stepMode ?? "vertex";
  if (r !== "vertex" && r !== "instance")
    throw G(n, `Invalid stepMode: ${String(r)}.`);
  const i = [], s = [];
  let o = 0;
  for (const [f, d] of Object.entries(e.attributes)) {
    if (/^\d+$/.test(f))
      throw G(n, `Attribute '${f}' is numeric; use a non-numeric name.`);
    const p = typeof d == "string" ? { format: d } : d, g = On(p.format);
    if (!g)
      throw G(n, `Unknown GPUVertexFormat '${p.format}'.`);
    const m = p.offset ?? o, v = Math.min(4, g);
    if (!Number.isInteger(m) || m < 0 || m % v !== 0)
      throw G(n, `Attribute '${f}' offset ${String(m)} needs ${v}-byte alignment.`);
    if (p.location !== void 0 && (!Number.isInteger(p.location) || p.location < 0 || p.location >= t.gpu.limits.maxVertexAttributes))
      throw G(n, `Location ${String(p.location)} for '${f}' is outside limit ${t.gpu.limits.maxVertexAttributes}.`);
    i.push({ shaderLocation: p.location ?? i.length, offset: m, format: p.format }), s.push({ name: f, format: p.format, location: p.location }), o += g;
  }
  const a = e.stride ?? Ro(o);
  if (!Number.isInteger(a) || a <= 0 || a > 2048 || a % 4 !== 0)
    throw G(n, `Stride ${String(a)} must be 4-aligned in [4,2048].`);
  for (const [f, d] of i.entries()) {
    const p = On(d.format);
    if (d.offset + p > a)
      throw G(n, `Attribute '${s[f]?.name}' (${d.offset}+${p}) exceeds stride ${a}.`);
  }
  const c = e.data ? Zr(e.data) : void 0;
  if (c !== void 0 && c % a !== 0)
    throw Or(n, `Data byteLength ${c} is not divisible by stride ${a}.`);
  const u = e.data !== void 0 ? t.createBuffer({ label: e.label, size: Math.max(4, c ?? 0), usage: ["vertex", "copy_dst"] }) : void 0;
  return u && e.data && u.write(e.data), { layout: Object.freeze({ arrayStride: a, ...e.stepMode ? { stepMode: r } : {}, attributes: Object.freeze(i) }), attributes: Object.freeze(s), stride: a, stepMode: r, byteLength: c, gpu: u?.gpu ?? Uo(e.buffer, n), owned: u };
}
function Lo(t, e, n) {
  if (e.indices !== void 0 && e.indexBuffer !== void 0)
    throw G(n, "Choose indices or indexBuffer, not both.");
  if (e.indices === void 0) {
    const c = [e.indexBuffer, e.indexFormat, e.indexCount].filter((u) => u !== void 0).length;
    if (c !== 0 && c !== 3)
      throw G(n, "Provide indexBuffer, indexFormat, and indexCount together.");
    if (e.indexFormat !== void 0 && e.indexFormat !== "uint16" && e.indexFormat !== "uint32")
      throw G(n, `Unknown index format '${String(e.indexFormat)}'.`);
    return e.indexCount !== void 0 && oe(n, "indexCount", e.indexCount, Number.MAX_SAFE_INTEGER), { gpu: e.indexBuffer, format: e.indexFormat, count: e.indexCount };
  }
  if (e.indexFormat !== void 0)
    throw G(n, "indices infer format; omit indexFormat.");
  const r = Array.isArray(e.indices) ? new Uint32Array(e.indices) : e.indices, i = r instanceof Uint16Array ? "uint16" : "uint32", s = r.byteLength;
  if (s % (i === "uint16" ? 2 : 4) !== 0)
    throw Or(n, `Index byteLength ${s} is invalid for ${i}.`);
  const o = t.createBuffer({ label: e.label ? `${e.label}.indices` : void 0, size: Math.max(4, s), usage: ["index", "copy_dst"] });
  return o.write(r), { gpu: o.gpu, owned: o, format: i, count: r.length, byteLength: s };
}
function Bn(t, e) {
  let n;
  for (const r of t)
    r.stepMode === e && r.byteLength !== void 0 && (n = Math.min(n ?? 1 / 0, Math.floor(r.byteLength / r.stride)));
  return n;
}
function jn(t, e, n, r) {
  if (n === void 0 && t.some((i) => i.stepMode === e && i.byteLength === void 0))
    throw G(r, `Raw ${e} buffer needs ${e}Count.`);
}
function At(t, e, n, r) {
  n !== void 0 && oe(t, e, n, r ?? Number.MAX_SAFE_INTEGER);
}
function Go(t) {
  for (const e of Object.keys(t))
    e !== "destroyed" && Object.defineProperty(t, e, { writable: !1, configurable: !1 });
}
const Do = /* @__PURE__ */ new Set(["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"]);
function Uo(t, e) {
  if (!t)
    throw G(e, "Provide geometry buffer data or buffer.");
  return t;
}
function Zr(t) {
  return t.byteLength;
}
function Ro(t) {
  return t + 3 & -4;
}
function Qr(t, e, n, r) {
  if (!Number.isInteger(r) || r < 0 || r % 4 !== 0 || n % 4 !== 0 || r + n > e)
    throw Ee(t, `Write size ${n}/offset ${String(r)} must be 4-aligned within ${e} bytes.`);
}
function oe(t, e, n, r) {
  if (!Number.isInteger(n) || n < 0 || n > r)
    throw Pe(t, `${e}=${String(n)} must be an integer in [0,${r}].`);
}
function Vo(t) {
  return t.startsWith("sint") ? "i32" : t.startsWith("uint") ? "u32" : "f32";
}
function ut(t) {
  return t.kind === "scalar" ? t.name : t.kind === "vector" || t.kind === "matrix" || t.kind === "atomic" ? ut(t.element) : t.kind;
}
class Jr extends Error {
  code;
  line;
  column;
  severity;
  metadata;
  relatedDiagnostics;
  /** Actionable remediation text. Forwarded verbatim from the underlying error when there is one. */
  fix;
  /** Coarse origin of the failure (e.g. `"resolveShader"`), mirroring `@vgpu/core`'s `VGPUError`. */
  where;
  cause;
  constructor(e, n, r = 1, i = 1, s = "error") {
    super(n), this.name = "VGPUError", this.code = e, this.line = r, this.column = i, this.severity = s;
  }
}
function No(t, e, n = {}) {
  const r = new Jr(t, e, n.line ?? 1, n.column ?? 1, n.severity ?? "error");
  return n.fix !== void 0 && (r.fix = n.fix), n.where !== void 0 && (r.where = n.where), n.cause !== void 0 && (r.cause = n.cause), n.metadata !== void 0 && (r.metadata = n.metadata), r;
}
function A(t, e, n = 1, r = 1) {
  return new Jr(t, e, n, r);
}
const zo = /* @__PURE__ */ new Set(["fn", "struct", "const", "alias", "var", "override"]);
function Oo(t) {
  const e = [], n = [], r = [];
  let i = 0, s = !1, o = 0;
  for (; i < t.length; ) {
    const a = t[i];
    if (a.text === "{") {
      o++, i++;
      continue;
    }
    if (a.text === "}") {
      o = Math.max(0, o - 1), i++;
      continue;
    }
    if (ei(a)) {
      i++;
      continue;
    }
    if (o > 0) {
      i++;
      continue;
    }
    if (a.text === "import") {
      if (s)
        throw A("VGPU-WGSL-IMP-ORDER", "Imports must precede declarations", a.line, a.column);
      const [f, d] = Bo(t, i);
      e.push(f), i = d;
      continue;
    }
    if (a.text === "export" && t[i + 1]?.text === "{")
      throw A("VGPU-WGSL-EXP-REEXPORT-CYCLE", "Re-export cycles are not supported", a.line, a.column);
    if (a.text === "@" && t[i + 2]?.text === "export" && t[i + 3]?.text === "@")
      throw A("VGPU-WGSL-EXP-NOTDECL", "Repeated export attributes", a.line, a.column);
    const c = a.text === "export" || a.text === "@" && t[i + 2]?.text === "export", u = c ? jo(t, a.text === "export" ? i + 1 : i + 3) : i, l = t[u];
    if (l && zo.has(l.text)) {
      const f = Wo(t, u);
      n.push({ name: f, localName: f, kind: l.text }), c && r.push({ name: f, localName: f, kind: l.text }), s = !0;
    }
    i++;
  }
  return { imports: e, exports: r, locals: n };
}
function Bo(t, e) {
  let n = e + 1;
  const r = [];
  if (t[n]?.text === "{") {
    for (n++; t[n] && t[n].text !== "}"; ) {
      if (ei(t[n])) {
        n++;
        continue;
      }
      const o = Lt(t[n]);
      let a = o;
      n++, t[n]?.text === "as" && (a = Lt(t[n + 1]), n += 2), r.push({ imported: o, local: a }), t[n]?.text === "," && n++;
    }
    n++, Mt(t[n], "from"), n++;
  } else if (t[n]?.text === "*")
    Mt(t[n + 1], "as"), r.push({ imported: "*", local: Lt(t[n + 2]), namespace: !0 }), n += 3, Mt(t[n], "from"), n++;
  else throw t[n]?.kind === "string" ? A("VGPU-WGSL-IMP-SIDEEFFECT", "Side-effect imports are not supported", t[n].line, t[n].column) : A("VGPU-WGSL-IMP-DEFAULT", "Default imports are not supported", t[n]?.line, t[n]?.column);
  const i = t[n];
  if (i?.kind !== "string")
    throw A("VGPU-WGSL-RES-NOTFOUND", "Import path must be a string", i?.line, i?.column);
  const s = i.text.slice(1, -1);
  return n++, t[n]?.text === ";" && n++, [{ from: s, bindings: r, start: t[e].start, end: t[n - 1].end }, n];
}
function jo(t, e) {
  for (; t[e]?.text === "@"; ) {
    if (e += 2, t[e]?.text === "(")
      for (; t[e] && t[e].text !== ")"; )
        e++;
    t[e]?.text === ")" && e++;
  }
  return e;
}
function Wo(t, e) {
  let n = e + 1;
  if (t[e]?.text === "var" && t[n]?.text === "<")
    for (; t[n] && t[n].text !== ">"; )
      n++;
  for (; n < t.length; n++)
    if (t[n].kind === "ident")
      return t[n].text;
  throw A("VGPU-WGSL-EXP-NOTDECL", "Exported declaration has no name", t[e]?.line, t[e]?.column);
}
function Mt(t, e) {
  if (t?.text !== e)
    throw A("VGPU-WGSL-IMP-DEFAULT", `Expected ${e}`, t?.line, t?.column);
}
function Lt(t) {
  if (t?.kind !== "ident")
    throw A("VGPU-WGSL-IMP-DEFAULT", "Expected identifier", t?.line, t?.column);
  return t.text;
}
function ei(t) {
  return t.kind === "lineComment" || t.kind === "blockComment";
}
function qo(t, e) {
  return e === "uniform" || e === "storage" ? "buffer" : t.kind === "sampler" ? "sampler" : t.kind === "texture" ? t.textureKind === "texture_external" ? "externalTexture" : "texture" : "unknown";
}
function Ko(t, e, n, r, i) {
  if (t === "buffer")
    return Yo(e, n, i);
  if (r.kind === "sampler")
    return Xo(r);
  if (r.kind === "texture")
    return r.textureKind === "texture_external" ? { kind: "externalTexture", externalTexture: {} } : r.textureKind.startsWith("texture_storage_") ? Ho(r) : Zo(r);
}
function Yo(t, e, n) {
  return { kind: "buffer", buffer: { type: t === "uniform" ? "uniform" : e === "read" ? "read-only-storage" : "storage", hasDynamicOffset: !1, minBindingSize: n?.size } };
}
function Xo(t) {
  return { kind: "sampler", sampler: { type: t.comparison ? "comparison" : "filtering" } };
}
function Ho(t) {
  return {
    kind: "storageTexture",
    storageTexture: {
      access: Jo(t.access),
      format: t.texelFormat ?? "rgba8unorm",
      viewDimension: ti(t.dimension)
    }
  };
}
function Zo(t) {
  return {
    kind: "texture",
    texture: {
      sampleType: Qo(t),
      viewDimension: ti(t.dimension),
      multisampled: t.dimension === "multisampled_2d" || t.dimension === "depth_multisampled_2d"
    }
  };
}
function Qo(t) {
  if (t.textureKind.startsWith("texture_depth_"))
    return "depth";
  const e = t.sampleType;
  return e?.kind === "scalar" && e.name === "i32" ? "sint" : e?.kind === "scalar" && e.name === "u32" ? "uint" : "unfilterable-float";
}
function ti(t) {
  switch (t) {
    case "1d":
      return "1d";
    case "2d_array":
    case "depth_2d_array":
      return "2d-array";
    case "cube":
    case "depth_cube":
      return "cube";
    case "cube_array":
    case "depth_cube_array":
      return "cube-array";
    case "3d":
      return "3d";
    default:
      return "2d";
  }
}
function Jo(t) {
  return t === "read" ? "read-only" : t === "read_write" ? "read-write" : "write-only";
}
const B = (1n << 64n) - 1n, pe = 11400714785074694791n, De = 14029467366897019727n, Wn = 1609587929392839161n, ni = 9650029242287828579n, qn = 2870177450012600261n;
function ea(t, e = 0n) {
  const n = new TextEncoder().encode(t);
  let r = 0, i;
  if (n.length >= 32) {
    let s = e + pe + De, o = e + De, a = e, c = e - pe;
    const u = n.length - 32;
    do
      s = Se(s, Ge(n, r)), r += 8, o = Se(o, Ge(n, r)), r += 8, a = Se(a, Ge(n, r)), r += 8, c = Se(c, Ge(n, r)), r += 8;
    while (r <= u);
    i = se(s, 1n) + se(o, 7n) + se(a, 12n) + se(c, 18n), i = et(i, s), i = et(i, o), i = et(i, a), i = et(i, c);
  } else
    i = e + qn;
  for (i = i + BigInt(n.length) & B; r + 8 <= n.length; )
    i ^= Se(0n, Ge(n, r)), i = se(i, 27n) * pe + ni & B, r += 8;
  for (r + 4 <= n.length && (i ^= ta(n, r) * pe & B, i = se(i, 23n) * De + Wn & B, r += 4); r < n.length; )
    i ^= BigInt(n[r]) * qn & B, i = se(i, 11n) * pe & B, r++;
  return i ^= i >> 33n, i = i * De & B, i ^= i >> 29n, i = i * Wn & B, i ^= i >> 32n, i.toString(16).padStart(16, "0");
}
function Se(t, e) {
  return se(t + e * De & B, 31n) * pe & B;
}
function et(t, e) {
  return t ^= Se(0n, e), t * pe + ni & B;
}
function se(t, e) {
  return (t << e | t >> 64n - e) & B;
}
function Ge(t, e) {
  let n = 0n;
  for (let r = 7; r >= 0; r--)
    n = (n << 8n) + BigInt(t[e + r]);
  return n;
}
function ta(t, e) {
  return BigInt(t[e]) | BigInt(t[e + 1]) << 8n | BigInt(t[e + 2]) << 16n | BigInt(t[e + 3]) << 24n;
}
function na(t) {
  return ea(t);
}
function ra(t) {
  return na(t).slice(0, 8);
}
function ia(t, e) {
  return `_vgsl_${ra(t)}__${e}`;
}
function z(t, e) {
  const n = t.find((s) => s.name === e);
  if (!n)
    return;
  const r = n.args.map((s) => s.text).join(""), i = Number(r.replace(/[ui]$/, ""));
  return Number.isFinite(i) ? i : void 0;
}
function Jt(t) {
  const e = [[]];
  let n = 0, r = 0;
  for (const i of t) {
    if (i.text === "<" ? n++ : i.text === ">" ? n = Math.max(0, n - 1) : i.text === "(" ? r++ : i.text === ")" && (r = Math.max(0, r - 1)), i.text === "," && n === 0 && r === 0) {
      e.push([]);
      continue;
    }
    e[e.length - 1].push(i);
  }
  return e.map(ri).filter((i) => i.length > 0);
}
function ri(t) {
  let e = 0, n = t.length;
  for (; e < n && t[e].text === ","; )
    e++;
  for (; n > e && t[n - 1].text === ","; )
    n--;
  return t.slice(e, n);
}
function sa(t) {
  if (t !== void 0 && ii(t))
    return Number(t.replace(/[ui]$/, ""));
}
function ii(t) {
  return /^(0|[1-9][0-9]*)([ui])?$/.test(t);
}
function si(t) {
  if (t === "read" || t === "write" || t === "read_write")
    return t;
}
function oa(t) {
  return ["f32", "f16", "i32", "u32", "bool"].find((e) => e === t);
}
function aa(t) {
  return { kind: "scalar", name: t === "f" ? "f32" : t === "h" ? "f16" : t === "i" ? "i32" : "u32" };
}
function oi(t) {
  return t === "f16" ? 2 : 4;
}
function be(t, e) {
  return Math.ceil(e / t) * t;
}
function K(t) {
  const e = ri(t);
  if (e.length === 0)
    throw A("VGPU-WGSL-REFLECT-TYPE", "Expected WGSL type");
  const n = e.map((s) => s.text).join(""), r = ca(n);
  if (r)
    return r;
  if (e[1]?.text === "<") {
    const s = e[0].text, o = Jt(e.slice(2, -1)), a = ua(s, o);
    if (a)
      return a;
  }
  const i = fa(n);
  return i || la(n);
}
function ca(t) {
  const e = oa(t);
  if (e)
    return { kind: "scalar", name: e };
  const n = t.match(/^vec([234])([fiuh])$/);
  if (n)
    return { kind: "vector", width: Number(n[1]), element: aa(n[2]) };
  const r = t.match(/^mat([234])x([234])([fh])$/);
  if (r) {
    const i = r[3] === "h" ? { kind: "scalar", name: "f16" } : { kind: "scalar", name: "f32" };
    return { kind: "matrix", columns: Number(r[1]), rows: Number(r[2]), element: i };
  }
}
function ua(t, e) {
  if (t === "array") {
    const n = e[1]?.map((i) => i.text).join(""), r = n === void 0 ? void 0 : sa(n);
    return { kind: "array", element: K(e[0] ?? []), count: r, countExpression: n };
  }
  if (t === "atomic")
    return { kind: "atomic", element: K(e[0] ?? []) };
  if (t === "vec2" || t === "vec3" || t === "vec4")
    return { kind: "vector", width: Number(t.slice(3)), element: K(e[0] ?? []) };
  if (/^mat[234]x[234]$/.test(t))
    return { kind: "matrix", columns: Number(t[3]), rows: Number(t[5]), element: K(e[0] ?? []) };
  if (t === "ptr")
    return { kind: "ptr", addressSpace: e[0]?.map((n) => n.text).join("") ?? "", element: K(e[1] ?? []), access: e[2]?.map((n) => n.text).join("") };
  if (t === "sampler")
    return { kind: "sampler", comparison: !1 };
  if (t.startsWith("texture_storage_"))
    return { kind: "texture", textureKind: t, dimension: t.slice(16), texelFormat: e[0]?.map((n) => n.text).join(""), access: si(e[1]?.map((n) => n.text).join("")) };
  if (t.startsWith("texture_"))
    return { kind: "texture", textureKind: t, dimension: t.slice(8), sampleType: e[0] ? K(e[0]) : void 0 };
}
function fa(t) {
  if (t === "sampler" || t === "sampler_comparison")
    return { kind: "sampler", comparison: t === "sampler_comparison" };
  if (t === "texture_external")
    return { kind: "texture", textureKind: t };
  if (t.startsWith("texture_depth_"))
    return { kind: "texture", textureKind: t, dimension: t.slice(8) };
  if (t.startsWith("texture_"))
    return { kind: "texture", textureKind: t, dimension: t.slice(8) };
}
function la(t) {
  return { kind: "identifier", name: t };
}
function ue(t) {
  if (t?.kind !== "ident" && t?.kind !== "keyword")
    throw A("VGPU-WGSL-REFLECT-PARSE", "Expected identifier", t?.line, t?.column);
  return t.text;
}
function we(t, e, n) {
  for (let r = e; r < t.length; r++)
    if (t[r].text === n)
      return r;
  throw A("VGPU-WGSL-REFLECT-PARSE", `Expected ${n}`, t[e]?.line, t[e]?.column);
}
function da(t, e, n, r) {
  for (let i = e; i < n; i++)
    if (t[i].text === r)
      return i;
}
function It(t, e, n) {
  let r = 0;
  for (let i = e; i < t.length; i++)
    if ((t[i].text === "{" || t[i].text === "(") && r++, (t[i].text === "}" || t[i].text === ")") && (r = Math.max(0, r - 1)), r === 0 && t[i].text === n)
      return i;
  return t.length;
}
function en(t, e) {
  const n = t[e].text, r = n === "(" ? ")" : n === "{" ? "}" : ">";
  let i = 0;
  for (let s = e; s < t.length; s++)
    if (t[s].text === n && i++, t[s].text === r && (i--, i === 0))
      return s;
  throw A("VGPU-WGSL-REFLECT-PARSE", `Unclosed ${n}`, t[e]?.line, t[e]?.column);
}
function tn(t, e) {
  const n = [];
  let r = e;
  for (; t[r]?.text === "@"; ) {
    const i = t[r], s = ue(t[r + 1]);
    r += 2;
    let o = [];
    if (t[r]?.text === "(") {
      const a = en(t, r);
      o = t.slice(r + 1, a), r = a + 1;
    }
    n.push({ name: s, args: o, token: i });
  }
  return [n, r];
}
function $e(t) {
  switch (t.kind) {
    case "scalar":
      return t.name;
    case "identifier":
      return t.name;
    case "vector":
      return `vec${t.width}<${$e(t.element)}>`;
    case "matrix":
      return `mat${t.columns}x${t.rows}<${$e(t.element)}>`;
    case "array":
      return `array<${$e(t.element)}${t.count === void 0 ? "" : `,${t.count}`}>`;
    default:
      return t.kind;
  }
}
function ha(t) {
  const e = t.find((r) => r.name === "workgroup_size");
  if (!e)
    return;
  const n = Jt(e.args).map((r) => Number(r.map((i) => i.text).join("")));
  return [n[0] ?? 1, n[1] ?? 1, n[2] ?? 1];
}
function pa(t, e) {
  if (t[e]?.text !== "<")
    return { after: e };
  const n = we(t, e, ">"), r = Jt(t.slice(e + 1, n)).map((i) => i.map((s) => s.text).join(""));
  return { addressSpace: r[0], access: si(r[1]), after: n + 1 };
}
function ma(t) {
  const e = [], n = [], r = [], i = [], s = [], o = [], a = t.tokens.filter((l) => l.kind !== "lineComment" && l.kind !== "blockComment");
  let c = 0, u = 0;
  for (; c < a.length; ) {
    const l = a[c];
    if (l.text === "{") {
      u++, c++;
      continue;
    }
    if (l.text === "}") {
      u = Math.max(0, u - 1), c++;
      continue;
    }
    if (u > 0) {
      c++;
      continue;
    }
    const f = c, [d, p] = tn(a, c);
    c = p, a[c]?.text === "export" && c++;
    const g = a[c]?.text;
    if (g === "enable") {
      a[c + 1]?.kind === "ident" && o.push(a[c + 1].text), c = It(a, c, ";") + 1;
      continue;
    }
    if (g === "struct") {
      const m = ga(t, a, c);
      m.item && e.push(m.item), c = m.next;
      continue;
    }
    if (g === "alias") {
      const m = ba(t, a, c);
      m.item && n.push(m.item), c = m.next;
      continue;
    }
    if (g === "var") {
      const m = wa(t, a, c, d);
      m.item && r.push(m.item), c = m.next;
      continue;
    }
    if (g === "fn") {
      const m = ya(t, a, c, d);
      m.item && i.push(m.item), c = m.next;
      continue;
    }
    if (g === "override") {
      const m = va(a, c, d);
      m.item && s.push(m.item), c = m.next;
      continue;
    }
    c = Math.max(f + 1, c + 1);
  }
  return { structs: e, aliases: n, vars: r, entries: i, overrides: s, features: o };
}
function ga(t, e, n, r) {
  const i = ue(e[n + 1]), s = we(e, n + 2, "{"), o = en(e, s);
  return {
    item: { name: i, originalName: i, mangledName: nn(t, i, "struct"), members: Sa(e.slice(s + 1, o)), path: t.path },
    next: o + 1
  };
}
function ba(t, e, n, r) {
  const i = ue(e[n + 1]), s = we(e, n + 2, "="), o = It(e, s + 1, ";");
  return {
    item: { name: i, originalName: i, mangledName: nn(t, i, "alias"), target: K(e.slice(s + 1, o)), path: t.path },
    next: o + 1
  };
}
function wa(t, e, n, r) {
  const { addressSpace: i, access: s, after: o } = pa(e, n + 1), a = ue(e[o]), c = we(e, o + 1, ":"), u = It(e, c + 1, ";");
  return {
    item: { path: t.path, name: a, mangledName: _a(r) ? a : nn(t, a, "var"), attrs: r, addressSpace: i, access: s, type: K(e.slice(c + 1, u)) },
    next: u + 1
  };
}
function ya(t, e, n, r) {
  const i = ue(e[n + 1]), s = r.find((c) => c.name === "vertex" || c.name === "fragment" || c.name === "compute")?.name;
  if (!s)
    return { item: void 0, next: n + 1 };
  const o = we(e, n + 2, "("), a = en(e, o);
  return { item: { name: i, mangledName: i, stage: s, workgroupSize: ha(r), path: t.path, params: xa(e.slice(o + 1, a)) }, next: a + 1 };
}
function xa(t) {
  const e = [];
  let n = 0;
  for (; n < t.length; ) {
    const [r, i] = tn(t, n);
    if (n = i, !t[n] || t[n].text === ",") {
      n++;
      continue;
    }
    const s = ue(t[n]), o = we(t, n + 1, ":");
    let a = o + 1, c = 0;
    for (; a < t.length && (t[a].text === "<" && c++, t[a].text === ">" && (c = Math.max(0, c - 1)), !(c === 0 && t[a].text === ",")); )
      a++;
    e.push({ name: s, attrs: r, type: K(t.slice(o + 1, a)) }), n = a + 1;
  }
  return e;
}
function va(t, e, n) {
  const r = ue(t[e + 1]), i = It(t, e + 1, ";"), s = da(t, e + 2, i, "=");
  return { item: { name: r, mangledName: r, id: z(n, "id"), defaultValue: s === void 0 ? void 0 : t.slice(s + 1, i).map((o) => o.text).join("") }, next: i + 1 };
}
function Sa(t) {
  const e = [];
  let n = 0;
  for (; n < t.length; ) {
    const [r, i] = tn(t, n);
    if (n = i, !t[n] || t[n].text === "," || t[n].text === ";") {
      n++;
      continue;
    }
    const s = ue(t[n]), o = we(t, n + 1, ":");
    let a = o + 1, c = 0;
    for (; a < t.length && (t[a].text === "<" && c++, t[a].text === ">" && (c = Math.max(0, c - 1)), !(c === 0 && (t[a].text === "," || t[a].text === ";"))); )
      a++;
    e.push({ name: s, attrs: r, type: K(t.slice(o + 1, a)), align: z(r, "align"), size: z(r, "size") }), n = a + 1;
  }
  return e;
}
function nn(t, e, n) {
  return n === "override" ? e : ia(t.path, e);
}
function _a(t) {
  return z(t, "group") !== void 0 || z(t, "binding") !== void 0;
}
const ka = "literal length required for auto layout; use draw.group(n, bg) manual binding", Ea = "VGPUError: `bool` is not host-shareable in uniform/storage. Fix: use `u32` (0 | 1) → struct Params { enabled: u32 }", ai = "use a manual group claim (`draw.group(n, bg)`)";
function $a(t = 1, e = 1) {
  return A("VGPU-WGSL-REFLECT-ARRAY-LENGTH", ka, t, e);
}
function ci(t = 1, e = 1) {
  return A("VGPU-WGSL-REFLECT-BOOL-HOST-SHAREABLE", Ea, t, e);
}
function bt(t, e, n = 1, r = 1) {
  return A("VGPU-WGSL-REFLECT-UNKNOWN-TYPE", `type '${t}' is unknown in ${e}; ${ai}`, n, r);
}
function Kn(t, e, n = 1, r = 1) {
  return A("VGPU-WGSL-REFLECT-NS-TYPE", `type '${t}' is a namespace-member import; use a named import or manual @group(1+) binding`, n, r);
}
function ui(t, e = 1, n = 1) {
  return A("VGPU-WGSL-REFLECT-NON-HOST-SHAREABLE", `Type ${t} is not host-shareable; ${ai}`, e, n);
}
const Fe = "naga-standard";
function Ia(t, e, n) {
  const r = /* @__PURE__ */ new Map();
  for (const o of e) {
    const a = /* @__PURE__ */ new Map();
    for (const c of [...o.structs, ...o.aliases])
      a.set(c.originalName, { path: c.path, name: c.originalName, mangledName: c.mangledName, kind: "members" in c ? "struct" : "alias" });
    r.set(o.structs[0]?.path ?? o.aliases[0]?.path ?? o.vars[0]?.path ?? "", a);
  }
  const i = new Map(t.map((o) => [o.path, r.get(o.path) ?? /* @__PURE__ */ new Map()])), s = /* @__PURE__ */ new Map();
  for (const o of t) {
    const a = new Map(i.get(o.path));
    for (const c of o.parsed.imports)
      Pa(o, c, a, t, i);
    s.set(o.path, a);
  }
  return s;
}
function Pa(t, e, n, r, i, s) {
  const o = Ta(e, t.path, r), a = i.get(o);
  for (const c of e.bindings) {
    if (c.namespace) {
      n.set(c.local, { path: o, name: c.local, mangledName: c.local, kind: "namespace" });
      continue;
    }
    const u = a?.get(c.imported);
    u && n.set(c.local, u);
  }
}
function Ca(t, e) {
  const n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (const s of t) {
    for (const o of s.structs) {
      const a = {
        name: o.name,
        mangledName: o.mangledName,
        members: o.members.map((c) => ({ name: c.name, type: ge(c.type, o.path, e), align: c.align, size: c.size }))
      };
      n.set(o.mangledName, a), i.set(o.mangledName, a);
    }
    for (const o of s.aliases) {
      const a = { name: o.name, mangledName: o.mangledName, target: ge(o.target, o.path, e) };
      r.set(o.mangledName, a), i.set(o.mangledName, a);
    }
  }
  return { structs: n, aliases: r, byMangled: i };
}
function ge(t, e, n, r) {
  switch (t.kind) {
    case "identifier": {
      const i = t.name.indexOf(".");
      if (i > 0) {
        const o = t.name.slice(0, i);
        if (n.get(e)?.get(o)?.kind === "namespace")
          throw Kn(t.name);
      }
      const s = n.get(e)?.get(t.name);
      if (s?.kind === "namespace")
        throw Kn(t.name);
      if (!s)
        throw bt(t.name, e);
      return { kind: "identifier", name: s.name, mangledName: s.mangledName };
    }
    case "array":
    case "atomic":
    case "vector":
    case "matrix":
    case "ptr":
      return { ...t, element: ge(t.element, e, n) };
    case "texture":
      return { ...t, sampleType: t.sampleType ? ge(t.sampleType, e, n) : void 0 };
    default:
      return t;
  }
}
function Ae(t, e) {
  if (!e || t.kind !== "identifier")
    return t;
  const n = e.aliases.get(t.mangledName ?? t.name);
  return n ? Ae(n.target, e) : t;
}
function Wt(t, e) {
  const n = Ae(t, e);
  switch (n.kind) {
    case "array":
    case "atomic":
    case "vector":
    case "matrix":
    case "ptr":
      return { ...n, element: Wt(n.element, e) };
    case "texture":
      return { ...n, sampleType: n.sampleType ? Wt(n.sampleType, e) : void 0 };
    default:
      return n;
  }
}
function Ta(t, e, n, r) {
  const i = void 0;
  if (i !== void 0 && n.some((u) => u.path === i))
    return i;
  const s = t.from, o = e.slice(0, e.lastIndexOf("/") + 1), a = s.startsWith("/") ? s : Fa(`${o}${s}`);
  return [s, a].find((u) => n.some((l) => l.path === u)) ?? i ?? a;
}
function Fa(t) {
  const e = t.startsWith("/"), n = [];
  for (const r of t.split("/"))
    !r || r === "." || (r === ".." ? n.pop() : n.push(r));
  return `${e ? "/" : ""}${n.join("/")}`;
}
function Ye(t, e, n = $e(t), r = n, i) {
  const s = i ? Wt(t, i) : t;
  return Aa(s, e, n, r, i);
}
function Aa(t, e, n, r, i) {
  switch (t.kind) {
    case "scalar":
      return Ma(t, e, n, r);
    case "atomic":
      return La(t, e, n, r);
    case "vector":
      return Ga(t, e, n, r, i);
    case "matrix":
      return Da(t, e, n, r, i);
    case "array":
      return Ua(t, e, n, r, i);
    case "identifier":
      return Va(t, e, n, r, i);
    default:
      throw ui($e(t));
  }
}
function Ma(t, e, n, r) {
  const i = oi(t.name);
  if (t.name === "bool")
    throw ci();
  return { name: n, mangledName: r, addressSpace: e, layoutMode: Fe, type: t, align: i, size: i };
}
function La(t, e, n, r) {
  return { name: n, mangledName: r, addressSpace: e, layoutMode: Fe, type: t, align: 4, size: 4 };
}
function Ga(t, e, n, r, i) {
  const o = Ye(t.element, e, n, r, i).size ?? 4, a = t.width === 2 ? o * 2 : o * 4;
  return { name: n, mangledName: r, addressSpace: e, layoutMode: Fe, type: t, align: a, size: o * t.width };
}
function Da(t, e, n, r, i) {
  const s = { kind: "vector", width: t.rows, element: t.element }, o = Ye(s, e, `${n}[]`, `${r}[]`, i), a = be(o.align, o.size ?? 0);
  return { name: n, mangledName: r, addressSpace: e, layoutMode: Fe, type: t, align: o.align, size: a * t.columns, stride: a, element: o };
}
function Ua(t, e, n, r, i) {
  Ra(t.countExpression);
  const s = Ye(t.element, e, `${n}[]`, `${r}[]`, i), o = be(Oe(t.element, e, i), s.size ?? 0);
  return {
    name: n,
    mangledName: r,
    addressSpace: e,
    layoutMode: Fe,
    type: t,
    align: Oe(t, e, i),
    size: t.count === void 0 ? void 0 : o * t.count,
    stride: o,
    element: s,
    runtimeSized: t.count === void 0
  };
}
function Ra(t) {
  if (t !== void 0 && !ii(t))
    throw $a();
}
function Va(t, e, n, r, i) {
  if (!i)
    throw bt(t.name, "<unknown>");
  const s = i.structs.get(t.mangledName ?? t.name);
  if (!s)
    throw bt(t.name, "<unknown>");
  const o = [];
  let a = 0, c = 1;
  for (const l of s.members) {
    const f = Na(l, e, a, i);
    o.push(f.member), a = za(e, l.type, f.offset, f.member.size ?? 0, i), c = Math.max(c, f.member.align);
  }
  const u = Ba(e, c);
  return { name: n, mangledName: r, addressSpace: e, layoutMode: Fe, type: t, align: u, size: be(u, a), members: o };
}
function Na(t, e, n, r) {
  const i = Ye(t.type, e, t.name, t.name, r), s = Math.max(Oe(t.type, e, r), t.align ?? 1), o = Math.max(i.size ?? 0, t.size ?? 0), a = be(s, n);
  return {
    member: { name: t.name, offset: a, align: s, size: o, type: t.type, layout: i, explicitAlign: t.align, explicitSize: t.size },
    offset: a
  };
}
function za(t, e, n, r, i) {
  return n + (t === "uniform" && Oa(e, i) ? be(16, r) : r);
}
function Oa(t, e) {
  const n = Ae(t, e);
  return n.kind === "identifier" && e.structs.has(n.mangledName ?? n.name);
}
function Ba(t, e) {
  return t === "uniform" ? be(16, e) : e;
}
function Oe(t, e, n) {
  const r = n ? Ae(t, n) : t, i = ft(r, e, n);
  return e === "uniform" && ja(r, n) ? be(16, i) : i;
}
function ja(t, e) {
  return t.kind === "array" || t.kind === "identifier" && !!e?.structs.get(t.mangledName ?? t.name);
}
function ft(t, e, n) {
  const r = n ? Ae(t, n) : t;
  switch (r.kind) {
    case "scalar":
      return Wa(r.name);
    case "atomic":
      return 4;
    case "vector":
      return r.width === 2 ? ft(r.element, e, n) * 2 : ft(r.element, e, n) * 4;
    case "matrix":
      return ft({ kind: "vector", width: r.rows, element: r.element }, e, n);
    case "array":
      return Oe(r.element, e, n);
    case "identifier":
      return qa(r, e, n);
    default:
      throw ui($e(r));
  }
}
function Wa(t) {
  if (t === "bool")
    throw ci();
  return oi(t);
}
function qa(t, e, n) {
  const r = n?.structs.get(t.mangledName ?? t.name);
  if (!r)
    throw bt(t.name, "<unknown>");
  return Math.max(1, ...r.members.map((i) => Math.max(Oe(i.type, e, n), i.align ?? 1)));
}
const Ka = /* @__PURE__ */ new Set([
  "alias",
  "break",
  "case",
  "const",
  "const_assert",
  "continue",
  "continuing",
  "default",
  "diagnostic",
  "discard",
  "else",
  "enable",
  "false",
  "fn",
  "for",
  "if",
  "let",
  "loop",
  "override",
  "requires",
  "return",
  "struct",
  "switch",
  "true",
  "var",
  "while"
]), Ya = /* @__PURE__ */ new Set(["import", "export", "from", "as"]), fi = /* @__PURE__ */ new Set([...Ka, ...Ya]), Xa = /* @__PURE__ */ new Set([
  "NULL",
  "Self",
  "abstract",
  "active",
  "alignas",
  "alignof",
  "as",
  "asm",
  "asm_fragment",
  "async",
  "attribute",
  "auto",
  "await",
  "become",
  "cast",
  "catch",
  "class",
  "co_await",
  "co_return",
  "co_yield",
  "coherent",
  "column_major",
  "common",
  "compile",
  "compile_fragment",
  "concept",
  "const_cast",
  "consteval",
  "constexpr",
  "constinit",
  "crate",
  "debugger",
  "decltype",
  "delete",
  "demote",
  "demote_to_helper",
  "do",
  "dynamic_cast",
  "enum",
  "explicit",
  "export",
  "extends",
  "extern",
  "external",
  "fallthrough",
  "filter",
  "final",
  "finally",
  "friend",
  "from",
  "fxgroup",
  "get",
  "goto",
  "groupshared",
  "highp",
  "impl",
  "implements",
  "import",
  "inline",
  "instanceof",
  "interface",
  "layout",
  "lowp",
  "macro",
  "macro_rules",
  "match",
  "mediump",
  "meta",
  "mod",
  "module",
  "move",
  "mut",
  "mutable",
  "namespace",
  "new",
  "nil",
  "noexcept",
  "noinline",
  "nointerpolation",
  "non_coherent",
  "noncoherent",
  "noperspective",
  "null",
  "nullptr",
  "of",
  "operator",
  "package",
  "packoffset",
  "partition",
  "pass",
  "patch",
  "pixelfragment",
  "precise",
  "precision",
  "premerge",
  "priv",
  "protected",
  "pub",
  "public",
  "readonly",
  "ref",
  "regardless",
  "register",
  "reinterpret_cast",
  "require",
  "resource",
  "restrict",
  "self",
  "set",
  "shared",
  "sizeof",
  "smooth",
  "snorm",
  "static",
  "static_assert",
  "static_cast",
  "std",
  "subroutine",
  "super",
  "target",
  "template",
  "this",
  "thread_local",
  "throw",
  "trait",
  "try",
  "type",
  "typedef",
  "typeid",
  "typename",
  "typeof",
  "union",
  "unless",
  "unorm",
  "unsafe",
  "unsized",
  "use",
  "using",
  "varying",
  "virtual",
  "volatile",
  "wgsl",
  "where",
  "with",
  "writeonly",
  "yield"
]), Ha = /* @__PURE__ */ new Set(["binding_array"]), Za = /* @__PURE__ */ new Set([
  "array",
  "atomic",
  "bool",
  "f16",
  "f32",
  "i32",
  "mat2x2",
  "mat2x3",
  "mat2x4",
  "mat3x2",
  "mat3x3",
  "mat3x4",
  "mat4x2",
  "mat4x3",
  "mat4x4",
  "ptr",
  "sampler",
  "sampler_comparison",
  "texture_1d",
  "texture_2d",
  "texture_2d_array",
  "texture_3d",
  "texture_cube",
  "texture_cube_array",
  "texture_depth_2d",
  "texture_depth_2d_array",
  "texture_depth_cube",
  "texture_depth_cube_array",
  "texture_depth_multisampled_2d",
  "texture_external",
  "texture_multisampled_2d",
  "texture_storage_1d",
  "texture_storage_2d",
  "texture_storage_2d_array",
  "texture_storage_3d",
  "u32",
  "vec2",
  "vec2f",
  "vec2h",
  "vec2i",
  "vec2u",
  "vec3",
  "vec3f",
  "vec3h",
  "vec3i",
  "vec3u",
  "vec4",
  "vec4f",
  "vec4h",
  "vec4i",
  "vec4u"
]), Qa = /* @__PURE__ */ new Set([
  "abs",
  "acos",
  "acosh",
  "all",
  "any",
  "arrayLength",
  "asin",
  "asinh",
  "atan",
  "atan2",
  "atanh",
  "ceil",
  "clamp",
  "cos",
  "cosh",
  "countLeadingZeros",
  "countOneBits",
  "countTrailingZeros",
  "cross",
  "degrees",
  "determinant",
  "distance",
  "dot",
  "dot4I8Packed",
  "dot4U8Packed",
  "dpdx",
  "dpdxCoarse",
  "dpdxFine",
  "dpdy",
  "dpdyCoarse",
  "dpdyFine",
  "exp",
  "exp2",
  "extractBits",
  "faceForward",
  "firstLeadingBit",
  "firstTrailingBit",
  "floor",
  "fma",
  "fract",
  "frexp",
  "fwidth",
  "fwidthCoarse",
  "fwidthFine",
  "insertBits",
  "inverseSqrt",
  "ldexp",
  "length",
  "log",
  "log2",
  "max",
  "min",
  "mix",
  "modf",
  "normalize",
  "pack2x16float",
  "pack2x16snorm",
  "pack2x16unorm",
  "pack4x8snorm",
  "pack4x8unorm",
  "pack4xI8",
  "pack4xU8",
  "pack4xI8Clamp",
  "pack4xU8Clamp",
  "pow",
  "quantizeToF16",
  "radians",
  "reflect",
  "refract",
  "reverseBits",
  "round",
  "saturate",
  "select",
  "sign",
  "sin",
  "sinh",
  "smoothstep",
  "sqrt",
  "step",
  "storageBarrier",
  "tan",
  "tanh",
  "textureBarrier",
  "textureDimensions",
  "textureGather",
  "textureGatherCompare",
  "textureLoad",
  "textureNumLayers",
  "textureNumLevels",
  "textureNumSamples",
  "textureSample",
  "textureSampleBaseClampToEdge",
  "textureSampleBias",
  "textureSampleCompare",
  "textureSampleCompareLevel",
  "textureSampleGrad",
  "textureSampleLevel",
  "textureStore",
  "transpose",
  "trunc",
  "unpack2x16float",
  "unpack2x16snorm",
  "unpack2x16unorm",
  "unpack4x8snorm",
  "unpack4x8unorm",
  "unpack4xI8",
  "unpack4xU8",
  "workgroupBarrier"
]), Ja = /* @__PURE__ */ new Set([
  "frag_depth",
  "front_facing",
  "global_invocation_id",
  "instance_index",
  "local_invocation_id",
  "local_invocation_index",
  "num_workgroups",
  "position",
  "sample_index",
  "sample_mask",
  "subgroup_invocation_id",
  "subgroup_size",
  "vertex_index",
  "workgroup_id"
]), ec = /* @__PURE__ */ new Set([
  "align",
  "binding",
  "blend_src",
  "builtin",
  "compute",
  "diagnostic",
  "fragment",
  "group",
  "id",
  "interpolate",
  "invariant",
  "location",
  "must_use",
  "size",
  "vertex",
  "workgroup_size"
]), tc = /* @__PURE__ */ new Set(["function", "private", "storage", "uniform", "workgroup"]), nc = /* @__PURE__ */ new Set(["read", "read_write", "write"]), rc = /* @__PURE__ */ new Set([
  "bgra8unorm",
  "r32float",
  "r32sint",
  "r32uint",
  "rg32float",
  "rg32sint",
  "rg32uint",
  "rgba16float",
  "rgba16sint",
  "rgba16uint",
  "rgba32float",
  "rgba32sint",
  "rgba32uint",
  "rgba8sint",
  "rgba8snorm",
  "rgba8uint",
  "rgba8unorm"
]);
[
  ...fi,
  ...Xa,
  ...Ha,
  ...Za,
  ...Qa,
  ...Ja,
  ...ec,
  ...tc,
  ...nc,
  ...rc
];
const ic = "VGPU-WGSL-IDENT-NONASCII", sc = "https://github.com/vercel-labs/vgpu/issues/294";
function oc(t, e) {
  const n = [];
  let r = 0, i = 1, s = 1;
  const o = (c, u, l, f, d) => n.push({ kind: c, text: t.slice(u, l), start: u, end: l, line: f, column: d }), a = () => {
    t[r] === `
` ? (i++, s = 1) : s++, r++;
  };
  for (; r < t.length; ) {
    const c = t[r];
    if (/\s/.test(c)) {
      a();
      continue;
    }
    const u = r, l = i, f = s;
    if (c === "/" && t[r + 1] === "/") {
      for (; r < t.length && t[r] !== `
`; )
        a();
      o("lineComment", u, r, l, f);
      continue;
    }
    if (c === "/" && t[r + 1] === "*") {
      let d = 0;
      for (; r < t.length; ) {
        if (t[r] === "/" && t[r + 1] === "*") {
          d++, a(), a();
          continue;
        }
        if (t[r] === "*" && t[r + 1] === "/") {
          if (d--, a(), a(), d === 0) {
            o("blockComment", u, r, l, f);
            break;
          }
          continue;
        }
        a();
      }
      if (d !== 0)
        throw A("VGPU-WGSL-LEX-UNTERM-COMMENT", "Unterminated block comment", l, f);
      continue;
    }
    if (c === '"' || c === "'") {
      const d = c;
      for (a(); r < t.length && t[r] !== d; ) {
        if (t[r] === `
`)
          throw A("VGPU-WGSL-LEX-UNTERM-STRING", "Unterminated string", l, f);
        t[r] === "\\" && a(), a();
      }
      if (r >= t.length)
        throw A("VGPU-WGSL-LEX-UNTERM-STRING", "Unterminated string", l, f);
      a(), o("string", u, r, l, f);
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      for (; r < t.length && /[A-Za-z0-9_]/.test(t[r]); )
        a();
      const d = t.slice(u, r);
      o(fi.has(d) ? "keyword" : "ident", u, r, l, f);
      continue;
    }
    if (/[0-9]/.test(c) || c === "." && /[0-9]/.test(t[r + 1] ?? "")) {
      for (c === "." && a(); r < t.length; ) {
        const d = t[r];
        if (/[A-Za-z0-9_.]/.test(d)) {
          a();
          continue;
        }
        if ((d === "+" || d === "-") && cc(t[r - 1]) && /[0-9]/.test(t[r + 1] ?? "")) {
          a();
          continue;
        }
        break;
      }
      o("number", u, r, l, f);
      continue;
    }
    if (c.charCodeAt(0) > 127)
      throw ac(t, r, i, s, e);
    a(), o("punct", u, r, l, f);
  }
  return n;
}
function ac(t, e, n, r, i) {
  let s = e;
  for (; s > 0 && Yn(t[s - 1]); )
    s--;
  let o = e + 1;
  for (; o < t.length && Yn(t[o]); )
    o++;
  const a = t.slice(s, o), c = r - (e - s), u = i === void 0 ? "" : ` in ${i}`, l = No(ic, `Non-ASCII identifier '${a}'${u} at line ${n} column ${c}; vgpu's WGSL pipeline supports ASCII identifiers only`, { fix: `Rename '${a}' using ASCII letters, digits and '_'. Unicode (XID) identifiers are tracked in ${sc}`, line: n, column: c });
  return l.range = { file: i, start: { line: n, column: c } }, l;
}
function Yn(t) {
  return t.charCodeAt(0) > 127 || /[A-Za-z0-9_]/.test(t);
}
function cc(t) {
  return t === "e" || t === "E" || t === "p" || t === "P";
}
const uc = /^_vgsl_[0-9a-f]{8,16}__[A-Za-z_][A-Za-z0-9_]*$/, fc = /* @__PURE__ */ new Set(["fn", "struct", "const", "alias", "var", "override"]);
function li(t) {
  return new lc(t).analyze();
}
class lc {
  tokens;
  scopes = [];
  declarations = [];
  references = [];
  functions = [];
  preserved = /* @__PURE__ */ new Map();
  symbolsByScope = /* @__PURE__ */ new Map();
  moduleFallbackReasons = [];
  pendingSymbols = [];
  moduleScopeId;
  constructor(e) {
    this.tokens = e, this.moduleScopeId = this.createScope("module", void 0, void 0, 0);
  }
  analyze() {
    this.collectTopLevel();
    for (const e of this.functions)
      this.walkFunction(e);
    return {
      tokens: this.tokens,
      scopes: this.scopes,
      declarations: this.declarations,
      references: this.references,
      functions: this.functions,
      preservedTokens: [...this.preserved.entries()].map(([e, n]) => ({ tokenIndex: e, reason: n })),
      fallback: { wholeModule: this.moduleFallbackReasons.length > 0, reasons: this.moduleFallbackReasons }
    };
  }
  collectTopLevel() {
    let e = 0;
    for (let n = 0; n < this.tokens.length; n++) {
      const r = this.tokens[n];
      if (!Q(r)) {
        if (r.text === "{") {
          e++;
          continue;
        }
        if (r.text === "}") {
          e--, e < 0 && (this.moduleFallback("unmatched top-level closing brace", n), e = 0);
          continue;
        }
        if (e === 0) {
          if (r.text === "@") {
            n = this.preserveAttribute(n);
            continue;
          }
          if (r.text === "enable" || r.text === "requires" || r.text === "diagnostic" || r.text === "const_assert") {
            n = this.preserveStatement(n, "directive");
            continue;
          }
          if (r.text !== "export") {
            if (r.text === "struct") {
              n = this.collectStruct(n);
              continue;
            }
            if (r.text === "fn") {
              n = this.collectFunction(n);
              continue;
            }
            if (r.text === "const" || r.text === "alias" || r.text === "var" || r.text === "override") {
              n = this.preserveGlobalDeclaration(n);
              continue;
            }
            r.kind === "keyword" && !fc.has(r.text) && this.moduleFallback(`unexpected top-level keyword '${r.text}'`, n);
          }
        }
      }
    }
    e !== 0 && this.moduleFallback("unclosed top-level brace", this.tokens.length - 1), this.scopes[this.moduleScopeId].endToken = Math.max(0, this.tokens.length - 1);
  }
  collectStruct(e) {
    const n = this.nextSig(e);
    if (n === void 0 || this.tokens[n]?.kind !== "ident")
      return this.moduleFallback("struct without name", e), e;
    this.preserveToken(n, "global");
    const r = this.nextSig(n);
    if (r === void 0 || this.tokens[r]?.text !== "{")
      return this.moduleFallback("struct without body", e), n;
    const i = this.findMatching(r, "{", "}");
    if (i === void 0)
      return this.moduleFallback("unclosed struct body", r), r;
    for (let s = r; s <= i; s++)
      this.tokens[s]?.kind === "ident" && this.preserveToken(s, "struct");
    return i;
  }
  collectFunction(e) {
    const n = this.nextSig(e);
    if (n === void 0 || this.tokens[n]?.kind !== "ident")
      return this.moduleFallback("function without name", e), e;
    const r = this.tokens[n].text, i = uc.test(r) && !this.hasEntryAttributeBefore(e);
    this.addDeclaration(r, "function", n, this.moduleScopeId, void 0, i), i || this.preserveToken(n, "global");
    const s = this.nextSig(n);
    if (s === void 0 || this.tokens[s]?.text !== "(")
      return this.moduleFallback("function without parameter list", n), n;
    const o = this.findMatching(s, "(", ")");
    if (o === void 0)
      return this.moduleFallback("unclosed function parameter list", s), s;
    const a = this.findNextText(o + 1, "{");
    if (a === void 0)
      return this.moduleFallback("function without body", o), o;
    this.preserveFunctionSignatureTail(o + 1, a);
    const c = this.findMatching(a, "{", "}");
    if (c === void 0)
      return this.moduleFallback("unclosed function body", a), a;
    const u = this.createScope("function", this.moduleScopeId, this.functions.length, s);
    return this.functions.push({ id: this.functions.length, name: r, nameTokenIndex: n, scopeId: u, bodyStartToken: a, bodyEndToken: c, skipped: !1, fallbackReasons: [] }), this.collectParams(s, o, u, this.functions.length - 1), this.scopes[u].endToken = c, c;
  }
  collectParams(e, n, r, i) {
    for (let s = e + 1; s < n; s++) {
      const o = this.tokens[s];
      if (!Q(o)) {
        if (o.text === "@") {
          s = this.preserveAttribute(s);
          continue;
        }
        if (o.kind === "ident" && this.nextSig(s) !== void 0 && this.tokens[this.nextSig(s)]?.text === ":") {
          this.addDeclaration(o.text, "param", s, r, i, !0);
          const a = this.nextSig(s);
          s = this.preserveTypeFrom(a + 1, [",", ")"], n);
        }
      }
    }
  }
  preserveFunctionSignatureTail(e, n) {
    for (let r = e; r < n; r++) {
      const i = this.tokens[r];
      if (!Q(i)) {
        if (i.text === "@") {
          r = this.preserveAttribute(r);
          continue;
        }
        i.kind === "ident" && this.preserveToken(r, "type");
      }
    }
  }
  preserveGlobalDeclaration(e) {
    let n = e + 1;
    if (this.tokens[e]?.text === "var") {
      const s = this.nextSig(e);
      if (s !== void 0 && this.tokens[s]?.text === "<") {
        const o = this.findMatching(s, "<", ">");
        if (o === void 0)
          return this.moduleFallback("unparseable top-level var template", s), s;
        this.preserveRange(s, o, "type"), n = o + 1;
      }
    }
    const r = this.findNextIdent(n);
    r !== void 0 && (this.preserveToken(r, "global"), this.addDeclaration(this.tokens[r].text, "global", r, this.moduleScopeId, void 0, !1));
    const i = this.findStatementEnd(e);
    for (let s = e; s <= i; s++)
      this.tokens[s]?.kind === "ident" && this.preserveToken(s, "global");
    return i;
  }
  walkFunction(e) {
    const n = [this.moduleScopeId, e.scopeId], r = [], i = (a, c) => {
      const u = this.createScope(a, n[n.length - 1], e.id, c);
      return n.push(u), u;
    }, s = (a) => {
      if (n.length <= 2) {
        this.functionFallback(e, "scope frame underflow", a);
        return;
      }
      const c = n.pop();
      return this.scopes[c].endToken = a, c;
    };
    i("block", e.bodyStartToken);
    let o = 1;
    for (let a = e.bodyStartToken + 1; a < e.bodyEndToken; a++) {
      this.activatePendingSymbols(a);
      const c = this.tokens[a];
      if (Q(c))
        continue;
      if (c.text === "@") {
        a = this.preserveAttribute(a);
        continue;
      }
      if (c.text === ".") {
        const l = this.nextSig(a);
        l !== void 0 && this.tokens[l]?.kind === "ident" && this.preserveToken(l, "member");
        continue;
      }
      if (c.text === "enable" || c.text === "requires" || c.text === "diagnostic") {
        a = this.preserveStatement(a, "directive");
        continue;
      }
      if (c.text === "for") {
        const l = i("for-init", a), f = this.nextSig(a);
        (f === void 0 || this.tokens[f]?.text !== "(") && this.functionFallback(e, "for without parenthesized header", a), r.push({ scopeId: l, headerDepth: 0, awaitingBody: !1 });
        continue;
      }
      const u = r[r.length - 1];
      if (u && u.bodyDepth === void 0 && (c.text === "(" && u.headerDepth++, c.text === ")" && (u.headerDepth--, u.headerDepth <= 0 && (u.awaitingBody = !0))), c.text === "{") {
        o++;
        const l = dc(r, (f) => f.awaitingBody && f.bodyDepth === void 0);
        l && (l.bodyDepth = o), i("block", a);
        continue;
      }
      if (c.text === "}") {
        const l = o;
        for (s(a), o--; r.length > 0 && r[r.length - 1].bodyDepth === l; )
          s(a), r.pop();
        o < 0 && this.functionFallback(e, "unmatched closing brace", a);
        continue;
      }
      if (c.text === ":") {
        a = this.preserveTypeFrom(a + 1, ["=", ";", ",", ")", "{"], e.bodyEndToken);
        continue;
      }
      if (c.text === "-" && this.tokens[this.nextSig(a) ?? -1]?.text === ">") {
        a = this.preserveTypeFrom((this.nextSig(a) ?? a) + 1, ["{"], e.bodyEndToken);
        continue;
      }
      if (c.text === "let" || c.text === "const" || c.text === "var") {
        a = this.collectLocalDeclaration(a, n[n.length - 1], e);
        continue;
      }
      if (c.kind === "ident" && !this.preserved.has(a)) {
        const l = this.resolve(c.text, n);
        l !== void 0 ? this.references.push({ name: c.text, tokenIndex: a, declarationId: l, scopeId: n[n.length - 1], functionId: e.id }) : this.preserveToken(a, "unknown");
      }
    }
    for (; n.length > 2; )
      s(e.bodyEndToken);
  }
  collectLocalDeclaration(e, n, r) {
    const i = this.tokens[e].text;
    let s = e + 1;
    if (i === "var") {
      const c = this.nextSig(e);
      if (c !== void 0 && this.tokens[c]?.text === "<") {
        const u = this.findMatching(c, "<", ">");
        if (u === void 0)
          return this.functionFallback(r, "unparseable var template", c), c;
        this.preserveRange(c, u, "type"), s = u + 1;
      }
    }
    const o = this.findNextIdent(s);
    if (o === void 0 || o >= r.bodyEndToken)
      return this.functionFallback(r, `${i} without identifier`, e), e;
    this.addDeclaration(this.tokens[o].text, i, o, n, r.id, !0, this.findStatementEnd(e));
    const a = this.nextSig(o);
    return a !== void 0 && this.tokens[a]?.text === ":" ? this.preserveTypeFrom(a + 1, ["=", ";", ",", ")"], r.bodyEndToken) : o;
  }
  addDeclaration(e, n, r, i, s, o, a) {
    const c = this.declarations.length;
    return this.declarations.push({ id: c, name: e, kind: n, tokenIndex: r, scopeId: i, functionId: s, safeToRename: o }), a !== void 0 ? this.pendingSymbols.push({ name: e, id: c, scopeId: i, activateAfter: a }) : this.activateSymbol(e, c, i), c;
  }
  activatePendingSymbols(e) {
    for (let n = this.pendingSymbols.length - 1; n >= 0; n--) {
      const r = this.pendingSymbols[n];
      r.activateAfter >= e || (this.activateSymbol(r.name, r.id, r.scopeId), this.pendingSymbols.splice(n, 1));
    }
  }
  activateSymbol(e, n, r) {
    let i = this.symbolsByScope.get(r);
    i || (i = /* @__PURE__ */ new Map(), this.symbolsByScope.set(r, i)), i.has(e) || i.set(e, n);
  }
  resolve(e, n) {
    for (let r = n.length - 1; r >= 0; r--) {
      const i = this.symbolsByScope.get(n[r])?.get(e);
      if (i !== void 0)
        return i;
    }
  }
  preserveAttribute(e) {
    this.preserveToken(e, "attribute");
    const n = this.nextSig(e);
    if (n === void 0)
      return e;
    this.preserveToken(n, "attribute");
    const r = this.nextSig(n);
    if (r === void 0 || this.tokens[r]?.text !== "(")
      return n;
    const i = this.findMatching(r, "(", ")");
    return i === void 0 ? (this.preserveRange(r, r, "attribute"), r) : (this.preserveRange(r, i, "attribute"), i);
  }
  preserveTypeFrom(e, n, r) {
    let i = 0, s = 0, o = 0, a = e - 1;
    for (let c = e; c < r; c++) {
      const u = this.tokens[c];
      if (!Q(u)) {
        if (i === 0 && s === 0 && o === 0 && n.includes(u.text))
          return Math.max(e - 1, c - 1);
        if (u.text === "<")
          i++;
        else if (u.text === ">")
          i = Math.max(0, i - 1);
        else if (u.text === "(")
          s++;
        else if (u.text === ")") {
          if (s === 0 && n.includes(")"))
            return Math.max(e - 1, c - 1);
          s = Math.max(0, s - 1);
        } else u.text === "[" ? o++ : u.text === "]" && (o = Math.max(0, o - 1));
        u.kind === "ident" && this.preserveToken(c, "type"), a = c;
      }
    }
    return a;
  }
  preserveStatement(e, n) {
    const r = this.findStatementEnd(e);
    return this.preserveRange(e, r, n), r;
  }
  preserveRange(e, n, r) {
    for (let i = e; i <= n; i++)
      this.tokens[i] && this.tokens[i].kind !== "lineComment" && this.tokens[i].kind !== "blockComment" && this.preserveToken(i, r);
  }
  preserveToken(e, n) {
    this.preserved.has(e) || this.preserved.set(e, n);
  }
  createScope(e, n, r, i) {
    const s = this.scopes.length;
    return this.scopes.push({ id: s, kind: e, parentId: n, functionId: r, startToken: i }), s;
  }
  nextSig(e) {
    for (let n = e + 1; n < this.tokens.length; n++)
      if (!Q(this.tokens[n]))
        return n;
  }
  findNextIdent(e) {
    for (let n = e; n < this.tokens.length; n++) {
      const r = this.tokens[n];
      if (!Q(r)) {
        if (r.kind === "ident")
          return n;
        if (r.text !== "@")
          return;
      }
    }
  }
  findNextText(e, n) {
    for (let r = e; r < this.tokens.length; r++)
      if (!Q(this.tokens[r]) && this.tokens[r].text === n)
        return r;
  }
  // `<` / `>` are deliberately not tracked here: in a declaration's initializer they are
  // comparison or shift operators, not template brackets, and a net-positive count made this scan
  // overshoot the statement's own `;` (vgpu#251). A WGSL template argument list can never contain
  // `;`, `{` or `}`, so angle depth is not load-bearing for finding a statement end.
  findStatementEnd(e) {
    let n = 0;
    for (let r = e; r < this.tokens.length; r++) {
      const i = this.tokens[r].text;
      if (i === "(")
        n++;
      else if (i === ")")
        n = Math.max(0, n - 1);
      else if (n === 0 && (i === ";" || i === "{" || i === "}"))
        return r;
    }
    return this.tokens.length - 1;
  }
  findMatching(e, n, r) {
    let i = 0;
    for (let s = e; s < this.tokens.length; s++) {
      const o = this.tokens[s].text;
      if (o === n && i++, o === r && (i--, i === 0))
        return s;
    }
  }
  hasEntryAttributeBefore(e) {
    for (let n = e - 1; n >= 0; n--) {
      const r = this.tokens[n];
      if (!Q(r)) {
        if (r.text === ")" || r.kind === "ident" || r.text === "@") {
          const i = r.text;
          if (i === "compute" || i === "vertex" || i === "fragment")
            return !0;
          continue;
        }
        break;
      }
    }
    return !1;
  }
  moduleFallback(e, n) {
    this.moduleFallbackReasons.push(`${e} at token ${n}`);
  }
  functionFallback(e, n, r) {
    e.skipped = !0, e.fallbackReasons.push(`${n} at token ${r}`);
  }
}
function dc(t, e) {
  for (let n = t.length - 1; n >= 0; n--)
    if (e(t[n]))
      return t[n];
}
function Q(t) {
  return t.kind === "lineComment" || t.kind === "blockComment";
}
const hc = /* @__PURE__ */ new Set(["textureSample", "textureSampleBias", "textureSampleLevel", "textureSampleGrad", "textureGather", "textureSampleBaseClampToEdge"]), pc = /* @__PURE__ */ new Set(["textureSampleCompare", "textureSampleCompareLevel", "textureGatherCompare"]);
function mc(t, e, n) {
  const r = /* @__PURE__ */ new Map();
  for (let i = 0; i < t.length; i++) {
    const s = t[i], o = e[i], a = li(s.tokens), c = /* @__PURE__ */ new Map();
    for (const l of o.vars) {
      const f = z(l.attrs, "group"), d = z(l.attrs, "binding"), p = a.declarations.find((g) => g.kind === "global" && g.name === l.name);
      f !== void 0 && d !== void 0 && p && c.set(p.id, { group: f, binding: d });
    }
    const u = /* @__PURE__ */ new Map();
    for (const l of a.declarations) {
      if (l.kind !== "function")
        continue;
      const f = a.functions.find((d) => d.nameTokenIndex === l.tokenIndex);
      f && u.set(l.id, f.id);
    }
    for (const l of o.entries) {
      const f = a.functions.find((m) => m.name === l.name), d = [];
      let p = a.fallback.wholeModule || !f;
      !p && f && (p = !di(f.id, /* @__PURE__ */ new Map(), /* @__PURE__ */ new Set(), a, c, u, d));
      const g = f ? xc(f.id, a, c, u) : n.map(qt);
      r.set(l, p ? vc(n, g) : Sc(d));
    }
  }
  return r;
}
function di(t, e, n, r, i, s, o) {
  const a = r.functions[t];
  if (!a || a.skipped)
    return !1;
  const c = `${t}|${[...e].map(([f, d]) => `${f}:${d.group}:${d.binding}`).join(",")}`;
  if (n.has(c))
    return !0;
  n.add(c);
  const u = r.references.filter((f) => f.functionId === t), l = new Map(u.map((f) => [f.tokenIndex, f]));
  for (let f = a.bodyStartToken + 1; f < a.bodyEndToken; f++) {
    const d = r.tokens[f]?.text, p = hc.has(d ?? "") ? "filtering" : pc.has(d ?? "") ? "comparison" : void 0, g = l.get(f), m = g && s.get(g.declarationId);
    if (!p && m === void 0)
      continue;
    const v = yc(r, f);
    if (v === void 0 || r.tokens[v]?.text !== "(")
      continue;
    const y = wc(r, v);
    if (!y)
      return !1;
    const x = y.map(([E, $]) => gc(E, $, r, i, e));
    if (p) {
      const E = d === "textureGather" && !bc(y[0], r, i, e) ? 1 : 0, $ = x[E], _ = x[E + 1];
      if (!$ || !_)
        return !1;
      o.push({ texture: $, sampler: _, mode: p });
    } else {
      const E = r.declarations.filter((_) => _.kind === "param" && _.functionId === m).sort((_, M) => _.tokenIndex - M.tokenIndex), $ = /* @__PURE__ */ new Map();
      for (let _ = 0; _ < E.length; _++)
        x[_] && $.set(E[_].id, x[_]);
      if (!di(m, $, n, r, i, s, o))
        return !1;
    }
  }
  return !0;
}
function gc(t, e, n, r, i) {
  for (const s of n.references) {
    if (s.tokenIndex < t || s.tokenIndex > e)
      continue;
    const o = r.get(s.declarationId) ?? i.get(s.declarationId);
    if (o)
      return o;
  }
}
function bc(t, e, n, r) {
  const i = e.references.find((s) => s.tokenIndex >= t[0] && s.tokenIndex <= t[1]);
  return i?.tokenIndex === t[0] ? n.get(i.declarationId) ?? r.get(i.declarationId) : void 0;
}
function wc(t, e) {
  const n = [];
  let r = 1, i = 0, s = 0, o = 0, a = e + 1;
  for (let c = e + 1; c < t.tokens.length; c++) {
    const u = t.tokens[c].text;
    if (u === "(")
      r++;
    else if (u === ")") {
      if (r--, r === 0)
        return n.push([a, c - 1]), n;
    } else u === "[" ? i++ : u === "]" ? i-- : u === "{" ? s++ : u === "}" ? s-- : u === "<" ? o++ : u === ">" ? o-- : u === "," && r === 1 && i === 0 && s === 0 && o === 0 && (n.push([a, c - 1]), a = c + 1);
  }
}
function yc(t, e) {
  for (let n = e + 1; n < t.tokens.length; n++)
    if (t.tokens[n].kind !== "lineComment" && t.tokens[n].kind !== "blockComment")
      return n;
}
function xc(t, e, n, r) {
  const i = [t], s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
  for (; i.length; ) {
    const a = i.pop();
    if (!s.has(a)) {
      s.add(a);
      for (const c of e.references) {
        if (c.functionId !== a)
          continue;
        const u = n.get(c.declarationId);
        u && o.set(`${u.group}:${u.binding}`, u);
        const l = r.get(c.declarationId);
        l !== void 0 && i.push(l);
      }
    }
  }
  return [...o.values()];
}
function vc(t, e) {
  const n = new Set(e.map((o) => `${o.group}:${o.binding}`)), r = t.filter((o) => n.has(`${o.group}:${o.binding}`)), i = r.filter((o) => o.bindingLayout?.kind === "texture" && o.bindingLayout.texture.sampleType === "unfilterable-float" && !o.bindingLayout.texture.multisampled), s = r.filter((o) => o.bindingLayout?.kind === "sampler" && o.bindingLayout.sampler.type === "filtering");
  return i.flatMap((o) => s.map((a) => ({ texture: qt(o), sampler: qt(a), mode: "filtering" })));
}
function qt(t) {
  return { group: t.group, binding: t.binding };
}
function Sc(t) {
  const e = /* @__PURE__ */ new Set();
  return t.filter((n) => {
    const r = `${n.texture.group}:${n.texture.binding}:${n.sampler.group}:${n.sampler.binding}:${n.mode}`;
    return e.has(r) ? !1 : (e.add(r), !0);
  });
}
function _c(t, e) {
  const n = t.map(ma), r = Ia(t, n), i = Ca(n, r), s = [], o = [];
  for (const u of n)
    for (const l of u.vars) {
      const f = z(l.attrs, "group"), d = z(l.attrs, "binding");
      if (f === void 0 || d === void 0)
        continue;
      const p = ge(l.type, l.path, r), g = qo(p, l.addressSpace), m = l.addressSpace === "uniform" || l.addressSpace === "storage" ? Ye(p, l.addressSpace, l.name, l.mangledName, i) : void 0;
      m && o.push(m), s.push({
        group: f,
        binding: d,
        name: l.name,
        mangledName: l.mangledName,
        type: p,
        kind: g,
        addressSpace: l.addressSpace,
        access: l.access,
        struct: p.kind === "identifier" ? i.structs.get(p.mangledName ?? p.name) : void 0,
        layout: m,
        bindingLayout: Ko(g, l.addressSpace, l.access, p, m)
      });
    }
  s.sort((u, l) => u.group - l.group || u.binding - l.binding);
  const a = kc(t, n, s), c = mc(t, n, s);
  return {
    bindings: s,
    entryPoints: n.flatMap((u) => u.entries.map((l) => Ec(l, n.flatMap((f) => f.structs), r, i, a.get(l) ?? s, c.get(l) ?? []))),
    overrides: n.flatMap((u) => u.overrides),
    featuresRequired: [...new Set(n.flatMap((u) => u.features))],
    aliases: [...i.aliases.values()],
    structs: [...i.structs.values()],
    hostShareableLayouts: o
  };
}
function kc(t, e, n) {
  const r = /* @__PURE__ */ new Map();
  for (let i = 0; i < t.length; i++) {
    const s = t[i], o = e[i], a = li(s.tokens), c = a.fallback.wholeModule, u = /* @__PURE__ */ new Map();
    for (const f of a.declarations) {
      if (f.kind !== "function")
        continue;
      const d = a.functions.find((p) => p.nameTokenIndex === f.tokenIndex);
      d && u.set(f.id, d.id);
    }
    const l = /* @__PURE__ */ new Map();
    for (const f of o.vars) {
      const d = z(f.attrs, "group"), p = z(f.attrs, "binding");
      if (d === void 0 || p === void 0)
        continue;
      const g = a.declarations.find((m) => m.kind === "global" && m.name === f.name);
      g && l.set(g.id, { group: d, binding: p });
    }
    for (const f of o.entries) {
      const d = a.functions.find((v) => v.name === f.name);
      if (c || !d) {
        r.set(f, n);
        continue;
      }
      const p = [d.id], g = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Map();
      for (; p.length; ) {
        const v = p.pop();
        if (!g.has(v) && (g.add(v), !!a.functions[v]))
          for (const y of a.references) {
            if (y.functionId !== v)
              continue;
            const x = l.get(y.declarationId);
            x && m.set(`${x.group}:${x.binding}`, x);
            const E = u.get(y.declarationId);
            E !== void 0 && p.push(E);
          }
      }
      r.set(f, [...m.values()].sort((v, y) => v.group - y.group || v.binding - y.binding));
    }
  }
  return r;
}
function Ec(t, e, n, r, i, s) {
  return {
    name: t.name,
    mangledName: t.mangledName,
    stage: t.stage,
    // `workgroupSize` and `inputs` stay absent rather than `undefined`-valued when they do not
    // apply: an own key valued `undefined` survives structuredClone but is dropped by
    // JSON.stringify, which would make the key set differ across serialization boundaries.
    ...t.workgroupSize ? { workgroupSize: t.workgroupSize } : {},
    bindings: i.map(({ group: o, binding: a }) => ({ group: o, binding: a })),
    samplingPairs: s,
    ...t.stage === "vertex" ? { inputs: $c(t, e, n, r) } : {}
  };
}
function $c(t, e, n, r) {
  const i = [];
  for (const s of t.params) {
    if (Xn(s.attrs, "builtin"))
      continue;
    const o = ge(s.type, t.path, n), a = z(s.attrs, "location");
    if (a !== void 0) {
      i.push({ name: s.name, location: a, type: o });
      continue;
    }
    const c = Ae(o, r);
    if (c.kind !== "identifier")
      continue;
    const u = e.find((f) => f.mangledName === (c.mangledName ?? c.name)), l = r.structs.get(c.mangledName ?? c.name);
    if (u)
      for (let f = 0; f < u.members.length; f++) {
        const d = u.members[f];
        if (Xn(d.attrs, "builtin"))
          continue;
        const p = z(d.attrs, "location");
        p !== void 0 && i.push({ name: d.name, location: p, type: l?.members[f]?.type ?? ge(d.type, u.path, n) });
      }
  }
  return i;
}
function Xn(t, e) {
  return t.some((n) => n.name === e);
}
function rn(t, e = "<runtime>") {
  const n = oc(t, e), r = Oo(n);
  if (r.imports.length > 0)
    throw A("VGPU-WGSL-REFLECT-SOURCE-IMPORT", "reflectSource() accepts a single raw WGSL string; use resolveShader() for WGSL import graphs.");
  return _c([{ path: e, source: t, tokens: n, parsed: r }]);
}
function sn() {
  const t = /* @__PURE__ */ new Map();
  return {
    getOrCreate(e, n, r, i) {
      const s = r.map(wt), o = `${e}:${n}:${s.join("|")}`, a = t.get(o);
      if (a)
        return a.bindGroup;
      const c = i();
      return t.set(o, { identities: s, bindGroup: c }), c;
    },
    evictIdentity(e) {
      const n = wt(e);
      for (const [r, i] of t)
        i.identities.includes(n) && t.delete(r);
    },
    clearDraw(e) {
      const n = `${e}:`;
      for (const r of t.keys())
        r.startsWith(n) && t.delete(r);
    },
    dispose() {
      t.clear();
    }
  };
}
function wt(t) {
  return typeof t == "string" || typeof t == "number" ? String(t) : `${t.kind}:${t.id}`;
}
function Be(t, e, n) {
  const r = t[e];
  if (!r)
    throw new w({
      code: "VGPU-REFLECT-ENTRY-METADATA-MISSING",
      message: `Entry point '${t.name}' has no reflected ${e}.`,
      fix: "Pass the reflection from reflectSource()/resolveShader().",
      where: n
    });
  return r;
}
const yt = /* @__PURE__ */ new WeakMap();
function Ne(t, e) {
  if (!t.gpu.pushErrorScope || !t.gpu.popErrorScope)
    return;
  t.gpu.pushErrorScope("validation");
  const n = yt.get(t.gpu);
  n ? n.push(e) : yt.set(t.gpu, [e]);
}
function j(t) {
  const e = yt.get(t.gpu);
  if (!e?.length || !t.gpu.popErrorScope)
    return;
  const n = e.pop();
  return e.length || yt.delete(t.gpu), { context: n, error: t.gpu.popErrorScope() };
}
function hi(t) {
  const e = [];
  let n = j(t);
  for (; n; )
    e.push(n), n = j(t);
  return e;
}
function Ic(t) {
  const e = j(t);
  e && an(e);
}
function pi(t) {
  for (const e of hi(t))
    an(e);
}
function N(t) {
  for (const e of t)
    an(e);
}
function on(t) {
  return t.gpu.queue.onSubmittedWorkDone?.() ?? Promise.resolve();
}
function mi(t, e = [], n = {}) {
  return Cc(t, e, n.errorSink ?? Tc);
}
function xt(t, e) {
  return {
    context: t.context,
    error: Pc(t.error, e.error)
  };
}
async function Pc(t, e) {
  const n = await Promise.allSettled([t, e]);
  for (const i of n)
    if (i.status === "fulfilled" && i.value)
      return i.value;
  const r = n.find((i) => i.status === "rejected");
  if (r?.status === "rejected")
    throw r.reason;
  return null;
}
async function Cc(t, e, n) {
  await on(t);
  for (const r of e)
    try {
      const i = await r.error;
      i && await n(Ie(r.context.label, r.context.group, i));
    } catch (i) {
      await n(Ie(r.context.label, r.context.group, i));
    }
}
function an(t) {
  t.error.catch(() => {
  });
}
function Tc(t) {
  console.error(t);
}
function gi(t, e, n, r) {
  try {
    e.end();
  } catch (i) {
    const s = hi(t);
    N(n), N(s), n.length = 0;
    const o = s[0]?.context ?? r;
    throw o ? Ie(o.label, o.group, i) : i;
  }
}
let Fc = 1;
const Hn = /* @__PURE__ */ new WeakMap();
function Ac(t) {
  return t === null || typeof t != "object" || ArrayBuffer.isView(t) || t instanceof ArrayBuffer || Array.isArray(t) ? !0 : t instanceof ae || t instanceof Te ? !1 : !wi(t);
}
function Kt(t) {
  return typeof t != "object" || t === null || Array.isArray(t) || ArrayBuffer.isView(t) || t instanceof ArrayBuffer || t instanceof ae || t instanceof Te ? !1 : !wi(t);
}
function Zn(t, e, n) {
  switch (t.bindingLayout?.kind) {
    case "buffer":
      return Mc(t, e, n);
    case "texture":
      return Lc(t, e, n);
    case "sampler":
      return Gc(t, e);
    case "storageTexture":
      throw J(t, "storage texture", "Pass a storage-compatible texture.");
    case "externalTexture":
      throw J(t, "external texture", "Pass a compatible GPUExternalTexture.");
    default:
      throw J(t, "reflected resource", "Fix shader reflection bindingLayout.");
  }
}
function Mc(t, e, n) {
  const r = Po(e);
  if (r)
    return r[Kr](t, n.sourceHint);
  if (e instanceof ae)
    return zn(e, `${n.sourceHint}.set`), Uc(t, e.options.usage), { resource: { buffer: e.gpu }, identity: e.resourceIdentity, unsubscribe: (i) => e.onDestroy(i) };
  if (Vc(e))
    return zn(e.buffer, `${n.sourceHint}.set`), { resource: { buffer: e.gpu, offset: 0, size: e.size }, identity: e.buffer.resourceIdentity, unsubscribe: (i) => e.buffer.onDestroy(i) };
  if (xi(e))
    return { resource: e, identity: je(e.buffer) };
  if (cn(e))
    return { resource: { buffer: e }, identity: je(e) };
  throw J(t, "buffer", `Pass a compatible Buffer/Uniform: ${t.name}.set({ ${t.name}: gpu.device.createBuffer(...) }).`);
}
function Lc(t, e, n) {
  const r = bi(e);
  if (r) {
    const i = r.color;
    Qn(t, i, n);
    const s = r.onTexturesRecreated?.bind(r);
    return { resource: i.createView(), identity: i.resourceIdentity, unsubscribe: (o) => r.onDestroy(o), onRecreate: s ? (o) => s(o) : void 0 };
  }
  if (e instanceof Te)
    return Rc(t, e.usage), Qn(t, e, n), { resource: e.createView(), identity: e.resourceIdentity, unsubscribe: (i) => e.onDestroy(i) };
  if (yi(e))
    return { resource: e.createView(), identity: e.resourceIdentity ?? je(e) };
  if (typeof e == "object" && e !== null)
    return { resource: e, identity: je(e) };
  throw J(t, "texture/target", `Pass a Texture or Target: ${t.name}.set({ ${t.name}: scene.color }) or set({ ${t.name}: scene }).`);
}
function Gc(t, e) {
  if (Dc(e))
    return { resource: e, identity: je(e) };
  throw J(t, "sampler", `Use the cached sampler: set({ ${t.name}: sampler(gpu) }).`);
}
function Dc(t) {
  return typeof t != "object" || t === null || t instanceof ae || t instanceof Te ? !1 : !cn(t) && !xi(t) && !yi(t) && !bi(t);
}
function Uc(t, e) {
  const n = t.bindingLayout?.kind === "buffer" ? t.bindingLayout.buffer.type : void 0;
  if (n === "uniform" && !e.includes("uniform"))
    throw J(t, "uniform buffer", "Create with usage: ['uniform','copy_dst'].");
  if ((n === "storage" || n === "read-only-storage") && !e.includes("storage"))
    throw J(t, "storage buffer", "Create with usage: ['storage','copy_dst'].");
}
function Rc(t, e) {
  if (!e.includes("texture_binding") && !e.includes("render_attachment"))
    throw J(t, "sampled texture", "Use texture_binding usage or a sampleable Target.");
}
function Qn(t, e, n) {
  if (!(!n.filterableTexture || n.float32Filterable) && (e.format === "r32float" || e.format === "rg32float" || e.format === "rgba32float"))
    throw Os(n.sourceHint, t, e.format, e.label ?? "texture", n.pairedSampler);
}
function bi(t) {
  if (typeof t != "object" || t === null)
    return;
  const e = t;
  if (!(!e.resourceIdentity || !e.color || typeof e.onDestroy != "function"))
    return e;
}
function wi(t) {
  const e = t;
  return "gpu" in e || "bindGroup" in e || "createView" in e || "resourceIdentity" in e;
}
function je(t) {
  if (typeof t != "object" || t === null)
    return `value:${String(t)}`;
  let e = Hn.get(t);
  return e || (e = { kind: "external", id: Fc++ }, Hn.set(t, e)), e;
}
function Vc(t) {
  return typeof t == "object" && t !== null && "gpu" in t && "size" in t && "buffer" in t && t.buffer instanceof ae;
}
function yi(t) {
  return typeof t == "object" && t !== null && typeof t.createView == "function";
}
function xi(t) {
  return typeof t == "object" && t !== null && "buffer" in t && cn(t.buffer);
}
function cn(t) {
  return typeof t == "object" && t !== null && "size" in t && "usage" in t && typeof t.destroy == "function";
}
function Nc(t, e) {
  zc(t);
  const n = new ArrayBuffer(t.size);
  return un(new DataView(n), t, 0, e), n;
}
function zc(t) {
  if (t.size === void 0)
    throw D("set", `No se puede inferir byteLength para layout runtime-sized '${t.name}'.`);
}
function un(t, e, n, r) {
  if (e.members)
    return Oc(t, e.members, n, r);
  Bc(t, e, n, r);
}
function Oc(t, e, n, r) {
  const i = r;
  for (const s of e)
    un(t, s.layout, n + s.offset, i?.[s.name]);
}
function Bc(t, e, n, r) {
  switch (e.type.kind) {
    case "scalar":
      return fn(t, n, e.type.name, r);
    case "vector":
      return jc(t, n, e.type, r);
    case "matrix":
      return Wc(t, e, n, r);
    case "array":
      return qc(t, e, n, r);
    default:
      throw D("set", `No hay writer para layout ${e.type.kind}.`);
  }
}
function fn(t, e, n, r) {
  n === "f32" ? t.setFloat32(e, Number(r ?? 0), !0) : n === "i32" ? t.setInt32(e, Number(r ?? 0), !0) : n === "u32" || n === "bool" ? t.setUint32(e, n === "bool" ? r ? 1 : 0 : Number(r ?? 0), !0) : t.setUint16(e, Kc(Number(r ?? 0)), !0);
}
function jc(t, e, n, r) {
  const i = r, s = vi(n.element);
  for (let o = 0; o < n.width; o++)
    fn(t, e + o * s, ln(n.element), i?.[o] ?? 0);
}
function Wc(t, e, n, r) {
  const i = e.type, s = r, o = vi(i.element), a = e.stride ?? 16;
  for (let c = 0; c < i.columns; c++)
    for (let u = 0; u < i.rows; u++)
      fn(t, n + c * a + u * o, ln(i.element), s?.[c * i.rows + u] ?? 0);
}
function qc(t, e, n, r) {
  const i = r, s = e.stride ?? e.element?.size ?? 0;
  if (!e.element)
    throw D("set", "Array layout sin element layout.");
  for (let o = 0; o < (i?.length ?? 0); o++)
    un(t, e.element, n + o * s, i[o]);
}
function vi(t) {
  return ln(t) === "f16" ? 2 : 4;
}
function ln(t) {
  if (t.kind !== "scalar")
    throw D("set", `Expected scalar, got ${t.kind}`);
  return t.name;
}
function Kc(t) {
  const e = new Float32Array(1), n = new Uint32Array(e.buffer);
  e[0] = t;
  const r = n[0], i = r >> 16 & 32768, s = r & 8388607, o = r >> 23 & 255;
  if (o === 255)
    return i | (s ? 32256 : 31744);
  const a = o - 127 + 15;
  return a >= 31 ? i | 31744 : a <= 0 ? a < -10 ? i : i | (s | 8388608) >> 1 - a + 13 : i | a << 10 | s >> 13;
}
const Jn = /* @__PURE__ */ new WeakMap();
function Si(t, e) {
  const n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  for (const s of e) {
    const o = s.stage === "vertex" ? 1 : s.stage === "fragment" ? 2 : 4;
    for (const a of Be(s, "bindings", "visibility")) {
      const c = `${a.group}:${a.binding}`;
      n.set(c, (n.get(c) ?? 0) | o);
    }
    for (const a of Be(s, "samplingPairs", "visibility"))
      a.mode === "filtering" && r.add(`${a.texture.group}:${a.texture.binding}`);
  }
  const i = (s) => n.get(`${s.group}:${s.binding}`) ?? 0;
  return Object.defineProperty(i, "filterable", { value: r }), i;
}
function _i(t, e, n = dn) {
  return t.flatMap((r) => {
    if (r.group !== e)
      return [];
    const i = n(r);
    return i === 0 ? [] : [{ binding: r.binding, visibility: i, ...Qc(r, n.filterable?.has(`${r.group}:${r.binding}`) ?? !1) }];
  });
}
function ki(t, e, n, r = dn) {
  const i = /* @__PURE__ */ new Map(), s = n.bindings.filter((a) => r(a) !== 0).map((a) => a.group), o = Math.max(-1, ...s);
  for (let a = 0; a <= o; a++)
    i.set(a, Xc(t, e, n, a, r));
  return i;
}
function Yc(t, e) {
  return t.gpu.createPipelineLayout({ bindGroupLayouts: Hc(e) });
}
function Xc(t, e, n, r, i = dn) {
  return Ei(t, `${e}.group${r}.bgl`, _i(n.bindings, r, i));
}
function Ei(t, e, n) {
  let r = Jn.get(t.gpu);
  r || (r = /* @__PURE__ */ new Map(), Jn.set(t.gpu, r));
  const i = JSON.stringify(n), s = r.get(i);
  if (s)
    return s;
  const o = Vs(t.gpu.createBindGroupLayout({ label: e, entries: n }), { entries: n });
  return r.set(i, o), o;
}
function Hc(t) {
  const e = Math.max(-1, ...t.keys()), n = [];
  for (let r = 0; r <= e; r++)
    n.push(Zc(t, r));
  return n;
}
function Zc(t, e) {
  const n = t.get(e);
  if (!n)
    throw D("pipelineLayout", `Bind groups must be contiguous for pipeline layout; missing group(${e}).`);
  return n;
}
function Qc(t, e) {
  const n = t.bindingLayout;
  if (!n)
    throw D("bindGroupLayout", `Binding '${t.name}' does not have a reflected bindingLayout.`);
  return e && n.kind === "texture" && n.texture.sampleType === "unfilterable-float" && !n.texture.multisampled ? { texture: { ...n.texture, sampleType: "float" } } : Jc(n);
}
function Jc(t) {
  switch (t.kind) {
    case "buffer":
      return { buffer: { ...t.buffer } };
    case "sampler":
      return { sampler: { ...t.sampler } };
    case "texture":
      return { texture: { ...t.texture } };
    case "storageTexture":
      return { storageTexture: { ...t.storageTexture } };
    case "externalTexture":
      return { externalTexture: {} };
  }
}
function dn(t) {
  const e = globalThis.GPUShaderStage, n = e?.VERTEX ?? 1, r = e?.FRAGMENT ?? 2, i = e?.COMPUTE ?? 4;
  return t.kind === "buffer" ? n | r | i : r | i;
}
function $i(t) {
  const e = eu(t.reflection), n = [...t.bindGroupLayouts.keys()].sort((h, b) => h - b), r = /* @__PURE__ */ new Map();
  function i(h) {
    const b = [];
    for (const [S, I] of Object.entries(h))
      b.push(...o(S, I));
    return b;
  }
  function s(h) {
    const b = t.bindGroupLayouts.get(h.info.group);
    return !!b && !!Ve(b)?.entries.some((S) => S.binding === h.info.binding);
  }
  function o(h, b) {
    const S = e.get(h);
    if (S)
      return a(S, h, b);
    const I = tu(h, e, t.label);
    if (!I)
      throw D(`${t.label}.set`, `Binding '${h}' does not exist in '${t.label}'.`);
    return c(I, h, b);
  }
  function a(h, b, S) {
    _(h.info.group);
    const I = er(h.info, S);
    tr(h, b, I);
    const C = lt(h.identity);
    return I === "lib" ? u(h, su(h.libValue, S)) : f(h, S), s(h) ? Gt(h, C) : [];
  }
  function c(h, b, S) {
    _(h.info.group);
    const I = er(h.info, S);
    if (tr(h, b, I), nu(h, b, I), I !== "lib")
      throw D(`${t.label}.set`, `Member '${b}' needs a JS value; set resource '${h.info.name}' instead.`);
    const C = lt(h.identity);
    return u(h, { ...ou(h.libValue), [b]: S }), s(h) ? Gt(h, C) : [];
  }
  function u(h, b) {
    const S = V(h);
    h.libValue = b;
    const I = Nc(S, b);
    h.buffer || M(h, S.size), h.bytes = I, h.buffer.write(I, 0);
  }
  function l(h) {
    const b = Ve(t.bindGroupLayouts.get(h.group))?.entries.find((C) => C.binding === h.binding), S = t.reflection.entryPoints.flatMap((C) => Be(C, "samplingPairs", t.label)).find((C) => C.mode === "filtering" && C.texture.group === h.group && C.texture.binding === h.binding), I = S && t.reflection.bindings.find((C) => C.group === S.sampler.group && C.binding === S.sampler.binding);
    return { sourceHint: t.label, filterableTexture: b?.texture?.sampleType === "float", float32Filterable: t.device.features.has("float32-filterable"), pairedSampler: I };
  }
  function f(h, b) {
    const S = Zn(h.info, b, l(h.info));
    h.unsubscribe?.(), h.unsubscribeRecreate?.(), h.resource = S.resource, h.identity = S.identity, h.unsubscribe = S.unsubscribe?.(() => {
      h.identity && t.cache.evictIdentity(h.identity);
    }), h.unsubscribeRecreate = S.onRecreate?.(() => d(h, b));
  }
  function d(h, b) {
    const S = lt(h.identity);
    h.identity && t.cache.evictIdentity(h.identity);
    const I = Zn(h.info, b, l(h.info));
    if (h.unsubscribe?.(), h.unsubscribeRecreate?.(), h.resource = I.resource, h.identity = I.identity, h.unsubscribe = I.unsubscribe?.(() => {
      h.identity && t.cache.evictIdentity(h.identity);
    }), h.unsubscribeRecreate = I.onRecreate?.(() => d(h, b)), s(h))
      for (const C of Gt(h, S))
        t.onIdentityChange?.(C);
  }
  function p(h, b, S) {
    g(h), ru(t.label, h, b, S);
    const I = r.has(h) ? `claimed-group:${h}` : void 0;
    return r.set(h, b), I;
  }
  function g(h) {
    const b = t.bindGroupLayouts.get(h);
    if (!b)
      throw D(`${t.label}.layout`, `@group(${h}) does not exist in '${t.label}'.`);
    return b;
  }
  function m() {
    return n.map(v);
  }
  function v(h) {
    const b = r.get(h);
    if (b)
      return { group: h, bindGroup: b, offsets: [], claimValidation: y(b, h) };
    const S = new Set(Ve(g(h))?.entries.map((te) => te.binding)), I = t.reflection.bindings.filter((te) => te.group === h && S.has(te.binding)), C = x(I), ye = E(I), xe = t.cache.getOrCreate(t.drawId, h, ye, () => t.device.gpu.createBindGroup({
      label: `${t.label}.group${h}`,
      layout: g(h),
      entries: C
    }));
    return { group: h, bindGroup: xe, offsets: [] };
  }
  function y(h, b) {
    return Nr(h) ? void 0 : { label: t.label, group: b };
  }
  function x(h) {
    return h.map((b) => {
      const S = $(b);
      return { binding: b.binding, resource: S.resource };
    });
  }
  function E(h) {
    return h.map((b) => $(b).identity);
  }
  function $(h) {
    const b = e.get(h.name);
    if (!b?.resource || !b.identity)
      throw Bs(t.label, h);
    return b;
  }
  function _(h) {
    if (r.has(h))
      throw js(t.label, h);
  }
  function M(h, b) {
    h.buffer = t.device.createBuffer({ size: b, usage: ["uniform", "copy_dst"], label: `${t.label}.${h.info.name}` }), h.resource = { buffer: h.buffer.gpu, offset: 0, size: b }, h.identity = h.buffer.resourceIdentity, h.unsubscribe = h.buffer.onDestroy(() => t.cache.evictIdentity(h.buffer.resourceIdentity));
  }
  function V(h) {
    if (h.info.kind !== "buffer" || !h.info.layout?.size)
      throw D(`${t.label}.set`, `Binding '${h.info.name}' needs a compatible resource, not JS.`);
    return h.info.layout;
  }
  return {
    get groups() {
      return n;
    },
    set: i,
    claimGroup: p,
    layout: g,
    bindGroups: m,
    bindingState(h) {
      const b = e.get(h);
      if (!(!b?.ownership || !b.resource || !b.identity))
        return { info: b.info, ownership: b.ownership, resource: b.resource, identity: b.identity };
    }
  };
}
function eu(t) {
  return new Map(t.bindings.map((e) => [e.name, { info: e, memberOwnership: /* @__PURE__ */ new Map() }]));
}
function tu(t, e, n) {
  let r;
  for (const i of e.values())
    if (i.info.layout?.members?.some((s) => s.name === t)) {
      if (r)
        throw D(`${n}.set`, `Binding member '${t}' is ambiguous in '${n}'; set the complete binding.`);
      r = i;
    }
  return r;
}
function er(t, e) {
  return t.bindingLayout?.kind === "buffer" && Ac(e) ? "lib" : "user";
}
function tr(t, e, n) {
  if (t.ownership && t.ownership !== n)
    throw zr(e, t.ownership);
  t.ownership ??= n;
}
function nu(t, e, n) {
  const r = t.memberOwnership.get(e);
  if (r && r !== n)
    throw zr(e, r);
  t.memberOwnership.set(e, n);
}
function ru(t, e, n, r) {
  const i = Nr(n);
  if (!i)
    return;
  const s = Ve(r);
  if (!s)
    return;
  const o = iu(s.entries, i.layout.entries);
  if (o)
    throw Ws(t, e, o);
}
function iu(t, e) {
  if (t.length !== e.length)
    return `expected ${t.length} bindings and received ${e.length}`;
  const n = nr(t), r = nr(e);
  for (const [i, s] of n) {
    const o = r.get(i);
    if (!o)
      return `missing @binding(${i})`;
    if (rr(s) !== rr(o))
      return `@binding(${i}) does not match the reflected layout`;
  }
}
function nr(t) {
  return new Map(t.map((e) => [e.binding, e]));
}
function rr(t) {
  return JSON.stringify({
    binding: t.binding,
    visibility: t.visibility,
    buffer: t.buffer,
    sampler: t.sampler,
    texture: t.texture,
    storageTexture: t.storageTexture,
    externalTexture: t.externalTexture ? {} : void 0
  });
}
function Gt(t, e) {
  const n = lt(t.identity);
  return !n || e === n ? [] : [{
    group: t.info.group,
    binding: t.info.binding,
    bindingName: t.info.name,
    bindingKind: t.info.kind,
    previousIdentity: e,
    newIdentity: n
  }];
}
function lt(t) {
  return t === void 0 ? void 0 : wt(t);
}
function su(t, e) {
  return Kt(t) && Kt(e) ? { ...t, ...e } : e;
}
function ou(t) {
  return Kt(t) ? t : {};
}
const au = "rgba8unorm", hn = Object.freeze([0, 0, 0, 1]);
function vt(t, e) {
  const n = t, r = Array.isArray(t) ? t : [n?.r, n?.g, n?.b, n?.a];
  if (r.length !== 4 || !r.every((i) => typeof i == "number" && Number.isFinite(i)))
    throw po(e);
  return pn(t);
}
function pn(t) {
  const e = t;
  return Array.isArray(t) ? [t[0], t[1], t[2], t[3]] : { r: e.r, g: e.g, b: e.b, a: e.a };
}
function dt(t) {
  return t.colors ?? [{ format: t.format ?? au }];
}
function Ii(t) {
  return t.depth === !0 ? "depth24plus" : t.depth || void 0;
}
function Pi(t) {
  const e = t.msaa;
  if (e === !0 || e === 4)
    return 4;
  if (e === void 0 || e === !1)
    return 1;
  const n = Br();
  throw n.code = "VGPU-TARGET-MSAA-INVALID", n.message = `msaa received ${e}; WebGPU 1|4; use true`, n;
}
function cu(t, e) {
  if (!t?.size)
    throw Br();
  const n = Ii(t);
  if (n === "stencil8")
    throw ao(n);
  if (Pi(t) === 4)
    for (const r of dt(t))
      uu(r.format, e);
}
function uu(t, e) {
  if (e.isCompatibilityMode && t === "rgba16float")
    throw D("target", "Dawn compatibility mode does not support rgba16float+msaa.", "Use rgba8unorm for MSAA here, or disable msaa.");
}
function fu(t, e, n, r) {
  const i = {
    view: (e ?? t).createView(),
    resolveTarget: e ? t.createView() : void 0,
    loadOp: r ? "load" : "clear",
    storeOp: e ? "discard" : "store"
  };
  return r || (i.clearValue = Ci(n)), i;
}
function lu(t, e, n, r, i) {
  if (i) {
    const o = { view: t.createView(), depthReadOnly: !0 };
    return We(t.format) && (o.stencilReadOnly = !0), o;
  }
  const s = { view: t.createView(), depthLoadOp: e ? "load" : "clear", depthStoreOp: t.sampleCount > 1 ? "discard" : "store" };
  return e || (s.depthClearValue = n ?? 1), t.format && We(t.format) && (s.stencilLoadOp = e ? "load" : "clear", s.stencilStoreOp = t.sampleCount > 1 ? "discard" : "store", e || (s.stencilClearValue = r ?? 0)), s;
}
function We(t) {
  return !!t && t.includes("stencil");
}
function Ci(t) {
  return Array.isArray(t) ? { r: t[0], g: t[1], b: t[2], a: t[3] } : t;
}
function Ti(t, e) {
  return t[0] === e[0] && t[1] === e[1];
}
function Pt(t) {
  return typeof t == "object" && t !== null && typeof t.renderPassDescriptor == "function";
}
let du = 1, hu = 1;
const pu = /* @__PURE__ */ new WeakMap(), mu = /* @__PURE__ */ new WeakMap();
function gu(t) {
  return Pt(t) ? {
    colors: t.colors.map((e) => e.format),
    depth: t.depth?.format,
    sampleCount: t.sampleCount
  } : typeof t != "object" || t === null ? { colors: [] } : {
    colors: Array.isArray(t.colors) ? [...t.colors] : t.colors ?? [],
    depth: t.depth,
    sampleCount: t.sampleCount ?? 1
  };
}
function Fi(t) {
  return `${t.colors.join(",")}:${t.depth ?? "none"}:${t.sampleCount ?? 1}`;
}
function bu(t, e) {
  if (!Array.isArray(t.colors) || t.colors.length === 0)
    throw Qe(e, "colors must be a non-empty array.");
  const n = t.colors.find((i) => typeof i != "string" || i.length === 0);
  if (n !== void 0)
    throw Qe(e, `colors must contain only GPUTextureFormat strings; received ${String(n)}.`);
  if (t.depth !== void 0 && (typeof t.depth != "string" || t.depth.length === 0))
    throw Qe(e, "depth must be a GPUTextureFormat string.");
  const r = t.sampleCount ?? 1;
  if (r !== 1 && r !== 4)
    throw Qe(e, `sampleCount must be 1 or 4; received ${String(r)}.`);
}
function wu(t) {
  const e = `${or(pu, t.module, () => du++)}|${or(mu, t.pipelineLayout, () => hu++)}|${_u(t.vertexBufferLayouts ?? [])}|${Fi(t.signature)}`, n = t.topology || t.stripIndexFormat ? `${e}|${t.topology ?? "triangle-list"}|${t.stripIndexFormat ?? "none"}` : e, r = t.cullMode || t.frontFace ? `${n}|${t.cullMode ?? "none"}|${t.frontFace ?? "ccw"}` : n, i = t.unclippedDepth ? `${r}|unclipped` : r, s = t.depthKey ? `${i}|${t.depthKey}` : i, o = t.stencilKey ? `${s}|${t.stencilKey}` : s, a = t.multisampleKey ? `${o}|${t.multisampleKey}` : o, c = t.constantsKey ? `${a}|${t.constantsKey}` : a, u = t.entryKey ? `${c}|${t.entryKey}` : c;
  return t.fragmentKey ? `${u}|${t.fragmentKey}` : u;
}
function Yt(t, e, n, r, i) {
  if (r === void 0)
    return e.find((o) => o.stage === n);
  if (typeof r != "string")
    throw ct(t, `${n} received ${Xt(r)}; expected an entry point name string.`, i);
  const s = e.find((o) => o.name === r);
  if (!s)
    throw ct(t, `"${r}" matches no entry point in the shader; available entry points: ${ir(e)}.`, i);
  if (s.stage !== n)
    throw ct(t, `"${r}" is a @${s.stage} entry point, not @${n}; available entry points: ${ir(e)}.`, i);
  return s;
}
function ir(t) {
  return t.length ? t.map((e) => `"${e.name}" (@${e.stage})`).join(", ") : "none";
}
function Ai(t, e, n, r) {
  if (e !== void 0 && (typeof e != "object" || e === null || Array.isArray(e)))
    throw Ze(t, `received ${Xt(e)}; expected { overrideNameOrId: number | boolean }.`, r);
  const i = new Map(n.map((o) => [sr(o), o])), s = {};
  for (const [o, a] of Object.entries(e ?? {})) {
    if (!i.has(o))
      throw Ze(t, `"${o}" matches no override in the shader; available overrides: ${yu(n)}.`, r);
    if (typeof a == "boolean") {
      s[o] = a ? 1 : 0;
      continue;
    }
    if (typeof a != "number" || !Number.isFinite(a))
      throw Ze(t, `"${o}" received ${Xt(a)}; use a finite number or a boolean (WebGPU converts the value to the override's WGSL type, and NaN/Infinity fail that conversion).`, r);
    s[o] = a;
  }
  for (const o of n) {
    const a = sr(o);
    if (o.defaultValue === void 0 && !(a in s))
      throw Ze(t, `override '${o.name}' has no default value and must be provided; add constants: { "${a}": value }.`, r);
  }
  return Object.keys(s).length === 0 ? {} : { constants: s, constantsKey: xu(s) };
}
function sr(t) {
  return t.id !== void 0 ? String(t.id) : t.name;
}
function yu(t) {
  return t.length ? t.map((e) => e.id !== void 0 ? `"${e.id}" (@id of ${e.name})` : `"${e.name}"`).join(", ") : "none";
}
function xu(t) {
  return `cn~${Object.entries(t).sort(([e], [n]) => e < n ? -1 : e > n ? 1 : 0).map(([e, n]) => `${e}=${n}`).join("~")}`;
}
function Xt(t) {
  if (typeof t == "string")
    return `"${t}"`;
  try {
    return JSON.stringify(t) ?? String(t);
  } catch {
    return String(t);
  }
}
function Mi(t) {
  const e = /* @__PURE__ */ new Map();
  return {
    get(n, r) {
      let i = e.get(n);
      return i || (i = t.gpu.createShaderModule({ label: r, code: n }), e.set(n, i)), i;
    },
    dispose() {
      e.clear();
    }
  };
}
function Li(t) {
  const e = /* @__PURE__ */ new Map();
  return {
    get(n) {
      const r = ku(n);
      let i = e.get(r);
      return i || (i = t.gpu.createPipelineLayout({ bindGroupLayouts: Eu(n) }), e.set(r, i)), i;
    },
    dispose() {
      e.clear();
    }
  };
}
function Gi(t, e = {}) {
  return new vu(t, e);
}
class vu {
  device;
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ new Set();
  #n;
  #r;
  #s = !1;
  constructor(e, n) {
    this.device = e, this.#n = n.errorSink ?? (() => {
    }), this.#r = n.registerSettledSource?.(() => [...this.#t]);
  }
  getReady(e) {
    return this.#e.get(e)?.pipeline;
  }
  getSync(e, n, r) {
    this.#o(r.where);
    const i = this.#e.get(e);
    if (i?.pipeline)
      return i.pipeline;
    const s = i ?? {};
    i || this.#e.set(e, s);
    const o = this.#i(e, s, n, r);
    if (!o) {
      s.pending || this.#e.delete(e);
      return;
    }
    return s.pipeline = o, s.pending?.resolve(o), s.pending = void 0, o;
  }
  getAsync(e, n, r) {
    this.#o(r.where);
    const i = this.#e.get(e);
    if (i?.pipeline)
      return Promise.resolve(i.pipeline);
    if (i?.pending)
      return i.pending.promise;
    const s = {}, o = Su();
    s.pending = o, this.#e.set(e, s);
    let a;
    try {
      a = n();
    } catch (c) {
      const u = Le(r.where, c, r.signature);
      return o.reject(u), this.#e.delete(e), o.promise;
    }
    return this.#c(a), a.then((c) => {
      this.#e.get(e) !== s || s.pipeline || s.pending !== o || (s.pipeline = c, s.pending = void 0, o.resolve(c));
    }, (c) => {
      this.#e.get(e) !== s || s.pipeline || s.pending !== o || (s.pending = void 0, this.#e.delete(e), o.reject(Le(r.where, c, r.signature)));
    }), o.promise;
  }
  dispose() {
    if (this.#s)
      return;
    this.#s = !0;
    const e = Rn("gpu.dispose");
    for (const n of this.#e.values())
      n.pending?.reject(e);
    this.#e.clear(), this.#t.clear(), this.#r?.();
  }
  #i(e, n, r, i) {
    const s = this.device.gpu, o = typeof s.pushErrorScope == "function" && typeof s.popErrorScope == "function";
    o && s.pushErrorScope("validation");
    try {
      const a = r();
      return o && this.#a(e, n, i), a;
    } catch (a) {
      o && this.#f();
      const c = Le(i.where, a, i.signature);
      this.#n(c);
      return;
    }
  }
  #a(e, n, r) {
    const i = this.device.gpu.popErrorScope().then((s) => {
      if (!s)
        return;
      const o = Le(r.where, s, r.signature);
      return this.#e.get(e) === n && this.#e.delete(e), this.#n(o);
    }, (s) => {
      const o = Le(r.where, s, r.signature);
      return this.#e.get(e) === n && this.#e.delete(e), this.#n(o);
    });
    this.#c(i);
  }
  #f() {
    const e = this.device.gpu.popErrorScope?.();
    e && e.catch(() => {
    });
  }
  #o(e) {
    if (this.#s)
      throw Rn(e);
  }
  #c(e) {
    this.#t.add(e), e.catch(() => {
    }).then(() => this.#t.delete(e), () => this.#t.delete(e));
  }
}
function Su() {
  let t, e;
  const n = new Promise((r, i) => {
    t = r, e = i;
  });
  return n.catch(() => {
  }), { promise: n, resolve: t, reject: e };
}
function or(t, e, n) {
  let r = t.get(e);
  return r || (r = n(), t.set(e, r)), r;
}
function _u(t) {
  return JSON.stringify(t.map((e) => ({
    arrayStride: e.arrayStride,
    stepMode: e.stepMode ?? "vertex",
    attributes: [...e.attributes].map((n) => ({
      shaderLocation: n.shaderLocation,
      offset: n.offset,
      format: n.format
    }))
  })));
}
function ku(t) {
  return JSON.stringify([...t.entries()].map(([e, n]) => ({ group: e, entries: Iu(n) })));
}
function Eu(t) {
  const e = Math.max(-1, ...t.keys()), n = [];
  for (let r = 0; r <= e; r++)
    n.push($u(t, r));
  return n;
}
function $u(t, e) {
  const n = t.get(e);
  if (!n)
    throw oo(e);
  return n;
}
function Iu(t) {
  return (Ve(t)?.entries ?? []).map((e) => ({
    binding: e.binding,
    visibility: e.visibility,
    buffer: e.buffer ? { ...e.buffer } : void 0,
    sampler: e.sampler ? { ...e.sampler } : void 0,
    texture: e.texture ? { ...e.texture } : void 0,
    storageTexture: e.storageTexture ? { ...e.storageTexture } : void 0,
    externalTexture: e.externalTexture ? { ...e.externalTexture } : void 0
  }));
}
const Pu = Ke("frame-state");
function mn(t) {
  return t.service(Pu, Cu);
}
function Cu() {
  const t = /* @__PURE__ */ new Set();
  let e = ar(), n = !1, r = !1;
  const i = {
    time: 0,
    deltaTime: 0,
    frameCount: 0,
    advanceBy(s) {
      i.deltaTime = s, i.time += s, r = !0;
    },
    tick() {
      if (n)
        throw Wr();
      n = !0;
      try {
        const s = ar();
        r ? r = !1 : (i.deltaTime = Math.max(0, (s - e) / 1e3), i.time += i.deltaTime), e = s, i.frameCount += 1;
        for (const o of [...t])
          o();
      } finally {
        n = !1;
      }
    },
    onAdvance(s) {
      return t.add(s), () => {
        t.delete(s);
      };
    }
  };
  return i;
}
function ar() {
  return globalThis.performance?.now?.() ?? Date.now();
}
function Di(t, e, n = {}) {
  const r = X(t, "surface"), i = Fu(r), s = i.get(e);
  if (s && !s.disposed)
    throw uo(s.label);
  const o = new Ri(r.device, e, n, (u) => {
    i.get(u.canvas) === u && i.delete(u.canvas), a(), c();
  }), a = mn(r).onAdvance(() => o.applyAutoResize()), c = r.own("resource", () => o.dispose());
  return i.set(e, o), o;
}
const Tu = Ke("surfaces");
function Fu(t) {
  return t.service(Tu, () => /* @__PURE__ */ new Map());
}
let Ue = 0, gn = 0;
function Au() {
  return Ue > 0;
}
function Mu() {
  return gn > 0;
}
function Lu() {
  gn += 1;
}
function Gu() {
  gn -= 1;
}
function Ui(t) {
  return t instanceof Ri;
}
class Ri {
  device;
  canvas;
  options;
  unregister;
  resourceIdentity = Et("render-target");
  label;
  context;
  autoResize;
  layoutBacked;
  format;
  #e = new $t();
  #t = /* @__PURE__ */ new Set();
  #n = /* @__PURE__ */ new Set();
  #r;
  #s;
  #i = !1;
  #a = !1;
  constructor(e, n, r, i) {
    this.device = e, this.canvas = n, this.options = r, this.unregister = i, this.label = r.label, this.#s = r.clearColor === void 0 ? hn : vt(r.clearColor, "surface.clearColor");
    const s = n.getContext("webgpu");
    if (!s)
      throw co();
    if (this.context = s, this.layoutBacked = Du(n), r.autoResize === !0 && !this.layoutBacked)
      throw lo();
    this.autoResize = r.autoResize ?? (r.size ? !1 : this.layoutBacked), this.#r = ur(r.dpr), this.format = r.format ?? Ru();
    const o = Uu(n, r, this.layoutBacked, this.#r);
    (r.size || this.layoutBacked) && cr(n, o), s.configure({
      device: e.gpu,
      format: this.format,
      alphaMode: r.alphaMode ?? "premultiplied",
      colorSpace: r.colorSpace ?? "srgb",
      usage: Vu()
    });
  }
  get gpu() {
    return this.context;
  }
  get size() {
    return this.#u(), ht(this.canvas);
  }
  get texelSize() {
    const e = this.size;
    return [1 / e[0], 1 / e[1]];
  }
  get color() {
    return this.#u(), new Te(this.device, this.context.getCurrentTexture(), {
      size: this.size,
      format: this.format,
      usage: ["render_attachment", "texture_binding", "copy_src"],
      label: this.options.label ? `${this.options.label}.color` : "surface.color"
    }, "external");
  }
  get colors() {
    return [this.color];
  }
  get depth() {
    this.#u();
  }
  get sampleCount() {
    return this.#u(), 1;
  }
  get dpr() {
    return this.#r;
  }
  /** Default clear color of this surface; passes that clear without naming a color use it. */
  get clearColor() {
    return pn(this.#s);
  }
  set clearColor(e) {
    this.#s = vt(e, "surface.clearColor");
  }
  get disposed() {
    return this.#i;
  }
  resize(e) {
    if (this.#u(), this.#a)
      throw ho(this.options.label);
    this.#f(St(e), this.#r, !0);
  }
  applyAutoResize() {
    if (this.#i || !this.autoResize || !this.layoutBacked)
      return;
    const e = ur(this.options.dpr), n = Vi(this.canvas, e);
    this.#f(n, e, !0);
  }
  onResize(e) {
    this.#u(), this.#t.add(e), this.#a = !0, Ue += 1;
    try {
      e(this.#l());
    } finally {
      Ue -= 1, this.#a = !1;
    }
    return () => {
      this.#t.delete(e);
    };
  }
  async read() {
    return this.#u(), this.color.read();
  }
  async readFloats() {
    return this.#u(), this.color.readFloats();
  }
  onDestroy(e) {
    return this.#u(), this.#e.onDestroy(this, e);
  }
  onTexturesRecreated(e) {
    return this.#u(), this.#n.add(e), () => {
      this.#n.delete(e);
    };
  }
  renderPassDescriptor(e = {}) {
    const { clear: n = [0, 0, 0, 1], preserve: r } = e;
    this.#u();
    const i = { view: this.context.getCurrentTexture().createView(), loadOp: r ? "load" : "clear", storeOp: "store" };
    return r || (i.clearValue = Ci(n)), { colorAttachments: [i] };
  }
  dispose() {
    if (!this.#i) {
      this.#i = !0;
      try {
        this.context.unconfigure?.();
      } catch {
      }
      this.unregister(this), this.#t.clear(), this.#n.clear(), this.#e.emit(this);
    }
  }
  #f(e, n, r) {
    const i = !Ti(ht(this.canvas), e);
    this.#r = n, i && (cr(this.canvas, e), this.#o(), r && this.#c());
  }
  #o() {
    for (const e of [...this.#n])
      e();
  }
  #c() {
    this.#a = !0, Ue += 1;
    try {
      const e = this.#l();
      for (const n of [...this.#t])
        n(e);
    } finally {
      Ue -= 1, this.#a = !1;
    }
  }
  #l() {
    const e = ht(this.canvas);
    return { width: e[0], height: e[1], dpr: this.#r, surface: this };
  }
  #u() {
    if (this.#i)
      throw fo(this.options.label);
  }
}
function Du(t) {
  return typeof t.clientWidth == "number";
}
function Uu(t, e, n, r) {
  return e.size ? St(e.size) : n ? Vi(t, r) : St(ht(t));
}
function Vi(t, e) {
  const n = t;
  return St([Math.round(n.clientWidth * e), Math.round(n.clientHeight * e)]);
}
function ht(t) {
  const e = t;
  return [e.width, e.height];
}
function cr(t, e) {
  const n = t;
  n.width = e[0], n.height = e[1];
}
function St(t) {
  return [Math.max(1, Math.floor(t[0])), Math.max(1, Math.floor(t[1]))];
}
function ur(t) {
  const e = globalThis.devicePixelRatio ?? 1;
  return Array.isArray(t) ? Math.min(t[1], Math.max(t[0], e)) : typeof t == "number" ? t : e;
}
function Ru() {
  return globalThis.navigator?.gpu?.getPreferredCanvasFormat?.() ?? "bgra8unorm";
}
function Vu() {
  const t = globalThis.GPUTextureUsage;
  return t ? t.RENDER_ATTACHMENT | t.TEXTURE_BINDING | t.COPY_SRC : void 0;
}
const Nu = {
  drawIndirect: { bytes: 16, args: "4 u32 values: vertexCount, instanceCount, firstVertex, firstInstance" },
  drawIndexedIndirect: { bytes: 20, args: "5 32-bit values: indexCount, instanceCount, firstIndex, baseVertex (signed), firstInstance" },
  dispatchWorkgroupsIndirect: { bytes: 12, args: "3 u32 values: workgroupCountX, workgroupCountY, workgroupCountZ" }
};
function Ni(t, e, n, r) {
  const i = typeof n == "object" && n !== null ? n.buffer : void 0, s = fr(n) ? n : fr(i) ? i : void 0;
  if (!s)
    throw he(t, `received ${lr(n)}; expected a StorageBuffer or { buffer, offset? }.`, e);
  const o = s === n ? 0 : n.offset ?? 0;
  if (typeof o != "number" || !Number.isInteger(o) || o < 0)
    throw he(t, `offset must be an integer >= 0; received ${lr(o)}.`, e);
  if (o % 4 !== 0)
    throw he(t, `offset must be a multiple of 4 (WebGPU requires "indirectOffset is a multiple of 4"); received ${o}.`, e);
  if (!s.buffer.options.usage.includes("indirect"))
    throw he(t, `the buffer lacks the "indirect" usage (WebGPU requires "indirectBuffer.usage contains INDIRECT"); create it with storage(gpu, ${s.size}, { indirect: true }).`, e);
  const { bytes: a, args: c } = Nu[r];
  if (o + a > s.size)
    throw he(t, `${r} reads ${a} bytes (${c}) at offset ${o}, but offset + ${a} = ${o + a} exceeds the buffer size ${s.size}.`, e);
  return { buffer: s.gpu, offset: o };
}
function fr(t) {
  return typeof t == "object" && t !== null && "gpu" in t && "size" in t && t.buffer instanceof ae;
}
function lr(t) {
  if (typeof t == "string")
    return `"${t}"`;
  try {
    return JSON.stringify(t) ?? String(t);
  } catch {
    return String(t);
  }
}
const _t = /* @__PURE__ */ Symbol("vgpu.frame.drawable");
function zu(t) {
  return t?.[_t];
}
const Ou = /* @__PURE__ */ Symbol("vgpu.frame.bundle");
function Bu(t) {
  return t?.[Ou];
}
const zi = /* @__PURE__ */ Symbol("vgpu.frame.passAttachment");
function ju(t) {
  return typeof t?.[zi] == "function" ? t : void 0;
}
function Ht(t, e) {
  return Ct(X(t, "sampler")).sampler(e);
}
let dr = 1;
function Wu(t) {
  const e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new WeakMap();
  return {
    sampler(r = {}) {
      const i = Zt(r);
      let s = e.get(i);
      return s || (s = t.gpu.createSampler(r), e.set(i, s), n.set(s, { kind: "sampler", id: dr++ })), s;
    },
    identity(r) {
      let i = n.get(r);
      return i || (i = { kind: "sampler", id: dr++ }, n.set(r, i)), i;
    }
  };
}
function Zt(t) {
  if (t === null || typeof t != "object")
    return JSON.stringify(t);
  if (Array.isArray(t))
    return `[${t.map(Zt).join(",")}]`;
  const e = t;
  return `{${Object.keys(e).sort().map((n) => `${JSON.stringify(n)}:${Zt(e[n])}`).join(",")}}`;
}
const qu = Ke("render-service");
function Ct(t) {
  return t.service(qu, Ku);
}
function Ku(t) {
  const e = t.device, n = sn(), r = Gi(e, {
    errorSink: (a) => t.reportError(a),
    registerSettledSource: (a) => t.registerSettledSource(a)
  }), i = Mi(e), s = Li(e), o = Wu(e);
  return t.own("service", () => {
    r.dispose(), i.dispose(), s.dispose(), n.dispose();
  }), { binds: n, pipelines: r, shaderModules: i, pipelineLayouts: s, sampler: (a) => o.sampler(a) };
}
function bn(t) {
  if (typeof t == "string")
    return t;
  if (!Yu(t) || !("version" in t) || t.version !== 1)
    throw Je(t);
  const n = t.wgsl;
  if (typeof n != "string")
    throw Je(t);
  return n;
}
function Yu(t) {
  return typeof t == "object" && t !== null;
}
function pt(t, e) {
  const n = X(t, "draw"), r = Ct(n), i = bn(e.shader);
  return new Bi(n.device, i, { ...e, shader: i }, r.binds, void 0, r.pipelines, r.shaderModules, r.pipelineLayouts, (s) => n.reportError(s), (s) => {
    n.trackDelivery(s);
  });
}
let Xu = 1;
const Oi = /* @__PURE__ */ new WeakMap();
class Bi {
  source;
  label;
  #e = /* @__PURE__ */ new Map();
  constructor(e, n, r, i = sn(), s, o = Gi(e), a = Mi(e), c = Li(e), u, l) {
    this.source = n, F(e, "Draw.constructor"), this.label = r.label ?? "draw";
    const f = Xu++, d = rn(n, `${this.label}.wgsl`), p = sf(this.label, r.entry), g = Yt(this.label, d.entryPoints, "vertex", p.vertex, "draw"), m = Yt(this.label, d.entryPoints, "fragment", p.fragment, "draw"), v = of(d, g, m), y = [g, m].filter((O) => !!O), x = Si(d.bindings, y);
    Hu(e, this.label, d.bindings, y, x);
    const E = r.geometry, $ = g ? Be(g, "inputs", this.label) : [], _ = E && Ce in E ? E[Ce]($, `${this.label}.geometry`) : E?.vertexBufferLayouts, M = new Map(ki(e, this.label, d, x)), V = c.get(M), h = a.get(n, `${this.label}.shader`), b = _f(), S = Ju(this.label, r), I = tf(this.label, r, S), C = af(e, this.label, r), ye = lf(e, this.label, r), xe = mf(this.label, r), te = bf(this.label, r), Tt = Ai(this.label, r.constants, d.overrides, "draw"), Xe = $i({
      device: e,
      label: this.label,
      drawId: f,
      reflection: d,
      bindGroupLayouts: M,
      cache: i,
      onIdentityChange: (O) => b.markStale({ kind: "binding-identity", drawLabel: this.label, ...O })
    });
    Oi.set(this, { id: f, device: e, opts: r, vertexBufferLayouts: _, cache: i, defaultTarget: s, reflection: d, visibility: x, vertexEntry: g?.name ?? "vs_main", fragmentEntry: m?.name ?? "fs_main", entryKey: v, setCore: Xe, bindGroupLayouts: M, pipelineLayout: V, shaderModule: h, pipelineStore: o, pipelineLayouts: c, errorSink: u, trackSettled: l, resolvedPipelineKeys: /* @__PURE__ */ new Set(), recordedIn: b, ...S, ...I, ...C, ...ye, ...xe, ...te, ...Tt }), r.set && this.set(r.set);
    for (const O of r.targets ?? [])
      this.compileSync(O);
  }
  get gpu() {
    const e = k(this);
    for (const n of e.resolvedPipelineKeys) {
      const r = e.pipelineStore.getReady(n);
      if (r)
        return r;
    }
  }
  get targets() {
    return k(this).opts.targets;
  }
  /**
   * Frame drawable protocol: a `Frame` encodes through this instead of importing draw.ts, so a
   * program that never draws never pulls this module. The instance is its own protocol object —
   * `encode`, `label` and the depth/stencil metadata below are exactly what a pass needs.
   */
  get [_t]() {
    return this;
  }
  /** @internal Frame drawable protocol; see {@link drawWritesDepth}. */
  writesDepth() {
    return xf(this);
  }
  /** @internal Frame drawable protocol; see {@link drawStencilWritingOps}. */
  stencilWritingOps() {
    return vf(this);
  }
  set(e) {
    const n = k(this);
    F(n.device, `${this.label}.set`);
    for (const r of n.setCore.set(e))
      n.recordedIn.markStale({ kind: "binding-identity", drawLabel: this.label, ...r });
    return this;
  }
  group(e, n) {
    const r = k(this);
    F(r.device, `${this.label}.group`);
    const i = this.#e.get(e) ?? this.layout(e), s = r.setCore.claimGroup(e, n, i);
    return r.recordedIn.markStale({ kind: "group-claim", drawLabel: this.label, group: e, previousIdentity: s, newIdentity: `claimed-group:${e}` }), this;
  }
  layout(e, n = {}) {
    return F(k(this).device, `${this.label}.layout`), n.dynamicOffsets ? this.#t(e) : k(this).setCore.layout(e);
  }
  #t(e) {
    const n = k(this);
    n.setCore.layout(e);
    const r = this.#e.get(e);
    if (r)
      return r;
    const i = Ef(this, e), s = Ei(n.device, `${this.label}.group${e}.dynamic.bgl`, i);
    return this.#e.set(e, s), n.bindGroupLayouts.set(e, s), n.pipelineLayout = n.pipelineLayouts.get(n.bindGroupLayouts), s;
  }
  /**
   * Encodes and submits this draw as a one-shot render pass.
   *
   * Raw claimed-bind-group validation failures are delivered asynchronously via
   * `gpu.onError` as `VGPU-R4-GROUP-VALIDATION`.
   */
  draw(e = {}) {
    F(k(this).device, `${this.label}.draw`);
    const n = Pt(e) ? { target: e } : e, r = k(this), i = n.target ?? r.defaultTarget;
    if (!i)
      throw Bt(`${this.label}.draw`);
    $r(i, `${this.label}.draw`);
    const s = r.device.gpu.createCommandEncoder(), o = s.beginRenderPass(i.renderPassDescriptor()), a = [];
    try {
      this.encode(o, i, n, (f) => a.push(f));
    } catch (f) {
      N(a), pi(r.device);
      try {
        o.end();
      } catch {
      }
      throw f;
    }
    gi(r.device, o, a, a[0]?.context);
    let c;
    const u = a[0]?.context;
    u && Ne(r.device, u);
    try {
      c = s.finish();
    } catch (f) {
      const d = u ? j(r.device) : void 0;
      N(a), d && N([d]);
      const p = d?.context ?? u;
      if (p) {
        Er(r, p.label, p.group, f);
        return;
      }
      throw f;
    }
    if (u) {
      const f = j(r.device);
      f && (a[0] = a[0] ? xt(f, a[0]) : f);
    }
    const l = a[0]?.context;
    l && Ne(r.device, l);
    try {
      r.device.gpu.queue.submit([c]);
    } catch (f) {
      const d = l ? j(r.device) : void 0;
      N(a), d && N([d]);
      const p = d?.context ?? l;
      if (p) {
        Er(r, p.label, p.group, f);
        return;
      }
      throw f;
    }
    if (l) {
      const f = j(r.device);
      f && (a[0] = a[0] ? xt(f, a[0]) : f);
    }
    if (a.length) {
      const f = mi(r.device, a, { errorSink: r.errorSink });
      r.trackSettled?.(f);
    }
  }
  encode(e, n, r = {}, i) {
    F(k(this).device, `${this.label}.encode`);
    const s = this.pipelineFor(n, !0);
    if (!s)
      return;
    e.setPipeline(s);
    const o = k(this);
    o.blendConstant && e.setBlendConstant(o.blendConstant), o.stencilRef !== void 0 && e.setStencilReference(o.stencilRef);
    for (const a of o.setCore.bindGroups())
      this.#n(e, a, r, i);
    this.#a(e, r);
  }
  #n(e, n, r, i) {
    const s = kf(r.offsets, n.group, n.offsets);
    if (!n.claimValidation || !i) {
      e.setBindGroup(n.group, n.bindGroup, s);
      return;
    }
    Ne(k(this).device, n.claimValidation);
    try {
      e.setBindGroup(n.group, n.bindGroup, s);
    } catch (a) {
      throw Ic(k(this).device), Ie(n.claimValidation.label, n.claimValidation.group, a);
    }
    const o = j(k(this).device);
    o && i(o);
  }
  compile(e) {
    F(k(this).device, `${this.label}.compile`);
    const { key: n, signature: r, signatureKey: i } = this.#r(e, `${this.label}.compile`);
    return k(this).pipelineStore.getAsync(n, () => this.#c(r), { where: `${this.label}.compile`, signature: i }).then(() => (F(k(this).device, `${this.label}.compile`), k(this).resolvedPipelineKeys.add(n), this));
  }
  compileSync(e) {
    F(k(this).device, `${this.label}.compileSync`);
    const { key: n, signature: r, signatureKey: i } = this.#r(e, `${this.label}.compileSync`);
    return k(this).pipelineStore.getSync(n, () => this.#o(r), { where: `${this.label}.compileSync`, signature: i }) && k(this).resolvedPipelineKeys.add(n), this;
  }
  pipelineFor(e, n = !1) {
    F(k(this).device, `${this.label}.pipelineFor`);
    const { key: r, signature: i, signatureKey: s } = this.#r(e, `${this.label}.pipelineFor`, n), o = k(this).pipelineStore.getSync(r, () => this.#o(i), { where: `${this.label}.pipelineFor`, signature: s });
    return o && k(this).resolvedPipelineKeys.add(r), o;
  }
  pipelineForAsync(e) {
    F(k(this).device, `${this.label}.pipelineForAsync`);
    const { key: n, signature: r, signatureKey: i } = this.#r(e, `${this.label}.pipelineForAsync`);
    return k(this).pipelineStore.getAsync(n, () => this.#c(r), { where: `${this.label}.pipelineForAsync`, signature: i }).then((o) => (F(k(this).device, `${this.label}.pipelineForAsync`), k(this).resolvedPipelineKeys.add(n), o));
  }
  #r(e, n, r = !1) {
    const i = this.#s(e, n, r), s = Fi(i);
    return { signature: i, signatureKey: s, key: this.#i(i) };
  }
  #s(e, n, r = !1) {
    const i = k(this), s = e ?? i.defaultTarget;
    if (!s)
      throw Bt(n);
    r || $r(s, n);
    const o = gu(s);
    if (bu(o, n), i.colorStates && i.colorStates.length !== o.colors.length)
      throw Ot(this.label, `expected one entry per color attachment; colors has ${i.colorStates.length}, but the target signature has ${o.colors.length}.`, n);
    if (i.multisampleState?.alphaToCoverageEnabled && (o.sampleCount ?? 1) <= 1)
      throw at(this.label, `alphaToCoverage requires a multisampled target, but the target signature has sampleCount ${o.sampleCount ?? 1}; create the target with msaa: true.`, n);
    if ((i.stencilState || i.stencilRef !== void 0) && !We(o.depth))
      throw ke(this.label, `stencil requires a depth format with a stencil aspect, but the target signature has ${o.depth ? `"${o.depth}"` : "no depth"}; create the target with depth: "depth24plus-stencil8".`, n);
    return o;
  }
  #i(e) {
    const n = k(this), r = n.opts.geometry;
    return wu({ module: n.shaderModule, pipelineLayout: n.pipelineLayout, vertexBufferLayouts: n.vertexBufferLayouts, signature: e, fragmentKey: n.fragmentKey, topology: r?.topology, stripIndexFormat: ji(r), cullMode: n.cullMode, frontFace: n.frontFace, unclippedDepth: n.unclippedDepth, depthKey: n.depthKey, stencilKey: n.stencilKey, multisampleKey: n.multisampleKey, constantsKey: n.constantsKey, entryKey: n.entryKey });
  }
  #a(e, n = {}) {
    const r = k(this).opts.geometry;
    if (r?.vertexBuffers && r.vertexBuffers.forEach((s, o) => e.setVertexBuffer(o, s)), n.indirect !== void 0)
      return this.#f(e, r, n);
    const i = Qu(this.label, r, k(this).opts, n);
    if (!r?.indexBuffer)
      return e.draw(i.vertexCount, i.instanceCount, i.firstVertex, i.firstInstance);
    e.setIndexBuffer(r.indexBuffer, r.indexFormat ?? "uint32"), e.drawIndexed(i.indexCount, i.instanceCount, i.firstIndex, i.baseVertex, i.firstInstance);
  }
  /**
   * The GPU reads the draw arguments from the buffer, so per-call counts alongside indirect are dead options and throw.
   * A non-zero firstInstance in the buffered arguments cannot be validated on the CPU; per WebGPU, it "must be 0,
   * unless the 'indirect-first-instance' feature is enabled", otherwise the indirect call "will be treated as a no-op".
   */
  #f(e, n, r) {
    const i = `${this.label}.draw`, s = Zu.find((u) => r[u] !== void 0);
    if (s !== void 0)
      throw he(this.label, `indirect cannot be combined with ${s} in the same call; the GPU reads the draw arguments from the buffer, so the CPU-side value would be ignored.`, i);
    const o = !!n?.indexBuffer, { buffer: a, offset: c } = Ni(this.label, i, r.indirect, o ? "drawIndexedIndirect" : "drawIndirect");
    if (!o)
      return e.drawIndirect(a, c);
    e.setIndexBuffer(n.indexBuffer, n.indexFormat ?? "uint32"), e.drawIndexedIndirect(a, c);
  }
  #o(e) {
    const n = k(this);
    return n.device.gpu.createRenderPipeline({
      label: `${this.label}.pipeline`,
      layout: n.pipelineLayout,
      vertex: { module: n.shaderModule, entryPoint: n.vertexEntry, buffers: [...n.vertexBufferLayouts ?? []], ...n.constants ? { constants: n.constants } : {} },
      fragment: { module: n.shaderModule, entryPoint: n.fragmentEntry, targets: hr(e, n), ...n.constants ? { constants: n.constants } : {} },
      primitive: pr(n.opts.geometry, n.cullMode, n.frontFace, n.unclippedDepth),
      depthStencil: xr(e, n),
      multisample: _r(e, n)
    });
  }
  #c(e) {
    const n = k(this);
    return n.device.gpu.createRenderPipelineAsync({
      label: `${this.label}.pipeline`,
      layout: n.pipelineLayout,
      vertex: { module: n.shaderModule, entryPoint: n.vertexEntry, buffers: [...n.vertexBufferLayouts ?? []], ...n.constants ? { constants: n.constants } : {} },
      fragment: { module: n.shaderModule, entryPoint: n.fragmentEntry, targets: hr(e, n), ...n.constants ? { constants: n.constants } : {} },
      primitive: pr(n.opts.geometry, n.cullMode, n.frontFace, n.unclippedDepth),
      depthStencil: xr(e, n),
      multisample: _r(e, n)
    });
  }
}
function Hu(t, e, n, r, i) {
  const s = t.limits;
  for (const [o, a, c] of [["vertex", 1, "maxStorageBuffersInVertexStage"], ["fragment", 2, "maxStorageBuffersInFragmentStage"]]) {
    const u = r.find((d) => d.stage === o);
    if (!u)
      continue;
    const l = n.filter((d) => d.bindingLayout?.kind === "buffer" && d.bindingLayout.buffer.type !== "uniform" && i(d) & a), f = s[c] ?? s.maxStorageBuffersPerShaderStage;
    if (f !== void 0 && l.length > f)
      throw zs(e, o, u.name, l.length, f, l);
  }
}
const Zu = ["vertices", "indices", "instances", "firstVertex", "firstIndex", "baseVertex", "firstInstance"];
function hr(t, e) {
  return t.colors.map((n, r) => {
    const i = e.colorStates?.[r], s = i?.blendState ?? e.blendState, o = i?.writeMask ?? e.writeMask, a = { format: n };
    return s && (a.blend = s), o !== void 0 && (a.writeMask = o), a;
  });
}
function Qu(t, e, n, r) {
  ie(t, "DrawOptions.instances", n.instances), ie(t, "DrawOptions.vertices", n.vertices), ie(t, "DrawOptions.firstInstance", n.firstInstance), ie(t, "DrawCallOptions.instances", r.instances), re(t, "DrawCallOptions.vertices", r.vertices), re(t, "DrawCallOptions.indices", r.indices), re(t, "DrawCallOptions.firstVertex", r.firstVertex), re(t, "DrawCallOptions.firstIndex", r.firstIndex), re(t, "DrawCallOptions.baseVertex", r.baseVertex), ie(t, "DrawCallOptions.firstInstance", r.firstInstance), ie(t, "GeometryLike.vertexCount", e?.vertexCount), ie(t, "GeometryLike.indexCount", e?.indexCount), ie(t, "GeometryLike.instanceCount", e?.instanceCount), re(t, "GeometryLike.firstVertex", e?.firstVertex), re(t, "GeometryLike.firstIndex", e?.firstIndex), re(t, "GeometryLike.baseVertex", e?.baseVertex);
  const i = !!e?.indexBuffer, o = e?.geometry ?? (e && Ce in e ? e : void 0), a = r.firstVertex ?? e?.firstVertex ?? 0, c = r.vertices ?? e?.vertexCount ?? n.vertices ?? 3, u = r.firstIndex ?? e?.firstIndex ?? 0, l = r.indices ?? e?.indexCount ?? 0, f = r.baseVertex ?? e?.baseVertex ?? 0;
  if (i)
    mr(t, "index", u, l, o?.indexCount);
  else if (r.indices !== void 0 || r.firstIndex !== void 0 || r.baseVertex !== void 0)
    throw Pe(`${t}.draw`, "Index range needs an indexed geometry.");
  return i || mr(t, "vertex", a, c, o?.vertexCount), {
    instanceCount: r.instances ?? n.instances ?? e?.instanceCount ?? 1,
    firstInstance: r.firstInstance ?? n.firstInstance ?? 0,
    vertexCount: c,
    firstVertex: a,
    indexCount: l,
    firstIndex: u,
    baseVertex: f
  };
}
function ji(t) {
  const e = t?.topology ?? "triangle-list";
  return t?.stripIndexFormat ?? (e.endsWith("strip") ? t?.indexFormat : void 0);
}
function pr(t, e, n, r) {
  const i = t?.topology ?? "triangle-list", s = ji(t), o = s ? { topology: i, stripIndexFormat: s } : { topology: i };
  return e !== void 0 && (o.cullMode = e), n !== void 0 && (o.frontFace = n), r && (o.unclippedDepth = !0), o;
}
function mr(t, e, n, r, i) {
  if (!(i === void 0 || n + r <= i))
    throw Pe(`${t}.draw`, `${e} range [${n}, ${n + r}) exceeds parent geometry ${e} count ${i}.`);
}
function re(t, e, n) {
  if (!(n === void 0 || Number.isInteger(n) && n >= 0))
    throw Pe(`${t}.draw`, `${e} must be an integer >= 0; received ${String(n)}.`);
}
function ie(t, e, n) {
  if (n !== void 0 && !(Number.isInteger(n) && n >= 0))
    throw new w({
      code: "VGPU-R1-DRAW-COUNT",
      message: `${e} of '${t}' must be an integer >= 0; received ${String(n)}. Use 0 only when you want to issue a valid draw with no vertices/instances.`,
      where: `${t}.draw`
    });
}
function Ju(t, e) {
  const n = e.blend === void 0 ? void 0 : Wi(t, e.blend), r = e.writeMask === void 0 ? void 0 : Yi(t, e.writeMask), i = e.colors === void 0 ? void 0 : ef(t, e.colors), s = i ? `${kr(n, r)}@${i.map(yf).join("@")}` : n || r !== void 0 ? kr(n, r) : void 0;
  return { blendState: n, writeMask: r, colorStates: i, fragmentKey: s };
}
function ef(t, e) {
  if (!Array.isArray(e))
    throw Ot(t, `colors must be an array; received ${T(e)}.`);
  return e.map((n, r) => {
    if (n == null)
      return null;
    if (typeof n != "object" || Array.isArray(n))
      throw Ot(t, `colors[${r}] must be null or { blend?, writeMask? }; received ${T(n)}.`);
    const i = n.blend === void 0 ? void 0 : Wi(`${t}.colors[${r}]`, n.blend), s = n.writeMask === void 0 ? void 0 : Yi(`${t}.colors[${r}]`, n.writeMask);
    return !i && s === void 0 ? null : { blendState: i, writeMask: s };
  });
}
function Wi(t, e) {
  if (e === "alpha")
    return tt({ src: "src-alpha", dst: "one-minus-src-alpha" }, { src: "one", dst: "one-minus-src-alpha" });
  if (e === "premultiplied")
    return tt({ src: "one", dst: "one-minus-src-alpha" }, { src: "one", dst: "one-minus-src-alpha" });
  if (e === "additive")
    return tt({ src: "one", dst: "one" }, { src: "one", dst: "one" });
  if (typeof e != "object" || e === null || !gr(e.color))
    throw Tn(t, e);
  const n = e.color, r = e.alpha;
  if (r !== void 0 && !gr(r))
    throw Tn(t, e);
  return tt(n, r ?? n);
}
function gr(t) {
  return typeof t == "object" && t !== null && typeof t.src == "string" && typeof t.dst == "string";
}
function tt(t, e) {
  return { color: br(t), alpha: br(e) };
}
function br(t) {
  return { srcFactor: t.src, dstFactor: t.dst, operation: t.op ?? "add" };
}
function tf(t, e, n) {
  if (e.blendConstant === void 0)
    return {};
  const r = e.blendConstant;
  if (!Array.isArray(r) || r.length !== 4 || r.some((i) => typeof i != "number" || !Number.isFinite(i)))
    throw Fn(t, `received ${T(r)}; expected [r, g, b, a] finite numbers.`);
  if (!nf(n).some((i) => i && rf(i)))
    throw Fn(t, `no color target's effective blend uses a "constant"/"one-minus-constant" factor (colors[i].blend replaces the top-level blend for that target), so blendConstant would have no effect.`);
  return { blendConstant: { r: r[0], g: r[1], b: r[2], a: r[3] } };
}
function nf(t) {
  return t.colorStates ? t.colorStates.map((e) => e?.blendState ?? t.blendState) : [t.blendState];
}
function rf(t) {
  return [t.color.srcFactor, t.color.dstFactor, t.alpha.srcFactor, t.alpha.dstFactor].some((e) => e === "constant" || e === "one-minus-constant");
}
function sf(t, e) {
  if (e === void 0)
    return {};
  if (typeof e != "object" || e === null || Array.isArray(e))
    throw ct(t, `received ${T(e)}; expected { vertex?, fragment? } entry point names.`);
  return e;
}
function of(t, e, n) {
  const r = t.entryPoints.find((s) => s.stage === "vertex"), i = t.entryPoints.find((s) => s.stage === "fragment");
  if (!(e === r && n === i))
    return `en~${e?.name ?? ""}~${n?.name ?? ""}`;
}
function af(t, e, n) {
  const r = n.cull === void 0 ? void 0 : uf(e, n.cull), i = n.frontFace === void 0 ? void 0 : ff(e, n.frontFace), s = n.unclippedDepth === void 0 ? void 0 : cf(t, e, n.unclippedDepth);
  return { cullMode: r, frontFace: i, unclippedDepth: s };
}
function cf(t, e, n) {
  if (typeof n != "boolean")
    throw Mn(e, `received ${T(n)}; expected a boolean.`);
  if (n) {
    if (!t.features.has("depth-clip-control"))
      throw Mn(e, 'the device lacks the "depth-clip-control" feature; request it at init: init({ requiredFeatures: ["depth-clip-control"] }) on an adapter that supports it.');
    return !0;
  }
}
function uf(t, e) {
  if (e === "none" || e === "front" || e === "back")
    return e;
  throw qs(t, e);
}
function ff(t, e) {
  if (e === "ccw" || e === "cw")
    return e;
  throw Ks(t, e);
}
const qi = { depthWriteEnabled: !0, depthCompare: "less-equal" }, Ki = ["never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"], wr = -2147483648, yr = 2147483647;
function xr(t, e) {
  if (t.depth)
    return { format: t.depth, ...e.depthState ?? qi, ...e.stencilState ?? {} };
}
function lf(t, e, n) {
  if (n.depth === void 0)
    return {};
  const r = df(t, e, n.depth, n.geometry?.topology ?? "triangle-list");
  return { depthState: r, depthKey: hf(r) };
}
function df(t, e, n, r) {
  if (n === !1)
    return { depthWriteEnabled: !1, depthCompare: "always" };
  if (typeof n != "object" || n === null)
    throw H(e, `received ${T(n)}.`);
  if (n.write !== void 0 && typeof n.write != "boolean")
    throw H(e, `write must be a boolean; received ${T(n.write)}.`);
  if (n.compare !== void 0 && !Ki.includes(n.compare))
    throw H(e, `compare must be a GPUCompareFunction; received ${T(n.compare)}.`);
  if (n.bias !== void 0 && !Number.isInteger(n.bias))
    throw H(e, `bias must be an integer (WebGPU depthBias is i32); received ${T(n.bias)}.`);
  if (n.bias !== void 0 && (n.bias < wr || n.bias > yr))
    throw H(e, `bias must fit in the i32 range [${wr}, ${yr}] (WebGPU depthBias is i32); received ${T(n.bias)}.`);
  if (n.biasSlopeScale !== void 0 && !Number.isFinite(n.biasSlopeScale))
    throw H(e, `biasSlopeScale must be a finite number; received ${T(n.biasSlopeScale)}.`);
  if (n.biasClamp !== void 0 && !Number.isFinite(n.biasClamp))
    throw H(e, `biasClamp must be a finite number; received ${T(n.biasClamp)}.`);
  const i = n.bias ?? 0, s = n.biasSlopeScale ?? 0, o = n.biasClamp ?? 0;
  if ((i !== 0 || s !== 0 || o !== 0) && !r.startsWith("triangle"))
    throw H(e, `bias, biasSlopeScale, and biasClamp must be 0 for "${r}" topology.`);
  if (o !== 0 && t.isCompatibilityMode)
    throw H(e, `biasClamp must be 0 on a compatibility-mode device; received ${T(n.biasClamp)}.`);
  return {
    depthWriteEnabled: n.write ?? !0,
    depthCompare: n.compare ?? "less-equal",
    ...i !== 0 ? { depthBias: i } : {},
    ...s !== 0 ? { depthBiasSlopeScale: s } : {},
    ...o !== 0 ? { depthBiasClamp: o } : {}
  };
}
function hf(t) {
  return `${t.depthWriteEnabled ? 1 : 0}~${t.depthCompare}~${t.depthBias ?? 0}~${t.depthBiasSlopeScale ?? 0}~${t.depthBiasClamp ?? 0}`;
}
const pf = ["keep", "zero", "replace", "invert", "increment-clamp", "decrement-clamp", "increment-wrap", "decrement-wrap"];
function mf(t, e) {
  if (e.stencil === void 0)
    return {};
  const n = e.stencil;
  if (typeof n != "object" || n === null || Array.isArray(n))
    throw ke(t, `received ${T(n)}; expected { front?, back?, readMask?, writeMask?, ref? }.`);
  const r = n.front === void 0 ? void 0 : vr(t, "front", n.front), i = n.back === void 0 ? void 0 : vr(t, "back", n.back);
  Dt(t, "readMask", n.readMask), Dt(t, "writeMask", n.writeMask), Dt(t, "ref", n.ref);
  const s = {
    ...r ? { stencilFront: r } : {},
    // Omitted back mirrors the normalized front so both faces behave the same; with neither given, both keep the WebGPU defaults.
    ...i ?? r ? { stencilBack: i ?? { ...r } } : {},
    ...n.readMask !== void 0 ? { stencilReadMask: n.readMask } : {},
    ...n.writeMask !== void 0 ? { stencilWriteMask: n.writeMask } : {}
  }, o = s.stencilFront !== void 0 || s.stencilBack !== void 0 || s.stencilReadMask !== void 0 || s.stencilWriteMask !== void 0;
  return !o && n.ref === void 0 ? {} : {
    ...o ? { stencilState: s, stencilKey: gf(s) } : {},
    // The reference is encoder state (setStencilReference), not pipeline state; it stays out of the pipeline key.
    ...n.ref !== void 0 ? { stencilRef: n.ref } : {}
  };
}
function vr(t, e, n) {
  if (typeof n != "object" || n === null || Array.isArray(n))
    throw ke(t, `${e} must be a { compare?, fail?, depthFail?, pass? } object; received ${T(n)}.`);
  if (n.compare !== void 0 && !Ki.includes(n.compare))
    throw ke(t, `${e}.compare must be a GPUCompareFunction; received ${T(n.compare)}.`);
  for (const [r, i] of [["fail", n.fail], ["depthFail", n.depthFail], ["pass", n.pass]])
    if (i !== void 0 && !pf.includes(i))
      throw ke(t, `${e}.${r} must be a GPUStencilOperation; received ${T(i)}.`);
  return { compare: n.compare ?? "always", failOp: n.fail ?? "keep", depthFailOp: n.depthFail ?? "keep", passOp: n.pass ?? "keep" };
}
function Dt(t, e, n) {
  if (n !== void 0 && (typeof n != "number" || !Number.isInteger(n) || n < 0 || n > 4294967295))
    throw ke(t, `${e} must be an integer in [0, 0xFFFFFFFF] (WebGPU GPUStencilValue is u32); received ${T(n)}.`);
}
function gf(t) {
  return `st~${Sr(t.stencilFront)}~${Sr(t.stencilBack)}~${t.stencilReadMask ?? 4294967295}~${t.stencilWriteMask ?? 4294967295}`;
}
function Sr(t) {
  return t ? `${t.compare},${t.failOp},${t.depthFailOp},${t.passOp}` : "default";
}
function _r(t, e) {
  return { count: t.sampleCount ?? 1, ...e.multisampleState ?? {} };
}
function bf(t, e) {
  if (e.multisample === void 0)
    return {};
  const n = e.multisample;
  if (typeof n != "object" || n === null || Array.isArray(n))
    throw at(t, `received ${T(n)}; expected { alphaToCoverage?, mask? }.`);
  if (n.alphaToCoverage !== void 0 && typeof n.alphaToCoverage != "boolean")
    throw at(t, `alphaToCoverage must be a boolean; received ${T(n.alphaToCoverage)}.`);
  if (n.mask !== void 0 && (typeof n.mask != "number" || !Number.isInteger(n.mask) || n.mask < 0 || n.mask > 4294967295))
    throw at(t, `mask must be an integer in [0, 0xFFFFFFFF] (WebGPU GPUSampleMask is u32); received ${T(n.mask)}.`);
  const r = {
    ...n.alphaToCoverage !== void 0 ? { alphaToCoverageEnabled: n.alphaToCoverage } : {},
    ...n.mask !== void 0 ? { mask: n.mask } : {}
  };
  return r.alphaToCoverageEnabled === void 0 && r.mask === void 0 ? {} : { multisampleState: r, multisampleKey: wf(r) };
}
function wf(t) {
  return `ms~${t.alphaToCoverageEnabled ? 1 : 0}~${t.mask ?? 4294967295}`;
}
function Yi(t, e) {
  if (!Array.isArray(e))
    throw An(t, T(e));
  let n = 0;
  for (const r of e)
    if (r === "r")
      n |= 1;
    else if (r === "g")
      n |= 2;
    else if (r === "b")
      n |= 4;
    else if (r === "a")
      n |= 8;
    else
      throw An(t, T(r));
  return n;
}
function kr(t, e) {
  return `${Xi(t)};${e ?? 15}`;
}
function Xi(t) {
  if (!t)
    return "none;none";
  const e = t.color, n = t.alpha;
  return `${e.srcFactor},${e.dstFactor},${e.operation};${n.srcFactor},${n.dstFactor},${n.operation}`;
}
function yf(t) {
  return t ? `${t.blendState ? Xi(t.blendState) : "inherit"};${t.writeMask ?? "inherit"}` : "inherit";
}
function T(t) {
  if (typeof t == "string")
    return `"${t}"`;
  try {
    return JSON.stringify(t) ?? String(t);
  } catch {
    return String(t);
  }
}
function xf(t) {
  return (k(t).depthState ?? qi).depthWriteEnabled;
}
function vf(t) {
  const e = k(t), n = e.stencilState;
  if (!n || n.stencilWriteMask === 0)
    return [];
  const r = e.cullMode ?? "none", i = [], s = (o, a) => {
    if (a)
      for (const [c, u] of [["fail", a.failOp], ["depthFail", a.depthFailOp], ["pass", a.passOp]])
        u !== void 0 && u !== "keep" && i.push(`${o}.${c}: "${u}"`);
  };
  return r !== "front" && s("front", n.stencilFront), r !== "back" && s("back", n.stencilBack), i;
}
function Sf(t, e, n, r = {}, i) {
  t.encode(e, n, r, i);
}
function k(t) {
  const e = Oi.get(t);
  if (!e)
    throw new TypeError("Invalid Draw instance");
  return e;
}
function Er(t, e, n, r) {
  const i = (async () => {
    await on(t.device), F(t.device, `${e}.validation`);
    const s = Ie(e, n, r);
    t.errorSink ? await t.errorSink(s) : console.error(s);
  })();
  return t.trackSettled?.(i), i;
}
function _f() {
  const t = /* @__PURE__ */ new Set();
  return {
    add(e) {
      t.add(e);
    },
    delete(e) {
      t.delete(e);
    },
    list() {
      return [...t];
    },
    markStale(e) {
      for (const n of t)
        n.markStale(e);
    }
  };
}
function kf(t, e, n) {
  return t ? Array.isArray(t) ? t : t[e] ?? n : n;
}
function Ef(t, e) {
  const n = k(t);
  return _i(n.reflection.bindings, e, n.visibility).map($f);
}
function $f(t) {
  return t.buffer ? { ...t, buffer: { ...t.buffer, hasDynamicOffset: !0 } } : t;
}
function $r(t, e) {
  if (Ui(t) && !Mu())
    throw jr(e);
}
function Qt(t, e, n = {}) {
  if ("geometry" in n)
    throw D("effect", "effect() never accepts vertex buffers; use draw(gpu, { shader, geometry: geometry(gpu, descriptor) }).");
  const r = X(t, "effect"), i = Ct(r);
  return new If(r.device, bn(e), n, i.binds, void 0, i.pipelines, i.shaderModules, i.pipelineLayouts, (s) => r.reportError(s), (s) => {
    r.trackDelivery(s);
  });
}
const Hi = /* @__PURE__ */ new WeakMap();
class If {
  get gpu() {
    return fe(this).gpu;
  }
  constructor(e, n, r = {}, i, s, o, a, c, u, l) {
    const f = Pf(n), d = new Bi(e, f, { shader: f, set: r.set, label: r.label ?? "effect", blend: r.blend, writeMask: r.writeMask }, i, s, o, a, c, u, l);
    Hi.set(this, d);
  }
  set(e) {
    return fe(this).set(e), this;
  }
  draw(e = {}) {
    fe(this).draw(Pt(e) ? { target: e } : e);
  }
  compile(e) {
    return fe(this).compile(e).then(() => this);
  }
  compileSync(e) {
    return fe(this).compileSync(e), this;
  }
  /** @internal FramePass delegates here; not part of the frozen public Effect surface. */
  encode(e, n, r = {}, i) {
    Sf(fe(this), e, n, r, i);
  }
  /**
   * Frame drawable protocol: an effect is encoded as its underlying draw, so it reuses that draw's
   * protocol object — same encode path, same depth/stencil metadata for read-only passes.
   */
  get [_t]() {
    return fe(this)[_t];
  }
}
function fe(t) {
  const e = Hi.get(t);
  if (!e)
    throw new TypeError("Invalid Effect instance");
  return e;
}
function Pf(t) {
  return Cf(t) ? t : `
struct VgpuFullscreenVertexOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};
@vertex fn vgpu_fullscreen_vs(@builtin(vertex_index) vi: u32) -> VgpuFullscreenVertexOut {
  var pos = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  var uv = array<vec2f, 3>(vec2f(0.0, 1.0), vec2f(2.0, 1.0), vec2f(0.0, -1.0));
  var out: VgpuFullscreenVertexOut;
  out.position = vec4f(pos[vi], 0.0, 1.0);
  out.uv = uv[vi];
  return out;
}
${t}`;
}
function Cf(t) {
  return rn(t, "effect.wgsl").entryPoints.some((e) => e.stage === "vertex");
}
const Tf = Ke("clock");
function Zi(t) {
  return Ff(X(t, "clock"));
}
function Ff(t) {
  return t.service(Tf, (e) => {
    const n = mn(e), r = (i) => {
      if (e.disposed)
        throw Yr(i);
      F(e.device, i);
    };
    return {
      get time() {
        return r("clock.time"), n.time;
      },
      get deltaTime() {
        return r("clock.deltaTime"), n.deltaTime;
      },
      get frameCount() {
        return r("clock.frameCount"), n.frameCount;
      },
      advance(i) {
        if (r("clock.advance"), typeof i != "number" || !Number.isFinite(i) || i < 0)
          throw mo(i);
        n.advanceBy(i);
      }
    };
  });
}
function _e(t, e, n = {}) {
  const r = X(t, "compute");
  return new Mf(r.device, bn(e), n, Ct(r).binds);
}
let Af = 1;
class Mf {
  device;
  source;
  opts;
  cache;
  id = Af++;
  label;
  reflection;
  entryPoint;
  setCore;
  bindGroupLayouts;
  pipelineLayout;
  shaderModule;
  pipeline;
  #e;
  constructor(e, n, r = {}, i = sn()) {
    this.device = e, this.source = n, this.opts = r, this.cache = i, F(e, "Compute.constructor"), this.label = r.label ?? "compute", this.reflection = rn(n, `${this.label}.wgsl`);
    const s = Lf(this.reflection, this.label, r.entry);
    this.entryPoint = s.name;
    const { constants: o } = Ai(this.label, r.constants, this.reflection.overrides, "compute");
    this.bindGroupLayouts = ki(e, this.label, this.reflection, Si(this.reflection.bindings, [s])), this.pipelineLayout = Yc(e, this.bindGroupLayouts), this.shaderModule = e.gpu.createShaderModule({ label: `${this.label}.shader`, code: n }), this.pipeline = e.gpu.createComputePipeline({
      label: `${this.label}.pipeline`,
      layout: this.pipelineLayout,
      compute: { module: this.shaderModule, entryPoint: this.entryPoint, ...o ? { constants: o } : {} }
    }), this.setCore = $i({ device: e, label: this.label, drawId: this.id, reflection: this.reflection, bindGroupLayouts: this.bindGroupLayouts, cache: this.cache });
    const a = new Set(Be(s, "bindings", this.label).map((c) => `${c.group}:${c.binding}`));
    this.#e = this.reflection.bindings.filter((c) => c.kind === "buffer" && c.addressSpace === "storage" && a.has(`${c.group}:${c.binding}`)), r.set && this.set(r.set);
  }
  set(e) {
    return F(this.device, `${this.label}.set`), this.setCore.set(e), this;
  }
  dispatch(e, n, r) {
    F(this.device, `${this.label}.dispatch`);
    const i = typeof e == "object" && e !== null ? this.#t(e, n, r) : void 0;
    this.#n();
    const s = this.device.gpu.createCommandEncoder({ label: `${this.label}.encoder` }), o = s.beginComputePass({ label: `${this.label}.pass` });
    o.setPipeline(this.pipeline);
    for (const a of this.setCore.bindGroups())
      o.setBindGroup(a.group, a.bindGroup, a.offsets);
    i ? o.dispatchWorkgroupsIndirect(i.buffer, i.offset) : o.dispatchWorkgroups(e, n ?? 1, r ?? 1), o.end(), this.device.gpu.queue.submit([s.finish()]);
  }
  /** The GPU reads the workgroup counts from the buffer, so explicit counts alongside indirect are dead options and throw. */
  #t(e, n, r) {
    const i = `${this.label}.dispatch`;
    if (n !== void 0 || r !== void 0)
      throw he(this.label, "indirect cannot be combined with explicit workgroup counts in the same call; the GPU reads the counts from the buffer, so the CPU-side values would be ignored.", i);
    return Ni(this.label, i, e.indirect, "dispatchWorkgroupsIndirect");
  }
  #n() {
    if (!this.#e.length)
      return;
    const e = /* @__PURE__ */ new Map();
    for (const n of this.#e) {
      const r = this.setCore.bindingState(n.name);
      if (!r)
        continue;
      const i = wt(r.identity);
      e.has(i) || e.set(i, []), e.get(i).push({ identity: r.identity, writable: n.access !== "read" });
    }
    for (const n of e.values())
      if (!(n.length < 2) && n.some((r) => r.writable))
        throw wo(`${this.label}.dispatch`);
  }
}
function Lf(t, e, n) {
  const r = Yt(e, t.entryPoints, "compute", n, "compute");
  if (!r)
    throw D(`${e}.compute`, "The compute shader requires a @compute entry point.");
  return r;
}
function Qi(t, e, n = {}) {
  return Df(X(t, "frameLoop")).loop(e, n);
}
const Gf = Ke("frame-runner");
function Df(t) {
  return t.service(Gf, (e) => {
    const n = mn(e);
    return new Kf(() => {
      let r = () => {
      };
      const i = new Uf(e.device, void 0, (s) => e.reportError(s), (s) => {
        e.trackDelivery(s);
      }, () => r());
      return r = e.own("scheduler", () => i.cancel()), i;
    }, () => n.tick(), (r) => e.own("scheduler", () => r.stop()));
  });
}
class Uf {
  device;
  defaultTarget;
  errorSink;
  trackSettled;
  releaseLifecycle;
  /**
   * Resolves after submitted GPU work completes and raw claimed-bind-group
   * validation has been delivered to `gpu.onError`.
   *
   * This is a completion/timing signal only; it never rejects and is not an error
   * channel.
   */
  done = Promise.resolve();
  #e;
  #t = [];
  /**
   * Everything a pass of this frame attached, as opaque {@link FrameOwner}s: timers and
   * visibilities today, scene view generations later. The frame never learns what they are — it
   * only guarantees each one sees exactly one `frameSubmitted` or `frameAbandoned`.
   */
  #n = /* @__PURE__ */ new Set();
  /**
   * Owners whose per-frame bookkeeping a failed pass invalidated: their frame is neither finalized
   * nor read back, so a throwing pass callback cannot leave a phantom result. Kept alongside the
   * live set so a later pass re-attaching the same instance in this frame stays dropped too — the
   * failed pass's span/slots are still in that instance's frame bookkeeping.
   */
  #r = /* @__PURE__ */ new Set();
  #s = !1;
  #i = !1;
  #a = !1;
  constructor(e, n, r, i, s) {
    this.device = e, this.defaultTarget = n, this.errorSink = r, this.trackSettled = i, this.releaseLifecycle = s, F(e, "Frame.constructor"), this.#e = e.gpu.createCommandEncoder({ label: "vgpu.frame" });
  }
  pass(e, n) {
    if (this.#i)
      throw Vn("Frame.pass");
    F(this.device, "Frame.pass");
    const r = Pt(e), i = typeof n == "function" ? n : (m) => m.draw(n), s = r ? e : e.target ?? this.defaultTarget;
    if (!s)
      throw Bt("Frame.pass");
    if (Ui(s) && this.#s)
      throw jr("Frame.pass");
    const o = r ? void 0 : e.clear, a = o === !1;
    if (a && s.sampleCount === 4)
      throw Ys();
    const c = r ? void 0 : e.clearDepth;
    if (c !== void 0) {
      if (typeof c != "number" || !(c >= 0 && c <= 1))
        throw Ln(c);
      if (a)
        throw Xs();
      if (!s.depth)
        throw Ln(c, "but the target has no depth attachment, so clearDepth would have no effect.", "Create the target with depth: true (or a depth format), or drop clearDepth.");
    }
    const u = r ? void 0 : e.clearStencil;
    if (u !== void 0) {
      if (typeof u != "number" || !Number.isInteger(u) || u < 0 || u > 4294967295)
        throw Gn(`received ${String(u)}; expected an integer in [0, 0xFFFFFFFF] (WebGPU GPUStencilValue).`);
      if (a)
        throw Hs();
      const m = s.depth?.format;
      if (!We(m))
        throw Gn(`received ${String(u)}, but the target's depth format ${m ? `"${m}"` : "(none)"} has no stencil aspect, so clearStencil would have no effect.`);
    }
    const l = r ? void 0 : e.depthReadOnly;
    if (l !== void 0 && typeof l != "boolean")
      throw me(`received ${ce(l)}; expected a boolean.`, "Pass depthReadOnly: true to open the pass with a read-only depth attachment, or omit it.");
    if (l) {
      if (!s.depth)
        throw me("is set, but the target has no depth attachment, so there is nothing to make read-only.", "Create the target with depth: true (or a depth format), or drop depthReadOnly.");
      if (s.sampleCount === 4)
        throw Zs();
      if (c !== void 0)
        throw me("cannot be combined with clearDepth; a read-only depth aspect omits its load/store ops and is never cleared.", "Remove clearDepth, or drop depthReadOnly.");
      if (u !== void 0)
        throw me("cannot be combined with clearStencil; a read-only stencil aspect omits its load/store ops and is never cleared.", "Remove clearStencil, or drop depthReadOnly.");
    }
    const f = r ? void 0 : jf(e.viewport, this.device.gpu.limits, s.size), d = r ? void 0 : Wf(e.scissor, s.size), p = [];
    let g;
    try {
      const m = r || e.timer === void 0 ? void 0 : this.#u(e.timer, s, p, Of), y = (r || e.visibility === void 0 ? void 0 : this.#u(e.visibility, s, p, Bf))?.occlusion;
      let x = s.renderPassDescriptor({ clear: o === void 0 || o === !0 || o === !1 ? s.clearColor ?? hn : o, preserve: a, clearDepth: c, clearStencil: u, depthReadOnly: l });
      m?.timestampWrites && (x = { ...x, timestampWrites: m.timestampWrites }), y && (x = { ...x, occlusionQuerySet: y.querySet }), g = this.#e.beginRenderPass(x), f && g.setViewport(f.x, f.y, f.width, f.height, f.minDepth, f.maxDepth), d && g.setScissorRect(d[0], d[1], d[2], d[3]), this.#a = !0;
      try {
        i(new Rf(g, s, this.#t, l === !0, y, this, (E) => {
          if (F(this.device, E), this.#i)
            throw Vn(E);
        }));
      } finally {
        this.#a = !1;
      }
    } catch (m) {
      this.#c(p), N(this.#t), this.#t.length = 0, pi(this.device);
      try {
        g?.end();
      } catch {
      }
      throw m;
    }
    gi(this.device, g, this.#t);
  }
  submit() {
    if (this.#s || this.#i)
      return;
    F(this.device, "Frame.submit"), this.#s = !0, this.releaseLifecycle?.();
    for (const i of this.#l())
      i.finalizeFrame(this, this.#e);
    let e;
    const n = this.#t[0]?.context;
    n && Ne(this.device, n);
    try {
      e = this.#e.finish();
    } catch (i) {
      this.#f(this.#o());
      const s = n ? j(this.device) : void 0;
      N(this.#t), s && N([s]);
      const o = s?.context ?? n;
      if (!o)
        throw i;
      this.done = this.#h(this.#d(o.label, o.group, i));
      return;
    }
    if (n) {
      const i = j(this.device);
      i && (this.#t[0] = this.#t[0] ? xt(i, this.#t[0]) : i);
    }
    const r = this.#t[0]?.context;
    r && Ne(this.device, r);
    try {
      this.device.gpu.queue.submit([e]);
    } catch (i) {
      this.#f(this.#o());
      const s = r ? j(this.device) : void 0;
      N(this.#t), s && N([s]);
      const o = s?.context ?? r;
      if (!o)
        throw i;
      this.done = this.#h(this.#d(o.label, o.group, i));
      return;
    }
    if (r) {
      const i = j(this.device);
      i && (this.#t[0] = this.#t[0] ? xt(i, this.#t[0]) : i);
    }
    for (const i of this.#l())
      i.frameSubmitted(this);
    this.#f(this.#r), this.done = this.#h(mi(this.device, this.#t, { errorSink: this.errorSink }));
  }
  /**
   * Discards the frame without submitting it: the command encoder is dropped (nothing this frame
   * encoded ever runs) and every telemetry instance it attached releases the retain it took on its
   * query ring, so a `timer(gpu)` / `visibility(gpu)` can be disposed for good without waiting for
   * `gpu.dispose()`. This is the explicit way out of the leak a manual `frame(gpu)` would otherwise
   * hold: a frame is never assumed abandoned, because an old frame can still be submitted.
   *
   * Idempotent, like `submit()`: cancelling twice is a no-op, and `submit()` after `cancel()` does
   * nothing. Cancelling a frame that was already submitted throws `VGPU-FRAME-SUBMITTED` — its work
   * is on the queue and cannot be taken back, so silently accepting the call would hide a real
   * lifecycle bug.
   */
  cancel() {
    if (!this.#i) {
      if (this.#s)
        throw bo("Frame.cancel");
      if (this.#a)
        throw go("Frame.cancel");
      this.#i = !0, this.releaseLifecycle?.(), this.#f(this.#o()), this.#n.clear(), this.#r.clear(), N(this.#t), this.#t.length = 0;
    }
  }
  /**
   * Ends the frame for telemetry instances that will never see a real frameSubmitted: a pass whose
   * callback threw, a frame whose finish/submit failed, or a canceled frame. Each one took a retain
   * on its query ring when it was attached to a pass descriptor (so a mid-frame dispose() cannot
   * destroy a set the frame still points at); without the matching release, a dispose() after the
   * failure leaves the ring alive forever. frameAbandoned() drops the instance's pending encoded
   * state as it releases: a resolve that never reached the queue must not be decoded — its staging
   * buffer holds stale bytes, which would surface as a phantom duration or a phantom "hidden".
   */
  #f(e) {
    for (const n of [...e])
      n.frameAbandoned(this);
  }
  /** Every owner this frame attached, discarded ones included. */
  #o() {
    return [...this.#n, ...this.#r];
  }
  /** Moves owners out of this frame's live set: they are neither finalized nor read back. */
  #c(e) {
    for (const n of [...e])
      this.#n.delete(n), this.#r.add(n);
  }
  #l() {
    return [...this.#n].filter((e) => !this.#r.has(e));
  }
  /**
   * Attaches one `FramePassOptions` telemetry value to this pass through the nominal attachment
   * protocol, so the frame never learns whether it is a timer span, a visibility or a future
   * scene-view generation: it only records the owner it must settle exactly once.
   */
  #u(e, n, r, i) {
    const s = ju(e);
    if (!s)
      throw i(e);
    let o;
    try {
      o = s[zi]({ frame: this, device: this.device, target: n });
    } catch (a) {
      throw this.#c(this.#n), a;
    }
    return this.#n.add(o.owner), r.push(o.owner), o;
  }
  async #d(e, n, r) {
    await on(this.device), F(this.device, "Frame.validation");
    const i = Ie(e, n, r);
    this.errorSink ? await this.errorSink(i) : console.error(i);
  }
  #h(e) {
    return this.trackSettled?.(e), e;
  }
}
class Rf {
  encoder;
  target;
  validations;
  depthReadOnly;
  occlusionSource;
  frame;
  assertFrameOpen;
  #e = !1;
  constructor(e, n, r, i = !1, s, o, a) {
    this.encoder = e, this.target = n, this.validations = r, this.depthReadOnly = i, this.occlusionSource = s, this.frame = o, this.assertFrameOpen = a;
  }
  draw(e, n = {}) {
    this.assertFrameOpen?.("FramePass.draw");
    const r = Nf(e);
    this.depthReadOnly && Vf(r, this.target), r.encode(this.encoder, this.target, n, (i) => this.validations.push(i));
  }
  /**
   * Wraps one or more draws in begin/endOcclusionQuery. The body ALWAYS executes; condition your
   * real draws on `q.hidden` outside.
   */
  occlusion(e, n) {
    if (this.assertFrameOpen?.("FramePass.occlusion"), !this.occlusionSource)
      throw eo();
    if (this.#e)
      throw to();
    const r = this.occlusionSource.beginQuery(e, this.frame);
    this.encoder.beginOcclusionQuery(r), this.#e = !0;
    try {
      typeof n == "function" ? n() : this.draw(n);
    } finally {
      this.#e = !1, this.encoder.endOcclusionQuery();
    }
  }
  bundles(...e) {
    if (this.assertFrameOpen?.("FramePass.bundles"), this.depthReadOnly)
      throw me("pass cannot replay bundles: bundle records bundles with writable depth/stencil, and WebGPU only executes read-only-recorded bundles in a read-only pass.", "Encode the draws directly with pass.draw(...) inside the depthReadOnly pass.", "FramePass.bundles");
    const n = e.map((r) => Bu(r) ?? zf());
    for (const r of n)
      r.assertReplayable(this.target);
    this.encoder.executeBundles(n.map((r) => r.gpu));
  }
}
function Vf(t, e) {
  if (t.writesDepth())
    throw me(`pass cannot encode draw '${t.label}': its depth state writes depth (the default is write: true). Give the draw depth: { write: false } (or depth: false to disable depth testing).`, "Use depth: { write: false } on the draw, or open the pass without depthReadOnly.", "FramePass.draw");
  if (We(e.depth?.format)) {
    const n = t.stencilWritingOps();
    if (n.length)
      throw me(`pass cannot encode draw '${t.label}': its stencil ops can write (${n.join(", ")}), and the pass's stencil aspect is read-only too.`, 'Use "keep" for those ops or stencil writeMask: 0, or open the pass without depthReadOnly.', "FramePass.draw");
  }
}
function Nf(t) {
  const e = zu(t);
  if (!e)
    throw new TypeError("Invalid Effect instance: pass.draw() expects a Draw or an Effect created by this library.");
  return e;
}
function zf() {
  throw new w({ code: "VGPU-R3-BUNDLE-INVALID", message: "p.bundles() expected bundles created by bundle(gpu, { target }, cb).", where: "FramePass.bundles" });
}
function Of(t) {
  return Qs(`FramePassOptions.timer received ${ce(t)}; expected a TimerSpan from timer.span(name).`, 'Create const passTimer = timer(gpu) once, then pass passTimer.span("name") per pass.', "Frame.pass");
}
function Bf(t) {
  return Js(`FramePassOptions.visibility received ${ce(t)}; expected a Visibility from visibility(gpu).`, "Create const vis = visibility(gpu) once, then pass { target, visibility: vis } per pass.", "Frame.pass");
}
function jf(t, e, n) {
  if (t === void 0)
    return;
  if (typeof t != "object" || t === null || Array.isArray(t))
    throw Z(`received ${ce(t)}; expected { x?, y?, width, height, minDepth?, maxDepth? }.`);
  const { x: r = 0, y: i = 0, width: s, height: o, minDepth: a = 0, maxDepth: c = 1 } = t;
  for (const [d, p] of [["x", r], ["y", i], ["width", s], ["height", o], ["minDepth", a], ["maxDepth", c]])
    if (typeof p != "number" || !Number.isFinite(p))
      throw Z(`${d} received ${ce(p)}; expected a finite number.`);
  const u = e.maxTextureDimension2D, l = u * 2, f = `target is ${n[0]}x${n[1]}px, device maxTextureDimension2D is ${u}`;
  if (!(s >= 0 && s <= u))
    throw Z(`width ${s} is outside [0, ${u}] (${f}).`);
  if (!(o >= 0 && o <= u))
    throw Z(`height ${o} is outside [0, ${u}] (${f}).`);
  if (!(r >= -l && r + s <= l - 1))
    throw Z(`x ${r} with width ${s} is outside [${-l}, ${l - 1}] (${f}).`);
  if (!(i >= -l && i + o <= l - 1))
    throw Z(`y ${i} with height ${o} is outside [${-l}, ${l - 1}] (${f}).`);
  if (!(a >= 0 && a <= 1))
    throw Z(`minDepth ${a} is outside [0, 1].`);
  if (!(c >= 0 && c <= 1))
    throw Z(`maxDepth ${c} is outside [0, 1].`);
  if (!(a <= c))
    throw Z(`minDepth ${a} exceeds maxDepth ${c}.`);
  return { x: r, y: i, width: s, height: o, minDepth: a, maxDepth: c };
}
function Wf(t, e) {
  if (t === void 0)
    return;
  if (!Array.isArray(t) || t.length !== 4)
    throw Ft(`received ${ce(t)}; expected [x, y, width, height].`);
  const [n, r, i, s] = t;
  for (const [c, u] of [["x", n], ["y", r], ["width", i], ["height", s]])
    if (typeof u != "number" || !Number.isInteger(u) || u < 0)
      throw Ft(`${c} received ${ce(u)}; expected a non-negative integer.`);
  const [o, a] = e;
  if (n + i > o || r + s > a)
    throw Ft(`[${n}, ${r}, ${i}, ${s}] exceeds the target's current size ${o}x${a}px (x + width <= ${o}, y + height <= ${a}).`);
  return [n, r, i, s];
}
function ce(t) {
  return typeof t == "string" ? `'${t}'` : Array.isArray(t) ? `[${t.map((e) => ce(e)).join(", ")}]` : typeof t == "object" && t !== null ? "an object" : String(t);
}
function qf(t) {
  const e = t?.code;
  return e === "VGPU-DEVICE-DISPOSED" || e === "VGPU-DEVICE-LOST";
}
class Kf {
  createFrame;
  advance;
  trackLoop;
  #e = !1;
  /**
   * @param trackLoop Lifecycle hook for the owning gpu: called with each started loop handle and
   * returns the untrack function the handle runs when it stops on its own, so `gpu.dispose()` can
   * stop the loops still running without holding on to the ones already stopped.
   */
  constructor(e, n, r) {
    this.createFrame = e, this.advance = n, this.trackLoop = r;
  }
  frame(e) {
    if (this.#e || Au())
      throw Wr();
    this.#e = !0, Lu();
    try {
      this.advance();
      const n = this.createFrame();
      if (e)
        try {
          e(n);
        } finally {
          try {
            n.submit();
          } catch (r) {
            if (!qf(r))
              throw r;
          }
        }
      return n;
    } finally {
      Gu(), this.#e = !1;
    }
  }
  loop(e, n = {}) {
    let r = !1;
    const i = globalThis.requestAnimationFrame ?? ((d) => setTimeout(() => d(performance.now()), 16)), s = globalThis.cancelAnimationFrame ?? ((d) => clearTimeout(d)), o = n.fps && n.fps > 0 ? 1e3 / n.fps : 0;
    let a, c = 0;
    const u = (d) => {
      r || (Yf(d, a, o) && (a = d, this.frame(e)), r || (c = i(u)));
    };
    c = i(u);
    let l;
    const f = {
      stop() {
        r = !0, s(c), l?.(), l = void 0;
      }
    };
    return l = this.trackLoop?.(f), f;
  }
}
function Yf(t, e, n) {
  return e === void 0 || n <= 0 ? !0 : t - e >= n;
}
function mt(t, e) {
  return new Xf(X(t, "target").device, e);
}
class Xf {
  device;
  options;
  resourceIdentity = Et("render-target");
  #e = new $t();
  #t = /* @__PURE__ */ new Set();
  #n;
  #r;
  #s;
  #i;
  #a;
  constructor(e, n) {
    this.device = e, this.options = n, cu(n, e), this.#a = n.clearColor === void 0 ? hn : vt(n.clearColor, "target.clearColor"), this.#n = n.size, this.#r = this.#l(), this.#s = this.sampleCount === 4 ? this.#u() : void 0, this.#i = this.#d();
  }
  get gpu() {
    return this.color.gpu;
  }
  get size() {
    return this.#n;
  }
  get texelSize() {
    return [1 / this.#n[0], 1 / this.#n[1]];
  }
  /** Resolved, sampleable color texture. For MSAA targets, render passes resolve into this texture. */
  get color() {
    return this.#r[0];
  }
  /** Resolved, sampleable color textures. For MSAA targets, render passes resolve into these textures. */
  get colors() {
    return this.#r;
  }
  get depth() {
    return this.#i;
  }
  get format() {
    return dt(this.options)[0]?.format ?? "rgba8unorm";
  }
  /** Default clear color of this target; passes that clear without naming a color use it. */
  get clearColor() {
    return pn(this.#a);
  }
  set clearColor(e) {
    this.#a = vt(e, "target.clearColor");
  }
  get sampleCount() {
    return Pi(this.options);
  }
  resize(e) {
    Ti(this.#n, e) || this.#f(e);
  }
  async read() {
    return this.color.read();
  }
  async readFloats() {
    return this.color.readFloats();
  }
  onDestroy(e) {
    return this.#e.onDestroy(this, e);
  }
  onTexturesRecreated(e) {
    return this.#t.add(e), () => {
      this.#t.delete(e);
    };
  }
  destroy() {
    this.#e.emit(this), this.#t.clear(), this.#c();
  }
  renderPassDescriptor(e = {}) {
    const { clear: n = [0, 0, 0, 1], preserve: r, clearDepth: i, clearStencil: s, depthReadOnly: o } = e;
    return {
      colorAttachments: this.#r.map((a, c) => fu(a, this.#s?.[c], n, r)),
      depthStencilAttachment: this.#i ? lu(this.#i, r, i, s, o) : void 0
    };
  }
  #f(e) {
    this.#c(), this.#n = [e[0], e[1]], this.#r = this.#l(), this.#s = this.sampleCount === 4 ? this.#u() : void 0, this.#i = this.#d(), this.#o();
  }
  #o() {
    for (const e of [...this.#t])
      e();
  }
  #c() {
    for (const e of this.#r)
      e.destroy();
    for (const e of this.#s ?? [])
      e.destroy();
    this.#i?.destroy();
  }
  #l() {
    return dt(this.options).map((e, n) => this.device.createTexture({
      size: this.#n,
      format: e.format,
      usage: ["render_attachment", "texture_binding", "copy_src"],
      sampleCount: 1,
      label: this.options.label ? `${this.options.label}.color${n}.resolve` : void 0
    }));
  }
  #u() {
    return dt(this.options).map((e, n) => this.device.createTexture({
      size: this.#n,
      format: e.format,
      usage: ["render_attachment"],
      sampleCount: 4,
      label: this.options.label ? `${this.options.label}.color${n}` : void 0
    }));
  }
  #d() {
    const e = Ii(this.options);
    return e ? this.device.createTexture({
      size: this.#n,
      format: e,
      usage: ["render_attachment", "texture_binding"],
      sampleCount: this.sampleCount,
      label: this.options.label ? `${this.options.label}.depth` : void 0
    }) : void 0;
  }
}
function q(t, e, n = "read-write") {
  const r = X(t, "storage"), i = typeof n == "string" ? { access: n } : n, s = Hf(r.device, e, i.access ?? "read-write", void 0, i.indirect ?? !1);
  return Xr(r, s, (o) => o.destroy(), (o) => {
    s.onDestroy(o);
  });
}
class wn {
  size;
  access;
  buffer;
  constructor(e, n) {
    this.buffer = e, this.access = n, this.size = e.options.size;
  }
  static create(e, n, r, i, s = !1) {
    const o = s ? ["storage", "copy_dst", "copy_src", "indirect"] : ["storage", "copy_dst", "copy_src"], a = e.createBuffer({
      size: n,
      usage: o,
      label: i
    });
    return new wn(a, r);
  }
  read() {
    return this.buffer.read(this.size);
  }
  write(e, n = 0) {
    this.buffer.write(Zf(e), n);
  }
  get gpu() {
    return this.buffer.gpu;
  }
  get resourceIdentity() {
    return this.buffer.resourceIdentity;
  }
  onDestroy(e) {
    return this.buffer.onDestroy(e);
  }
  /** Frees the GPU allocation. Idempotent; bind groups holding it are invalidated through the buffer's destroy signal. */
  destroy() {
    this.buffer.destroy();
  }
}
function Hf(t, e, n, r, i = !1) {
  return wn.create(t, e, n, r, i);
}
function Zf(t) {
  if (t instanceof ArrayBuffer || ArrayBuffer.isView(t))
    return t;
  throw new TypeError("StorageBuffer.write() requires ArrayBuffer or ArrayBufferView.");
}
function Qf(t) {
  return Eo("browser", t);
}
const Jf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Geometry: Hr,
  VGPUError: w,
  clock: Zi,
  compute: _e,
  draw: pt,
  effect: Qt,
  frameLoop: Qi,
  geometry: jt,
  init: Qf,
  sampler: Ht,
  storage: q,
  surface: Di,
  target: mt
}, Symbol.toStringTag, { value: "Module" }));
function el(t, e, n) {
  const r = Object.freeze({ ...e });
  return Object.freeze({
    kind: t,
    props: r,
    build: (i) => tl(n(i, r))
  });
}
function tl(t) {
  const e = t.attributes, n = {
    position: { ...e.position, location: 0 }
  };
  return e.normal && (n.normal = { ...e.normal, location: 1 }), e.uv && (n.uv = { ...e.uv, location: 2 }), {
    buffers: [{
      buffer: t.gpu?.vertexBuffer ?? t.vertexBuffer.gpu,
      stride: e.stride,
      attributes: n
    }],
    vertexCount: t.vertexCount,
    indexBuffer: t.gpu?.indexBuffer ?? t.indexBuffer?.gpu,
    indexFormat: t.indexFormat,
    indexCount: t.indexCount
  };
}
function nl(t, e, n, r) {
  let i = t.get(e);
  i || (i = /* @__PURE__ */ new Map(), t.set(e, i));
  const s = i.get(n);
  if (s)
    return s;
  const o = r();
  return i.set(n, o), o;
}
function nt(t, e) {
  return new kt({ code: "VGPU-CORE-INVALID-USAGE", message: e, where: t });
}
function rl(t) {
  const { radius: e, widthSegments: n, heightSegments: r } = t, i = [], s = [];
  for (let a = 0; a <= r; a++) {
    const c = a / r, u = c * Math.PI, l = Math.sin(u), f = Math.cos(u);
    for (let d = 0; d <= n; d++) {
      const p = d / n, g = p * Math.PI * 2, m = l * Math.cos(g), v = f, y = l * Math.sin(g);
      i.push(e * m, e * v, e * y, m, v, y, p, c);
    }
  }
  const o = n + 1;
  for (let a = 0; a < r; a++)
    for (let c = 0; c < n; c++) {
      const u = a * o + c, l = u + 1, f = (a + 1) * o + c, d = f + 1;
      s.push(u, l, f, l, d, f);
    }
  return { vertices: new Float32Array(i), indices: new Uint16Array(s) };
}
const il = Object.freeze({
  stride: 32,
  position: Object.freeze({ offset: 0, format: "float32x3" }),
  normal: Object.freeze({ offset: 12, format: "float32x3" }),
  uv: Object.freeze({ offset: 24, format: "float32x2" })
}), sl = /* @__PURE__ */ new WeakMap();
function ol(t) {
  const e = t.radius ?? 0.5, n = t.widthSegments ?? 32, r = t.heightSegments ?? 16;
  al(e, n, r);
  const i = `${e}|${n}|${r}`;
  return nl(sl, t.device, i, () => {
    const s = rl({ radius: e, widthSegments: n, heightSegments: r }), o = t.device.createBuffer({ label: `mesh.sphere.vertices.${i}`, size: s.vertices.byteLength, usage: ["vertex", "copy_dst"] });
    o.write(s.vertices);
    const a = t.device.createBuffer({ label: `mesh.sphere.indices.${i}`, size: s.indices.byteLength, usage: ["index", "copy_dst"] });
    return a.write(s.indices), Object.freeze({
      vertexBuffer: o,
      vertexCount: s.vertices.length / 8,
      attributes: il,
      bbox: Object.freeze({
        min: new Float32Array([-e, -e, -e]),
        max: new Float32Array([e, e, e])
      }),
      indexBuffer: a,
      indexCount: s.indices.length,
      indexFormat: "uint16",
      layout: "position-normal-uv",
      gpu: Object.freeze({ vertexBuffer: o.gpu, indexBuffer: a.gpu })
    });
  });
}
function al(t, e, n) {
  if (t <= 0)
    throw nt("Mesh.sphere", "Radius must be greater than 0.");
  if (e < 3)
    throw nt("Mesh.sphere", "Width segments must be at least 3.");
  if (n < 2)
    throw nt("Mesh.sphere", "Height segments must be at least 2.");
  const r = (e + 1) * (n + 1);
  if (r > 65535)
    throw nt("Mesh.sphere", `Segments ${e}x${n} make ${r} vertices > uint16 limit 65535; reduce them.`);
}
function cl(t = {}) {
  return el("sphere", t, (e, n) => ol({ device: e, ...n }));
}
function ul(t) {
  return t * Math.PI / 180;
}
function fl(t, e, n, r) {
  const i = Math.tan(Math.PI * 0.5 - 0.5 * t), s = 1 / (n - r);
  return new Float32Array([
    i / e,
    0,
    0,
    0,
    0,
    i,
    0,
    0,
    0,
    0,
    Number.isFinite(r) ? r * s : -1,
    -1,
    0,
    0,
    Number.isFinite(r) ? r * n * s : -n,
    0
  ]);
}
function ll(t, e) {
  const n = e ? `'${e}'` : "the node";
  return new w({
    code: "VGPU-SCENE-CYCLE",
    message: `add() would make ${n} an ancestor of itself.`,
    fix: "Remove the node from the ancestor chain first, or add a different node.",
    where: t
  });
}
function ee(t, e, n) {
  return new w({
    code: "VGPU-SCENE-VALUE-INVALID",
    message: `\`${e}\` is invalid; expected ${n}.`,
    fix: `Pass ${n} for \`${e}\`.`,
    where: t
  });
}
function ze(t) {
  return t.fill(0), t[0] = t[5] = t[10] = t[15] = 1, t;
}
function dl(t, e) {
  return t.set(e), t;
}
function hl(t, e, n, r) {
  const i = n[0], s = n[1], o = n[2], a = n[3], c = i + i, u = s + s, l = o + o, f = i * c, d = i * u, p = i * l, g = s * u, m = s * l, v = o * l, y = a * c, x = a * u, E = a * l, $ = r[0], _ = r[1], M = r[2];
  return t[0] = (1 - (g + v)) * $, t[1] = (d + E) * $, t[2] = (p - x) * $, t[3] = 0, t[4] = (d - E) * _, t[5] = (1 - (f + v)) * _, t[6] = (m + y) * _, t[7] = 0, t[8] = (p + x) * M, t[9] = (m - y) * M, t[10] = (1 - (f + g)) * M, t[11] = 0, t[12] = e[0], t[13] = e[1], t[14] = e[2], t[15] = 1, t;
}
function Ji(t, e, n) {
  const r = e[0], i = e[1], s = e[2], o = e[3], a = e[4], c = e[5], u = e[6], l = e[7], f = e[8], d = e[9], p = e[10], g = e[11], m = e[12], v = e[13], y = e[14], x = e[15];
  for (let E = 0; E < 4; E++) {
    const $ = E * 4, _ = n[$], M = n[$ + 1], V = n[$ + 2], h = n[$ + 3];
    t[$] = r * _ + a * M + f * V + m * h, t[$ + 1] = i * _ + c * M + d * V + v * h, t[$ + 2] = s * _ + u * M + p * V + y * h, t[$ + 3] = o * _ + l * M + g * V + x * h;
  }
  return t;
}
function es(t, e) {
  const n = e[0], r = e[1], i = e[2], s = e[4], o = e[5], a = e[6], c = e[8], u = e[9], l = e[10], f = e[12], d = e[13], p = e[14], g = o * l - a * u, m = a * c - s * l, v = s * u - o * c, y = n * g + r * m + i * v, x = y === 0 ? 0 : 1 / y, E = g * x, $ = m * x, _ = v * x, M = (i * u - r * l) * x, V = (n * l - i * c) * x, h = (r * c - n * u) * x, b = (r * a - i * o) * x, S = (i * s - n * a) * x, I = (n * o - r * s) * x;
  return t[0] = E, t[1] = M, t[2] = b, t[3] = 0, t[4] = $, t[5] = V, t[6] = S, t[7] = 0, t[8] = _, t[9] = h, t[10] = I, t[11] = 0, t[12] = -(E * f + $ * d + _ * p), t[13] = -(M * f + V * d + h * p), t[14] = -(b * f + S * d + I * p), t[15] = 1, t;
}
function pl(t, e, n) {
  const r = n[0], i = n[1], s = n[2];
  return t[0] = e[0] * r + e[4] * i + e[8] * s + e[12], t[1] = e[1] * r + e[5] * i + e[9] * s + e[13], t[2] = e[2] * r + e[6] * i + e[10] * s + e[14], t;
}
function ml(t, e, n) {
  const r = n[0], i = n[1], s = n[2];
  return t[0] = e[0] * r + e[4] * i + e[8] * s, t[1] = e[1] * r + e[5] * i + e[9] * s, t[2] = e[2] * r + e[6] * i + e[10] * s, t;
}
function gl(t, e, n, r) {
  const i = Math.cos(e / 2), s = Math.sin(e / 2), o = Math.cos(n / 2), a = Math.sin(n / 2), c = Math.cos(r / 2), u = Math.sin(r / 2);
  return t[0] = s * o * c + i * a * u, t[1] = i * a * c - s * o * u, t[2] = i * o * u + s * a * c, t[3] = i * o * c - s * a * u, t;
}
function bl(t, e, n, r, i, s, o, a, c, u) {
  const l = e + s + u;
  if (l > 0) {
    const f = 0.5 / Math.sqrt(l + 1);
    t[3] = 0.25 / f, t[0] = (o - c) * f, t[1] = (a - r) * f, t[2] = (n - i) * f;
  } else if (e > s && e > u) {
    const f = 2 * Math.sqrt(1 + e - s - u);
    t[3] = (o - c) / f, t[0] = 0.25 * f, t[1] = (i + n) / f, t[2] = (a + r) / f;
  } else if (s > u) {
    const f = 2 * Math.sqrt(1 + s - e - u);
    t[3] = (a - r) / f, t[0] = (i + n) / f, t[1] = 0.25 * f, t[2] = (c + o) / f;
  } else {
    const f = 2 * Math.sqrt(1 + u - e - s);
    t[3] = (n - i) / f, t[0] = (a + r) / f, t[1] = (c + o) / f, t[2] = 0.25 * f;
  }
  return t;
}
function wl(t, e, n, r) {
  let i = e[0] - n[0], s = e[1] - n[1], o = e[2] - n[2];
  const a = Math.hypot(i, s, o);
  if (a === 0)
    return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t;
  i /= a, s /= a, o /= a;
  let c = r[1] * o - r[2] * s, u = r[2] * i - r[0] * o, l = r[0] * s - r[1] * i, f = Math.hypot(c, u, l);
  f === 0 && (c = o, u = 0, l = -i, f = Math.hypot(c, u, l), f === 0 && (c = 1, u = 0, l = 0, f = 1)), c /= f, u /= f, l /= f;
  const d = s * l - o * u, p = o * c - i * l, g = i * u - s * c;
  return bl(t, c, u, l, d, p, g, i, s, o);
}
const yl = new Float32Array([0, 1, 0]), Ir = new Float32Array(3), rt = new Float32Array(3), it = new Float32Array(3), Ut = new Float32Array(16);
class xl {
  kind;
  label;
  visible = !0;
  #e = new Float32Array(3);
  #t = new Float32Array([0, 0, 0, 1]);
  #n = new Float32Array([1, 1, 1]);
  #r = ze(new Float32Array(16));
  #s = ze(new Float32Array(16));
  #i = new Float32Array(3);
  #a = !1;
  #f = !1;
  #o = null;
  #c = [];
  _worldVersion = 0;
  constructor(e, n = {}) {
    this.kind = e, this.label = n.label, this.#l(n), n.children && this.add(...n.children);
  }
  /** Updates transform components in place; unspecified components are left untouched. */
  set(e) {
    return this.#l(e), this;
  }
  #l(e) {
    const n = `${this.label ?? this.kind}.set`;
    let r = !1;
    if (e.position !== void 0 && (st(this.#e, e.position, "position", n), r = !0), e.quaternion !== void 0) {
      if (e.quaternion.length !== 4)
        throw ee(n, "quaternion", "an array of 4 numbers (x, y, z, w)");
      this.#t[0] = e.quaternion[0], this.#t[1] = e.quaternion[1], this.#t[2] = e.quaternion[2], this.#t[3] = e.quaternion[3], r = !0;
    } else if (e.rotation !== void 0) {
      if (e.rotation.length !== 3)
        throw ee(n, "rotation", "an array of 3 Euler angles in radians");
      gl(this.#t, e.rotation[0], e.rotation[1], e.rotation[2]), r = !0;
    }
    e.scale !== void 0 && (typeof e.scale == "number" ? this.#n.fill(e.scale) : st(this.#n, e.scale, "scale", n), r = !0), e.visible !== void 0 && (this.visible = e.visible), e.label !== void 0 && (this.label = e.label), r && this.#u();
  }
  /**
   * Rotates the node so its -Z axis points at a world-space target.
   *
   * The whole computation runs in parent space (the target and up hint are pulled through
   * the parent's affine inverse), which stays exact under non-uniform parent scale: an
   * affine map sends the parent-space ray through the target to the world-space ray through
   * the world target. Extracting a scale-stripped parent rotation instead — as an earlier
   * version did — skews the forward vector whenever the parent scale is anisotropic.
   */
  lookAt(e, n = yl) {
    const r = `${this.label ?? this.kind}.lookAt`;
    st(rt, e, "target", r), st(it, n, "up", r), Ir.set(this.#e);
    const i = this.#o;
    return i && (es(Ut, i.worldMatrix), pl(rt, Ut, rt), ml(it, Ut, it)), wl(this.#t, Ir, rt, it), this.#u(), this;
  }
  /** Adds children, reparenting them if needed. Throws `VGPU-SCENE-CYCLE` on cycles. */
  add(...e) {
    const n = `${this.label ?? this.kind}.add`;
    for (const r of e) {
      for (let i = this; i; i = i.#o)
        if (i === r)
          throw ll(n, r.label ?? r.kind);
      r.#o && r.#o.#h(r), r.#o = this, this.#c.push(r), r.#d();
    }
    return this;
  }
  /** Removes direct children; nodes that are not children are ignored. */
  remove(...e) {
    for (const n of e)
      n.#o === this && this.#h(n);
    return this;
  }
  /** Detaches this node from its parent, keeping its local transform. */
  removeFromParent() {
    return this.#o && this.#o.#h(this), this;
  }
  /** Depth-first visit of this node and all descendants. */
  traverse(e) {
    e(this);
    for (const n of this.#c)
      n.traverse(e);
  }
  get parent() {
    return this.#o;
  }
  get children() {
    return this.#c;
  }
  /** Local position. Stable array identity; mutate via `set()`. */
  get position() {
    return this.#e;
  }
  /** Local rotation quaternion (x, y, z, w). Stable array identity; mutate via `set()`. */
  get quaternion() {
    return this.#t;
  }
  /** Local scale. Stable array identity; mutate via `set()`. */
  get scale() {
    return this.#n;
  }
  /** Column-major local TRS matrix, recomputed lazily. Stable array identity. */
  get localMatrix() {
    return this.#a && (hl(this.#r, this.#e, this.#t, this.#n), this.#a = !1), this.#r;
  }
  /** Column-major world matrix, recomputed lazily for dirty subtrees. Stable array identity. */
  get worldMatrix() {
    if (this.#f || this.#a) {
      const e = this.localMatrix, n = this.#o;
      n ? Ji(this.#s, n.worldMatrix, e) : dl(this.#s, e), this.#f = !1, this._worldVersion++;
    }
    return this.#s;
  }
  /** World-space position derived from `worldMatrix`. Stable array identity. */
  get worldPosition() {
    const e = this.worldMatrix;
    return this.#i[0] = e[12], this.#i[1] = e[13], this.#i[2] = e[14], this.#i;
  }
  #u() {
    this.#a = !0, this.#d(!0);
  }
  #d(e = !1) {
    if (!(this.#f && !e)) {
      this.#f = !0;
      for (const n of this.#c)
        n.#d();
    }
  }
  #h(e) {
    const n = this.#c.indexOf(e);
    n >= 0 && this.#c.splice(n, 1), e.#o = null, e.#d(!0);
  }
}
function st(t, e, n, r) {
  if (e.length !== 3)
    throw ee(r, n, "an array of 3 numbers");
  t[0] = e[0], t[1] = e[1], t[2] = e[2];
}
class vl extends xl {
  #e = ze(new Float32Array(16));
  #t = ze(new Float32Array(16));
  #n = ze(new Float32Array(16));
  _projectionDirty = !0;
  #r = -1;
  #s = !0;
  get projection() {
    return this._projectionDirty && (this._updateProjection(this.#e), this._projectionDirty = !1, this.#s = !0), this.#e;
  }
  get view() {
    return this.#i(), this.#t;
  }
  get viewProjection() {
    const e = this.projection;
    return this.#i(), this.#s && (Ji(this.#n, e, this.#t), this.#s = !1), this.#n;
  }
  get viewProjectionMatrix() {
    return this.viewProjection;
  }
  #i() {
    const e = this.worldMatrix;
    this.#r !== this._worldVersion && (es(this.#t, e), this.#r = this._worldVersion, this.#s = !0);
  }
}
class Sl extends vl {
  #e;
  #t;
  #n;
  #r;
  constructor(e) {
    Pr("perspectiveCamera", e.fov), e.aspect !== void 0 && Tr("perspectiveCamera", e.aspect), Cr("perspectiveCamera", e.near ?? 0.1, e.far ?? 100), kl("perspectiveCamera", e.target, e.up), super("perspective-camera", e), this.#e = e.fov, this.#t = e.aspect, this.#n = e.near ?? 0.1, this.#r = e.far ?? 100, e.target && this.lookAt(e.target, e.up);
  }
  set(e) {
    super.set(e);
    const n = `${this.label ?? this.kind}.set`;
    if (e.fov !== void 0 && (Pr(n, e.fov), this.#e = e.fov, this._projectionDirty = !0), e.aspect !== void 0 && (Tr(n, e.aspect), this.#t = e.aspect, this._projectionDirty = !0), e.near !== void 0 || e.far !== void 0) {
      const r = e.near ?? this.#n, i = e.far ?? this.#r;
      Cr(n, r, i), this.#n = r, this.#r = i, this._projectionDirty = !0;
    }
    return this;
  }
  get fov() {
    return this.#e;
  }
  /** Resolved aspect ratio; defaults to 1 until set explicitly. */
  get aspect() {
    return this.#t ?? 1;
  }
  get near() {
    return this.#n;
  }
  get far() {
    return this.#r;
  }
  _updateProjection(e) {
    e.set(fl(ul(this.#e), this.#t ?? 1, this.#n, this.#r));
  }
}
function _l(t) {
  return new Sl(t);
}
function kl(t, e, n) {
  if (e !== void 0) {
    if (e.length !== 3)
      throw ee(t, "target", "an array of 3 numbers");
    if (n !== void 0 && n.length !== 3)
      throw ee(t, "up", "an array of 3 numbers");
  }
}
function Pr(t, e) {
  if (!(e > 0 && e < 180))
    throw ee(t, "fov", "a field of view in degrees between 0 and 180 (exclusive)");
}
function Cr(t, e, n) {
  if (!(e > 0))
    throw ee(t, "near", "a positive near plane distance");
  if (!(n > e))
    throw ee(t, "far", "a far plane distance greater than `near`");
}
function Tr(t, e) {
  if (!(e > 0) || !Number.isFinite(e))
    throw ee(t, "aspect", "a positive, finite width/height ratio");
}
const El = { version: 1, wgsl: "const NU:u32=256u;@group(0) @binding(0) var<storage,read> disp:array<vec4f>;@fragment fn fs_main(@location(0) a:vec2f)-> @location(0) vec4f{let x=min(u32(a.x*f32(NU)),NU-1u);let b=min(u32(a.y*f32(NU)),NU-1u);return disp[b*NU+x];}" }, $l = { version: 1, wgsl: "@group(0) @binding(0) var src:texture_2d<f32>;@group(0) @binding(1) var samp:sampler;fn aces(a:vec3f)-> vec3f{let b=2.51;let c=0.03;let d=2.43;let e=0.59;let f=0.14;return clamp((a*(b*a+c))/(a*(d*a+e)+f),vec3f(0.0),vec3f(1.0));}const EXPOSURE=0.62;@fragment fn fs_main(@location(0) a:vec2f)-> @location(0) vec4f{let b=textureSampleLevel(src,samp,a,0.0).rgb*EXPOSURE;var c=pow(aces(b),vec3f(1.0/2.2));c=(c-0.5)*1.07+0.5;c*=vec3f(1.05,1.0,0.95);let d=a-vec2f(0.5);c*=1.0-0.28*dot(d,d);return vec4f(clamp(c,vec3f(0.0),vec3f(1.0)),1.0);}" }, Il = { version: 1, wgsl: "@group(0) @binding(0) var<storage,read> inX:array<vec2f>;@group(0) @binding(1) var<storage,read> inY:array<vec2f>;@group(0) @binding(2) var<storage,read> inZ:array<vec2f>;@group(0) @binding(3) var<storage,read_write> disp:array<vec4f>;var<workgroup> _vgsl_ecb896ab__shX:array<vec2f,256>;var<workgroup> _vgsl_ecb896ab__shY:array<vec2f,256>;var<workgroup> _vgsl_ecb896ab__shZ:array<vec2f,256>;fn d(a:u32,b:u32,c:f32){let h=select(1.0,-1.0,((a+b)&1u)==1u);let i=c*h;disp[b*_vgsl_11bec4f4__N+a]=vec4f(_vgsl_ecb896ab__shX[b].x*i,_vgsl_ecb896ab__shY[b].x*i,_vgsl_ecb896ab__shZ[b].x*i,0.0);}@compute @workgroup_size(128) fn fftCol(@builtin(workgroup_id) a:vec3u,@builtin(local_invocation_id) b:vec3u,){let c=a.x;let h=b.x;let i=h;let j=h+128u;let k=f(i);let l=f(j);_vgsl_ecb896ab__shX[k]=inX[i*_vgsl_11bec4f4__N+c];_vgsl_ecb896ab__shY[k]=inY[i*_vgsl_11bec4f4__N+c];_vgsl_ecb896ab__shZ[k]=inZ[i*_vgsl_11bec4f4__N+c];_vgsl_ecb896ab__shX[l]=inX[j*_vgsl_11bec4f4__N+c];_vgsl_ecb896ab__shY[l]=inY[j*_vgsl_11bec4f4__N+c];_vgsl_ecb896ab__shZ[l]=inZ[j*_vgsl_11bec4f4__N+c];workgroupBarrier();g(&_vgsl_ecb896ab__shX,&_vgsl_ecb896ab__shY,&_vgsl_ecb896ab__shZ,h);let m=1.0/f32(_vgsl_11bec4f4__N);d(c,i,m);d(c,j,m);}fn e(a:vec2f,b:vec2f)-> vec2f{return vec2f(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);}fn f(a:u32)-> u32{return reverseBits(a)>>(32u-_vgsl_11bec4f4__LOG2N);}fn g(a:ptr<workgroup,array<vec2f,256>>,b:ptr<workgroup,array<vec2f,256>>,c:ptr<workgroup,array<vec2f,256>>,h:u32,){for(var i:u32=0u;i<_vgsl_11bec4f4__LOG2N;i=i+1u){let j=1u<<i;let k=j<<1u;if(h<128u){let l=h&(j-1u);let m=(h>> i)<<(i+1u);let n=m+l;let o=n+j;let p=_vgsl_11bec4f4__TWO_PI*f32(l)/f32(k);let q=vec2f(cos(p),sin(p));let r=(*a)[n];let s=e(q,(*a)[o]);(*a)[n]=r+s;(*a)[o]=r-s;let t=(*b)[n];let u=e(q,(*b)[o]);(*b)[n]=t+u;(*b)[o]=t-u;let v=(*c)[n];let w=e(q,(*c)[o]);(*c)[n]=v+w;(*c)[o]=v-w;}workgroupBarrier();}}const _vgsl_11bec4f4__TWO_PI:f32=6.28318530718;const _vgsl_11bec4f4__N:u32=256u;const _vgsl_11bec4f4__LOG2N:u32=8u;" }, Pl = { version: 1, wgsl: "@group(0) @binding(0) var<storage,read> inX:array<vec2f>;@group(0) @binding(1) var<storage,read> inY:array<vec2f>;@group(0) @binding(2) var<storage,read> inZ:array<vec2f>;@group(0) @binding(3) var<storage,read_write> outX:array<vec2f>;@group(0) @binding(4) var<storage,read_write> outY:array<vec2f>;@group(0) @binding(5) var<storage,read_write> outZ:array<vec2f>;var<workgroup> _vgsl_6ae2dc4f__shX:array<vec2f,256>;var<workgroup> _vgsl_6ae2dc4f__shY:array<vec2f,256>;var<workgroup> _vgsl_6ae2dc4f__shZ:array<vec2f,256>;@compute @workgroup_size(128) fn fftRow(@builtin(workgroup_id) a:vec3u,@builtin(local_invocation_id) b:vec3u,){let c=a.x*_vgsl_11bec4f4__N;let g=b.x;let h=g;let i=g+128u;let j=e(h);let k=e(i);_vgsl_6ae2dc4f__shX[j]=inX[c+h];_vgsl_6ae2dc4f__shY[j]=inY[c+h];_vgsl_6ae2dc4f__shZ[j]=inZ[c+h];_vgsl_6ae2dc4f__shX[k]=inX[c+i];_vgsl_6ae2dc4f__shY[k]=inY[c+i];_vgsl_6ae2dc4f__shZ[k]=inZ[c+i];workgroupBarrier();f(&_vgsl_6ae2dc4f__shX,&_vgsl_6ae2dc4f__shY,&_vgsl_6ae2dc4f__shZ,g);let l=1.0/f32(_vgsl_11bec4f4__N);outX[c+h]=_vgsl_6ae2dc4f__shX[h]*l;outY[c+h]=_vgsl_6ae2dc4f__shY[h]*l;outZ[c+h]=_vgsl_6ae2dc4f__shZ[h]*l;outX[c+i]=_vgsl_6ae2dc4f__shX[i]*l;outY[c+i]=_vgsl_6ae2dc4f__shY[i]*l;outZ[c+i]=_vgsl_6ae2dc4f__shZ[i]*l;}fn d(a:vec2f,b:vec2f)-> vec2f{return vec2f(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);}fn e(a:u32)-> u32{return reverseBits(a)>>(32u-_vgsl_11bec4f4__LOG2N);}fn f(a:ptr<workgroup,array<vec2f,256>>,b:ptr<workgroup,array<vec2f,256>>,c:ptr<workgroup,array<vec2f,256>>,g:u32,){for(var h:u32=0u;h<_vgsl_11bec4f4__LOG2N;h=h+1u){let i=1u<<h;let j=i<<1u;if(g<128u){let k=g&(i-1u);let l=(g>> h)<<(h+1u);let m=l+k;let n=m+i;let o=_vgsl_11bec4f4__TWO_PI*f32(k)/f32(j);let p=vec2f(cos(o),sin(o));let q=(*a)[m];let r=d(p,(*a)[n]);(*a)[m]=q+r;(*a)[n]=q-r;let s=(*b)[m];let t=d(p,(*b)[n]);(*b)[m]=s+t;(*b)[n]=s-t;let u=(*c)[m];let v=d(p,(*c)[n]);(*c)[m]=u+v;(*c)[n]=u-v;}workgroupBarrier();}}const _vgsl_11bec4f4__TWO_PI:f32=6.28318530718;const _vgsl_11bec4f4__N:u32=256u;const _vgsl_11bec4f4__LOG2N:u32=8u;" }, Cl = { version: 1, wgsl: "struct _vgsl_0b8034eb__IslandUniforms{viewProj:mat4x4f,camPos:vec3f,_pad0:f32,sunDir:vec3f,_pad1:f32,}@group(0) @binding(0) var<uniform> u:_vgsl_0b8034eb__IslandUniforms;struct _vgsl_0b8034eb__VertexIn{@location(0) position:vec3f,@location(1) normal:vec3f,@location(2) color:vec3f,}struct _vgsl_0b8034eb__VertexOut{@builtin(position) clip:vec4f,@location(0) world:vec3f,@location(1) normal:vec3f,@location(2) color:vec3f,}@vertex fn vs_main(b:_vgsl_0b8034eb__VertexIn)-> _vgsl_0b8034eb__VertexOut{var c:_vgsl_0b8034eb__VertexOut;c.clip=u.viewProj*vec4f(b.position,1.0);c.world=b.position;c.normal=b.normal;c.color=b.color;return c;}@fragment fn fs_main(b:_vgsl_0b8034eb__VertexOut)-> @location(0) vec4f{let c=normalize(b.normal);let d=normalize(u.sunDir);let e=normalize(u.camPos-b.world);let f=max(dot(c,d),0.0);let g=0.32+max(c.y,0.0)*0.34;let h=normalize(d+e);let i=pow(max(dot(c,h),0.0),34.0)*0.16;var color=b.color*(g+f*0.72);color+=vec3f(1.0,0.66,0.34)*i;let j=length(u.camPos-b.world);let k=smoothstep(205.0,420.0,j);let l=normalize(b.world-u.camPos);let m=a(normalize(vec3f(l.x,0.04,l.z)),u.sunDir);color=mix(color,m,k*0.82);return vec4f(color,1.0);}fn a(b:vec3f,c:vec3f)-> vec3f{let d=normalize(b);let e=normalize(c);let f=clamp(d.y,0.0,1.0);let g=vec3f(1.15,0.44,0.19);let h=vec3f(0.05,0.08,0.22);var i=mix(g,h,pow(f,0.5));let j=exp(-abs(d.y)*7.0);i+=vec3f(0.45,0.15,0.04)*j;let k=clamp(-d.y,0.0,1.0);i=mix(i,vec3f(0.18,0.08,0.09),k*0.75);let l=max(dot(d,e),0.0);i+=vec3f(1.35,0.62,0.24)*pow(l,12.0)*0.55;i+=vec3f(1.5,0.85,0.42)*pow(l,170.0)*1.5;let m=smoothstep(0.9993,0.9997,l);i+=vec3f(1.7,1.05,0.6)*m*4.5;return i;}" }, Tl = { version: 1, wgsl: "override GRID:u32=512u;const _vgsl_0abb0aa1__NU:u32=256u;struct _vgsl_0abb0aa1__Ocean{viewProj:mat4x4f,camPos:vec3f,worldSize:f32,sunDir:vec3f,patchSize:f32,heightScale:f32,choppyScale:f32,foamScale:f32,_pad:f32,}@group(0) @binding(0) var<uniform> u:_vgsl_0abb0aa1__Ocean;@group(0) @binding(1) var disp:texture_2d<f32>;@group(0) @binding(2) var dispSamp:sampler;fn a(d:vec2f)-> vec3f{return textureSampleLevel(disp,dispSamp,d,0.0).xyz;}fn b(d:vec3f)-> vec3f{return vec3f(d.x*u.choppyScale,d.y*u.heightScale,d.z*u.choppyScale);}struct _vgsl_0abb0aa1__VOut{@builtin(position) clip:vec4f,@location(0) world:vec3f,@location(1) uv:vec2f,}@vertex fn vs_main(@builtin(vertex_index) d:u32)-> _vgsl_0abb0aa1__VOut{let e=d/6u;let f=d%6u;let g=e%GRID;let h=e/GRID;var i=array<vec2u,6>(vec2u(0u,0u),vec2u(1u,0u),vec2u(0u,1u),vec2u(0u,1u),vec2u(1u,0u),vec2u(1u,1u),);let j=i[f];let k=vec2f(f32(g+j.x),f32(h+j.y))/f32(GRID);let l=(k-0.5)*u.worldSize;let uv=l/u.patchSize;let world=vec3f(l.x,0.0,l.y)+b(a(uv));var m:_vgsl_0abb0aa1__VOut;m.clip=u.viewProj*vec4f(world,1.0);m.world=world;m.uv=uv;return m;}@fragment fn fs_main(@location(0) d:vec3f,@location(1) e:vec2f)-> @location(0) vec4f{let f=1.0/f32(_vgsl_0abb0aa1__NU);let g=u.patchSize/f32(_vgsl_0abb0aa1__NU);let h=a(e);let i=a(e+vec2f(f,0.0));let j=a(e+vec2f(0.0,f));let k=vec3f(g+(i.x-h.x)*u.choppyScale,(i.y-h.y)*u.heightScale,(i.z-h.z)*u.choppyScale,);let l=vec3f((j.x-h.x)*u.choppyScale,(j.y-h.y)*u.heightScale,g+(j.z-h.z)*u.choppyScale,);var m=normalize(cross(l,k));if(m.y<0.0){m=-m;}let n=(i.x-h.x)*u.choppyScale/g;let o=(j.z-h.z)*u.choppyScale/g;let p=(j.x-h.x)*u.choppyScale/g;let q=(i.z-h.z)*u.choppyScale/g;let r=(1.0+n)*(1.0+o)-p*q;let s=smoothstep(u.foamScale,u.foamScale*0.35,r);let t=normalize(u.camPos-d);let v=normalize(u.sunDir);let w=length(u.camPos-d);let A=reflect(-t,m);let B=c(A,u.sunDir);let C=0.02;let D=C+(1.0-C)*pow(1.0-max(dot(m,t),0.0),5.0);let E=max(dot(m,t),0.0);let F=vec3f(0.002,0.028,0.055);let G=vec3f(0.03,0.16,0.19);var H=mix(F,G,pow(E,0.5));let I=clamp(d.y*0.06+0.35,0.0,1.0);let J=pow(max(dot(t,-v),0.0),3.0)*I;H+=vec3f(0.95,0.34,0.14)*J*0.8;let K=mix(0.03,0.92,D);var L=mix(H,B,K);let M=normalize(v+t);let N=pow(max(dot(m,M),0.0),600.0);L+=vec3f(1.8,1.1,0.62)*N*4.5;L=mix(L,vec3f(0.96,0.90,0.84),s);let O=normalize(d-u.camPos);let P=c(normalize(vec3f(O.x,0.04,O.z)),u.sunDir);let Q=smoothstep(u.worldSize*0.42,u.worldSize*0.62,w);L=mix(L,P,Q);return vec4f(L,1.0);}fn c(d:vec3f,e:vec3f)-> vec3f{let f=normalize(d);let g=normalize(e);let h=clamp(f.y,0.0,1.0);let i=vec3f(1.15,0.44,0.19);let j=vec3f(0.05,0.08,0.22);var k=mix(i,j,pow(h,0.5));let l=exp(-abs(f.y)*7.0);k+=vec3f(0.45,0.15,0.04)*l;let m=clamp(-f.y,0.0,1.0);k=mix(k,vec3f(0.18,0.08,0.09),m*0.75);let n=max(dot(f,g),0.0);k+=vec3f(1.35,0.62,0.24)*pow(n,12.0)*0.55;k+=vec3f(1.5,0.85,0.42)*pow(n,170.0)*1.5;let o=smoothstep(0.9993,0.9997,n);k+=vec3f(1.7,1.05,0.6)*o*4.5;return k;}" }, Fl = { version: 1, wgsl: "struct _vgsl_e87a9f00__Sky{viewProj:mat4x4f,camPos:vec3f,radius:f32,sunDir:vec3f,_pad:f32,}@group(0) @binding(0) var<uniform> u:_vgsl_e87a9f00__Sky;struct _vgsl_e87a9f00__VOut{@builtin(position) clip:vec4f,@location(0) dir:vec3f,}@vertex fn vs_main(@location(0) b:vec3f)-> _vgsl_e87a9f00__VOut{var c:_vgsl_e87a9f00__VOut;let d=b*u.radius+u.camPos;c.clip=u.viewProj*vec4f(d,1.0);c.dir=normalize(b);return c;}@fragment fn fs_main(@location(0) b:vec3f)-> @location(0) vec4f{return vec4f(a(b,u.sunDir),1.0);}fn a(b:vec3f,c:vec3f)-> vec3f{let d=normalize(b);let e=normalize(c);let f=clamp(d.y,0.0,1.0);let g=vec3f(1.15,0.44,0.19);let h=vec3f(0.05,0.08,0.22);var i=mix(g,h,pow(f,0.5));let j=exp(-abs(d.y)*7.0);i+=vec3f(0.45,0.15,0.04)*j;let k=clamp(-d.y,0.0,1.0);i=mix(i,vec3f(0.18,0.08,0.09),k*0.75);let l=max(dot(d,e),0.0);i+=vec3f(1.35,0.62,0.24)*pow(l,12.0)*0.55;i+=vec3f(1.5,0.85,0.42)*pow(l,170.0)*1.5;let m=smoothstep(0.9993,0.9997,l);i+=vec3f(1.7,1.05,0.6)*m*4.5;return i;}" }, Fr = { version: 1, wgsl: "@group(0) @binding(0) var<storage,read_write> h0:array<vec4f>;@group(0) @binding(1) var<uniform> sim:_vgsl_11bec4f4__SimParams;fn a(e:u32)-> u32{var f=e;f^=f>>16u;f*=0x7feb352du;f^=f>>15u;f*=0x846ca68bu;f^=f>>16u;return f;}fn b(e:vec2u,f:u32)-> f32{let g=a(e.x*1973u+e.y*9277u+f*26699u+1u);return f32(g)*(1.0/4294967296.0);}fn c(e:vec2u)-> vec2f{let f=max(b(e,0u),1e-6);let g=b(e,1u);let h=sqrt(-2.0*log(f));return vec2f(h*cos(_vgsl_11bec4f4__TWO_PI*g),h*sin(_vgsl_11bec4f4__TWO_PI*g));}fn d(e:vec2f)-> f32{let f=length(e);if(f<1e-4){return 0.0;}let g=f*f;let h=sim.windSpeed*sim.windSpeed/_vgsl_11bec4f4__GRAVITY;let i=e/f;let j=dot(i,normalize(sim.windDir));var k=sim.amplitude*exp(-1.0/(g*h*h))/(g*g);k*=j*j;let l=sim.patchSize/2000.0;k*=exp(-g*l*l);if(j<0.0){k*=0.07;}return k;}@compute @workgroup_size(8,8) fn init(@builtin(global_invocation_id) e:vec3u){let x=e.x;let f=e.y;if(x>=_vgsl_11bec4f4__N||f>=_vgsl_11bec4f4__N){return;}let g=f*_vgsl_11bec4f4__N+x;let h=f32(i32(x)-i32(_vgsl_11bec4f4__N)/2);let i=f32(i32(f)-i32(_vgsl_11bec4f4__N)/2);let j=_vgsl_11bec4f4__TWO_PI*vec2f(h,i)/sim.patchSize;let k=d(j);let l=d(-j);let m=sqrt(k*0.5)*c(vec2u(x,f));let n=(_vgsl_11bec4f4__N-x)%_vgsl_11bec4f4__N;let o=(_vgsl_11bec4f4__N-f)%_vgsl_11bec4f4__N;let p=sqrt(l*0.5)*c(vec2u(n,o));h0[g]=vec4f(m,vec2f(p.x,-p.y));}const _vgsl_11bec4f4__TWO_PI:f32=6.28318530718;const _vgsl_11bec4f4__N:u32=256u;const _vgsl_11bec4f4__GRAVITY:f32=9.81;struct _vgsl_11bec4f4__SimParams{windDir:vec2f,windSpeed:f32,amplitude:f32,patchSize:f32,time:f32,_pad:vec2f,}" }, Al = { version: 1, wgsl: "@group(0) @binding(0) var<storage,read> h0:array<vec4f>;@group(0) @binding(1) var<storage,read_write> specX:array<vec2f>;@group(0) @binding(2) var<storage,read_write> specY:array<vec2f>;@group(0) @binding(3) var<storage,read_write> specZ:array<vec2f>;@group(0) @binding(4) var<uniform> sim:_vgsl_11bec4f4__SimParams;fn c(a:vec2f,b:vec2f)-> vec2f{return vec2f(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);}fn d(a:f32)-> vec2f{return vec2f(cos(a),sin(a));}@compute @workgroup_size(8,8) fn update(@builtin(global_invocation_id) a:vec3u){let x=a.x;let b=a.y;if(x>=_vgsl_11bec4f4__N||b>=_vgsl_11bec4f4__N){return;}let e=b*_vgsl_11bec4f4__N+x;let f=f32(i32(x)-i32(_vgsl_11bec4f4__N)/2);let g=f32(i32(b)-i32(_vgsl_11bec4f4__N)/2);let h=_vgsl_11bec4f4__TWO_PI*vec2f(f,g)/sim.patchSize;let i=length(h);let j=h0[e];let k=j.xy;let l=j.zw;let m=sqrt(_vgsl_11bec4f4__GRAVITY*i);let n=d(m*sim.time);let o=vec2f(n.x,-n.y);let p=c(k,n)+c(l,o);specY[e]=p;let q=select(vec2f(0.0),h/i,i>1e-6);let r=vec2f(p.y,-p.x);specX[e]=r*q.x;specZ[e]=r*q.y;}const _vgsl_11bec4f4__TWO_PI:f32=6.28318530718;const _vgsl_11bec4f4__N:u32=256u;const _vgsl_11bec4f4__GRAVITY:f32=9.81;struct _vgsl_11bec4f4__SimParams{windDir:vec2f,windSpeed:f32,amplitude:f32,patchSize:f32,time:f32,_pad:vec2f,}" }, Ml = {
  fov: 48,
  near: 1,
  far: 8e3,
  position: [0, 24, 128],
  target: [0, 5, 0]
}, Ll = {
  windSpeed: 24,
  windAngle: 18,
  amplitude: 4,
  patchSize: 265,
  heightScale: 34,
  choppyScale: 14,
  foamScale: 0.5,
  sunElevation: 6.5,
  sunAzimuth: 236,
  timeScale: 1
}, R = 256, ve = R * R * 2 * 4, Rt = R * R * 4 * 4, Vt = 512, Gl = 1e3, Dl = 6e3, Nt = Math.PI / 180, Ul = [0.02, 0.02, 0.04, 1];
function Rl(t, e) {
  const n = /* @__PURE__ */ new Set(), r = (s) => (n.add(s), s), i = (s) => {
    n.delete(s), s.destroy();
  };
  try {
    let s = function(P, L, U = u()) {
      return {
        viewProj: P,
        camPos: L,
        worldSize: Gl,
        sunDir: U,
        patchSize: a.patchSize,
        heightScale: a.heightScale,
        choppyScale: a.choppyScale,
        foamScale: a.foamScale
      };
    }, o = function(P, L, U = u()) {
      return { viewProj: P, camPos: L, sunDir: U };
    };
    const a = { ...Ll }, c = () => {
      const P = a.windAngle * Nt;
      return [Math.cos(P), Math.sin(P)];
    }, u = () => {
      const P = a.sunElevation * Nt, L = a.sunAzimuth * Nt;
      return [Math.cos(P) * Math.cos(L), Math.sin(P), Math.cos(P) * Math.sin(L)];
    }, l = (P) => ({
      windDir: c(),
      windSpeed: a.windSpeed,
      amplitude: a.amplitude,
      patchSize: a.patchSize,
      time: P
    }), f = (P, L, U = u()) => ({
      viewProj: P,
      camPos: L,
      radius: Dl,
      sunDir: U
    });
    let d = r(q(t, Rt, "read-write"));
    const p = r(q(t, ve, "read-write")), g = r(q(t, ve, "read-write")), m = r(q(t, ve, "read-write")), v = r(q(t, ve, "read-write")), y = r(q(t, ve, "read-write")), x = r(q(t, ve, "read-write")), E = r(q(t, Rt, "read-write")), $ = _e(t, Fr, {
      set: { h0: d, sim: l(0) }
    }), _ = _e(t, Al, {
      set: { h0: d, specX: p, specY: g, specZ: m, sim: l(0) }
    }), M = _e(t, Pl, {
      set: {
        inX: p,
        inY: g,
        inZ: m,
        outX: v,
        outY: y,
        outZ: x
      }
    }), V = _e(t, Il, {
      set: { inX: v, inY: y, inZ: x, disp: E }
    }), h = r(mt(t, { size: [R, R], format: "rgba16float" })), b = Ht(t, {
      addressModeU: "repeat",
      addressModeV: "repeat",
      minFilter: "linear",
      magFilter: "linear"
    }), S = Qt(t, El, {
      set: { disp: E }
    }), I = r(jt(t, cl({ radius: 1 }))), C = new Float32Array(16), ye = pt(t, {
      shader: Fl,
      geometry: I,
      cull: "front",
      set: { u: f(C, [0, 0, 0]) }
    }), xe = pt(t, {
      shader: Tl,
      cull: "none",
      constants: { GRID: Vt },
      vertices: 6 * Vt * Vt,
      set: {
        u: s(C, [0, 0, 0]),
        disp: h,
        dispSamp: b
      }
    }), te = ts(), Tt = r(
      jt(t, {
        label: "sw-capital-islands",
        buffers: [
          {
            data: te.buffer,
            stride: 36,
            attributes: {
              position: "float32x3",
              normal: "float32x3",
              color: "float32x3"
            }
          }
        ]
      })
    ), Xe = pt(t, {
      shader: Cl,
      geometry: Tt,
      cull: "none",
      set: {
        u: o(C, [0, 0, 0])
      }
    });
    let O = r(
      mt(t, {
        size: [e[0], e[1]],
        format: "rgba16float",
        depth: !0
      })
    );
    const yn = Ht(t, {
      minFilter: "linear",
      magFilter: "linear"
    }), xn = Qt(t, $l, {
      set: { src: O, samp: yn }
    });
    let vn = 0, Sn = !1;
    return $.set({ sim: l(0) }), $.dispatch(R / 8, R / 8), {
      params: a,
      get hdr() {
        return O;
      },
      skydome: ye,
      ocean: xe,
      islands: Xe,
      composite: xn,
      clear: Ul,
      rebuildSpectrum() {
        const P = r(q(t, Rt, "read-write"));
        try {
          _e(t, Fr, {
            set: { h0: P, sim: l(0) }
          }).dispatch(R / 8, R / 8), _.set({ h0: P });
        } catch (U) {
          zt(U, () => i(P));
        }
        const L = d;
        d = P, i(L);
      },
      simulate(P) {
        vn += P * a.timeScale, _.set({ sim: l(vn) }), _.dispatch(R / 8, R / 8), M.dispatch(R, 1), V.dispatch(R, 1), S.draw(h);
      },
      updateCamera(P, L) {
        const U = [L[0], L[1], L[2]], Me = u();
        ye.set({ u: f(P, U, Me) }), xe.set({ u: s(P, U, Me) }), Xe.set({ u: o(P, U, Me) });
      },
      resize(P) {
        if (O.size[0] === P[0] && O.size[1] === P[1]) return;
        const L = r(
          mt(t, {
            size: [P[0], P[1]],
            format: "rgba16float",
            depth: !0
          })
        );
        try {
          xn.set({ src: L, samp: yn });
        } catch (Me) {
          zt(Me, () => i(L));
        }
        const U = O;
        O = L, i(U);
      },
      destroy() {
        if (Sn) return;
        Sn = !0;
        const P = [...n].reverse();
        n.clear(), Ar(P);
      }
    };
  } catch (s) {
    zt(s, () => Ar([...n].reverse()));
  }
}
function Ar(t) {
  const e = [];
  for (const n of t)
    try {
      n.destroy();
    } catch (r) {
      e.push(r);
    }
  if (e.length) throw e[0];
}
function zt(t, e) {
  try {
    e();
  } catch {
  }
  throw t;
}
function Vl({ canvas: t, onView: e }) {
  let n = !1, r = !1, i, s, o, a, c, u;
  function l() {
    n || (n = !0, Nl([() => c?.stop(), () => u?.(), () => i?.dispose()]));
  }
  function f(y) {
    r = !0;
    try {
      l();
    } catch {
    }
    throw y;
  }
  function d(y) {
    try {
      return y();
    } catch (x) {
      return f(x);
    }
  }
  function p() {
    a && e({
      viewProjection: a.viewProjection,
      size: [Math.max(1, t.clientWidth), Math.max(1, t.clientHeight)]
    });
  }
  function g() {
    d(() => {
      !o || !a || !s || (o.resize(s.size), a.set({ aspect: s.size[0] / s.size[1] }), p());
    });
  }
  return { ready: (async () => {
    const { init: y } = await Promise.resolve().then(() => Jf);
    if (n) return;
    const x = await y();
    if (n) {
      x.dispose();
      return;
    }
    i = x, s = Di(i, t, { dpr: [1, 2] }), o = Rl(i, s.size), a = _l({
      ...Ml,
      aspect: s.size[0] / s.size[1]
    }), u = s.onResize(g), p();
    const E = Zi(i);
    c = Qi(i, ($) => {
      d(() => {
        n || !s || !o || !a || (o.simulate(E.deltaTime), o.updateCamera(a.viewProjection, a.worldPosition), $.pass({ target: o.hdr, clear: o.clear }, (_) => {
          _.draw(o.skydome), _.draw(o.ocean), _.draw(o.islands);
        }), $.pass(s, o.composite));
      });
    });
  })().catch((y) => {
    n && !r || f(y);
  }), dispose: l };
}
function Nl(t) {
  const e = [];
  for (const n of t)
    try {
      n();
    } catch (r) {
      e.push(r);
    }
  if (e.length) throw e[0];
}
const ot = document.body, Mr = document.querySelector("#ocean-canvas"), zl = new Map(
  [...document.querySelectorAll("[data-island]")].map((t) => [t.dataset.island, t])
);
function Ol({ viewProjection: t, size: e }) {
  for (const n of Gr) {
    const r = zl.get(n.id);
    if (!r) continue;
    const [i, s] = Bl(n.anchor, t, e), o = Math.max(88, r.offsetWidth / 2), a = Lr(i, o + 10, e[0] - o - 10), c = Lr(s, 138, e[1] - 110);
    r.style.setProperty("--island-left", `${a.toFixed(2)}px`), r.style.setProperty("--island-top", `${c.toFixed(2)}px`);
  }
}
function Bl(t, e, n) {
  const [r, i, s] = t, o = e[0] * r + e[4] * i + e[8] * s + e[12], a = e[1] * r + e[5] * i + e[9] * s + e[13], c = e[3] * r + e[7] * i + e[11] * s + e[15], u = c === 0 ? 1 : 1 / c;
  return [(o * u * 0.5 + 0.5) * n[0], (-a * u * 0.5 + 0.5) * n[1]];
}
function Lr(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
const jl = "gpu" in navigator && !!navigator.gpu;
if (!Mr || !jl)
  ot.dataset.ocean = "fallback";
else {
  const t = Vl({ canvas: Mr, onView: Ol });
  try {
    await t.ready, requestAnimationFrame(() => {
      ot.dataset.ocean = "ready", ot.dataset.islands = "ready";
    }), window.addEventListener("pagehide", () => t.dispose(), { once: !0 });
  } catch (e) {
    console.error("The live ocean could not start.", e), ot.dataset.ocean = "fallback", t.dispose();
  }
}
