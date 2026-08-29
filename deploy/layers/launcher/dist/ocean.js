const ee = [
  {
    id: "manifest",
    anchor: [30, -54],
    scale: 2.4,
    light: [1, 0.85, 0.6],
    blinkPeriod: 2.4,
    yawRate: 0.05
  },
  {
    id: "prolimo",
    anchor: [-2, 10],
    scale: 2,
    light: [0.35, 1, 0.45],
    blinkPeriod: 3,
    yawRate: -0.07
  },
  {
    id: "plateops",
    anchor: [29, 24],
    scale: 1.75,
    light: [1, 0.28, 0.2],
    blinkPeriod: 2.7,
    yawRate: 0.06
  }
], to = 16, no = 3, ro = 1 / 256, ar = 20, cr = 9.81;
function io(e) {
  const t = (c) => [
    c.anchor[0] / e.patchSize,
    c.anchor[1] / e.patchSize
  ], [n, r] = t(ee[0]), [i, s] = t(ee[1]), [o, a] = t(ee[2]);
  return {
    anchorA: [n, r, i, s],
    anchorB: [o, a, ro, 0]
  };
}
function so(e, t) {
  const n = ee.map(() => ({
    wl: 0,
    vy: 0,
    x: 0,
    z: 0,
    up: [0, 1, 0],
    yaw: 0,
    lastWater: 0,
    waterVel: 0,
    hasWater: !1,
    agitation: 0
  })), r = new Float32Array(ee.length * ar), i = new Float32Array(ee.length * 8), s = /* @__PURE__ */ new Map();
  let o = 0;
  function a(c, u, l, f) {
    const d = Math.min(Math.max(c, 0), 0.05);
    o += d;
    for (let m = 0; m < ee.length; m++) {
      const g = ee[m], h = n[m];
      let S = 0, x = 0, w = 0, $ = [0, 1, 0];
      if (u) {
        const M = m * no * 4, F = [u[M], u[M + 1], u[M + 2]], ke = [u[M + 4], u[M + 5], u[M + 6]], Q = [u[M + 8], u[M + 9], u[M + 10]];
        S = F[0] * l.choppyScale, w = F[1] * l.heightScale, x = F[2] * l.choppyScale;
        const pe = l.patchSize / 256, ae = [
          pe + (ke[0] - F[0]) * l.choppyScale,
          (ke[1] - F[1]) * l.heightScale,
          (ke[2] - F[2]) * l.choppyScale
        ], ce = [
          (Q[0] - F[0]) * l.choppyScale,
          (Q[1] - F[1]) * l.heightScale,
          pe + (Q[2] - F[2]) * l.choppyScale
        ];
        let me = ce[1] * ae[2] - ce[2] * ae[1], Ee = ce[2] * ae[0] - ce[0] * ae[2], Ge = ce[0] * ae[1] - ce[1] * ae[0];
        Ee < 0 && (me = -me, Ee = -Ee, Ge = -Ge);
        const Re = Math.hypot(me, Ee, Ge) || 1;
        $ = [me / Re, Ee / Re, Ge / Re];
      }
      if (h.hasWater || (h.wl = w, h.lastWater = w, h.hasWater = !0), f && o > 0) {
        const M = (w - h.lastWater) / o;
        h.lastWater = w, h.waterVel += (M - h.waterVel) * (1 - Math.exp(-o / 0.12));
      }
      const I = 3.4 / Math.sqrt(g.scale);
      let E = (w - h.wl) * I * I + 2 * 0.85 * I * (h.waterVel - h.vy);
      E = Math.max(-cr, Math.min(E, cr * 3)), h.vy += E * d, h.wl += h.vy * d;
      const A = w + 0.2 * g.scale, p = w - 1.1 * g.scale;
      h.wl > A ? (h.wl = A, h.vy = Math.min(h.vy, h.waterVel)) : h.wl < p && (h.wl = p, h.vy = Math.max(h.vy, h.waterVel));
      const b = 1 - Math.exp(-d / 0.2);
      h.x += (S - h.x) * b, h.z += (x - h.z) * b;
      const _ = [$[0] * 0.6, 1, $[2] * 0.6], k = 1 - Math.exp(-d / 0.3);
      h.up[0] += (_[0] - h.up[0]) * k, h.up[1] += (_[1] - h.up[1]) * k, h.up[2] += (_[2] - h.up[2]) * k, h.yaw += g.yawRate * d;
      const C = Math.min(1, Math.abs(h.vy - h.waterVel) * 0.6);
      h.agitation += (C - h.agitation) * (1 - Math.exp(-d / 0.7));
      const Z = h.wl - t * g.scale;
      oo(r, m * ar, g, h, Z), i[m * 8] = g.anchor[0], i[m * 8 + 1] = g.anchor[1], i[m * 8 + 2] = g.scale, i[m * 8 + 3] = h.agitation, i[m * 8 + 4] = g.light[0], i[m * 8 + 5] = g.light[1], i[m * 8 + 6] = g.light[2], i[m * 8 + 7] = g.blinkPeriod;
      const B = Math.hypot(h.up[0], h.up[1], h.up[2]) || 1;
      s.set(g.id, [
        g.anchor[0] + h.x + h.up[0] / B * e * g.scale,
        Z + h.up[1] / B * (e + 2.2) * g.scale,
        g.anchor[1] + h.z + h.up[2] / B * e * g.scale
      ]);
    }
    return f && (o = 0), { instanceData: r, wakeData: i, labelAnchors: s };
  }
  return { step: a };
}
function oo(e, t, n, r, i) {
  const s = Math.hypot(r.up[0], r.up[1], r.up[2]) || 1, o = [r.up[0] / s, r.up[1] / s, r.up[2] / s], a = Math.cos(r.yaw), u = [Math.sin(r.yaw), 0, a], l = u[0] * o[0] + u[1] * o[1] + u[2] * o[2];
  let f = u[0] - o[0] * l, d = u[1] - o[1] * l, m = u[2] - o[2] * l;
  const g = Math.hypot(f, d, m) || 1;
  f /= g, d /= g, m /= g;
  const h = o[1] * m - o[2] * d, S = o[2] * f - o[0] * m, x = o[0] * d - o[1] * f, w = n.scale;
  e[t + 0] = h * w, e[t + 1] = S * w, e[t + 2] = x * w, e[t + 3] = 0, e[t + 4] = o[0] * w, e[t + 5] = o[1] * w, e[t + 6] = o[2] * w, e[t + 7] = 0, e[t + 8] = f * w, e[t + 9] = d * w, e[t + 10] = m * w, e[t + 11] = 0, e[t + 12] = n.anchor[0] + r.x, e[t + 13] = i, e[t + 14] = n.anchor[1] + r.z, e[t + 15] = 1, e[t + 16] = n.light[0], e[t + 17] = n.light[1], e[t + 18] = n.light[2], e[t + 19] = n.blinkPeriod;
}
let Qt = class extends Error {
  code;
  severity;
  fix;
  where;
  cause;
  detail;
  constructor(t) {
    super(t.message, { cause: t.cause }), this.name = "VGPUError", this.code = t.code, this.severity = t.severity ?? "error", this.fix = t.fix, this.where = t.where, this.cause = t.cause, this.detail = t.detail;
  }
};
class H extends Qt {
  constructor(t) {
    super({ ...t, severity: "error" }), this.name = "ValidationError";
  }
}
function ao(e) {
  return new Qt({
    code: "VGPU-FEATURE-UNSUPPORTED",
    message: `Adapter does not support requested feature(s): ${e.map((t) => `"${t}"`).join(", ")}.`,
    fix: "Remove the unsupported name(s) from init({ requiredFeatures: [...] }) or run on an adapter that supports them; gate optional code paths on device.features after init.",
    where: "init"
  });
}
function co(e, t) {
  if (!e)
    return;
  const n = (t ?? []).filter((r) => !e.has(r));
  if (n.length)
    throw ao(n);
}
const uo = {
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
function gt(e) {
  const t = globalThis.GPUBufferUsage;
  return e.reduce((n, r) => n | fo(r, t), 0);
}
function fo(e, t) {
  const n = e.toUpperCase();
  return t?.[n] ?? uo[e];
}
function ur() {
  return globalThis.GPUMapMode?.READ ?? 1;
}
const lo = {
  copy_src: 1,
  copy_dst: 2,
  texture_binding: 4,
  storage_binding: 8,
  render_attachment: 16
};
function ho(e) {
  const t = globalThis.GPUTextureUsage;
  return e.reduce((n, r) => n | po(r, t), 0);
}
function po(e, t) {
  const n = e.toUpperCase();
  return t?.[n] ?? lo[e];
}
function Ti(e) {
  return "__vgpuMockBytes" in e;
}
function fr(e) {
  return "__vgpuMockBytes" in e;
}
let mo = 1;
function Jt(e) {
  return Object.freeze({ kind: e, id: mo++ });
}
class en {
  callbacks = /* @__PURE__ */ new Set();
  destroyed = !1;
  onDestroy(t, n) {
    return this.destroyed ? (n(t), () => {
    }) : (this.callbacks.add(n), () => {
      this.callbacks.delete(n);
    });
  }
  emit(t) {
    if (this.destroyed)
      return !1;
    this.destroyed = !0;
    const n = [...this.callbacks];
    this.callbacks.clear();
    for (const r of n)
      r(t);
    return !0;
  }
}
class ve {
  device;
  gpu;
  options;
  ownership;
  destroySignal = new en();
  identity = Jt("buffer");
  destroyed = !1;
  constructor(t, n, r, i = "owned") {
    this.device = t, this.gpu = n, this.options = r, this.ownership = i, Object.defineProperty(this, "assertUsable", { value: (s) => this.#e(s) });
  }
  get resourceIdentity() {
    return this.identity;
  }
  onDestroy(t) {
    return this.destroySignal.onDestroy(this, t);
  }
  #e(t = "Buffer") {
    if (this.destroyed)
      throw new H({
        code: "VGPU-BUFFER-DISPOSED",
        message: "Buffer is destroyed.",
        where: t,
        fix: "Wrap or create a live GPUBuffer before using it."
      });
    this.device.assertUsable(t);
  }
  write(t, n = 0) {
    this.#e("Buffer.write"), this.ownership === "external" && this.validateExternalOperation("write", n, t.byteLength, "copy_dst");
    try {
      this.device.queue.writeBuffer(this.gpu, n, t);
    } catch (r) {
      throw this.ownership !== "external" ? r : St("Buffer.write", "The external GPUBuffer rejected the write operation.", r);
    }
  }
  async read(t, n = 0) {
    this.#e("Buffer.read"), this.ownership === "external" && this.validateExternalOperation("read", n, t, "copy_src");
    try {
      const r = await this.device.readback.read(this.gpu, t, n);
      return this.#e("Buffer.read"), r;
    } catch (r) {
      throw r instanceof H || this.ownership !== "external" ? r : St("Buffer.read", "The external GPUBuffer rejected the read operation.", r);
    }
  }
  destroy() {
    this.destroyed || (this.destroyed = !0, this.destroySignal.emit(this), this.ownership === "owned" && !Ti(this.gpu) && this.gpu.destroy());
  }
  dispose() {
    this.destroy();
  }
  validateExternalOperation(t, n, r, i) {
    if (!(Number.isSafeInteger(n) && n >= 0 && n % 4 === 0 && Number.isSafeInteger(r) && r >= 0 && r % 4 === 0 && n <= this.options.size && r <= this.options.size - n))
      throw St(`Buffer.${t}`, "External buffer offsets and lengths must be non-negative, 4-byte aligned, and within the buffer size.");
    if ((this.gpu.usage & gt([i])) === 0)
      throw St(`Buffer.${t}`, `External buffer is missing ${i.toUpperCase()} usage.`);
  }
}
function St(e, t, n) {
  return new H({
    code: "VGPU-EXTERNAL-BUFFER-VALIDATION",
    message: t,
    where: e,
    cause: n,
    fix: "Use a buffer with the required usage flags and an aligned in-range operation."
  });
}
function go(e) {
  if (wo(e))
    throw xo();
  const t = { version: 1, mappings: [] }, n = {
    version: 1,
    modules: [{ path: "<runtime>", text: e }],
    diagnostics: [],
    sourceMap: t,
    cacheKey: bo(e)
  };
  return {
    kind: "wgsl",
    wgsl: e,
    source: { text: e, path: "<runtime>", imports: [] },
    ast: n,
    sourceMap: t,
    diagnostics: [],
    cacheKey: n.cacheKey,
    entryPoints: yo(e),
    stats: { lines: e.split(/\r?\n/).length, bytes: new TextEncoder().encode(e).byteLength, bindGroups: 0 }
  };
}
function bo(e) {
  let t = 2166136261;
  for (let n = 0; n < e.length; n++)
    t = Math.imul(t ^ e.charCodeAt(n), 16777619);
  return { default: `vgpu-wgsl-1:${(t >>> 0).toString(16).padStart(8, "0")}` };
}
function yo(e) {
  const t = [], n = /@(vertex|fragment|compute)\s+fn\s+([A-Za-z_][A-Za-z0-9_]*)/g;
  for (const r of e.matchAll(n))
    t.push(r[2]);
  return t;
}
function wo(e) {
  const t = e.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").trimStart();
  return t.startsWith("import ") || t.startsWith("import{");
}
function xo() {
  const e = new Error("Runtime WGSL strings cannot contain import statements. Use a build-time loader or @vgpu/wgsl/runtime.");
  return e.name = "VGPUWGSLRuntimeImportError", e.code = "VGPU-WGSL-RUNTIME-IMPORT", e.severity = "error", e.source = "wgsl", e;
}
const lr = gt(["copy_dst", "map_read"]);
class vo {
  device;
  constructor(t) {
    this.device = t;
  }
  async read(t, n, r) {
    if (Ti(t))
      return t.__vgpuMockBytes.slice(r, r + n).buffer;
    const i = this.device.createBuffer({
      size: n,
      usage: lr
    });
    try {
      const s = this.device.createCommandEncoder();
      s.copyBufferToBuffer(t, r, i, 0, n), this.device.queue.submit([s.finish()]), await i.mapAsync(ur());
      const o = i.getMappedRange().slice(0);
      return dr(i), o;
    } finally {
      hr(i);
    }
  }
  async readTexture(t, n, r) {
    const [i, s] = n, o = Bt(r, "Readback.readTexture"), a = o.bytesPerPixel, c = So(i * a, 256), u = c * s, l = this.device.createBuffer({ size: u, usage: lr });
    let f;
    try {
      const d = this.device.createCommandEncoder();
      d.copyTextureToBuffer({ texture: t }, { buffer: l, bytesPerRow: c, rowsPerImage: s }, { width: i, height: s }), this.device.queue.submit([d.finish()]), await l.mapAsync(ur());
      const m = new Uint8Array(l.getMappedRange());
      f = new Uint8Array(i * s * a);
      for (let g = 0; g < s; g++) {
        const h = g * c, S = g * i * a;
        f.set(m.subarray(h, h + i * a), S);
      }
      dr(l);
    } finally {
      hr(l);
    }
    return o.swizzle === "bgra-to-rgba" && Ci(f), f;
  }
  destroy() {
  }
}
function dr(e) {
  try {
    e.unmap();
  } catch {
  }
}
function hr(e) {
  try {
    e.destroy();
  } catch {
  }
}
function So(e, t) {
  return Math.ceil(e / t) * t;
}
const pr = {
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
function Bt(e, t) {
  const n = pr[e];
  if (n)
    return n;
  throw new H({
    code: "VGPU-CORE-UNSUPPORTED-FORMAT",
    message: `Texture.read does not support format ${e}. Supported formats: ${Object.keys(pr).join(", ")}.`,
    where: t
  });
}
function _o(e, t, n = "Texture.readFloats") {
  const r = Bt(t, n), i = r.bytesPerPixel / r.components, s = Math.floor(e.byteLength / i), o = new Float32Array(s), a = new DataView(e.buffer, e.byteOffset, e.byteLength);
  for (let c = 0; c < s; c++)
    r.componentType === "unorm8" ? o[c] = a.getUint8(c) / 255 : r.componentType === "float16" ? o[c] = ko(a.getUint16(c * 2, !0)) : o[c] = a.getFloat32(c * 4, !0);
  return o;
}
function ko(e) {
  const t = e & 32768 ? -1 : 1, n = e >> 10 & 31, r = e & 1023;
  return n === 0 ? t * r * 2 ** -24 : n === 31 ? r === 0 ? t * Number.POSITIVE_INFINITY : Number.NaN : t * (r + 1024) * 2 ** (n - 25);
}
function Eo(e, t, n) {
  const r = e.slice(0, t[0] * t[1] * n.bytesPerPixel);
  return n.swizzle === "bgra-to-rgba" && Ci(r), r;
}
function Ci(e) {
  for (let t = 0; t < e.length; t += 4) {
    const n = e[t];
    e[t] = e[t + 2], e[t + 2] = n;
  }
}
function $o(e) {
  return { size: e, usage: gt(["copy_src", "copy_dst"]) };
}
class Io {
  gpu;
  guard;
  constructor(t, n = () => {
  }) {
    this.gpu = t, this.guard = n;
  }
  writeBuffer(t, n, r) {
    this.guard("Queue.writeBuffer"), this.gpu.writeBuffer(t, n, r);
  }
  async flush() {
    this.guard("Queue.flush"), await this.gpu.onSubmittedWorkDone?.(), this.guard("Queue.flush");
  }
}
class Po {
  gpu;
  resolved;
  constructor(t, n) {
    this.gpu = t, this.resolved = n;
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
const To = /* @__PURE__ */ Symbol.for("vgpu/Texture"), Co = /* @__PURE__ */ Symbol.for("vgpu/Texture/resizeLock");
class He {
  device;
  ownership;
  [To] = !0;
  destroySignal = new en();
  identity = Jt("texture");
  currentGpu;
  currentOptions;
  defaultView = null;
  resizeLock;
  destroyed = !1;
  constructor(t, n, r, i = "owned") {
    this.device = t, this.ownership = i, this.currentGpu = n, this.currentOptions = r, Object.defineProperty(this, Co, {
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
  onDestroy(t) {
    return this.destroySignal.onDestroy(this, t);
  }
  get view() {
    return this.assertAlive(), this.defaultView ??= this.createView(), this.defaultView;
  }
  createView(t) {
    return this.assertAlive("Texture.createView"), this.gpu.createView(t);
  }
  resize(t) {
    if (this.assertAlive(), this.ownership === "external")
      throw new H({
        code: "VGPU-CORE-EXTERNAL-TEXTURE",
        message: "Texture wraps an externally owned GPUTexture and cannot be resized.",
        where: "Texture.resize"
      });
    if (this.resizeLock)
      throw new H({
        code: "VGPU-CORE-TEXTURE-RESIZE-LOCKED",
        message: this.resizeLock,
        where: "Texture.resize"
      });
    const n = this.options.size[2] ?? 1, r = t[2] ?? n;
    if (this.options.size[0] === t[0] && this.options.size[1] === t[1] && n === r)
      return !1;
    const i = t[2] === void 0 && this.options.size[2] === void 0 ? [t[0], t[1]] : [t[0], t[1], r], s = { ...this.options, size: i }, o = this.gpu;
    return this.currentGpu = this.device.gpu.createTexture(Mi(s)), this.currentOptions = s, this.defaultView = null, o.destroy(), !0;
  }
  /**
   * Raw, unpadded texel bytes in this texture's own format (row stride padding removed).
   * `byteLength` is `width * height * bytesPerPixel(format)`; `bgra*` bytes are swizzled to RGBA order.
   * Use `readFloats()` for float formats to get decoded component values.
   */
  async read() {
    this.assertAlive("Texture.read");
    const t = Bt(this.options.format, "Texture.read");
    if (fr(this.gpu))
      return Eo(this.gpu.__vgpuMockBytes, this.options.size, t);
    const n = await this.device.readback.readTexture(this.gpu, this.options.size, this.options.format);
    return this.assertAlive("Texture.read"), n;
  }
  /**
   * Texel components decoded to f32, row-major, `width * height * components(format)` long.
   * `float16`/`float32` formats keep their HDR values (no clamping); `unorm8` formats are
   * normalized to `[0, 1]` without srgb gamma conversion.
   */
  async readFloats() {
    return Bt(this.options.format, "Texture.readFloats"), _o(await this.read(), this.options.format);
  }
  destroy() {
    this.destroyed || (this.destroyed = !0, this.defaultView = null, this.destroySignal.emit(this), this.ownership !== "external" && (fr(this.gpu) || this.gpu.destroy()));
  }
  dispose() {
    this.destroy();
  }
  assertAlive(t = "Texture") {
    if (this.destroyed)
      throw new H({ code: "VGPU-CORE-TEXTURE-DESTROYED", message: "Texture is destroyed", where: t });
    this.device.assertUsable?.(t);
  }
}
function Mi(e) {
  const t = {
    label: e.label,
    size: { width: e.size[0], height: e.size[1], depthOrArrayLayers: e.size[2] ?? 1 },
    format: e.format,
    usage: ho(e.usage)
  };
  return e.mipLevelCount !== void 0 && (t.mipLevelCount = e.mipLevelCount), e.sampleCount !== void 0 && (t.sampleCount = e.sampleCount), e.dimension !== void 0 && (t.dimension = e.dimension), e.viewFormats !== void 0 && (t.viewFormats = [...e.viewFormats]), t;
}
class Mo {
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
  constructor(t, n = null, r = "owned", i = {}) {
    this.gpu = t, this.adapterInfo = n, Object.defineProperty(this, "assertUsable", { value: (a) => this.#e(a) }), this.ownership = typeof r == "string" ? r : "owned";
    const s = typeof r == "string" ? i : r;
    this.isCompatibilityMode = s.isCompatibilityMode ?? !1, this.queue = new Io(t.queue, (a) => this.#e(a)), this.readback = new vo(t);
    const o = t.lost;
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
  createShader(t) {
    this.#e("Device.createShader");
    const n = typeof t == "string" ? go(t) : t;
    return new Po(this.gpu.createShaderModule({ code: n.wgsl }), n);
  }
  createTexture(t) {
    return this.#e("Device.createTexture"), new He(this, this.gpu.createTexture(Mi(t)), t);
  }
  createBuffer(t) {
    this.#e("Device.createBuffer");
    const n = Fo(t);
    n && this.captureError(n);
    const r = n ? $o(Math.max(4, t.size || 4)) : Ao(t);
    return new ve(this, this.gpu.createBuffer(r), t);
  }
  /** Wraps a caller-owned GPUBuffer without taking ownership of its native lifetime. */
  wrapBuffer(t) {
    if (this.#e("Device.wrapBuffer"), !Go(t))
      throw new H({
        code: "VGPU-EXTERNAL-BUFFER-INVALID",
        message: "Device.wrapBuffer requires a GPUBuffer with finite size and usage properties.",
        where: "Device.wrapBuffer",
        fix: "Pass a live GPUBuffer created for this GPUDevice."
      });
    const n = {
      size: t.size,
      usage: Do(t.usage),
      ...t.label ? { label: t.label } : {}
    };
    return new ve(this, t, n, "external");
  }
  pushErrorScope(t) {
    this.#e("Device.pushErrorScope"), this.scopes.push([]), this.gpu.pushErrorScope?.(t);
  }
  async popErrorScope() {
    this.#e("Device.popErrorScope");
    const t = this.scopes.pop(), n = await this.gpu.popErrorScope?.();
    return this.#e("Device.popErrorScope"), t?.[0] ?? Lo(n) ?? null;
  }
  #e(t) {
    if (this.state === "alive")
      return;
    if (this.state === "disposed")
      throw new H({
        code: "VGPU-DEVICE-DISPOSED",
        message: "The GPU device wrapper has been disposed.",
        where: t,
        fix: "Create a new Gpu instance before performing more work."
      });
    const n = this.lossInfo?.reason, r = this.lossInfo?.message;
    throw new H({
      code: "VGPU-DEVICE-LOST",
      message: `The GPU device was lost${n ? ` (${n})` : ""}${r ? `: ${r}` : "."}`,
      where: t,
      cause: this.lossInfo
    });
  }
  destroy() {
    if (this.state === "disposed")
      return;
    const t = this.state === "lost";
    this.state = "disposed", this.observeLoss = !1, this.scopes.length = 0, this.readback.destroy(), this.ownership === "owned" && !t && this.gpu.destroy();
  }
  dispose() {
    this.destroy();
  }
  captureError(t) {
    const n = this.scopes.at(-1);
    if (n)
      n.push(t);
    else
      throw t;
  }
}
function Fo(e) {
  return !Number.isFinite(e.size) || e.size <= 0 ? mr("Buffer size must be greater than zero.") : e.usage.length === 0 ? mr("Buffer usage must not be empty.") : null;
}
function mr(e) {
  return new H({ code: "VGPU-CORE-INVALID-USAGE", message: e, where: "Device.createBuffer" });
}
function Ao(e) {
  return { label: e.label, size: e.size, usage: gt(e.usage) };
}
function Lo(e) {
  return e ? new H({ code: "VGPU-CORE-VALIDATION", message: e.message, where: "GPUDevice.popErrorScope", cause: e }) : null;
}
function Go(e) {
  if (typeof e != "object" && typeof e != "function" || e === null)
    return !1;
  const t = e;
  return Number.isSafeInteger(t.size) && (t.size ?? -1) >= 0 && Number.isSafeInteger(t.usage) && (t.usage ?? -1) >= 0 && typeof t.destroy == "function";
}
const Ro = ["map_read", "map_write", "copy_src", "copy_dst", "index", "vertex", "uniform", "storage", "indirect", "query_resolve"];
function Do(e) {
  return Ro.filter((t) => (e & gt([t])) !== 0);
}
const Fi = /* @__PURE__ */ new WeakMap(), Uo = /* @__PURE__ */ new WeakMap();
function Vo(e, t) {
  return Fi.set(e, zo(t)), e;
}
function ct(e) {
  return Fi.get(e);
}
function Ai(e) {
  return Uo.get(e);
}
function zo(e) {
  return { entries: e.entries.map((t) => ({ ...t })) };
}
let y = class extends Qt {
};
function No(e, t, n, r, i, s) {
  const o = t === "vertex" ? "Vertex" : "Fragment", a = t === "vertex" ? "VERTEX" : "FRAGMENT", c = `maxStorageBuffersIn${o}Stage`;
  return new y({
    code: `VGPU-LIMIT-STORAGE-${a}`,
    message: `${o} entry '${n}' in '${e}' uses ${r} storage buffer(s), but device limit ${c} is ${i}.`,
    fix: t === "vertex" ? `Request init({ requiredLimits: { ${c}: ${r} } }) if the adapter supports it, or move vertex data to geometry(gpu, ...) vertex streams.` : `Request init({ requiredLimits: { ${c}: ${r} } }) if the adapter supports it, or reduce fragment storage buffers.`,
    where: `${e}.pipelineLayout`,
    detail: { stage: t, entryPoint: n, count: r, limit: i, bindings: s.map(({ name: u, group: l, binding: f }) => ({ name: u, group: l, binding: f })) }
  });
}
function Oo(e, t, n, r, i) {
  return new y({
    code: "VGPU-SET-TEXTURE-FILTERABILITY",
    message: `${r} (${n}) cannot satisfy filtering texture '${t.name}' @group(${t.group}) @binding(${t.binding}).`,
    fix: "Use a filterable format; request float32-filterable for rgba32float when supported; or use textureLoad without a sampler.",
    where: `${e}.set`,
    detail: { format: n, group: t.group, binding: t.binding, bindingName: t.name, resourceName: r, samplerName: i?.name, samplerGroup: i?.group, samplerBinding: i?.binding }
  });
}
function Bo(e, t) {
  const n = xa(e, t);
  return new y({
    code: "VGPU-R1-BINDING-NEVER-SET",
    message: `Unset \`${t.name}\` @group(${t.group}) @binding(${t.binding}) in '${e}'. Fix: ${n}; or ${e}.group(${t.group}, bindGroup).`,
    where: `${e}.draw`
  });
}
function Li(e, t) {
  const n = t === "lib" ? "lib-owned by its first JS set()" : "user-owned by its first resource set()", r = t === "lib" ? `Fix: pass a resource from the start: wave.set({ ${e}: new Uniform(gpu.device, { size: 4 }) }).` : `Fix: pass JS values from the first set(): wave.set({ ${e}: jsValue }).`;
  return new y({
    code: "VGPU-R1-OWNERSHIP-FLIP",
    message: `\`${e}\` is ${n}; ownership cannot change. ${r}`,
    where: "set"
  });
}
function jo(e, t) {
  return new y({
    code: "VGPU-R4-GROUP-CLAIMED",
    message: `group ${t} of '${e}' is claimed; set() cannot update it.`,
    fix: `Call set() first, or build from ${e}.layout(${t}); pass dynamic offsets to p.draw().`,
    where: `${e}.set`
  });
}
function Wo(e, t, n, r) {
  return new y({
    code: "VGPU-R4-GROUP-INCOMPATIBLE",
    message: `claimed group ${t} in '${e}' is incompatible: ${n}.`,
    fix: `Build from ${e}.layout(${t}, { dynamicOffsets? }) then call ${e}.group(${t}, bindGroup).`,
    where: `${e}.group`,
    cause: r
  });
}
function Ke(e, t, n) {
  return new y({
    code: "VGPU-R4-GROUP-VALIDATION",
    message: `WebGPU rejected claimed group ${t} in '${e}'.`,
    fix: `Build from ${e}.layout(${t}); pass offsets via p.draw(draw, { offsets: { ${t}: [...] } }).`,
    where: `${e}.draw`,
    cause: n,
    detail: { drawLabel: e, group: t }
  });
}
function gr(e, t) {
  return new y({
    code: "VGPU-BLEND-INVALID",
    message: `Invalid blend '${String(t)}' in '${e}'.`,
    fix: 'Use "alpha", "additive", "premultiplied", or { color, alpha? } components.',
    where: "draw"
  });
}
function br(e, t) {
  return new y({
    code: "VGPU-BLEND-CONSTANT-INVALID",
    message: `Invalid blendConstant in '${e}': ${t}`,
    fix: 'Use [r, g, b, a] finite numbers with a blend whose color or alpha uses "constant"/"one-minus-constant"; omit it to keep the pass default (0, 0, 0, 0).',
    where: "draw"
  });
}
function yr(e, t) {
  return new y({
    code: "VGPU-WRITEMASK-INVALID",
    message: `Invalid writeMask ${t} in '${e}'.`,
    fix: "Use an array of r/g/b/a; omit it for all channels.",
    where: "draw"
  });
}
function kn(e, t, n = "draw") {
  return new y({
    code: "VGPU-COLORS-INVALID",
    message: `Invalid colors in '${e}': ${t}`,
    fix: "Use one { blend?, writeMask? } or null entry per color attachment of the target, aligned by index; omit colors to apply the top-level blend/writeMask to every attachment.",
    where: n
  });
}
function qo(e, t) {
  return new y({
    code: "VGPU-CULL-INVALID",
    message: `Invalid cull '${String(t)}' in '${e}'.`,
    fix: 'Use "none", "front", or "back"; omit it for no culling.',
    where: "draw"
  });
}
function Ko(e, t) {
  return new y({
    code: "VGPU-FRONTFACE-INVALID",
    message: `Invalid frontFace '${String(t)}' in '${e}'.`,
    fix: 'Use "ccw" or "cw"; omit it for counter-clockwise.',
    where: "draw"
  });
}
function wr(e, t) {
  return new y({
    code: "VGPU-UNCLIPPED-DEPTH-INVALID",
    message: `Invalid unclippedDepth in '${e}': ${t}`,
    fix: 'Use a boolean. unclippedDepth: true needs the "depth-clip-control" device feature — request it with init({ requiredFeatures: ["depth-clip-control"] }) on an adapter that supports it. Omit the option to keep depth clipping.',
    where: "draw"
  });
}
function ue(e, t) {
  return new y({
    code: "VGPU-DEPTH-INVALID",
    message: `Invalid depth in '${e}': ${t}`,
    fix: 'Use false or { write?, compare?, bias?, biasSlopeScale?, biasClamp? }; omit it for { write: true, compare: "less-equal" }.',
    where: "draw"
  });
}
function Oe(e, t, n = "draw") {
  return new y({
    code: "VGPU-STENCIL-INVALID",
    message: `Invalid stencil in '${e}': ${t}`,
    fix: `Use { front?, back?, readMask?, writeMask?, ref? } with GPUCompareFunction/GPUStencilOperation faces and u32 masks, against a target whose depth format has a stencil aspect (depth: "depth24plus-stencil8"); omit it for WebGPU's pass-through defaults.`,
    where: n
  });
}
function At(e, t, n = "draw") {
  return new y({
    code: "VGPU-MULTISAMPLE-INVALID",
    message: `Invalid multisample in '${e}': ${t}`,
    fix: "Use { alphaToCoverage?, mask? }: alphaToCoverage needs a target created with msaa: true, and mask must be an integer in [0, 0xFFFFFFFF] (bits above the target's sampleCount are ignored). Omit multisample for full-coverage defaults.",
    where: n
  });
}
function _t(e, t, n = "draw") {
  return new y({
    code: "VGPU-CONSTANTS-INVALID",
    message: `Invalid constants in '${e}': ${t}`,
    fix: "Key WGSL `override` constants by name, or by the decimal string of N when the declaration has @id(N); values are finite numbers or booleans, converted to the override's WGSL type (bool/i32/u32/f32/f16). Every override without a default value must be provided. Omit constants to keep the WGSL defaults.",
    where: n
  });
}
function Lt(e, t, n = "draw") {
  return new y({
    code: "VGPU-ENTRY-INVALID",
    message: `Invalid entry in '${e}': ${t}`,
    fix: "Name an entry point declared in the shader with the matching stage — { vertex?, fragment? } strings for draw, one @compute name string for compute. Omit entry (or a field) to use the first entry point of that stage.",
    where: n
  });
}
function Pe(e, t, n) {
  return new y({
    code: "VGPU-INDIRECT-INVALID",
    message: `Invalid indirect in '${e}': ${t}`,
    fix: "Pass a storage buffer created with storage(gpu, bytes, { indirect: true }) — bare, or as { buffer, offset? } with a 4-aligned byte offset — sized so the GPU-read arguments fit: 16 bytes for drawIndirect, 20 for drawIndexedIndirect, 12 for dispatchWorkgroupsIndirect. Omit indirect to use CPU-side counts.",
    where: n
  });
}
function Yo() {
  return new y({
    code: "VGPU-PASS-PRESERVE-MSAA",
    message: "clear:false cannot preserve MSAA; use a non-MSAA target.",
    fix: "Use non-MSAA for accumulation.",
    where: "Frame.pass"
  });
}
function xr(e, t = "expected a number in [0, 1].", n = 'Use 1 (default), or 0 with depth: { compare: "greater" } for reversed-Z.') {
  return new y({
    code: "VGPU-PASS-CLEARDEPTH-INVALID",
    message: `clearDepth received ${String(e)}; ${t}`,
    fix: n,
    where: "Frame.pass"
  });
}
function fe(e) {
  return new y({
    code: "VGPU-PASS-VIEWPORT-INVALID",
    message: `Invalid viewport: ${e}`,
    fix: "Use { x?, y?, width, height, minDepth?, maxDepth? } finite numbers within device limits; omit it for the full target.",
    where: "Frame.pass"
  });
}
function ln(e) {
  return new y({
    code: "VGPU-PASS-SCISSOR-INVALID",
    message: `Invalid scissor: ${e}`,
    fix: "Use [x, y, width, height] non-negative integers with x + width and y + height within the target's current pixel size; omit it for the full target.",
    where: "Frame.pass"
  });
}
function Xo() {
  return new y({
    code: "VGPU-PASS-PRESERVE-CLEARDEPTH",
    message: "clear:false preserves depth; clearDepth cannot apply.",
    fix: "Remove clearDepth, or let the pass clear.",
    where: "Frame.pass"
  });
}
function vr(e) {
  return new y({
    code: "VGPU-PASS-CLEARSTENCIL-INVALID",
    message: `clearStencil ${e}`,
    fix: `Use an integer in [0, 0xFFFFFFFF] on a target whose depth format has a stencil aspect, e.g. depth: "depth24plus-stencil8"; the value is masked to the stencil aspect's bit width.`,
    where: "Frame.pass"
  });
}
function Ho() {
  return new y({
    code: "VGPU-PASS-PRESERVE-CLEARSTENCIL",
    message: "clear:false preserves stencil; clearStencil cannot apply.",
    fix: "Remove clearStencil, or let the pass clear.",
    where: "Frame.pass"
  });
}
function Ce(e, t, n = "Frame.pass") {
  return new y({
    code: "VGPU-PASS-DEPTH-READONLY",
    message: `depthReadOnly ${e}`,
    fix: t,
    where: n
  });
}
function Zo() {
  return new y({
    code: "VGPU-PASS-DEPTH-READONLY-MSAA",
    message: `depthReadOnly cannot read an MSAA target's depth: multisampled depth is stored with storeOp "discard", so a read-only pass tests against discarded contents.`,
    fix: "Use a non-MSAA target for read-only depth, or drop depthReadOnly and let the pass own its depth.",
    where: "Frame.pass"
  });
}
function Qo(e, t, n = "timer") {
  return new y({
    code: "VGPU-TIMER-INVALID",
    message: `Invalid timer use: ${e}`,
    fix: t,
    where: n
  });
}
function Jo(e, t, n = "visibility") {
  return new y({
    code: "VGPU-VIS-INVALID",
    message: `Invalid visibility use: ${e}`,
    fix: t,
    where: n
  });
}
function ea() {
  return new y({
    code: "VGPU-QUERY-NO-VISIBILITY",
    message: "occlusion() needs the pass to be opened with a visibility instance; the render pass has no occlusionQuerySet to write into.",
    fix: "Open the pass with f.pass({ target, visibility: vis }, ...) using the visibility(gpu) instance that created the query handle.",
    where: "FramePass.occlusion"
  });
}
function ta() {
  return new y({
    code: "VGPU-QUERY-NESTED",
    message: "occlusion() cannot nest inside an active occlusion() body; WebGPU allows one active occlusion query per pass at a time.",
    fix: "Encode each occlusion scope sequentially: p.occlusion(a, ...); p.occlusion(b, ...).",
    where: "FramePass.occlusion"
  });
}
function En(e = "Frame.pass") {
  return new y({
    code: "VGPU-TARGET-REQUIRED",
    message: "Target required. Fix: pass surface(gpu, canvas) or target(gpu, { size }) as { target }.",
    where: e
  });
}
function se(e, t, n, r) {
  return new y({ code: e, message: `${e}: ${n}`, fix: r, where: t });
}
function z(e, t) {
  return se("VGPU-MESH-LAYOUT-INVALID", e, t, "Fix attributes/formats/offsets; use non-numeric names and 4-aligned stride <= 2048.");
}
function Sr(e, t) {
  return se("VGPU-MESH-LIMIT-EXCEEDED", e, t, "Use <= 8 buffers and <= 16 attributes (or the device limits).");
}
function _r(e, t) {
  return se("VGPU-MESH-LOCATION-CONFLICT", e, `Duplicate geometry @location(${t}).`, "Use unique locations, or omit them for name matching.");
}
function Gi(e, t) {
  return se("VGPU-MESH-DATA-MISALIGNED", e, t, "Fix: repack data, set matching stride, or give raw buffers an explicit count.");
}
function Ye(e, t) {
  return se("VGPU-MESH-RANGE-INVALID", e, t, "Use index ranges for indexed geometries, vertex ranges otherwise, within geometry counts.");
}
function Be(e, t) {
  return se("VGPU-MESH-WRITE-RANGE", e, t, "Write within the buffer byteLength, or create a larger geometry.");
}
function na(e, t, n = []) {
  return se("VGPU-MESH-ATTRIBUTE-UNMATCHED", e, `Geometry attribute '${t}' has no shader input.`, `Use shader name${n.length ? ` (${n.join(",")})` : ""} or { location:n }.`);
}
function ra(e, t, n) {
  return se("VGPU-MESH-ATTRIBUTE-UNMATCHED", e, `Geometry attribute '${t}' matches locations ${n.join(",")}.`, "Rename inputs or set { location:n }.");
}
function ia(e, t, n = []) {
  return se("VGPU-MESH-INPUT-MISSING", e, `Geometry lacks shader input '${t}'.`, `Add/remove it. Geometry attributes: ${n.join(",") || "none"}.`);
}
function sa(e, t, n, r) {
  return se("VGPU-MESH-FORMAT-MISMATCH", e, `Attribute '${t}' ${n} != shader ${r}.`, "Match the float/sint/uint shader base type; widths may differ.");
}
function oa(e) {
  return new y({
    code: "VGPU-PIPELINE-LAYOUT-GAP",
    message: `Pipeline bind group ${e} is missing.`,
    fix: "Use consecutive @group() indices starting at 0.",
    where: "pipeline layout"
  });
}
function et(e, t, n) {
  return new y({
    code: "VGPU-COMPILE-FAILED",
    message: "WebGPU pipeline compilation failed.",
    fix: "Check WGSL, vertex layouts, and target signature.",
    where: e,
    cause: t,
    detail: n ? { signature: n } : void 0
  });
}
function kr(e) {
  return new y({
    code: "VGPU-COMPILE-DISPOSED",
    message: "GPU disposed during pipeline compilation.",
    where: e
  });
}
function kt(e, t) {
  return new y({
    code: "VGPU-COMPILE-SIGNATURE-INVALID",
    message: `Invalid TargetSignature: ${t}`,
    fix: "Pass { colors, depth?, sampleCount?:1|4 } or a Target.",
    where: e
  });
}
function aa(e) {
  return new y({
    code: "VGPU-TARGET-DEPTH-STENCIL-ONLY",
    message: `depth received '${e}'; stencil-only depth targets are not supported yet.`,
    fix: 'Use a format with a depth aspect such as "depth24plus" or "depth24plus-stencil8".',
    where: "target"
  });
}
function Ri() {
  return new y({
    code: "VGPU-TARGET-SIZE-REQUIRED",
    message: "Target size required. Fix: target(gpu, { size: [w,h] }); update surface-derived targets in onResize.",
    where: "target"
  });
}
function Di(e) {
  return new y({
    code: "VGPU-SURFACE-NOT-IN-FRAME",
    message: "Surface targets are only available inside frame(gpu).",
    fix: "surface passes must run inside frame(gpu, ...); precompile against an offscreen target(gpu, ...) instead",
    where: e
  });
}
function ca() {
  return new y({
    code: "VGPU-SURFACE-CONTEXT",
    message: "Canvas WebGPU context failed. Fix: check navigator.gpu and remove any existing 2d/webgl context.",
    where: "surface"
  });
}
function ua(e) {
  return new y({
    code: "VGPU-SURFACE-DUPLICATE",
    message: `Canvas already has surface${e ? ` '${e}'` : ""}. Fix: reuse or dispose it.`,
    where: "surface"
  });
}
function fa(e) {
  return new y({
    code: "VGPU-SURFACE-DISPOSED",
    message: `Surface '${e ?? "surface"}' is disposed. Fix: call surface(gpu, canvas).`,
    where: "surface"
  });
}
function la() {
  return new y({
    code: "VGPU-SURFACE-AUTORESIZE-UNSUPPORTED",
    message: "autoResize needs clientWidth. Fix: call surface.resize([w,h]) for OffscreenCanvas; onResize still fires.",
    where: "surface"
  });
}
function da(e) {
  return new y({
    code: "VGPU-SURFACE-RESIZE-REENTRANT",
    message: `Cannot resize this surface${e ? ` '${e}'` : ""} in onResize. Fix: resize derived targets only.`,
    where: "surface.resize"
  });
}
function ha(e) {
  return new y({
    code: "VGPU-CLEAR-COLOR-INVALID",
    message: `Invalid ${e}: expected four finite numbers.`,
    fix: "Assign [r, g, b, a] or a GPUColor object ({ r, g, b, a }).",
    where: e
  });
}
function pa(e) {
  return new y({
    code: "VGPU-CLOCK-DELTA-INVALID",
    message: `clock.advance() received ${String(e)}; expected a finite, non-negative number of seconds.`,
    fix: "Pass the elapsed seconds, e.g. clock(gpu).advance(1 / 60); use frame(gpu) alone to advance with wall-clock time.",
    where: "clock.advance"
  });
}
function Ui() {
  return new y({
    code: "VGPU-FRAME-REENTRANT",
    message: "Nested frame(gpu) is invalid. Fix: queue work for the next frame.",
    where: "frame"
  });
}
function Er(e) {
  return new y({
    code: "VGPU-FRAME-CANCELED",
    message: "the frame was canceled; its command encoder was dropped and nothing more can be encoded or submitted on it.",
    fix: "Open a new frame(gpu) for further work; cancel() is the last operation on a frame.",
    where: e
  });
}
function ma(e) {
  return new y({
    code: "VGPU-FRAME-PASS-ACTIVE",
    message: "the frame cannot be canceled while a pass callback is active.",
    fix: "Return from the frame.pass(...) callback first, then call frame.cancel(); this keeps pass descriptor resources alive until the pass is closed.",
    where: e
  });
}
function ga(e) {
  return new y({
    code: "VGPU-FRAME-SUBMITTED",
    message: "the frame was already submitted; submitted GPU work cannot be canceled.",
    fix: "Call cancel() only on a frame you decided not to submit; the frame you did submit needs no cleanup.",
    where: e
  });
}
function de(e, t, n) {
  return new y({
    code: "VGPU-R1-BINDING-INCOMPATIBLE-RESOURCE",
    message: `binding \`${e.name}\` @group(${e.group}) @binding(${e.binding}) needs ${t}.`,
    fix: n,
    where: "set"
  });
}
function N(e, t, n) {
  return new y({ code: "VGPU-RING1-UNSUPPORTED", message: t, fix: n, where: e });
}
function Et(e) {
  return ya(e) && e.version !== 1 ? new y({
    code: "VGPU-SHADER-SOURCE-INVALID",
    message: `VGPU-SHADER-SOURCE-INVALID: unsupported ShaderSource v${String(e.version)}; expected v1. Fix: update vgpu or regenerate it.`,
    where: "shader source"
  }) : new y({
    code: "VGPU-SHADER-SOURCE-INVALID",
    message: `VGPU-SHADER-SOURCE-INVALID: expected WGSL or { version, wgsl }, got ${wa(e)}. Fix: configure @vgpu/wgsl loader-vite or loader-webpack.`,
    where: "shader source"
  });
}
function ba(e) {
  return new y({
    code: "VGPU-R1-STORAGE-ALIASING",
    message: "`src` and writable `dst` alias. Fix: alternate them with pingPongStorage(gpu).",
    where: e
  });
}
function ya(e) {
  return typeof e == "object" && e !== null && "version" in e;
}
function wa(e) {
  if (typeof e != "object" || e === null)
    return typeof e;
  try {
    const t = JSON.stringify(e);
    return t.length > 80 ? `${t.slice(0, 77)}...` : t;
  } catch {
    return "object";
  }
}
function xa(e, t) {
  switch (t.kind) {
    case "sampler":
      return `${e}.set({${t.name}:sampler(gpu)})`;
    case "texture":
      return `${e}.set({${t.name}:scene.color})`;
    case "buffer":
      return t.addressSpace === "uniform" ? `${e}.set({${t.name}:{ /* values */ }})` : `${e}.set({${t.name}:buffer})`;
    default:
      return `${e}.set({${t.name}:resource})`;
  }
}
const $r = ["scheduler", "resource", "service"];
function bt(e) {
  return { name: e };
}
const Vi = /* @__PURE__ */ new WeakMap();
function va(e) {
  const t = Vi.get(e);
  if (!t)
    throw new y({
      code: "VGPU-GPU-FOREIGN",
      message: "This object was not created by init(); it has no vgpu kernel.",
      fix: "Pass the gpu returned by init() from vgpu, vgpu/node or vgpu/mock.",
      where: "gpu"
    });
  return t;
}
class Sa {
  device;
  #e = /* @__PURE__ */ new Map();
  #t = new Map($r.map((t) => [t, /* @__PURE__ */ new Set()]));
  #n = /* @__PURE__ */ new Set();
  #r = /* @__PURE__ */ new Set();
  #s = /* @__PURE__ */ new Set();
  #i = !1;
  constructor(t) {
    this.device = t;
  }
  get disposed() {
    return this.#i;
  }
  service(t, n) {
    const r = this.#e.get(t);
    if (r !== void 0)
      return r;
    const i = n(this);
    return this.#e.set(t, i), i;
  }
  peekService(t) {
    return this.#e.get(t);
  }
  own(t, n) {
    const r = this.#t.get(t);
    return r.add(n), () => {
      r.delete(n);
    };
  }
  addErrorListener(t) {
    return this.#n.add(t), () => {
      this.#n.delete(t);
    };
  }
  reportError(t) {
    if (this.#i)
      return Promise.resolve();
    const n = Promise.resolve().then(() => {
      const r = [...this.#n];
      if (!r.length) {
        console.error(t);
        return;
      }
      for (const i of r)
        try {
          i(t);
        } catch (s) {
          console.error(s);
        }
    });
    return this.trackDelivery(n);
  }
  trackDelivery(t) {
    const n = Promise.resolve(t).then(() => {
    }, (r) => {
      console.error(r);
    });
    return this.#r.add(n), n.finally(() => this.#r.delete(n)), n;
  }
  registerSettledSource(t) {
    return this.#s.add(t), () => {
      this.#s.delete(t);
    };
  }
  async settled() {
    const t = [
      ...this.#r,
      ...[...this.#s].flatMap((n) => n())
    ];
    await Promise.allSettled(t);
  }
  dispose() {
    if (!this.#i) {
      this.#i = !0;
      for (const t of $r) {
        const n = this.#t.get(t);
        for (const r of [...n])
          r();
        n.clear();
      }
      this.#e.clear(), this.#s.clear(), this.#n.clear(), this.device.dispose();
    }
  }
}
function _a(e) {
  const t = new Sa(e), n = {
    device: e,
    gpu: e.gpu,
    get disposed() {
      return t.disposed;
    },
    onError: (r) => t.addErrorListener(r),
    settled: () => t.settled(),
    dispose: () => {
      t.dispose();
    }
  };
  return Vi.set(n, t), n;
}
async function ka(e, t = {}, n) {
  return _a(await Ea(e, t, n));
}
async function Ea(e, t, n) {
  return t.adapter || n ? (t.adapter ?? n()).requestDevice(t) : $a(t);
}
async function $a(e) {
  const n = await globalThis.navigator.gpu?.requestAdapter({ powerPreference: e.powerPreference });
  if (!n)
    throw N("init", "navigator.gpu.requestAdapter() returned null.");
  co(n.features, e.requiredFeatures);
  const r = await n.requestDevice({ requiredFeatures: e.requiredFeatures, requiredLimits: e.requiredLimits });
  return new Mo(r, n.info ?? null);
}
function G(e, t) {
  e.assertUsable(t);
}
function Ir(e, t) {
  e.assertUsable(t);
}
const zi = /* @__PURE__ */ Symbol("vgpu.bindingResource");
function Ia(e) {
  return typeof (typeof e == "object" && e !== null ? e[zi] : void 0) == "function" ? e : void 0;
}
const Xe = /* @__PURE__ */ Symbol("vgpu.geometry.layoutResolver");
function oe(e, t) {
  const n = va(e);
  if (n.disposed)
    throw Ni(t);
  return n;
}
function Ni(e) {
  return new y({
    code: "VGPU-GPU-DISPOSED",
    message: `${e}() ran after gpu.dispose(); the device and everything it owned are gone.`,
    fix: "Create resources before disposing the gpu, or init() a new one.",
    where: e
  });
}
function Oi(e, t, n, r) {
  const i = e.own("resource", () => n(t));
  return r?.(i), t;
}
class Bi {
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
  constructor(t, n) {
    const r = "geometry";
    if (n.buffers.length > 8)
      throw Sr(r, `${n.buffers.length} vertex buffers exceed limit 8.`);
    let i = 0;
    const s = /* @__PURE__ */ new Set(), o = n.buffers.map((d, m) => {
      const g = Fa(t, d, `${r}.buffers[${m}]`);
      i += g.attributes.length;
      for (const h of g.attributes)
        if (h.location !== void 0) {
          if (s.has(h.location))
            throw _r(`${r}.buffers[${m}]`, h.location);
          s.add(h.location);
        }
      return g;
    }), a = t.gpu.limits.maxVertexAttributes;
    if (i > a)
      throw Sr(r, `${i} attributes exceed device limit ${a}.`);
    const c = n.topology ?? "triangle-list";
    if (!Ga.has(c))
      throw z(r, `Invalid topology: ${String(c)}.`);
    const u = Aa(t, n, r), l = Tr(o, "vertex"), f = Tr(o, "instance");
    Cr(o, "vertex", n.vertexCount ?? l, r), Cr(o, "instance", n.instanceCount ?? f, r), dn(r, "vertexCount", n.vertexCount, l), dn(r, "instanceCount", n.instanceCount, f), dn(r, "indexCount", n.indexCount, u.count), this.topology = c, this.stripIndexFormat = c.endsWith("strip") ? u.format : void 0, this.#n = o, this.vertexBufferLayouts = Object.freeze(o.map((d) => d.layout)), this.vertexBuffers = Object.freeze(o.map((d) => d.gpu)), this.buffers = Object.freeze(o.map((d, m) => new Pa(`${r}.buffers[${m}]`, d))), this.vertexCount = n.vertexCount ?? l, this.instanceCount = n.instanceCount ?? f, this.indexBuffer = u.gpu, this.indexFormat = u.format, this.indexCount = n.indexCount ?? u.count, this.#e = u.owned, this.#t = u.byteLength, La(this);
  }
  /** @internal Resolves named attributes for one reflected vertex entry point. */
  [Xe](t, n) {
    if (this.#i)
      throw z(n, "Geometry is destroyed; create a live geometry.");
    const r = t.map((u) => `${u.name}:${u.location}:${Rt(u.type)}`).join("|"), i = this.#r.get(r);
    if (i)
      return i;
    const s = /* @__PURE__ */ new Set(), o = this.#n.flatMap((u) => u.attributes.map((l) => l.name)), a = this.#n.map((u) => {
      const l = [...u.layout.attributes], f = u.attributes.map((d, m) => {
        const g = d.location === void 0 ? t.filter((x) => x.name === d.name) : [];
        if (d.location === void 0 && g.length === 0)
          throw na(n, d.name, t.map((x) => x.name));
        if (g.length > 1)
          throw ra(n, d.name, g.map((x) => x.location));
        const h = d.location ?? g[0].location;
        if (s.has(h))
          throw _r(n, h);
        s.add(h);
        const S = t.find((x) => x.location === h);
        if (S && Ua(d.format) !== Rt(S.type))
          throw sa(n, d.name, d.format, Rt(S.type));
        return Object.freeze({ ...l[m], shaderLocation: h });
      });
      return Object.freeze({ arrayStride: u.layout.arrayStride, ...u.layout.stepMode ? { stepMode: u.layout.stepMode } : {}, attributes: Object.freeze(f) });
    });
    for (const u of t)
      if (!s.has(u.location))
        throw ia(n, u.name, o);
    const c = Object.freeze(a);
    return this.#r.set(r, c), c;
  }
  /** Creates a frozen range view sharing this geometry's buffers and layout identity. */
  slice(t = {}) {
    return new Ta(this, t);
  }
  /** Updates bytes in vertex buffer stream 0 without resizing it. */
  write(t, n = 0) {
    const r = this.buffers[0];
    if (!r)
      throw Be("geometry.write", "No vertex buffer 0; add one before writing.");
    r.write(t, n);
  }
  /** Updates bytes in the owned index buffer without resizing it. */
  writeIndices(t, n = 0) {
    if (this.#i)
      throw Be("geometry.writeIndices", "Geometry is destroyed; create a new geometry before writing.");
    if (!this.#e || this.#t === void 0)
      throw Be("geometry.writeIndices", "No owned index buffer; write caller-owned buffers directly.");
    Wi("geometry.writeIndices", this.#t, t.byteLength, n), this.#e.write(t, n);
  }
  /** Destroys buffers owned by this geometry; caller-owned buffers are untouched. */
  destroy() {
    if (!this.#i) {
      this.#i = !0;
      for (const t of this.buffers)
        t.destroyOwned();
      this.#e?.destroy();
      for (const t of [...this.#s])
        t();
      this.#s.clear();
    }
  }
  /**
   * @internal Ownership hook: runs once, right after `destroy()` freed the buffers, so the owner
   * that registered this geometry with the kernel can drop its teardown registration.
   */
  onDestroy(t) {
    return this.#i ? (t(), () => {
    }) : (this.#s.add(t), () => {
      this.#s.delete(t);
    });
  }
}
class Pa {
  where;
  inner;
  gpu;
  stride;
  stepMode;
  #e = { destroyed: !1 };
  constructor(t, n) {
    this.where = t, this.inner = n, this.gpu = n.gpu, this.stride = n.stride, this.stepMode = n.stepMode, Object.freeze(this);
  }
  write(t, n = 0) {
    if (this.#e.destroyed)
      throw Be(this.where, "Geometry is destroyed; create a new geometry before writing.");
    if (!this.inner.owned || this.inner.byteLength === void 0)
      throw Be(this.where, "Caller-owned buffer; write it directly.");
    Wi(this.where, this.inner.byteLength, ji(t), n), this.inner.owned.write(t, n);
  }
  destroyOwned() {
    this.#e.destroyed = !0, this.inner.owned?.destroy();
  }
}
class Ta {
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
  [Xe](t, n) {
    return this.geometry[Xe](t, n);
  }
  constructor(t, n) {
    if (this.geometry = t, this.vertexBuffers = t.vertexBuffers, this.indexBuffer = t.indexBuffer, this.indexFormat = t.indexFormat, this.vertexBufferLayouts = t.vertexBufferLayouts, this.topology = t.topology, this.stripIndexFormat = t.stripIndexFormat, t.indexBuffer) {
      if (n.firstVertex !== void 0 || n.vertexCount !== void 0)
        throw Ye("geometry.slice", "Indexed slice needs firstIndex/indexCount/baseVertex; omit vertex range fields.");
      const r = n.firstIndex ?? 0, i = t.indexCount ?? 0, s = n.indexCount ?? i - r;
      xe("geometry.slice", "firstIndex", r, i), xe("geometry.slice", "indexCount", s, i - r), xe("geometry.slice", "baseVertex", n.baseVertex ?? 0, Number.MAX_SAFE_INTEGER), this.firstIndex = r, this.indexCount = s, this.baseVertex = n.baseVertex ?? 0, this.vertexCount = t.vertexCount;
    } else {
      if (n.firstIndex !== void 0 || n.indexCount !== void 0 || n.baseVertex !== void 0)
        throw Ye("geometry.slice", "Non-indexed slice needs firstVertex/vertexCount; omit index range fields.");
      const r = n.firstVertex ?? 0, i = t.vertexCount ?? 0, s = n.vertexCount ?? i - r;
      xe("geometry.slice", "firstVertex", r, i), xe("geometry.slice", "vertexCount", s, i - r), this.firstVertex = r, this.vertexCount = s, this.indexCount = t.indexCount;
    }
    xe("geometry.slice", "instanceCount", n.instanceCount ?? t.instanceCount ?? 0, Number.MAX_SAFE_INTEGER), this.instanceCount = n.instanceCount ?? t.instanceCount, Object.freeze(this);
  }
}
function Gt(e, t) {
  const n = oe(e, "geometry"), r = Ca(t) ? t.build(n.device) : t;
  return Ma(n, new Bi(n.device, r));
}
function Ca(e) {
  return "build" in e && typeof e.build == "function";
}
function Ma(e, t) {
  return Oi(e, t, (n) => n.destroy(), (n) => {
    t.onDestroy(n);
  });
}
function Pr(e) {
  if (e === "unorm10-10-10-2" || e === "unorm8x4-bgra")
    return 4;
  const t = /^(float|uint|sint|unorm|snorm)(8|16|32)(?:x([234]))?$/.exec(e);
  if (!t)
    return 0;
  const [, n, r, i] = t;
  return (r === "32" ? /norm/.test(n) : !i || i === "3" || r === "8" && n === "float") ? 0 : Number(r) / 8 * Number(i ?? 1);
}
function Fa(e, t, n) {
  if (t.data !== void 0 && t.buffer !== void 0)
    throw z(n, "Choose data or buffer, not both.");
  const r = t.stepMode ?? "vertex";
  if (r !== "vertex" && r !== "instance")
    throw z(n, `Invalid stepMode: ${String(r)}.`);
  const i = [], s = [];
  let o = 0;
  for (const [f, d] of Object.entries(t.attributes)) {
    if (/^\d+$/.test(f))
      throw z(n, `Attribute '${f}' is numeric; use a non-numeric name.`);
    const m = typeof d == "string" ? { format: d } : d, g = Pr(m.format);
    if (!g)
      throw z(n, `Unknown GPUVertexFormat '${m.format}'.`);
    const h = m.offset ?? o, S = Math.min(4, g);
    if (!Number.isInteger(h) || h < 0 || h % S !== 0)
      throw z(n, `Attribute '${f}' offset ${String(h)} needs ${S}-byte alignment.`);
    if (m.location !== void 0 && (!Number.isInteger(m.location) || m.location < 0 || m.location >= e.gpu.limits.maxVertexAttributes))
      throw z(n, `Location ${String(m.location)} for '${f}' is outside limit ${e.gpu.limits.maxVertexAttributes}.`);
    i.push({ shaderLocation: m.location ?? i.length, offset: h, format: m.format }), s.push({ name: f, format: m.format, location: m.location }), o += g;
  }
  const a = t.stride ?? Da(o);
  if (!Number.isInteger(a) || a <= 0 || a > 2048 || a % 4 !== 0)
    throw z(n, `Stride ${String(a)} must be 4-aligned in [4,2048].`);
  for (const [f, d] of i.entries()) {
    const m = Pr(d.format);
    if (d.offset + m > a)
      throw z(n, `Attribute '${s[f]?.name}' (${d.offset}+${m}) exceeds stride ${a}.`);
  }
  const c = t.data ? ji(t.data) : void 0;
  if (c !== void 0 && c % a !== 0)
    throw Gi(n, `Data byteLength ${c} is not divisible by stride ${a}.`);
  const u = t.data !== void 0 ? e.createBuffer({ label: t.label, size: Math.max(4, c ?? 0), usage: ["vertex", "copy_dst"] }) : void 0;
  return u && t.data && u.write(t.data), { layout: Object.freeze({ arrayStride: a, ...t.stepMode ? { stepMode: r } : {}, attributes: Object.freeze(i) }), attributes: Object.freeze(s), stride: a, stepMode: r, byteLength: c, gpu: u?.gpu ?? Ra(t.buffer, n), owned: u };
}
function Aa(e, t, n) {
  if (t.indices !== void 0 && t.indexBuffer !== void 0)
    throw z(n, "Choose indices or indexBuffer, not both.");
  if (t.indices === void 0) {
    const c = [t.indexBuffer, t.indexFormat, t.indexCount].filter((u) => u !== void 0).length;
    if (c !== 0 && c !== 3)
      throw z(n, "Provide indexBuffer, indexFormat, and indexCount together.");
    if (t.indexFormat !== void 0 && t.indexFormat !== "uint16" && t.indexFormat !== "uint32")
      throw z(n, `Unknown index format '${String(t.indexFormat)}'.`);
    return t.indexCount !== void 0 && xe(n, "indexCount", t.indexCount, Number.MAX_SAFE_INTEGER), { gpu: t.indexBuffer, format: t.indexFormat, count: t.indexCount };
  }
  if (t.indexFormat !== void 0)
    throw z(n, "indices infer format; omit indexFormat.");
  const r = Array.isArray(t.indices) ? new Uint32Array(t.indices) : t.indices, i = r instanceof Uint16Array ? "uint16" : "uint32", s = r.byteLength;
  if (s % (i === "uint16" ? 2 : 4) !== 0)
    throw Gi(n, `Index byteLength ${s} is invalid for ${i}.`);
  const o = e.createBuffer({ label: t.label ? `${t.label}.indices` : void 0, size: Math.max(4, s), usage: ["index", "copy_dst"] });
  return o.write(r), { gpu: o.gpu, owned: o, format: i, count: r.length, byteLength: s };
}
function Tr(e, t) {
  let n;
  for (const r of e)
    r.stepMode === t && r.byteLength !== void 0 && (n = Math.min(n ?? 1 / 0, Math.floor(r.byteLength / r.stride)));
  return n;
}
function Cr(e, t, n, r) {
  if (n === void 0 && e.some((i) => i.stepMode === t && i.byteLength === void 0))
    throw z(r, `Raw ${t} buffer needs ${t}Count.`);
}
function dn(e, t, n, r) {
  n !== void 0 && xe(e, t, n, r ?? Number.MAX_SAFE_INTEGER);
}
function La(e) {
  for (const t of Object.keys(e))
    t !== "destroyed" && Object.defineProperty(e, t, { writable: !1, configurable: !1 });
}
const Ga = /* @__PURE__ */ new Set(["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"]);
function Ra(e, t) {
  if (!e)
    throw z(t, "Provide geometry buffer data or buffer.");
  return e;
}
function ji(e) {
  return e.byteLength;
}
function Da(e) {
  return e + 3 & -4;
}
function Wi(e, t, n, r) {
  if (!Number.isInteger(r) || r < 0 || r % 4 !== 0 || n % 4 !== 0 || r + n > t)
    throw Be(e, `Write size ${n}/offset ${String(r)} must be 4-aligned within ${t} bytes.`);
}
function xe(e, t, n, r) {
  if (!Number.isInteger(n) || n < 0 || n > r)
    throw Ye(e, `${t}=${String(n)} must be an integer in [0,${r}].`);
}
function Ua(e) {
  return e.startsWith("sint") ? "i32" : e.startsWith("uint") ? "u32" : "f32";
}
function Rt(e) {
  return e.kind === "scalar" ? e.name : e.kind === "vector" || e.kind === "matrix" || e.kind === "atomic" ? Rt(e.element) : e.kind;
}
class qi extends Error {
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
  constructor(t, n, r = 1, i = 1, s = "error") {
    super(n), this.name = "VGPUError", this.code = t, this.line = r, this.column = i, this.severity = s;
  }
}
function Va(e, t, n = {}) {
  const r = new qi(e, t, n.line ?? 1, n.column ?? 1, n.severity ?? "error");
  return n.fix !== void 0 && (r.fix = n.fix), n.where !== void 0 && (r.where = n.where), n.cause !== void 0 && (r.cause = n.cause), n.metadata !== void 0 && (r.metadata = n.metadata), r;
}
function R(e, t, n = 1, r = 1) {
  return new qi(e, t, n, r);
}
const za = /* @__PURE__ */ new Set(["fn", "struct", "const", "alias", "var", "override"]);
function Na(e) {
  const t = [], n = [], r = [];
  let i = 0, s = !1, o = 0;
  for (; i < e.length; ) {
    const a = e[i];
    if (a.text === "{") {
      o++, i++;
      continue;
    }
    if (a.text === "}") {
      o = Math.max(0, o - 1), i++;
      continue;
    }
    if (Ki(a)) {
      i++;
      continue;
    }
    if (o > 0) {
      i++;
      continue;
    }
    if (a.text === "import") {
      if (s)
        throw R("VGPU-WGSL-IMP-ORDER", "Imports must precede declarations", a.line, a.column);
      const [f, d] = Oa(e, i);
      t.push(f), i = d;
      continue;
    }
    if (a.text === "export" && e[i + 1]?.text === "{")
      throw R("VGPU-WGSL-EXP-REEXPORT-CYCLE", "Re-export cycles are not supported", a.line, a.column);
    if (a.text === "@" && e[i + 2]?.text === "export" && e[i + 3]?.text === "@")
      throw R("VGPU-WGSL-EXP-NOTDECL", "Repeated export attributes", a.line, a.column);
    const c = a.text === "export" || a.text === "@" && e[i + 2]?.text === "export", u = c ? Ba(e, a.text === "export" ? i + 1 : i + 3) : i, l = e[u];
    if (l && za.has(l.text)) {
      const f = ja(e, u);
      n.push({ name: f, localName: f, kind: l.text }), c && r.push({ name: f, localName: f, kind: l.text }), s = !0;
    }
    i++;
  }
  return { imports: t, exports: r, locals: n };
}
function Oa(e, t) {
  let n = t + 1;
  const r = [];
  if (e[n]?.text === "{") {
    for (n++; e[n] && e[n].text !== "}"; ) {
      if (Ki(e[n])) {
        n++;
        continue;
      }
      const o = pn(e[n]);
      let a = o;
      n++, e[n]?.text === "as" && (a = pn(e[n + 1]), n += 2), r.push({ imported: o, local: a }), e[n]?.text === "," && n++;
    }
    n++, hn(e[n], "from"), n++;
  } else if (e[n]?.text === "*")
    hn(e[n + 1], "as"), r.push({ imported: "*", local: pn(e[n + 2]), namespace: !0 }), n += 3, hn(e[n], "from"), n++;
  else throw e[n]?.kind === "string" ? R("VGPU-WGSL-IMP-SIDEEFFECT", "Side-effect imports are not supported", e[n].line, e[n].column) : R("VGPU-WGSL-IMP-DEFAULT", "Default imports are not supported", e[n]?.line, e[n]?.column);
  const i = e[n];
  if (i?.kind !== "string")
    throw R("VGPU-WGSL-RES-NOTFOUND", "Import path must be a string", i?.line, i?.column);
  const s = i.text.slice(1, -1);
  return n++, e[n]?.text === ";" && n++, [{ from: s, bindings: r, start: e[t].start, end: e[n - 1].end }, n];
}
function Ba(e, t) {
  for (; e[t]?.text === "@"; ) {
    if (t += 2, e[t]?.text === "(")
      for (; e[t] && e[t].text !== ")"; )
        t++;
    e[t]?.text === ")" && t++;
  }
  return t;
}
function ja(e, t) {
  let n = t + 1;
  if (e[t]?.text === "var" && e[n]?.text === "<")
    for (; e[n] && e[n].text !== ">"; )
      n++;
  for (; n < e.length; n++)
    if (e[n].kind === "ident")
      return e[n].text;
  throw R("VGPU-WGSL-EXP-NOTDECL", "Exported declaration has no name", e[t]?.line, e[t]?.column);
}
function hn(e, t) {
  if (e?.text !== t)
    throw R("VGPU-WGSL-IMP-DEFAULT", `Expected ${t}`, e?.line, e?.column);
}
function pn(e) {
  if (e?.kind !== "ident")
    throw R("VGPU-WGSL-IMP-DEFAULT", "Expected identifier", e?.line, e?.column);
  return e.text;
}
function Ki(e) {
  return e.kind === "lineComment" || e.kind === "blockComment";
}
function Wa(e, t) {
  return t === "uniform" || t === "storage" ? "buffer" : e.kind === "sampler" ? "sampler" : e.kind === "texture" ? e.textureKind === "texture_external" ? "externalTexture" : "texture" : "unknown";
}
function qa(e, t, n, r, i) {
  if (e === "buffer")
    return Ka(t, n, i);
  if (r.kind === "sampler")
    return Ya(r);
  if (r.kind === "texture")
    return r.textureKind === "texture_external" ? { kind: "externalTexture", externalTexture: {} } : r.textureKind.startsWith("texture_storage_") ? Xa(r) : Ha(r);
}
function Ka(e, t, n) {
  return { kind: "buffer", buffer: { type: e === "uniform" ? "uniform" : t === "read" ? "read-only-storage" : "storage", hasDynamicOffset: !1, minBindingSize: n?.size } };
}
function Ya(e) {
  return { kind: "sampler", sampler: { type: e.comparison ? "comparison" : "filtering" } };
}
function Xa(e) {
  return {
    kind: "storageTexture",
    storageTexture: {
      access: Qa(e.access),
      format: e.texelFormat ?? "rgba8unorm",
      viewDimension: Yi(e.dimension)
    }
  };
}
function Ha(e) {
  return {
    kind: "texture",
    texture: {
      sampleType: Za(e),
      viewDimension: Yi(e.dimension),
      multisampled: e.dimension === "multisampled_2d" || e.dimension === "depth_multisampled_2d"
    }
  };
}
function Za(e) {
  if (e.textureKind.startsWith("texture_depth_"))
    return "depth";
  const t = e.sampleType;
  return t?.kind === "scalar" && t.name === "i32" ? "sint" : t?.kind === "scalar" && t.name === "u32" ? "uint" : "unfilterable-float";
}
function Yi(e) {
  switch (e) {
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
function Qa(e) {
  return e === "read" ? "read-only" : e === "read_write" ? "read-write" : "write-only";
}
const q = (1n << 64n) - 1n, Te = 11400714785074694791n, it = 14029467366897019727n, Mr = 1609587929392839161n, Xi = 9650029242287828579n, Fr = 2870177450012600261n;
function Ja(e, t = 0n) {
  const n = new TextEncoder().encode(e);
  let r = 0, i;
  if (n.length >= 32) {
    let s = t + Te + it, o = t + it, a = t, c = t - Te;
    const u = n.length - 32;
    do
      s = Ve(s, tt(n, r)), r += 8, o = Ve(o, tt(n, r)), r += 8, a = Ve(a, tt(n, r)), r += 8, c = Ve(c, tt(n, r)), r += 8;
    while (r <= u);
    i = we(s, 1n) + we(o, 7n) + we(a, 12n) + we(c, 18n), i = $t(i, s), i = $t(i, o), i = $t(i, a), i = $t(i, c);
  } else
    i = t + Fr;
  for (i = i + BigInt(n.length) & q; r + 8 <= n.length; )
    i ^= Ve(0n, tt(n, r)), i = we(i, 27n) * Te + Xi & q, r += 8;
  for (r + 4 <= n.length && (i ^= ec(n, r) * Te & q, i = we(i, 23n) * it + Mr & q, r += 4); r < n.length; )
    i ^= BigInt(n[r]) * Fr & q, i = we(i, 11n) * Te & q, r++;
  return i ^= i >> 33n, i = i * it & q, i ^= i >> 29n, i = i * Mr & q, i ^= i >> 32n, i.toString(16).padStart(16, "0");
}
function Ve(e, t) {
  return we(e + t * it & q, 31n) * Te & q;
}
function $t(e, t) {
  return e ^= Ve(0n, t), e * Te + Xi & q;
}
function we(e, t) {
  return (e << t | e >> 64n - t) & q;
}
function tt(e, t) {
  let n = 0n;
  for (let r = 7; r >= 0; r--)
    n = (n << 8n) + BigInt(e[t + r]);
  return n;
}
function ec(e, t) {
  return BigInt(e[t]) | BigInt(e[t + 1]) << 8n | BigInt(e[t + 2]) << 16n | BigInt(e[t + 3]) << 24n;
}
function tc(e) {
  return Ja(e);
}
function nc(e) {
  return tc(e).slice(0, 8);
}
function rc(e, t) {
  return `_vgsl_${nc(e)}__${t}`;
}
function W(e, t) {
  const n = e.find((s) => s.name === t);
  if (!n)
    return;
  const r = n.args.map((s) => s.text).join(""), i = Number(r.replace(/[ui]$/, ""));
  return Number.isFinite(i) ? i : void 0;
}
function An(e) {
  const t = [[]];
  let n = 0, r = 0;
  for (const i of e) {
    if (i.text === "<" ? n++ : i.text === ">" ? n = Math.max(0, n - 1) : i.text === "(" ? r++ : i.text === ")" && (r = Math.max(0, r - 1)), i.text === "," && n === 0 && r === 0) {
      t.push([]);
      continue;
    }
    t[t.length - 1].push(i);
  }
  return t.map(Hi).filter((i) => i.length > 0);
}
function Hi(e) {
  let t = 0, n = e.length;
  for (; t < n && e[t].text === ","; )
    t++;
  for (; n > t && e[n - 1].text === ","; )
    n--;
  return e.slice(t, n);
}
function ic(e) {
  if (e !== void 0 && Zi(e))
    return Number(e.replace(/[ui]$/, ""));
}
function Zi(e) {
  return /^(0|[1-9][0-9]*)([ui])?$/.test(e);
}
function Qi(e) {
  if (e === "read" || e === "write" || e === "read_write")
    return e;
}
function sc(e) {
  return ["f32", "f16", "i32", "u32", "bool"].find((t) => t === e);
}
function oc(e) {
  return { kind: "scalar", name: e === "f" ? "f32" : e === "h" ? "f16" : e === "i" ? "i32" : "u32" };
}
function Ji(e) {
  return e === "f16" ? 2 : 4;
}
function Ae(e, t) {
  return Math.ceil(t / e) * e;
}
function ie(e) {
  const t = Hi(e);
  if (t.length === 0)
    throw R("VGPU-WGSL-REFLECT-TYPE", "Expected WGSL type");
  const n = t.map((s) => s.text).join(""), r = ac(n);
  if (r)
    return r;
  if (t[1]?.text === "<") {
    const s = t[0].text, o = An(t.slice(2, -1)), a = cc(s, o);
    if (a)
      return a;
  }
  const i = uc(n);
  return i || fc(n);
}
function ac(e) {
  const t = sc(e);
  if (t)
    return { kind: "scalar", name: t };
  const n = e.match(/^vec([234])([fiuh])$/);
  if (n)
    return { kind: "vector", width: Number(n[1]), element: oc(n[2]) };
  const r = e.match(/^mat([234])x([234])([fh])$/);
  if (r) {
    const i = r[3] === "h" ? { kind: "scalar", name: "f16" } : { kind: "scalar", name: "f32" };
    return { kind: "matrix", columns: Number(r[1]), rows: Number(r[2]), element: i };
  }
}
function cc(e, t) {
  if (e === "array") {
    const n = t[1]?.map((i) => i.text).join(""), r = n === void 0 ? void 0 : ic(n);
    return { kind: "array", element: ie(t[0] ?? []), count: r, countExpression: n };
  }
  if (e === "atomic")
    return { kind: "atomic", element: ie(t[0] ?? []) };
  if (e === "vec2" || e === "vec3" || e === "vec4")
    return { kind: "vector", width: Number(e.slice(3)), element: ie(t[0] ?? []) };
  if (/^mat[234]x[234]$/.test(e))
    return { kind: "matrix", columns: Number(e[3]), rows: Number(e[5]), element: ie(t[0] ?? []) };
  if (e === "ptr")
    return { kind: "ptr", addressSpace: t[0]?.map((n) => n.text).join("") ?? "", element: ie(t[1] ?? []), access: t[2]?.map((n) => n.text).join("") };
  if (e === "sampler")
    return { kind: "sampler", comparison: !1 };
  if (e.startsWith("texture_storage_"))
    return { kind: "texture", textureKind: e, dimension: e.slice(16), texelFormat: t[0]?.map((n) => n.text).join(""), access: Qi(t[1]?.map((n) => n.text).join("")) };
  if (e.startsWith("texture_"))
    return { kind: "texture", textureKind: e, dimension: e.slice(8), sampleType: t[0] ? ie(t[0]) : void 0 };
}
function uc(e) {
  if (e === "sampler" || e === "sampler_comparison")
    return { kind: "sampler", comparison: e === "sampler_comparison" };
  if (e === "texture_external")
    return { kind: "texture", textureKind: e };
  if (e.startsWith("texture_depth_"))
    return { kind: "texture", textureKind: e, dimension: e.slice(8) };
  if (e.startsWith("texture_"))
    return { kind: "texture", textureKind: e, dimension: e.slice(8) };
}
function fc(e) {
  return { kind: "identifier", name: e };
}
function _e(e) {
  if (e?.kind !== "ident" && e?.kind !== "keyword")
    throw R("VGPU-WGSL-REFLECT-PARSE", "Expected identifier", e?.line, e?.column);
  return e.text;
}
function Le(e, t, n) {
  for (let r = t; r < e.length; r++)
    if (e[r].text === n)
      return r;
  throw R("VGPU-WGSL-REFLECT-PARSE", `Expected ${n}`, e[t]?.line, e[t]?.column);
}
function lc(e, t, n, r) {
  for (let i = t; i < n; i++)
    if (e[i].text === r)
      return i;
}
function tn(e, t, n) {
  let r = 0;
  for (let i = t; i < e.length; i++)
    if ((e[i].text === "{" || e[i].text === "(") && r++, (e[i].text === "}" || e[i].text === ")") && (r = Math.max(0, r - 1)), r === 0 && e[i].text === n)
      return i;
  return e.length;
}
function Ln(e, t) {
  const n = e[t].text, r = n === "(" ? ")" : n === "{" ? "}" : ">";
  let i = 0;
  for (let s = t; s < e.length; s++)
    if (e[s].text === n && i++, e[s].text === r && (i--, i === 0))
      return s;
  throw R("VGPU-WGSL-REFLECT-PARSE", `Unclosed ${n}`, e[t]?.line, e[t]?.column);
}
function Gn(e, t) {
  const n = [];
  let r = t;
  for (; e[r]?.text === "@"; ) {
    const i = e[r], s = _e(e[r + 1]);
    r += 2;
    let o = [];
    if (e[r]?.text === "(") {
      const a = Ln(e, r);
      o = e.slice(r + 1, a), r = a + 1;
    }
    n.push({ name: s, args: o, token: i });
  }
  return [n, r];
}
function je(e) {
  switch (e.kind) {
    case "scalar":
      return e.name;
    case "identifier":
      return e.name;
    case "vector":
      return `vec${e.width}<${je(e.element)}>`;
    case "matrix":
      return `mat${e.columns}x${e.rows}<${je(e.element)}>`;
    case "array":
      return `array<${je(e.element)}${e.count === void 0 ? "" : `,${e.count}`}>`;
    default:
      return e.kind;
  }
}
function dc(e) {
  const t = e.find((r) => r.name === "workgroup_size");
  if (!t)
    return;
  const n = An(t.args).map((r) => Number(r.map((i) => i.text).join("")));
  return [n[0] ?? 1, n[1] ?? 1, n[2] ?? 1];
}
function hc(e, t) {
  if (e[t]?.text !== "<")
    return { after: t };
  const n = Le(e, t, ">"), r = An(e.slice(t + 1, n)).map((i) => i.map((s) => s.text).join(""));
  return { addressSpace: r[0], access: Qi(r[1]), after: n + 1 };
}
function pc(e) {
  const t = [], n = [], r = [], i = [], s = [], o = [], a = e.tokens.filter((l) => l.kind !== "lineComment" && l.kind !== "blockComment");
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
    const f = c, [d, m] = Gn(a, c);
    c = m, a[c]?.text === "export" && c++;
    const g = a[c]?.text;
    if (g === "enable") {
      a[c + 1]?.kind === "ident" && o.push(a[c + 1].text), c = tn(a, c, ";") + 1;
      continue;
    }
    if (g === "struct") {
      const h = mc(e, a, c);
      h.item && t.push(h.item), c = h.next;
      continue;
    }
    if (g === "alias") {
      const h = gc(e, a, c);
      h.item && n.push(h.item), c = h.next;
      continue;
    }
    if (g === "var") {
      const h = bc(e, a, c, d);
      h.item && r.push(h.item), c = h.next;
      continue;
    }
    if (g === "fn") {
      const h = yc(e, a, c, d);
      h.item && i.push(h.item), c = h.next;
      continue;
    }
    if (g === "override") {
      const h = xc(a, c, d);
      h.item && s.push(h.item), c = h.next;
      continue;
    }
    c = Math.max(f + 1, c + 1);
  }
  return { structs: t, aliases: n, vars: r, entries: i, overrides: s, features: o };
}
function mc(e, t, n, r) {
  const i = _e(t[n + 1]), s = Le(t, n + 2, "{"), o = Ln(t, s);
  return {
    item: { name: i, originalName: i, mangledName: Rn(e, i, "struct"), members: vc(t.slice(s + 1, o)), path: e.path },
    next: o + 1
  };
}
function gc(e, t, n, r) {
  const i = _e(t[n + 1]), s = Le(t, n + 2, "="), o = tn(t, s + 1, ";");
  return {
    item: { name: i, originalName: i, mangledName: Rn(e, i, "alias"), target: ie(t.slice(s + 1, o)), path: e.path },
    next: o + 1
  };
}
function bc(e, t, n, r) {
  const { addressSpace: i, access: s, after: o } = hc(t, n + 1), a = _e(t[o]), c = Le(t, o + 1, ":"), u = tn(t, c + 1, ";");
  return {
    item: { path: e.path, name: a, mangledName: Sc(r) ? a : Rn(e, a, "var"), attrs: r, addressSpace: i, access: s, type: ie(t.slice(c + 1, u)) },
    next: u + 1
  };
}
function yc(e, t, n, r) {
  const i = _e(t[n + 1]), s = r.find((c) => c.name === "vertex" || c.name === "fragment" || c.name === "compute")?.name;
  if (!s)
    return { item: void 0, next: n + 1 };
  const o = Le(t, n + 2, "("), a = Ln(t, o);
  return { item: { name: i, mangledName: i, stage: s, workgroupSize: dc(r), path: e.path, params: wc(t.slice(o + 1, a)) }, next: a + 1 };
}
function wc(e) {
  const t = [];
  let n = 0;
  for (; n < e.length; ) {
    const [r, i] = Gn(e, n);
    if (n = i, !e[n] || e[n].text === ",") {
      n++;
      continue;
    }
    const s = _e(e[n]), o = Le(e, n + 1, ":");
    let a = o + 1, c = 0;
    for (; a < e.length && (e[a].text === "<" && c++, e[a].text === ">" && (c = Math.max(0, c - 1)), !(c === 0 && e[a].text === ",")); )
      a++;
    t.push({ name: s, attrs: r, type: ie(e.slice(o + 1, a)) }), n = a + 1;
  }
  return t;
}
function xc(e, t, n) {
  const r = _e(e[t + 1]), i = tn(e, t + 1, ";"), s = lc(e, t + 2, i, "=");
  return { item: { name: r, mangledName: r, id: W(n, "id"), defaultValue: s === void 0 ? void 0 : e.slice(s + 1, i).map((o) => o.text).join("") }, next: i + 1 };
}
function vc(e) {
  const t = [];
  let n = 0;
  for (; n < e.length; ) {
    const [r, i] = Gn(e, n);
    if (n = i, !e[n] || e[n].text === "," || e[n].text === ";") {
      n++;
      continue;
    }
    const s = _e(e[n]), o = Le(e, n + 1, ":");
    let a = o + 1, c = 0;
    for (; a < e.length && (e[a].text === "<" && c++, e[a].text === ">" && (c = Math.max(0, c - 1)), !(c === 0 && (e[a].text === "," || e[a].text === ";"))); )
      a++;
    t.push({ name: s, attrs: r, type: ie(e.slice(o + 1, a)), align: W(r, "align"), size: W(r, "size") }), n = a + 1;
  }
  return t;
}
function Rn(e, t, n) {
  return n === "override" ? t : rc(e.path, t);
}
function Sc(e) {
  return W(e, "group") !== void 0 || W(e, "binding") !== void 0;
}
const _c = "literal length required for auto layout; use draw.group(n, bg) manual binding", kc = "VGPUError: `bool` is not host-shareable in uniform/storage. Fix: use `u32` (0 | 1) → struct Params { enabled: u32 }", es = "use a manual group claim (`draw.group(n, bg)`)";
function Ec(e = 1, t = 1) {
  return R("VGPU-WGSL-REFLECT-ARRAY-LENGTH", _c, e, t);
}
function ts(e = 1, t = 1) {
  return R("VGPU-WGSL-REFLECT-BOOL-HOST-SHAREABLE", kc, e, t);
}
function jt(e, t, n = 1, r = 1) {
  return R("VGPU-WGSL-REFLECT-UNKNOWN-TYPE", `type '${e}' is unknown in ${t}; ${es}`, n, r);
}
function Ar(e, t, n = 1, r = 1) {
  return R("VGPU-WGSL-REFLECT-NS-TYPE", `type '${e}' is a namespace-member import; use a named import or manual @group(1+) binding`, n, r);
}
function ns(e, t = 1, n = 1) {
  return R("VGPU-WGSL-REFLECT-NON-HOST-SHAREABLE", `Type ${e} is not host-shareable; ${es}`, t, n);
}
const Ze = "naga-standard";
function $c(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const o of t) {
    const a = /* @__PURE__ */ new Map();
    for (const c of [...o.structs, ...o.aliases])
      a.set(c.originalName, { path: c.path, name: c.originalName, mangledName: c.mangledName, kind: "members" in c ? "struct" : "alias" });
    r.set(o.structs[0]?.path ?? o.aliases[0]?.path ?? o.vars[0]?.path ?? "", a);
  }
  const i = new Map(e.map((o) => [o.path, r.get(o.path) ?? /* @__PURE__ */ new Map()])), s = /* @__PURE__ */ new Map();
  for (const o of e) {
    const a = new Map(i.get(o.path));
    for (const c of o.parsed.imports)
      Ic(o, c, a, e, i);
    s.set(o.path, a);
  }
  return s;
}
function Ic(e, t, n, r, i, s) {
  const o = Tc(t, e.path, r), a = i.get(o);
  for (const c of t.bindings) {
    if (c.namespace) {
      n.set(c.local, { path: o, name: c.local, mangledName: c.local, kind: "namespace" });
      continue;
    }
    const u = a?.get(c.imported);
    u && n.set(c.local, u);
  }
}
function Pc(e, t) {
  const n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (const s of e) {
    for (const o of s.structs) {
      const a = {
        name: o.name,
        mangledName: o.mangledName,
        members: o.members.map((c) => ({ name: c.name, type: Fe(c.type, o.path, t), align: c.align, size: c.size }))
      };
      n.set(o.mangledName, a), i.set(o.mangledName, a);
    }
    for (const o of s.aliases) {
      const a = { name: o.name, mangledName: o.mangledName, target: Fe(o.target, o.path, t) };
      r.set(o.mangledName, a), i.set(o.mangledName, a);
    }
  }
  return { structs: n, aliases: r, byMangled: i };
}
function Fe(e, t, n, r) {
  switch (e.kind) {
    case "identifier": {
      const i = e.name.indexOf(".");
      if (i > 0) {
        const o = e.name.slice(0, i);
        if (n.get(t)?.get(o)?.kind === "namespace")
          throw Ar(e.name);
      }
      const s = n.get(t)?.get(e.name);
      if (s?.kind === "namespace")
        throw Ar(e.name);
      if (!s)
        throw jt(e.name, t);
      return { kind: "identifier", name: s.name, mangledName: s.mangledName };
    }
    case "array":
    case "atomic":
    case "vector":
    case "matrix":
    case "ptr":
      return { ...e, element: Fe(e.element, t, n) };
    case "texture":
      return { ...e, sampleType: e.sampleType ? Fe(e.sampleType, t, n) : void 0 };
    default:
      return e;
  }
}
function Qe(e, t) {
  if (!t || e.kind !== "identifier")
    return e;
  const n = t.aliases.get(e.mangledName ?? e.name);
  return n ? Qe(n.target, t) : e;
}
function $n(e, t) {
  const n = Qe(e, t);
  switch (n.kind) {
    case "array":
    case "atomic":
    case "vector":
    case "matrix":
    case "ptr":
      return { ...n, element: $n(n.element, t) };
    case "texture":
      return { ...n, sampleType: n.sampleType ? $n(n.sampleType, t) : void 0 };
    default:
      return n;
  }
}
function Tc(e, t, n, r) {
  const i = void 0;
  if (i !== void 0 && n.some((u) => u.path === i))
    return i;
  const s = e.from, o = t.slice(0, t.lastIndexOf("/") + 1), a = s.startsWith("/") ? s : Cc(`${o}${s}`);
  return [s, a].find((u) => n.some((l) => l.path === u)) ?? i ?? a;
}
function Cc(e) {
  const t = e.startsWith("/"), n = [];
  for (const r of e.split("/"))
    !r || r === "." || (r === ".." ? n.pop() : n.push(r));
  return `${t ? "/" : ""}${n.join("/")}`;
}
function yt(e, t, n = je(e), r = n, i) {
  const s = i ? $n(e, i) : e;
  return Mc(s, t, n, r, i);
}
function Mc(e, t, n, r, i) {
  switch (e.kind) {
    case "scalar":
      return Fc(e, t, n, r);
    case "atomic":
      return Ac(e, t, n, r);
    case "vector":
      return Lc(e, t, n, r, i);
    case "matrix":
      return Gc(e, t, n, r, i);
    case "array":
      return Rc(e, t, n, r, i);
    case "identifier":
      return Uc(e, t, n, r, i);
    default:
      throw ns(je(e));
  }
}
function Fc(e, t, n, r) {
  const i = Ji(e.name);
  if (e.name === "bool")
    throw ts();
  return { name: n, mangledName: r, addressSpace: t, layoutMode: Ze, type: e, align: i, size: i };
}
function Ac(e, t, n, r) {
  return { name: n, mangledName: r, addressSpace: t, layoutMode: Ze, type: e, align: 4, size: 4 };
}
function Lc(e, t, n, r, i) {
  const o = yt(e.element, t, n, r, i).size ?? 4, a = e.width === 2 ? o * 2 : o * 4;
  return { name: n, mangledName: r, addressSpace: t, layoutMode: Ze, type: e, align: a, size: o * e.width };
}
function Gc(e, t, n, r, i) {
  const s = { kind: "vector", width: e.rows, element: e.element }, o = yt(s, t, `${n}[]`, `${r}[]`, i), a = Ae(o.align, o.size ?? 0);
  return { name: n, mangledName: r, addressSpace: t, layoutMode: Ze, type: e, align: o.align, size: a * e.columns, stride: a, element: o };
}
function Rc(e, t, n, r, i) {
  Dc(e.countExpression);
  const s = yt(e.element, t, `${n}[]`, `${r}[]`, i), o = Ae(dt(e.element, t, i), s.size ?? 0);
  return {
    name: n,
    mangledName: r,
    addressSpace: t,
    layoutMode: Ze,
    type: e,
    align: dt(e, t, i),
    size: e.count === void 0 ? void 0 : o * e.count,
    stride: o,
    element: s,
    runtimeSized: e.count === void 0
  };
}
function Dc(e) {
  if (e !== void 0 && !Zi(e))
    throw Ec();
}
function Uc(e, t, n, r, i) {
  if (!i)
    throw jt(e.name, "<unknown>");
  const s = i.structs.get(e.mangledName ?? e.name);
  if (!s)
    throw jt(e.name, "<unknown>");
  const o = [];
  let a = 0, c = 1;
  for (const l of s.members) {
    const f = Vc(l, t, a, i);
    o.push(f.member), a = zc(t, l.type, f.offset, f.member.size ?? 0, i), c = Math.max(c, f.member.align);
  }
  const u = Oc(t, c);
  return { name: n, mangledName: r, addressSpace: t, layoutMode: Ze, type: e, align: u, size: Ae(u, a), members: o };
}
function Vc(e, t, n, r) {
  const i = yt(e.type, t, e.name, e.name, r), s = Math.max(dt(e.type, t, r), e.align ?? 1), o = Math.max(i.size ?? 0, e.size ?? 0), a = Ae(s, n);
  return {
    member: { name: e.name, offset: a, align: s, size: o, type: e.type, layout: i, explicitAlign: e.align, explicitSize: e.size },
    offset: a
  };
}
function zc(e, t, n, r, i) {
  return n + (e === "uniform" && Nc(t, i) ? Ae(16, r) : r);
}
function Nc(e, t) {
  const n = Qe(e, t);
  return n.kind === "identifier" && t.structs.has(n.mangledName ?? n.name);
}
function Oc(e, t) {
  return e === "uniform" ? Ae(16, t) : t;
}
function dt(e, t, n) {
  const r = n ? Qe(e, n) : e, i = Dt(r, t, n);
  return t === "uniform" && Bc(r, n) ? Ae(16, i) : i;
}
function Bc(e, t) {
  return e.kind === "array" || e.kind === "identifier" && !!t?.structs.get(e.mangledName ?? e.name);
}
function Dt(e, t, n) {
  const r = n ? Qe(e, n) : e;
  switch (r.kind) {
    case "scalar":
      return jc(r.name);
    case "atomic":
      return 4;
    case "vector":
      return r.width === 2 ? Dt(r.element, t, n) * 2 : Dt(r.element, t, n) * 4;
    case "matrix":
      return Dt({ kind: "vector", width: r.rows, element: r.element }, t, n);
    case "array":
      return dt(r.element, t, n);
    case "identifier":
      return Wc(r, t, n);
    default:
      throw ns(je(r));
  }
}
function jc(e) {
  if (e === "bool")
    throw ts();
  return Ji(e);
}
function Wc(e, t, n) {
  const r = n?.structs.get(e.mangledName ?? e.name);
  if (!r)
    throw jt(e.name, "<unknown>");
  return Math.max(1, ...r.members.map((i) => Math.max(dt(i.type, t, n), i.align ?? 1)));
}
const qc = /* @__PURE__ */ new Set([
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
]), Kc = /* @__PURE__ */ new Set(["import", "export", "from", "as"]), rs = /* @__PURE__ */ new Set([...qc, ...Kc]), Yc = /* @__PURE__ */ new Set([
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
]), Xc = /* @__PURE__ */ new Set(["binding_array"]), Hc = /* @__PURE__ */ new Set([
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
]), Zc = /* @__PURE__ */ new Set([
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
]), Qc = /* @__PURE__ */ new Set([
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
]), Jc = /* @__PURE__ */ new Set([
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
]), eu = /* @__PURE__ */ new Set(["function", "private", "storage", "uniform", "workgroup"]), tu = /* @__PURE__ */ new Set(["read", "read_write", "write"]), nu = /* @__PURE__ */ new Set([
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
  ...rs,
  ...Yc,
  ...Xc,
  ...Hc,
  ...Zc,
  ...Qc,
  ...Jc,
  ...eu,
  ...tu,
  ...nu
];
const ru = "VGPU-WGSL-IDENT-NONASCII", iu = "https://github.com/vercel-labs/vgpu/issues/294";
function su(e, t) {
  const n = [];
  let r = 0, i = 1, s = 1;
  const o = (c, u, l, f, d) => n.push({ kind: c, text: e.slice(u, l), start: u, end: l, line: f, column: d }), a = () => {
    e[r] === `
` ? (i++, s = 1) : s++, r++;
  };
  for (; r < e.length; ) {
    const c = e[r];
    if (/\s/.test(c)) {
      a();
      continue;
    }
    const u = r, l = i, f = s;
    if (c === "/" && e[r + 1] === "/") {
      for (; r < e.length && e[r] !== `
`; )
        a();
      o("lineComment", u, r, l, f);
      continue;
    }
    if (c === "/" && e[r + 1] === "*") {
      let d = 0;
      for (; r < e.length; ) {
        if (e[r] === "/" && e[r + 1] === "*") {
          d++, a(), a();
          continue;
        }
        if (e[r] === "*" && e[r + 1] === "/") {
          if (d--, a(), a(), d === 0) {
            o("blockComment", u, r, l, f);
            break;
          }
          continue;
        }
        a();
      }
      if (d !== 0)
        throw R("VGPU-WGSL-LEX-UNTERM-COMMENT", "Unterminated block comment", l, f);
      continue;
    }
    if (c === '"' || c === "'") {
      const d = c;
      for (a(); r < e.length && e[r] !== d; ) {
        if (e[r] === `
`)
          throw R("VGPU-WGSL-LEX-UNTERM-STRING", "Unterminated string", l, f);
        e[r] === "\\" && a(), a();
      }
      if (r >= e.length)
        throw R("VGPU-WGSL-LEX-UNTERM-STRING", "Unterminated string", l, f);
      a(), o("string", u, r, l, f);
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      for (; r < e.length && /[A-Za-z0-9_]/.test(e[r]); )
        a();
      const d = e.slice(u, r);
      o(rs.has(d) ? "keyword" : "ident", u, r, l, f);
      continue;
    }
    if (/[0-9]/.test(c) || c === "." && /[0-9]/.test(e[r + 1] ?? "")) {
      for (c === "." && a(); r < e.length; ) {
        const d = e[r];
        if (/[A-Za-z0-9_.]/.test(d)) {
          a();
          continue;
        }
        if ((d === "+" || d === "-") && au(e[r - 1]) && /[0-9]/.test(e[r + 1] ?? "")) {
          a();
          continue;
        }
        break;
      }
      o("number", u, r, l, f);
      continue;
    }
    if (c.charCodeAt(0) > 127)
      throw ou(e, r, i, s, t);
    a(), o("punct", u, r, l, f);
  }
  return n;
}
function ou(e, t, n, r, i) {
  let s = t;
  for (; s > 0 && Lr(e[s - 1]); )
    s--;
  let o = t + 1;
  for (; o < e.length && Lr(e[o]); )
    o++;
  const a = e.slice(s, o), c = r - (t - s), u = i === void 0 ? "" : ` in ${i}`, l = Va(ru, `Non-ASCII identifier '${a}'${u} at line ${n} column ${c}; vgpu's WGSL pipeline supports ASCII identifiers only`, { fix: `Rename '${a}' using ASCII letters, digits and '_'. Unicode (XID) identifiers are tracked in ${iu}`, line: n, column: c });
  return l.range = { file: i, start: { line: n, column: c } }, l;
}
function Lr(e) {
  return e.charCodeAt(0) > 127 || /[A-Za-z0-9_]/.test(e);
}
function au(e) {
  return e === "e" || e === "E" || e === "p" || e === "P";
}
const cu = /^_vgsl_[0-9a-f]{8,16}__[A-Za-z_][A-Za-z0-9_]*$/, uu = /* @__PURE__ */ new Set(["fn", "struct", "const", "alias", "var", "override"]);
function is(e) {
  return new fu(e).analyze();
}
class fu {
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
  constructor(t) {
    this.tokens = t, this.moduleScopeId = this.createScope("module", void 0, void 0, 0);
  }
  analyze() {
    this.collectTopLevel();
    for (const t of this.functions)
      this.walkFunction(t);
    return {
      tokens: this.tokens,
      scopes: this.scopes,
      declarations: this.declarations,
      references: this.references,
      functions: this.functions,
      preservedTokens: [...this.preserved.entries()].map(([t, n]) => ({ tokenIndex: t, reason: n })),
      fallback: { wholeModule: this.moduleFallbackReasons.length > 0, reasons: this.moduleFallbackReasons }
    };
  }
  collectTopLevel() {
    let t = 0;
    for (let n = 0; n < this.tokens.length; n++) {
      const r = this.tokens[n];
      if (!le(r)) {
        if (r.text === "{") {
          t++;
          continue;
        }
        if (r.text === "}") {
          t--, t < 0 && (this.moduleFallback("unmatched top-level closing brace", n), t = 0);
          continue;
        }
        if (t === 0) {
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
            r.kind === "keyword" && !uu.has(r.text) && this.moduleFallback(`unexpected top-level keyword '${r.text}'`, n);
          }
        }
      }
    }
    t !== 0 && this.moduleFallback("unclosed top-level brace", this.tokens.length - 1), this.scopes[this.moduleScopeId].endToken = Math.max(0, this.tokens.length - 1);
  }
  collectStruct(t) {
    const n = this.nextSig(t);
    if (n === void 0 || this.tokens[n]?.kind !== "ident")
      return this.moduleFallback("struct without name", t), t;
    this.preserveToken(n, "global");
    const r = this.nextSig(n);
    if (r === void 0 || this.tokens[r]?.text !== "{")
      return this.moduleFallback("struct without body", t), n;
    const i = this.findMatching(r, "{", "}");
    if (i === void 0)
      return this.moduleFallback("unclosed struct body", r), r;
    for (let s = r; s <= i; s++)
      this.tokens[s]?.kind === "ident" && this.preserveToken(s, "struct");
    return i;
  }
  collectFunction(t) {
    const n = this.nextSig(t);
    if (n === void 0 || this.tokens[n]?.kind !== "ident")
      return this.moduleFallback("function without name", t), t;
    const r = this.tokens[n].text, i = cu.test(r) && !this.hasEntryAttributeBefore(t);
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
  collectParams(t, n, r, i) {
    for (let s = t + 1; s < n; s++) {
      const o = this.tokens[s];
      if (!le(o)) {
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
  preserveFunctionSignatureTail(t, n) {
    for (let r = t; r < n; r++) {
      const i = this.tokens[r];
      if (!le(i)) {
        if (i.text === "@") {
          r = this.preserveAttribute(r);
          continue;
        }
        i.kind === "ident" && this.preserveToken(r, "type");
      }
    }
  }
  preserveGlobalDeclaration(t) {
    let n = t + 1;
    if (this.tokens[t]?.text === "var") {
      const s = this.nextSig(t);
      if (s !== void 0 && this.tokens[s]?.text === "<") {
        const o = this.findMatching(s, "<", ">");
        if (o === void 0)
          return this.moduleFallback("unparseable top-level var template", s), s;
        this.preserveRange(s, o, "type"), n = o + 1;
      }
    }
    const r = this.findNextIdent(n);
    r !== void 0 && (this.preserveToken(r, "global"), this.addDeclaration(this.tokens[r].text, "global", r, this.moduleScopeId, void 0, !1));
    const i = this.findStatementEnd(t);
    for (let s = t; s <= i; s++)
      this.tokens[s]?.kind === "ident" && this.preserveToken(s, "global");
    return i;
  }
  walkFunction(t) {
    const n = [this.moduleScopeId, t.scopeId], r = [], i = (a, c) => {
      const u = this.createScope(a, n[n.length - 1], t.id, c);
      return n.push(u), u;
    }, s = (a) => {
      if (n.length <= 2) {
        this.functionFallback(t, "scope frame underflow", a);
        return;
      }
      const c = n.pop();
      return this.scopes[c].endToken = a, c;
    };
    i("block", t.bodyStartToken);
    let o = 1;
    for (let a = t.bodyStartToken + 1; a < t.bodyEndToken; a++) {
      this.activatePendingSymbols(a);
      const c = this.tokens[a];
      if (le(c))
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
        (f === void 0 || this.tokens[f]?.text !== "(") && this.functionFallback(t, "for without parenthesized header", a), r.push({ scopeId: l, headerDepth: 0, awaitingBody: !1 });
        continue;
      }
      const u = r[r.length - 1];
      if (u && u.bodyDepth === void 0 && (c.text === "(" && u.headerDepth++, c.text === ")" && (u.headerDepth--, u.headerDepth <= 0 && (u.awaitingBody = !0))), c.text === "{") {
        o++;
        const l = lu(r, (f) => f.awaitingBody && f.bodyDepth === void 0);
        l && (l.bodyDepth = o), i("block", a);
        continue;
      }
      if (c.text === "}") {
        const l = o;
        for (s(a), o--; r.length > 0 && r[r.length - 1].bodyDepth === l; )
          s(a), r.pop();
        o < 0 && this.functionFallback(t, "unmatched closing brace", a);
        continue;
      }
      if (c.text === ":") {
        a = this.preserveTypeFrom(a + 1, ["=", ";", ",", ")", "{"], t.bodyEndToken);
        continue;
      }
      if (c.text === "-" && this.tokens[this.nextSig(a) ?? -1]?.text === ">") {
        a = this.preserveTypeFrom((this.nextSig(a) ?? a) + 1, ["{"], t.bodyEndToken);
        continue;
      }
      if (c.text === "let" || c.text === "const" || c.text === "var") {
        a = this.collectLocalDeclaration(a, n[n.length - 1], t);
        continue;
      }
      if (c.kind === "ident" && !this.preserved.has(a)) {
        const l = this.resolve(c.text, n);
        l !== void 0 ? this.references.push({ name: c.text, tokenIndex: a, declarationId: l, scopeId: n[n.length - 1], functionId: t.id }) : this.preserveToken(a, "unknown");
      }
    }
    for (; n.length > 2; )
      s(t.bodyEndToken);
  }
  collectLocalDeclaration(t, n, r) {
    const i = this.tokens[t].text;
    let s = t + 1;
    if (i === "var") {
      const c = this.nextSig(t);
      if (c !== void 0 && this.tokens[c]?.text === "<") {
        const u = this.findMatching(c, "<", ">");
        if (u === void 0)
          return this.functionFallback(r, "unparseable var template", c), c;
        this.preserveRange(c, u, "type"), s = u + 1;
      }
    }
    const o = this.findNextIdent(s);
    if (o === void 0 || o >= r.bodyEndToken)
      return this.functionFallback(r, `${i} without identifier`, t), t;
    this.addDeclaration(this.tokens[o].text, i, o, n, r.id, !0, this.findStatementEnd(t));
    const a = this.nextSig(o);
    return a !== void 0 && this.tokens[a]?.text === ":" ? this.preserveTypeFrom(a + 1, ["=", ";", ",", ")"], r.bodyEndToken) : o;
  }
  addDeclaration(t, n, r, i, s, o, a) {
    const c = this.declarations.length;
    return this.declarations.push({ id: c, name: t, kind: n, tokenIndex: r, scopeId: i, functionId: s, safeToRename: o }), a !== void 0 ? this.pendingSymbols.push({ name: t, id: c, scopeId: i, activateAfter: a }) : this.activateSymbol(t, c, i), c;
  }
  activatePendingSymbols(t) {
    for (let n = this.pendingSymbols.length - 1; n >= 0; n--) {
      const r = this.pendingSymbols[n];
      r.activateAfter >= t || (this.activateSymbol(r.name, r.id, r.scopeId), this.pendingSymbols.splice(n, 1));
    }
  }
  activateSymbol(t, n, r) {
    let i = this.symbolsByScope.get(r);
    i || (i = /* @__PURE__ */ new Map(), this.symbolsByScope.set(r, i)), i.has(t) || i.set(t, n);
  }
  resolve(t, n) {
    for (let r = n.length - 1; r >= 0; r--) {
      const i = this.symbolsByScope.get(n[r])?.get(t);
      if (i !== void 0)
        return i;
    }
  }
  preserveAttribute(t) {
    this.preserveToken(t, "attribute");
    const n = this.nextSig(t);
    if (n === void 0)
      return t;
    this.preserveToken(n, "attribute");
    const r = this.nextSig(n);
    if (r === void 0 || this.tokens[r]?.text !== "(")
      return n;
    const i = this.findMatching(r, "(", ")");
    return i === void 0 ? (this.preserveRange(r, r, "attribute"), r) : (this.preserveRange(r, i, "attribute"), i);
  }
  preserveTypeFrom(t, n, r) {
    let i = 0, s = 0, o = 0, a = t - 1;
    for (let c = t; c < r; c++) {
      const u = this.tokens[c];
      if (!le(u)) {
        if (i === 0 && s === 0 && o === 0 && n.includes(u.text))
          return Math.max(t - 1, c - 1);
        if (u.text === "<")
          i++;
        else if (u.text === ">")
          i = Math.max(0, i - 1);
        else if (u.text === "(")
          s++;
        else if (u.text === ")") {
          if (s === 0 && n.includes(")"))
            return Math.max(t - 1, c - 1);
          s = Math.max(0, s - 1);
        } else u.text === "[" ? o++ : u.text === "]" && (o = Math.max(0, o - 1));
        u.kind === "ident" && this.preserveToken(c, "type"), a = c;
      }
    }
    return a;
  }
  preserveStatement(t, n) {
    const r = this.findStatementEnd(t);
    return this.preserveRange(t, r, n), r;
  }
  preserveRange(t, n, r) {
    for (let i = t; i <= n; i++)
      this.tokens[i] && this.tokens[i].kind !== "lineComment" && this.tokens[i].kind !== "blockComment" && this.preserveToken(i, r);
  }
  preserveToken(t, n) {
    this.preserved.has(t) || this.preserved.set(t, n);
  }
  createScope(t, n, r, i) {
    const s = this.scopes.length;
    return this.scopes.push({ id: s, kind: t, parentId: n, functionId: r, startToken: i }), s;
  }
  nextSig(t) {
    for (let n = t + 1; n < this.tokens.length; n++)
      if (!le(this.tokens[n]))
        return n;
  }
  findNextIdent(t) {
    for (let n = t; n < this.tokens.length; n++) {
      const r = this.tokens[n];
      if (!le(r)) {
        if (r.kind === "ident")
          return n;
        if (r.text !== "@")
          return;
      }
    }
  }
  findNextText(t, n) {
    for (let r = t; r < this.tokens.length; r++)
      if (!le(this.tokens[r]) && this.tokens[r].text === n)
        return r;
  }
  // `<` / `>` are deliberately not tracked here: in a declaration's initializer they are
  // comparison or shift operators, not template brackets, and a net-positive count made this scan
  // overshoot the statement's own `;` (vgpu#251). A WGSL template argument list can never contain
  // `;`, `{` or `}`, so angle depth is not load-bearing for finding a statement end.
  findStatementEnd(t) {
    let n = 0;
    for (let r = t; r < this.tokens.length; r++) {
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
  findMatching(t, n, r) {
    let i = 0;
    for (let s = t; s < this.tokens.length; s++) {
      const o = this.tokens[s].text;
      if (o === n && i++, o === r && (i--, i === 0))
        return s;
    }
  }
  hasEntryAttributeBefore(t) {
    for (let n = t - 1; n >= 0; n--) {
      const r = this.tokens[n];
      if (!le(r)) {
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
  moduleFallback(t, n) {
    this.moduleFallbackReasons.push(`${t} at token ${n}`);
  }
  functionFallback(t, n, r) {
    t.skipped = !0, t.fallbackReasons.push(`${n} at token ${r}`);
  }
}
function lu(e, t) {
  for (let n = e.length - 1; n >= 0; n--)
    if (t(e[n]))
      return e[n];
}
function le(e) {
  return e.kind === "lineComment" || e.kind === "blockComment";
}
const du = /* @__PURE__ */ new Set(["textureSample", "textureSampleBias", "textureSampleLevel", "textureSampleGrad", "textureGather", "textureSampleBaseClampToEdge"]), hu = /* @__PURE__ */ new Set(["textureSampleCompare", "textureSampleCompareLevel", "textureGatherCompare"]);
function pu(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (let i = 0; i < e.length; i++) {
    const s = e[i], o = t[i], a = is(s.tokens), c = /* @__PURE__ */ new Map();
    for (const l of o.vars) {
      const f = W(l.attrs, "group"), d = W(l.attrs, "binding"), m = a.declarations.find((g) => g.kind === "global" && g.name === l.name);
      f !== void 0 && d !== void 0 && m && c.set(m.id, { group: f, binding: d });
    }
    const u = /* @__PURE__ */ new Map();
    for (const l of a.declarations) {
      if (l.kind !== "function")
        continue;
      const f = a.functions.find((d) => d.nameTokenIndex === l.tokenIndex);
      f && u.set(l.id, f.id);
    }
    for (const l of o.entries) {
      const f = a.functions.find((h) => h.name === l.name), d = [];
      let m = a.fallback.wholeModule || !f;
      !m && f && (m = !ss(f.id, /* @__PURE__ */ new Map(), /* @__PURE__ */ new Set(), a, c, u, d));
      const g = f ? wu(f.id, a, c, u) : n.map(In);
      r.set(l, m ? xu(n, g) : vu(d));
    }
  }
  return r;
}
function ss(e, t, n, r, i, s, o) {
  const a = r.functions[e];
  if (!a || a.skipped)
    return !1;
  const c = `${e}|${[...t].map(([f, d]) => `${f}:${d.group}:${d.binding}`).join(",")}`;
  if (n.has(c))
    return !0;
  n.add(c);
  const u = r.references.filter((f) => f.functionId === e), l = new Map(u.map((f) => [f.tokenIndex, f]));
  for (let f = a.bodyStartToken + 1; f < a.bodyEndToken; f++) {
    const d = r.tokens[f]?.text, m = du.has(d ?? "") ? "filtering" : hu.has(d ?? "") ? "comparison" : void 0, g = l.get(f), h = g && s.get(g.declarationId);
    if (!m && h === void 0)
      continue;
    const S = yu(r, f);
    if (S === void 0 || r.tokens[S]?.text !== "(")
      continue;
    const x = bu(r, S);
    if (!x)
      return !1;
    const w = x.map(([$, I]) => mu($, I, r, i, t));
    if (m) {
      const $ = d === "textureGather" && !gu(x[0], r, i, t) ? 1 : 0, I = w[$], T = w[$ + 1];
      if (!I || !T)
        return !1;
      o.push({ texture: I, sampler: T, mode: m });
    } else {
      const $ = r.declarations.filter((T) => T.kind === "param" && T.functionId === h).sort((T, E) => T.tokenIndex - E.tokenIndex), I = /* @__PURE__ */ new Map();
      for (let T = 0; T < $.length; T++)
        w[T] && I.set($[T].id, w[T]);
      if (!ss(h, I, n, r, i, s, o))
        return !1;
    }
  }
  return !0;
}
function mu(e, t, n, r, i) {
  for (const s of n.references) {
    if (s.tokenIndex < e || s.tokenIndex > t)
      continue;
    const o = r.get(s.declarationId) ?? i.get(s.declarationId);
    if (o)
      return o;
  }
}
function gu(e, t, n, r) {
  const i = t.references.find((s) => s.tokenIndex >= e[0] && s.tokenIndex <= e[1]);
  return i?.tokenIndex === e[0] ? n.get(i.declarationId) ?? r.get(i.declarationId) : void 0;
}
function bu(e, t) {
  const n = [];
  let r = 1, i = 0, s = 0, o = 0, a = t + 1;
  for (let c = t + 1; c < e.tokens.length; c++) {
    const u = e.tokens[c].text;
    if (u === "(")
      r++;
    else if (u === ")") {
      if (r--, r === 0)
        return n.push([a, c - 1]), n;
    } else u === "[" ? i++ : u === "]" ? i-- : u === "{" ? s++ : u === "}" ? s-- : u === "<" ? o++ : u === ">" ? o-- : u === "," && r === 1 && i === 0 && s === 0 && o === 0 && (n.push([a, c - 1]), a = c + 1);
  }
}
function yu(e, t) {
  for (let n = t + 1; n < e.tokens.length; n++)
    if (e.tokens[n].kind !== "lineComment" && e.tokens[n].kind !== "blockComment")
      return n;
}
function wu(e, t, n, r) {
  const i = [e], s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
  for (; i.length; ) {
    const a = i.pop();
    if (!s.has(a)) {
      s.add(a);
      for (const c of t.references) {
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
function xu(e, t) {
  const n = new Set(t.map((o) => `${o.group}:${o.binding}`)), r = e.filter((o) => n.has(`${o.group}:${o.binding}`)), i = r.filter((o) => o.bindingLayout?.kind === "texture" && o.bindingLayout.texture.sampleType === "unfilterable-float" && !o.bindingLayout.texture.multisampled), s = r.filter((o) => o.bindingLayout?.kind === "sampler" && o.bindingLayout.sampler.type === "filtering");
  return i.flatMap((o) => s.map((a) => ({ texture: In(o), sampler: In(a), mode: "filtering" })));
}
function In(e) {
  return { group: e.group, binding: e.binding };
}
function vu(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const r = `${n.texture.group}:${n.texture.binding}:${n.sampler.group}:${n.sampler.binding}:${n.mode}`;
    return t.has(r) ? !1 : (t.add(r), !0);
  });
}
function Su(e, t) {
  const n = e.map(pc), r = $c(e, n), i = Pc(n, r), s = [], o = [];
  for (const u of n)
    for (const l of u.vars) {
      const f = W(l.attrs, "group"), d = W(l.attrs, "binding");
      if (f === void 0 || d === void 0)
        continue;
      const m = Fe(l.type, l.path, r), g = Wa(m, l.addressSpace), h = l.addressSpace === "uniform" || l.addressSpace === "storage" ? yt(m, l.addressSpace, l.name, l.mangledName, i) : void 0;
      h && o.push(h), s.push({
        group: f,
        binding: d,
        name: l.name,
        mangledName: l.mangledName,
        type: m,
        kind: g,
        addressSpace: l.addressSpace,
        access: l.access,
        struct: m.kind === "identifier" ? i.structs.get(m.mangledName ?? m.name) : void 0,
        layout: h,
        bindingLayout: qa(g, l.addressSpace, l.access, m, h)
      });
    }
  s.sort((u, l) => u.group - l.group || u.binding - l.binding);
  const a = _u(e, n, s), c = pu(e, n, s);
  return {
    bindings: s,
    entryPoints: n.flatMap((u) => u.entries.map((l) => ku(l, n.flatMap((f) => f.structs), r, i, a.get(l) ?? s, c.get(l) ?? []))),
    overrides: n.flatMap((u) => u.overrides),
    featuresRequired: [...new Set(n.flatMap((u) => u.features))],
    aliases: [...i.aliases.values()],
    structs: [...i.structs.values()],
    hostShareableLayouts: o
  };
}
function _u(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (let i = 0; i < e.length; i++) {
    const s = e[i], o = t[i], a = is(s.tokens), c = a.fallback.wholeModule, u = /* @__PURE__ */ new Map();
    for (const f of a.declarations) {
      if (f.kind !== "function")
        continue;
      const d = a.functions.find((m) => m.nameTokenIndex === f.tokenIndex);
      d && u.set(f.id, d.id);
    }
    const l = /* @__PURE__ */ new Map();
    for (const f of o.vars) {
      const d = W(f.attrs, "group"), m = W(f.attrs, "binding");
      if (d === void 0 || m === void 0)
        continue;
      const g = a.declarations.find((h) => h.kind === "global" && h.name === f.name);
      g && l.set(g.id, { group: d, binding: m });
    }
    for (const f of o.entries) {
      const d = a.functions.find((S) => S.name === f.name);
      if (c || !d) {
        r.set(f, n);
        continue;
      }
      const m = [d.id], g = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Map();
      for (; m.length; ) {
        const S = m.pop();
        if (!g.has(S) && (g.add(S), !!a.functions[S]))
          for (const x of a.references) {
            if (x.functionId !== S)
              continue;
            const w = l.get(x.declarationId);
            w && h.set(`${w.group}:${w.binding}`, w);
            const $ = u.get(x.declarationId);
            $ !== void 0 && m.push($);
          }
      }
      r.set(f, [...h.values()].sort((S, x) => S.group - x.group || S.binding - x.binding));
    }
  }
  return r;
}
function ku(e, t, n, r, i, s) {
  return {
    name: e.name,
    mangledName: e.mangledName,
    stage: e.stage,
    // `workgroupSize` and `inputs` stay absent rather than `undefined`-valued when they do not
    // apply: an own key valued `undefined` survives structuredClone but is dropped by
    // JSON.stringify, which would make the key set differ across serialization boundaries.
    ...e.workgroupSize ? { workgroupSize: e.workgroupSize } : {},
    bindings: i.map(({ group: o, binding: a }) => ({ group: o, binding: a })),
    samplingPairs: s,
    ...e.stage === "vertex" ? { inputs: Eu(e, t, n, r) } : {}
  };
}
function Eu(e, t, n, r) {
  const i = [];
  for (const s of e.params) {
    if (Gr(s.attrs, "builtin"))
      continue;
    const o = Fe(s.type, e.path, n), a = W(s.attrs, "location");
    if (a !== void 0) {
      i.push({ name: s.name, location: a, type: o });
      continue;
    }
    const c = Qe(o, r);
    if (c.kind !== "identifier")
      continue;
    const u = t.find((f) => f.mangledName === (c.mangledName ?? c.name)), l = r.structs.get(c.mangledName ?? c.name);
    if (u)
      for (let f = 0; f < u.members.length; f++) {
        const d = u.members[f];
        if (Gr(d.attrs, "builtin"))
          continue;
        const m = W(d.attrs, "location");
        m !== void 0 && i.push({ name: d.name, location: m, type: l?.members[f]?.type ?? Fe(d.type, u.path, n) });
      }
  }
  return i;
}
function Gr(e, t) {
  return e.some((n) => n.name === t);
}
function Dn(e, t = "<runtime>") {
  const n = su(e, t), r = Na(n);
  if (r.imports.length > 0)
    throw R("VGPU-WGSL-REFLECT-SOURCE-IMPORT", "reflectSource() accepts a single raw WGSL string; use resolveShader() for WGSL import graphs.");
  return Su([{ path: t, source: e, tokens: n, parsed: r }]);
}
function Un() {
  const e = /* @__PURE__ */ new Map();
  return {
    getOrCreate(t, n, r, i) {
      const s = r.map(Wt), o = `${t}:${n}:${s.join("|")}`, a = e.get(o);
      if (a)
        return a.bindGroup;
      const c = i();
      return e.set(o, { identities: s, bindGroup: c }), c;
    },
    evictIdentity(t) {
      const n = Wt(t);
      for (const [r, i] of e)
        i.identities.includes(n) && e.delete(r);
    },
    clearDraw(t) {
      const n = `${t}:`;
      for (const r of e.keys())
        r.startsWith(n) && e.delete(r);
    },
    dispose() {
      e.clear();
    }
  };
}
function Wt(e) {
  return typeof e == "string" || typeof e == "number" ? String(e) : `${e.kind}:${e.id}`;
}
function ht(e, t, n) {
  const r = e[t];
  if (!r)
    throw new y({
      code: "VGPU-REFLECT-ENTRY-METADATA-MISSING",
      message: `Entry point '${e.name}' has no reflected ${t}.`,
      fix: "Pass the reflection from reflectSource()/resolveShader().",
      where: n
    });
  return r;
}
const qt = /* @__PURE__ */ new WeakMap();
function ut(e, t) {
  if (!e.gpu.pushErrorScope || !e.gpu.popErrorScope)
    return;
  e.gpu.pushErrorScope("validation");
  const n = qt.get(e.gpu);
  n ? n.push(t) : qt.set(e.gpu, [t]);
}
function Y(e) {
  const t = qt.get(e.gpu);
  if (!t?.length || !e.gpu.popErrorScope)
    return;
  const n = t.pop();
  return t.length || qt.delete(e.gpu), { context: n, error: e.gpu.popErrorScope() };
}
function os(e) {
  const t = [];
  let n = Y(e);
  for (; n; )
    t.push(n), n = Y(e);
  return t;
}
function $u(e) {
  const t = Y(e);
  t && zn(t);
}
function as(e) {
  for (const t of os(e))
    zn(t);
}
function j(e) {
  for (const t of e)
    zn(t);
}
function Vn(e) {
  return e.gpu.queue.onSubmittedWorkDone?.() ?? Promise.resolve();
}
function cs(e, t = [], n = {}) {
  return Pu(e, t, n.errorSink ?? Tu);
}
function Kt(e, t) {
  return {
    context: e.context,
    error: Iu(e.error, t.error)
  };
}
async function Iu(e, t) {
  const n = await Promise.allSettled([e, t]);
  for (const i of n)
    if (i.status === "fulfilled" && i.value)
      return i.value;
  const r = n.find((i) => i.status === "rejected");
  if (r?.status === "rejected")
    throw r.reason;
  return null;
}
async function Pu(e, t, n) {
  await Vn(e);
  for (const r of t)
    try {
      const i = await r.error;
      i && await n(Ke(r.context.label, r.context.group, i));
    } catch (i) {
      await n(Ke(r.context.label, r.context.group, i));
    }
}
function zn(e) {
  e.error.catch(() => {
  });
}
function Tu(e) {
  console.error(e);
}
function us(e, t, n, r) {
  try {
    t.end();
  } catch (i) {
    const s = os(e);
    j(n), j(s), n.length = 0;
    const o = s[0]?.context ?? r;
    throw o ? Ke(o.label, o.group, i) : i;
  }
}
let Cu = 1;
const Rr = /* @__PURE__ */ new WeakMap();
function Mu(e) {
  return e === null || typeof e != "object" || ArrayBuffer.isView(e) || e instanceof ArrayBuffer || Array.isArray(e) ? !0 : e instanceof ve || e instanceof He ? !1 : !ls(e);
}
function Pn(e) {
  return typeof e != "object" || e === null || Array.isArray(e) || ArrayBuffer.isView(e) || e instanceof ArrayBuffer || e instanceof ve || e instanceof He ? !1 : !ls(e);
}
function Dr(e, t, n) {
  switch (e.bindingLayout?.kind) {
    case "buffer":
      return Fu(e, t, n);
    case "texture":
      return Au(e, t, n);
    case "sampler":
      return Lu(e, t);
    case "storageTexture":
      throw de(e, "storage texture", "Pass a storage-compatible texture.");
    case "externalTexture":
      throw de(e, "external texture", "Pass a compatible GPUExternalTexture.");
    default:
      throw de(e, "reflected resource", "Fix shader reflection bindingLayout.");
  }
}
function Fu(e, t, n) {
  const r = Ia(t);
  if (r)
    return r[zi](e, n.sourceHint);
  if (t instanceof ve)
    return Ir(t, `${n.sourceHint}.set`), Ru(e, t.options.usage), { resource: { buffer: t.gpu }, identity: t.resourceIdentity, unsubscribe: (i) => t.onDestroy(i) };
  if (Uu(t))
    return Ir(t.buffer, `${n.sourceHint}.set`), { resource: { buffer: t.gpu, offset: 0, size: t.size }, identity: t.buffer.resourceIdentity, unsubscribe: (i) => t.buffer.onDestroy(i) };
  if (hs(t))
    return { resource: t, identity: pt(t.buffer) };
  if (Nn(t))
    return { resource: { buffer: t }, identity: pt(t) };
  throw de(e, "buffer", `Pass a compatible Buffer/Uniform: ${e.name}.set({ ${e.name}: gpu.device.createBuffer(...) }).`);
}
function Au(e, t, n) {
  const r = fs(t);
  if (r) {
    const i = r.color;
    Ur(e, i, n);
    const s = r.onTexturesRecreated?.bind(r);
    return { resource: i.createView(), identity: i.resourceIdentity, unsubscribe: (o) => r.onDestroy(o), onRecreate: s ? (o) => s(o) : void 0 };
  }
  if (t instanceof He)
    return Du(e, t.usage), Ur(e, t, n), { resource: t.createView(), identity: t.resourceIdentity, unsubscribe: (i) => t.onDestroy(i) };
  if (ds(t))
    return { resource: t.createView(), identity: t.resourceIdentity ?? pt(t) };
  if (typeof t == "object" && t !== null)
    return { resource: t, identity: pt(t) };
  throw de(e, "texture/target", `Pass a Texture or Target: ${e.name}.set({ ${e.name}: scene.color }) or set({ ${e.name}: scene }).`);
}
function Lu(e, t) {
  if (Gu(t))
    return { resource: t, identity: pt(t) };
  throw de(e, "sampler", `Use the cached sampler: set({ ${e.name}: sampler(gpu) }).`);
}
function Gu(e) {
  return typeof e != "object" || e === null || e instanceof ve || e instanceof He ? !1 : !Nn(e) && !hs(e) && !ds(e) && !fs(e);
}
function Ru(e, t) {
  const n = e.bindingLayout?.kind === "buffer" ? e.bindingLayout.buffer.type : void 0;
  if (n === "uniform" && !t.includes("uniform"))
    throw de(e, "uniform buffer", "Create with usage: ['uniform','copy_dst'].");
  if ((n === "storage" || n === "read-only-storage") && !t.includes("storage"))
    throw de(e, "storage buffer", "Create with usage: ['storage','copy_dst'].");
}
function Du(e, t) {
  if (!t.includes("texture_binding") && !t.includes("render_attachment"))
    throw de(e, "sampled texture", "Use texture_binding usage or a sampleable Target.");
}
function Ur(e, t, n) {
  if (!(!n.filterableTexture || n.float32Filterable) && (t.format === "r32float" || t.format === "rg32float" || t.format === "rgba32float"))
    throw Oo(n.sourceHint, e, t.format, t.label ?? "texture", n.pairedSampler);
}
function fs(e) {
  if (typeof e != "object" || e === null)
    return;
  const t = e;
  if (!(!t.resourceIdentity || !t.color || typeof t.onDestroy != "function"))
    return t;
}
function ls(e) {
  const t = e;
  return "gpu" in t || "bindGroup" in t || "createView" in t || "resourceIdentity" in t;
}
function pt(e) {
  if (typeof e != "object" || e === null)
    return `value:${String(e)}`;
  let t = Rr.get(e);
  return t || (t = { kind: "external", id: Cu++ }, Rr.set(e, t)), t;
}
function Uu(e) {
  return typeof e == "object" && e !== null && "gpu" in e && "size" in e && "buffer" in e && e.buffer instanceof ve;
}
function ds(e) {
  return typeof e == "object" && e !== null && typeof e.createView == "function";
}
function hs(e) {
  return typeof e == "object" && e !== null && "buffer" in e && Nn(e.buffer);
}
function Nn(e) {
  return typeof e == "object" && e !== null && "size" in e && "usage" in e && typeof e.destroy == "function";
}
function Vu(e, t) {
  zu(e);
  const n = new ArrayBuffer(e.size);
  return On(new DataView(n), e, 0, t), n;
}
function zu(e) {
  if (e.size === void 0)
    throw N("set", `No se puede inferir byteLength para layout runtime-sized '${e.name}'.`);
}
function On(e, t, n, r) {
  if (t.members)
    return Nu(e, t.members, n, r);
  Ou(e, t, n, r);
}
function Nu(e, t, n, r) {
  const i = r;
  for (const s of t)
    On(e, s.layout, n + s.offset, i?.[s.name]);
}
function Ou(e, t, n, r) {
  switch (t.type.kind) {
    case "scalar":
      return Bn(e, n, t.type.name, r);
    case "vector":
      return Bu(e, n, t.type, r);
    case "matrix":
      return ju(e, t, n, r);
    case "array":
      return Wu(e, t, n, r);
    default:
      throw N("set", `No hay writer para layout ${t.type.kind}.`);
  }
}
function Bn(e, t, n, r) {
  n === "f32" ? e.setFloat32(t, Number(r ?? 0), !0) : n === "i32" ? e.setInt32(t, Number(r ?? 0), !0) : n === "u32" || n === "bool" ? e.setUint32(t, n === "bool" ? r ? 1 : 0 : Number(r ?? 0), !0) : e.setUint16(t, qu(Number(r ?? 0)), !0);
}
function Bu(e, t, n, r) {
  const i = r, s = ps(n.element);
  for (let o = 0; o < n.width; o++)
    Bn(e, t + o * s, jn(n.element), i?.[o] ?? 0);
}
function ju(e, t, n, r) {
  const i = t.type, s = r, o = ps(i.element), a = t.stride ?? 16;
  for (let c = 0; c < i.columns; c++)
    for (let u = 0; u < i.rows; u++)
      Bn(e, n + c * a + u * o, jn(i.element), s?.[c * i.rows + u] ?? 0);
}
function Wu(e, t, n, r) {
  const i = r, s = t.stride ?? t.element?.size ?? 0;
  if (!t.element)
    throw N("set", "Array layout sin element layout.");
  for (let o = 0; o < (i?.length ?? 0); o++)
    On(e, t.element, n + o * s, i[o]);
}
function ps(e) {
  return jn(e) === "f16" ? 2 : 4;
}
function jn(e) {
  if (e.kind !== "scalar")
    throw N("set", `Expected scalar, got ${e.kind}`);
  return e.name;
}
function qu(e) {
  const t = new Float32Array(1), n = new Uint32Array(t.buffer);
  t[0] = e;
  const r = n[0], i = r >> 16 & 32768, s = r & 8388607, o = r >> 23 & 255;
  if (o === 255)
    return i | (s ? 32256 : 31744);
  const a = o - 127 + 15;
  return a >= 31 ? i | 31744 : a <= 0 ? a < -10 ? i : i | (s | 8388608) >> 1 - a + 13 : i | a << 10 | s >> 13;
}
const Vr = /* @__PURE__ */ new WeakMap();
function ms(e, t) {
  const n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  for (const s of t) {
    const o = s.stage === "vertex" ? 1 : s.stage === "fragment" ? 2 : 4;
    for (const a of ht(s, "bindings", "visibility")) {
      const c = `${a.group}:${a.binding}`;
      n.set(c, (n.get(c) ?? 0) | o);
    }
    for (const a of ht(s, "samplingPairs", "visibility"))
      a.mode === "filtering" && r.add(`${a.texture.group}:${a.texture.binding}`);
  }
  const i = (s) => n.get(`${s.group}:${s.binding}`) ?? 0;
  return Object.defineProperty(i, "filterable", { value: r }), i;
}
function gs(e, t, n = Wn) {
  return e.flatMap((r) => {
    if (r.group !== t)
      return [];
    const i = n(r);
    return i === 0 ? [] : [{ binding: r.binding, visibility: i, ...Zu(r, n.filterable?.has(`${r.group}:${r.binding}`) ?? !1) }];
  });
}
function bs(e, t, n, r = Wn) {
  const i = /* @__PURE__ */ new Map(), s = n.bindings.filter((a) => r(a) !== 0).map((a) => a.group), o = Math.max(-1, ...s);
  for (let a = 0; a <= o; a++)
    i.set(a, Yu(e, t, n, a, r));
  return i;
}
function Ku(e, t) {
  return e.gpu.createPipelineLayout({ bindGroupLayouts: Xu(t) });
}
function Yu(e, t, n, r, i = Wn) {
  return ys(e, `${t}.group${r}.bgl`, gs(n.bindings, r, i));
}
function ys(e, t, n) {
  let r = Vr.get(e.gpu);
  r || (r = /* @__PURE__ */ new Map(), Vr.set(e.gpu, r));
  const i = JSON.stringify(n), s = r.get(i);
  if (s)
    return s;
  const o = Vo(e.gpu.createBindGroupLayout({ label: t, entries: n }), { entries: n });
  return r.set(i, o), o;
}
function Xu(e) {
  const t = Math.max(-1, ...e.keys()), n = [];
  for (let r = 0; r <= t; r++)
    n.push(Hu(e, r));
  return n;
}
function Hu(e, t) {
  const n = e.get(t);
  if (!n)
    throw N("pipelineLayout", `Bind groups must be contiguous for pipeline layout; missing group(${t}).`);
  return n;
}
function Zu(e, t) {
  const n = e.bindingLayout;
  if (!n)
    throw N("bindGroupLayout", `Binding '${e.name}' does not have a reflected bindingLayout.`);
  return t && n.kind === "texture" && n.texture.sampleType === "unfilterable-float" && !n.texture.multisampled ? { texture: { ...n.texture, sampleType: "float" } } : Qu(n);
}
function Qu(e) {
  switch (e.kind) {
    case "buffer":
      return { buffer: { ...e.buffer } };
    case "sampler":
      return { sampler: { ...e.sampler } };
    case "texture":
      return { texture: { ...e.texture } };
    case "storageTexture":
      return { storageTexture: { ...e.storageTexture } };
    case "externalTexture":
      return { externalTexture: {} };
  }
}
function Wn(e) {
  const t = globalThis.GPUShaderStage, n = t?.VERTEX ?? 1, r = t?.FRAGMENT ?? 2, i = t?.COMPUTE ?? 4;
  return e.kind === "buffer" ? n | r | i : r | i;
}
function ws(e) {
  const t = Ju(e.reflection), n = [...e.bindGroupLayouts.keys()].sort((p, b) => p - b), r = /* @__PURE__ */ new Map();
  function i(p) {
    const b = [];
    for (const [_, k] of Object.entries(p))
      b.push(...o(_, k));
    return b;
  }
  function s(p) {
    const b = e.bindGroupLayouts.get(p.info.group);
    return !!b && !!ct(b)?.entries.some((_) => _.binding === p.info.binding);
  }
  function o(p, b) {
    const _ = t.get(p);
    if (_)
      return a(_, p, b);
    const k = ef(p, t, e.label);
    if (!k)
      throw N(`${e.label}.set`, `Binding '${p}' does not exist in '${e.label}'.`);
    return c(k, p, b);
  }
  function a(p, b, _) {
    T(p.info.group);
    const k = zr(p.info, _);
    Nr(p, b, k);
    const C = Ut(p.identity);
    return k === "lib" ? u(p, sf(p.libValue, _)) : f(p, _), s(p) ? mn(p, C) : [];
  }
  function c(p, b, _) {
    T(p.info.group);
    const k = zr(p.info, _);
    if (Nr(p, b, k), tf(p, b, k), k !== "lib")
      throw N(`${e.label}.set`, `Member '${b}' needs a JS value; set resource '${p.info.name}' instead.`);
    const C = Ut(p.identity);
    return u(p, { ...of(p.libValue), [b]: _ }), s(p) ? mn(p, C) : [];
  }
  function u(p, b) {
    const _ = A(p);
    p.libValue = b;
    const k = Vu(_, b);
    p.buffer || E(p, _.size), p.bytes = k, p.buffer.write(k, 0);
  }
  function l(p) {
    const b = ct(e.bindGroupLayouts.get(p.group))?.entries.find((C) => C.binding === p.binding), _ = e.reflection.entryPoints.flatMap((C) => ht(C, "samplingPairs", e.label)).find((C) => C.mode === "filtering" && C.texture.group === p.group && C.texture.binding === p.binding), k = _ && e.reflection.bindings.find((C) => C.group === _.sampler.group && C.binding === _.sampler.binding);
    return { sourceHint: e.label, filterableTexture: b?.texture?.sampleType === "float", float32Filterable: e.device.features.has("float32-filterable"), pairedSampler: k };
  }
  function f(p, b) {
    const _ = Dr(p.info, b, l(p.info));
    p.unsubscribe?.(), p.unsubscribeRecreate?.(), p.resource = _.resource, p.identity = _.identity, p.unsubscribe = _.unsubscribe?.(() => {
      p.identity && e.cache.evictIdentity(p.identity);
    }), p.unsubscribeRecreate = _.onRecreate?.(() => d(p, b));
  }
  function d(p, b) {
    const _ = Ut(p.identity);
    p.identity && e.cache.evictIdentity(p.identity);
    const k = Dr(p.info, b, l(p.info));
    if (p.unsubscribe?.(), p.unsubscribeRecreate?.(), p.resource = k.resource, p.identity = k.identity, p.unsubscribe = k.unsubscribe?.(() => {
      p.identity && e.cache.evictIdentity(p.identity);
    }), p.unsubscribeRecreate = k.onRecreate?.(() => d(p, b)), s(p))
      for (const C of mn(p, _))
        e.onIdentityChange?.(C);
  }
  function m(p, b, _) {
    g(p), nf(e.label, p, b, _);
    const k = r.has(p) ? `claimed-group:${p}` : void 0;
    return r.set(p, b), k;
  }
  function g(p) {
    const b = e.bindGroupLayouts.get(p);
    if (!b)
      throw N(`${e.label}.layout`, `@group(${p}) does not exist in '${e.label}'.`);
    return b;
  }
  function h() {
    return n.map(S);
  }
  function S(p) {
    const b = r.get(p);
    if (b)
      return { group: p, bindGroup: b, offsets: [], claimValidation: x(b, p) };
    const _ = new Set(ct(g(p))?.entries.map((M) => M.binding)), k = e.reflection.bindings.filter((M) => M.group === p && _.has(M.binding)), C = w(k), Z = $(k), B = e.cache.getOrCreate(e.drawId, p, Z, () => e.device.gpu.createBindGroup({
      label: `${e.label}.group${p}`,
      layout: g(p),
      entries: C
    }));
    return { group: p, bindGroup: B, offsets: [] };
  }
  function x(p, b) {
    return Ai(p) ? void 0 : { label: e.label, group: b };
  }
  function w(p) {
    return p.map((b) => {
      const _ = I(b);
      return { binding: b.binding, resource: _.resource };
    });
  }
  function $(p) {
    return p.map((b) => I(b).identity);
  }
  function I(p) {
    const b = t.get(p.name);
    if (!b?.resource || !b.identity)
      throw Bo(e.label, p);
    return b;
  }
  function T(p) {
    if (r.has(p))
      throw jo(e.label, p);
  }
  function E(p, b) {
    p.buffer = e.device.createBuffer({ size: b, usage: ["uniform", "copy_dst"], label: `${e.label}.${p.info.name}` }), p.resource = { buffer: p.buffer.gpu, offset: 0, size: b }, p.identity = p.buffer.resourceIdentity, p.unsubscribe = p.buffer.onDestroy(() => e.cache.evictIdentity(p.buffer.resourceIdentity));
  }
  function A(p) {
    if (p.info.kind !== "buffer" || !p.info.layout?.size)
      throw N(`${e.label}.set`, `Binding '${p.info.name}' needs a compatible resource, not JS.`);
    return p.info.layout;
  }
  return {
    get groups() {
      return n;
    },
    set: i,
    claimGroup: m,
    layout: g,
    bindGroups: h,
    bindingState(p) {
      const b = t.get(p);
      if (!(!b?.ownership || !b.resource || !b.identity))
        return { info: b.info, ownership: b.ownership, resource: b.resource, identity: b.identity };
    }
  };
}
function Ju(e) {
  return new Map(e.bindings.map((t) => [t.name, { info: t, memberOwnership: /* @__PURE__ */ new Map() }]));
}
function ef(e, t, n) {
  let r;
  for (const i of t.values())
    if (i.info.layout?.members?.some((s) => s.name === e)) {
      if (r)
        throw N(`${n}.set`, `Binding member '${e}' is ambiguous in '${n}'; set the complete binding.`);
      r = i;
    }
  return r;
}
function zr(e, t) {
  return e.bindingLayout?.kind === "buffer" && Mu(t) ? "lib" : "user";
}
function Nr(e, t, n) {
  if (e.ownership && e.ownership !== n)
    throw Li(t, e.ownership);
  e.ownership ??= n;
}
function tf(e, t, n) {
  const r = e.memberOwnership.get(t);
  if (r && r !== n)
    throw Li(t, r);
  e.memberOwnership.set(t, n);
}
function nf(e, t, n, r) {
  const i = Ai(n);
  if (!i)
    return;
  const s = ct(r);
  if (!s)
    return;
  const o = rf(s.entries, i.layout.entries);
  if (o)
    throw Wo(e, t, o);
}
function rf(e, t) {
  if (e.length !== t.length)
    return `expected ${e.length} bindings and received ${t.length}`;
  const n = Or(e), r = Or(t);
  for (const [i, s] of n) {
    const o = r.get(i);
    if (!o)
      return `missing @binding(${i})`;
    if (Br(s) !== Br(o))
      return `@binding(${i}) does not match the reflected layout`;
  }
}
function Or(e) {
  return new Map(e.map((t) => [t.binding, t]));
}
function Br(e) {
  return JSON.stringify({
    binding: e.binding,
    visibility: e.visibility,
    buffer: e.buffer,
    sampler: e.sampler,
    texture: e.texture,
    storageTexture: e.storageTexture,
    externalTexture: e.externalTexture ? {} : void 0
  });
}
function mn(e, t) {
  const n = Ut(e.identity);
  return !n || t === n ? [] : [{
    group: e.info.group,
    binding: e.info.binding,
    bindingName: e.info.name,
    bindingKind: e.info.kind,
    previousIdentity: t,
    newIdentity: n
  }];
}
function Ut(e) {
  return e === void 0 ? void 0 : Wt(e);
}
function sf(e, t) {
  return Pn(e) && Pn(t) ? { ...e, ...t } : t;
}
function of(e) {
  return Pn(e) ? e : {};
}
const af = "rgba8unorm", qn = Object.freeze([0, 0, 0, 1]);
function Yt(e, t) {
  const n = e, r = Array.isArray(e) ? e : [n?.r, n?.g, n?.b, n?.a];
  if (r.length !== 4 || !r.every((i) => typeof i == "number" && Number.isFinite(i)))
    throw ha(t);
  return Kn(e);
}
function Kn(e) {
  const t = e;
  return Array.isArray(e) ? [e[0], e[1], e[2], e[3]] : { r: t.r, g: t.g, b: t.b, a: t.a };
}
function Vt(e) {
  return e.colors ?? [{ format: e.format ?? af }];
}
function xs(e) {
  return e.depth === !0 ? "depth24plus" : e.depth || void 0;
}
function vs(e) {
  const t = e.msaa;
  if (t === !0 || t === 4)
    return 4;
  if (t === void 0 || t === !1)
    return 1;
  const n = Ri();
  throw n.code = "VGPU-TARGET-MSAA-INVALID", n.message = `msaa received ${t}; WebGPU 1|4; use true`, n;
}
function cf(e, t) {
  if (!e?.size)
    throw Ri();
  const n = xs(e);
  if (n === "stencil8")
    throw aa(n);
  if (vs(e) === 4)
    for (const r of Vt(e))
      uf(r.format, t);
}
function uf(e, t) {
  if (t.isCompatibilityMode && e === "rgba16float")
    throw N("target", "Dawn compatibility mode does not support rgba16float+msaa.", "Use rgba8unorm for MSAA here, or disable msaa.");
}
function ff(e, t, n, r) {
  const i = {
    view: (t ?? e).createView(),
    resolveTarget: t ? e.createView() : void 0,
    loadOp: r ? "load" : "clear",
    storeOp: t ? "discard" : "store"
  };
  return r || (i.clearValue = Ss(n)), i;
}
function lf(e, t, n, r, i) {
  if (i) {
    const o = { view: e.createView(), depthReadOnly: !0 };
    return mt(e.format) && (o.stencilReadOnly = !0), o;
  }
  const s = { view: e.createView(), depthLoadOp: t ? "load" : "clear", depthStoreOp: e.sampleCount > 1 ? "discard" : "store" };
  return t || (s.depthClearValue = n ?? 1), e.format && mt(e.format) && (s.stencilLoadOp = t ? "load" : "clear", s.stencilStoreOp = e.sampleCount > 1 ? "discard" : "store", t || (s.stencilClearValue = r ?? 0)), s;
}
function mt(e) {
  return !!e && e.includes("stencil");
}
function Ss(e) {
  return Array.isArray(e) ? { r: e[0], g: e[1], b: e[2], a: e[3] } : e;
}
function _s(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}
function nn(e) {
  return typeof e == "object" && e !== null && typeof e.renderPassDescriptor == "function";
}
let df = 1, hf = 1;
const pf = /* @__PURE__ */ new WeakMap(), mf = /* @__PURE__ */ new WeakMap();
function gf(e) {
  return nn(e) ? {
    colors: e.colors.map((t) => t.format),
    depth: e.depth?.format,
    sampleCount: e.sampleCount
  } : typeof e != "object" || e === null ? { colors: [] } : {
    colors: Array.isArray(e.colors) ? [...e.colors] : e.colors ?? [],
    depth: e.depth,
    sampleCount: e.sampleCount ?? 1
  };
}
function ks(e) {
  return `${e.colors.join(",")}:${e.depth ?? "none"}:${e.sampleCount ?? 1}`;
}
function bf(e, t) {
  if (!Array.isArray(e.colors) || e.colors.length === 0)
    throw kt(t, "colors must be a non-empty array.");
  const n = e.colors.find((i) => typeof i != "string" || i.length === 0);
  if (n !== void 0)
    throw kt(t, `colors must contain only GPUTextureFormat strings; received ${String(n)}.`);
  if (e.depth !== void 0 && (typeof e.depth != "string" || e.depth.length === 0))
    throw kt(t, "depth must be a GPUTextureFormat string.");
  const r = e.sampleCount ?? 1;
  if (r !== 1 && r !== 4)
    throw kt(t, `sampleCount must be 1 or 4; received ${String(r)}.`);
}
function yf(e) {
  const t = `${qr(pf, e.module, () => df++)}|${qr(mf, e.pipelineLayout, () => hf++)}|${_f(e.vertexBufferLayouts ?? [])}|${ks(e.signature)}`, n = e.topology || e.stripIndexFormat ? `${t}|${e.topology ?? "triangle-list"}|${e.stripIndexFormat ?? "none"}` : t, r = e.cullMode || e.frontFace ? `${n}|${e.cullMode ?? "none"}|${e.frontFace ?? "ccw"}` : n, i = e.unclippedDepth ? `${r}|unclipped` : r, s = e.depthKey ? `${i}|${e.depthKey}` : i, o = e.stencilKey ? `${s}|${e.stencilKey}` : s, a = e.multisampleKey ? `${o}|${e.multisampleKey}` : o, c = e.constantsKey ? `${a}|${e.constantsKey}` : a, u = e.entryKey ? `${c}|${e.entryKey}` : c;
  return e.fragmentKey ? `${u}|${e.fragmentKey}` : u;
}
function Tn(e, t, n, r, i) {
  if (r === void 0)
    return t.find((o) => o.stage === n);
  if (typeof r != "string")
    throw Lt(e, `${n} received ${Cn(r)}; expected an entry point name string.`, i);
  const s = t.find((o) => o.name === r);
  if (!s)
    throw Lt(e, `"${r}" matches no entry point in the shader; available entry points: ${jr(t)}.`, i);
  if (s.stage !== n)
    throw Lt(e, `"${r}" is a @${s.stage} entry point, not @${n}; available entry points: ${jr(t)}.`, i);
  return s;
}
function jr(e) {
  return e.length ? e.map((t) => `"${t.name}" (@${t.stage})`).join(", ") : "none";
}
function Es(e, t, n, r) {
  if (t !== void 0 && (typeof t != "object" || t === null || Array.isArray(t)))
    throw _t(e, `received ${Cn(t)}; expected { overrideNameOrId: number | boolean }.`, r);
  const i = new Map(n.map((o) => [Wr(o), o])), s = {};
  for (const [o, a] of Object.entries(t ?? {})) {
    if (!i.has(o))
      throw _t(e, `"${o}" matches no override in the shader; available overrides: ${wf(n)}.`, r);
    if (typeof a == "boolean") {
      s[o] = a ? 1 : 0;
      continue;
    }
    if (typeof a != "number" || !Number.isFinite(a))
      throw _t(e, `"${o}" received ${Cn(a)}; use a finite number or a boolean (WebGPU converts the value to the override's WGSL type, and NaN/Infinity fail that conversion).`, r);
    s[o] = a;
  }
  for (const o of n) {
    const a = Wr(o);
    if (o.defaultValue === void 0 && !(a in s))
      throw _t(e, `override '${o.name}' has no default value and must be provided; add constants: { "${a}": value }.`, r);
  }
  return Object.keys(s).length === 0 ? {} : { constants: s, constantsKey: xf(s) };
}
function Wr(e) {
  return e.id !== void 0 ? String(e.id) : e.name;
}
function wf(e) {
  return e.length ? e.map((t) => t.id !== void 0 ? `"${t.id}" (@id of ${t.name})` : `"${t.name}"`).join(", ") : "none";
}
function xf(e) {
  return `cn~${Object.entries(e).sort(([t], [n]) => t < n ? -1 : t > n ? 1 : 0).map(([t, n]) => `${t}=${n}`).join("~")}`;
}
function Cn(e) {
  if (typeof e == "string")
    return `"${e}"`;
  try {
    return JSON.stringify(e) ?? String(e);
  } catch {
    return String(e);
  }
}
function $s(e) {
  const t = /* @__PURE__ */ new Map();
  return {
    get(n, r) {
      let i = t.get(n);
      return i || (i = e.gpu.createShaderModule({ label: r, code: n }), t.set(n, i)), i;
    },
    dispose() {
      t.clear();
    }
  };
}
function Is(e) {
  const t = /* @__PURE__ */ new Map();
  return {
    get(n) {
      const r = kf(n);
      let i = t.get(r);
      return i || (i = e.gpu.createPipelineLayout({ bindGroupLayouts: Ef(n) }), t.set(r, i)), i;
    },
    dispose() {
      t.clear();
    }
  };
}
function Ps(e, t = {}) {
  return new vf(e, t);
}
class vf {
  device;
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ new Set();
  #n;
  #r;
  #s = !1;
  constructor(t, n) {
    this.device = t, this.#n = n.errorSink ?? (() => {
    }), this.#r = n.registerSettledSource?.(() => [...this.#t]);
  }
  getReady(t) {
    return this.#e.get(t)?.pipeline;
  }
  getSync(t, n, r) {
    this.#o(r.where);
    const i = this.#e.get(t);
    if (i?.pipeline)
      return i.pipeline;
    const s = i ?? {};
    i || this.#e.set(t, s);
    const o = this.#i(t, s, n, r);
    if (!o) {
      s.pending || this.#e.delete(t);
      return;
    }
    return s.pipeline = o, s.pending?.resolve(o), s.pending = void 0, o;
  }
  getAsync(t, n, r) {
    this.#o(r.where);
    const i = this.#e.get(t);
    if (i?.pipeline)
      return Promise.resolve(i.pipeline);
    if (i?.pending)
      return i.pending.promise;
    const s = {}, o = Sf();
    s.pending = o, this.#e.set(t, s);
    let a;
    try {
      a = n();
    } catch (c) {
      const u = et(r.where, c, r.signature);
      return o.reject(u), this.#e.delete(t), o.promise;
    }
    return this.#c(a), a.then((c) => {
      this.#e.get(t) !== s || s.pipeline || s.pending !== o || (s.pipeline = c, s.pending = void 0, o.resolve(c));
    }, (c) => {
      this.#e.get(t) !== s || s.pipeline || s.pending !== o || (s.pending = void 0, this.#e.delete(t), o.reject(et(r.where, c, r.signature)));
    }), o.promise;
  }
  dispose() {
    if (this.#s)
      return;
    this.#s = !0;
    const t = kr("gpu.dispose");
    for (const n of this.#e.values())
      n.pending?.reject(t);
    this.#e.clear(), this.#t.clear(), this.#r?.();
  }
  #i(t, n, r, i) {
    const s = this.device.gpu, o = typeof s.pushErrorScope == "function" && typeof s.popErrorScope == "function";
    o && s.pushErrorScope("validation");
    try {
      const a = r();
      return o && this.#a(t, n, i), a;
    } catch (a) {
      o && this.#f();
      const c = et(i.where, a, i.signature);
      this.#n(c);
      return;
    }
  }
  #a(t, n, r) {
    const i = this.device.gpu.popErrorScope().then((s) => {
      if (!s)
        return;
      const o = et(r.where, s, r.signature);
      return this.#e.get(t) === n && this.#e.delete(t), this.#n(o);
    }, (s) => {
      const o = et(r.where, s, r.signature);
      return this.#e.get(t) === n && this.#e.delete(t), this.#n(o);
    });
    this.#c(i);
  }
  #f() {
    const t = this.device.gpu.popErrorScope?.();
    t && t.catch(() => {
    });
  }
  #o(t) {
    if (this.#s)
      throw kr(t);
  }
  #c(t) {
    this.#t.add(t), t.catch(() => {
    }).then(() => this.#t.delete(t), () => this.#t.delete(t));
  }
}
function Sf() {
  let e, t;
  const n = new Promise((r, i) => {
    e = r, t = i;
  });
  return n.catch(() => {
  }), { promise: n, resolve: e, reject: t };
}
function qr(e, t, n) {
  let r = e.get(t);
  return r || (r = n(), e.set(t, r)), r;
}
function _f(e) {
  return JSON.stringify(e.map((t) => ({
    arrayStride: t.arrayStride,
    stepMode: t.stepMode ?? "vertex",
    attributes: [...t.attributes].map((n) => ({
      shaderLocation: n.shaderLocation,
      offset: n.offset,
      format: n.format
    }))
  })));
}
function kf(e) {
  return JSON.stringify([...e.entries()].map(([t, n]) => ({ group: t, entries: If(n) })));
}
function Ef(e) {
  const t = Math.max(-1, ...e.keys()), n = [];
  for (let r = 0; r <= t; r++)
    n.push($f(e, r));
  return n;
}
function $f(e, t) {
  const n = e.get(t);
  if (!n)
    throw oa(t);
  return n;
}
function If(e) {
  return (ct(e)?.entries ?? []).map((t) => ({
    binding: t.binding,
    visibility: t.visibility,
    buffer: t.buffer ? { ...t.buffer } : void 0,
    sampler: t.sampler ? { ...t.sampler } : void 0,
    texture: t.texture ? { ...t.texture } : void 0,
    storageTexture: t.storageTexture ? { ...t.storageTexture } : void 0,
    externalTexture: t.externalTexture ? { ...t.externalTexture } : void 0
  }));
}
const Pf = bt("frame-state");
function Yn(e) {
  return e.service(Pf, Tf);
}
function Tf() {
  const e = /* @__PURE__ */ new Set();
  let t = Kr(), n = !1, r = !1;
  const i = {
    time: 0,
    deltaTime: 0,
    frameCount: 0,
    advanceBy(s) {
      i.deltaTime = s, i.time += s, r = !0;
    },
    tick() {
      if (n)
        throw Ui();
      n = !0;
      try {
        const s = Kr();
        r ? r = !1 : (i.deltaTime = Math.max(0, (s - t) / 1e3), i.time += i.deltaTime), t = s, i.frameCount += 1;
        for (const o of [...e])
          o();
      } finally {
        n = !1;
      }
    },
    onAdvance(s) {
      return e.add(s), () => {
        e.delete(s);
      };
    }
  };
  return i;
}
function Kr() {
  return globalThis.performance?.now?.() ?? Date.now();
}
function Ts(e, t, n = {}) {
  const r = oe(e, "surface"), i = Mf(r), s = i.get(t);
  if (s && !s.disposed)
    throw ua(s.label);
  const o = new Ms(r.device, t, n, (u) => {
    i.get(u.canvas) === u && i.delete(u.canvas), a(), c();
  }), a = Yn(r).onAdvance(() => o.applyAutoResize()), c = r.own("resource", () => o.dispose());
  return i.set(t, o), o;
}
const Cf = bt("surfaces");
function Mf(e) {
  return e.service(Cf, () => /* @__PURE__ */ new Map());
}
let st = 0, Xn = 0;
function Ff() {
  return st > 0;
}
function Af() {
  return Xn > 0;
}
function Lf() {
  Xn += 1;
}
function Gf() {
  Xn -= 1;
}
function Cs(e) {
  return e instanceof Ms;
}
class Ms {
  device;
  canvas;
  options;
  unregister;
  resourceIdentity = Jt("render-target");
  label;
  context;
  autoResize;
  layoutBacked;
  format;
  #e = new en();
  #t = /* @__PURE__ */ new Set();
  #n = /* @__PURE__ */ new Set();
  #r;
  #s;
  #i = !1;
  #a = !1;
  constructor(t, n, r, i) {
    this.device = t, this.canvas = n, this.options = r, this.unregister = i, this.label = r.label, this.#s = r.clearColor === void 0 ? qn : Yt(r.clearColor, "surface.clearColor");
    const s = n.getContext("webgpu");
    if (!s)
      throw ca();
    if (this.context = s, this.layoutBacked = Rf(n), r.autoResize === !0 && !this.layoutBacked)
      throw la();
    this.autoResize = r.autoResize ?? (r.size ? !1 : this.layoutBacked), this.#r = Xr(r.dpr), this.format = r.format ?? Uf();
    const o = Df(n, r, this.layoutBacked, this.#r);
    (r.size || this.layoutBacked) && Yr(n, o), s.configure({
      device: t.gpu,
      format: this.format,
      alphaMode: r.alphaMode ?? "premultiplied",
      colorSpace: r.colorSpace ?? "srgb",
      usage: Vf()
    });
  }
  get gpu() {
    return this.context;
  }
  get size() {
    return this.#u(), zt(this.canvas);
  }
  get texelSize() {
    const t = this.size;
    return [1 / t[0], 1 / t[1]];
  }
  get color() {
    return this.#u(), new He(this.device, this.context.getCurrentTexture(), {
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
    return Kn(this.#s);
  }
  set clearColor(t) {
    this.#s = Yt(t, "surface.clearColor");
  }
  get disposed() {
    return this.#i;
  }
  resize(t) {
    if (this.#u(), this.#a)
      throw da(this.options.label);
    this.#f(Xt(t), this.#r, !0);
  }
  applyAutoResize() {
    if (this.#i || !this.autoResize || !this.layoutBacked)
      return;
    const t = Xr(this.options.dpr), n = Fs(this.canvas, t);
    this.#f(n, t, !0);
  }
  onResize(t) {
    this.#u(), this.#t.add(t), this.#a = !0, st += 1;
    try {
      t(this.#l());
    } finally {
      st -= 1, this.#a = !1;
    }
    return () => {
      this.#t.delete(t);
    };
  }
  async read() {
    return this.#u(), this.color.read();
  }
  async readFloats() {
    return this.#u(), this.color.readFloats();
  }
  onDestroy(t) {
    return this.#u(), this.#e.onDestroy(this, t);
  }
  onTexturesRecreated(t) {
    return this.#u(), this.#n.add(t), () => {
      this.#n.delete(t);
    };
  }
  renderPassDescriptor(t = {}) {
    const { clear: n = [0, 0, 0, 1], preserve: r } = t;
    this.#u();
    const i = { view: this.context.getCurrentTexture().createView(), loadOp: r ? "load" : "clear", storeOp: "store" };
    return r || (i.clearValue = Ss(n)), { colorAttachments: [i] };
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
  #f(t, n, r) {
    const i = !_s(zt(this.canvas), t);
    this.#r = n, i && (Yr(this.canvas, t), this.#o(), r && this.#c());
  }
  #o() {
    for (const t of [...this.#n])
      t();
  }
  #c() {
    this.#a = !0, st += 1;
    try {
      const t = this.#l();
      for (const n of [...this.#t])
        n(t);
    } finally {
      st -= 1, this.#a = !1;
    }
  }
  #l() {
    const t = zt(this.canvas);
    return { width: t[0], height: t[1], dpr: this.#r, surface: this };
  }
  #u() {
    if (this.#i)
      throw fa(this.options.label);
  }
}
function Rf(e) {
  return typeof e.clientWidth == "number";
}
function Df(e, t, n, r) {
  return t.size ? Xt(t.size) : n ? Fs(e, r) : Xt(zt(e));
}
function Fs(e, t) {
  const n = e;
  return Xt([Math.round(n.clientWidth * t), Math.round(n.clientHeight * t)]);
}
function zt(e) {
  const t = e;
  return [t.width, t.height];
}
function Yr(e, t) {
  const n = e;
  n.width = t[0], n.height = t[1];
}
function Xt(e) {
  return [Math.max(1, Math.floor(e[0])), Math.max(1, Math.floor(e[1]))];
}
function Xr(e) {
  const t = globalThis.devicePixelRatio ?? 1;
  return Array.isArray(e) ? Math.min(e[1], Math.max(e[0], t)) : typeof e == "number" ? e : t;
}
function Uf() {
  return globalThis.navigator?.gpu?.getPreferredCanvasFormat?.() ?? "bgra8unorm";
}
function Vf() {
  const e = globalThis.GPUTextureUsage;
  return e ? e.RENDER_ATTACHMENT | e.TEXTURE_BINDING | e.COPY_SRC : void 0;
}
const zf = {
  drawIndirect: { bytes: 16, args: "4 u32 values: vertexCount, instanceCount, firstVertex, firstInstance" },
  drawIndexedIndirect: { bytes: 20, args: "5 32-bit values: indexCount, instanceCount, firstIndex, baseVertex (signed), firstInstance" },
  dispatchWorkgroupsIndirect: { bytes: 12, args: "3 u32 values: workgroupCountX, workgroupCountY, workgroupCountZ" }
};
function As(e, t, n, r) {
  const i = typeof n == "object" && n !== null ? n.buffer : void 0, s = Hr(n) ? n : Hr(i) ? i : void 0;
  if (!s)
    throw Pe(e, `received ${Zr(n)}; expected a StorageBuffer or { buffer, offset? }.`, t);
  const o = s === n ? 0 : n.offset ?? 0;
  if (typeof o != "number" || !Number.isInteger(o) || o < 0)
    throw Pe(e, `offset must be an integer >= 0; received ${Zr(o)}.`, t);
  if (o % 4 !== 0)
    throw Pe(e, `offset must be a multiple of 4 (WebGPU requires "indirectOffset is a multiple of 4"); received ${o}.`, t);
  if (!s.buffer.options.usage.includes("indirect"))
    throw Pe(e, `the buffer lacks the "indirect" usage (WebGPU requires "indirectBuffer.usage contains INDIRECT"); create it with storage(gpu, ${s.size}, { indirect: true }).`, t);
  const { bytes: a, args: c } = zf[r];
  if (o + a > s.size)
    throw Pe(e, `${r} reads ${a} bytes (${c}) at offset ${o}, but offset + ${a} = ${o + a} exceeds the buffer size ${s.size}.`, t);
  return { buffer: s.gpu, offset: o };
}
function Hr(e) {
  return typeof e == "object" && e !== null && "gpu" in e && "size" in e && e.buffer instanceof ve;
}
function Zr(e) {
  if (typeof e == "string")
    return `"${e}"`;
  try {
    return JSON.stringify(e) ?? String(e);
  } catch {
    return String(e);
  }
}
const Ht = /* @__PURE__ */ Symbol("vgpu.frame.drawable");
function Nf(e) {
  return e?.[Ht];
}
const Of = /* @__PURE__ */ Symbol("vgpu.frame.bundle");
function Bf(e) {
  return e?.[Of];
}
const Ls = /* @__PURE__ */ Symbol("vgpu.frame.passAttachment");
function jf(e) {
  return typeof e?.[Ls] == "function" ? e : void 0;
}
function Mn(e, t) {
  return rn(oe(e, "sampler")).sampler(t);
}
let Qr = 1;
function Wf(e) {
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new WeakMap();
  return {
    sampler(r = {}) {
      const i = Fn(r);
      let s = t.get(i);
      return s || (s = e.gpu.createSampler(r), t.set(i, s), n.set(s, { kind: "sampler", id: Qr++ })), s;
    },
    identity(r) {
      let i = n.get(r);
      return i || (i = { kind: "sampler", id: Qr++ }, n.set(r, i)), i;
    }
  };
}
function Fn(e) {
  if (e === null || typeof e != "object")
    return JSON.stringify(e);
  if (Array.isArray(e))
    return `[${e.map(Fn).join(",")}]`;
  const t = e;
  return `{${Object.keys(t).sort().map((n) => `${JSON.stringify(n)}:${Fn(t[n])}`).join(",")}}`;
}
const qf = bt("render-service");
function rn(e) {
  return e.service(qf, Kf);
}
function Kf(e) {
  const t = e.device, n = Un(), r = Ps(t, {
    errorSink: (a) => e.reportError(a),
    registerSettledSource: (a) => e.registerSettledSource(a)
  }), i = $s(t), s = Is(t), o = Wf(t);
  return e.own("service", () => {
    r.dispose(), i.dispose(), s.dispose(), n.dispose();
  }), { binds: n, pipelines: r, shaderModules: i, pipelineLayouts: s, sampler: (a) => o.sampler(a) };
}
function Hn(e) {
  if (typeof e == "string")
    return e;
  if (!Yf(e) || !("version" in e) || e.version !== 1)
    throw Et(e);
  const n = e.wgsl;
  if (typeof n != "string")
    throw Et(e);
  return n;
}
function Yf(e) {
  return typeof e == "object" && e !== null;
}
function ze(e, t) {
  const n = oe(e, "draw"), r = rn(n), i = Hn(t.shader);
  return new Rs(n.device, i, { ...t, shader: i }, r.binds, void 0, r.pipelines, r.shaderModules, r.pipelineLayouts, (s) => n.reportError(s), (s) => {
    n.trackDelivery(s);
  });
}
let Xf = 1;
const Gs = /* @__PURE__ */ new WeakMap();
class Rs {
  source;
  label;
  #e = /* @__PURE__ */ new Map();
  constructor(t, n, r, i = Un(), s, o = Ps(t), a = $s(t), c = Is(t), u, l) {
    this.source = n, G(t, "Draw.constructor"), this.label = r.label ?? "draw";
    const f = Xf++, d = Dn(n, `${this.label}.wgsl`), m = il(this.label, r.entry), g = Tn(this.label, d.entryPoints, "vertex", m.vertex, "draw"), h = Tn(this.label, d.entryPoints, "fragment", m.fragment, "draw"), S = sl(d, g, h), x = [g, h].filter((Q) => !!Q), w = ms(d.bindings, x);
    Hf(t, this.label, d.bindings, x, w);
    const $ = r.geometry, I = g ? ht(g, "inputs", this.label) : [], T = $ && Xe in $ ? $[Xe](I, `${this.label}.geometry`) : $?.vertexBufferLayouts, E = new Map(bs(t, this.label, d, w)), A = c.get(E), p = a.get(n, `${this.label}.shader`), b = Sl(), _ = Jf(this.label, r), k = tl(this.label, r, _), C = ol(t, this.label, r), Z = fl(t, this.label, r), B = pl(this.label, r), M = gl(this.label, r), F = Es(this.label, r.constants, d.overrides, "draw"), ke = ws({
      device: t,
      label: this.label,
      drawId: f,
      reflection: d,
      bindGroupLayouts: E,
      cache: i,
      onIdentityChange: (Q) => b.markStale({ kind: "binding-identity", drawLabel: this.label, ...Q })
    });
    Gs.set(this, { id: f, device: t, opts: r, vertexBufferLayouts: T, cache: i, defaultTarget: s, reflection: d, visibility: w, vertexEntry: g?.name ?? "vs_main", fragmentEntry: h?.name ?? "fs_main", entryKey: S, setCore: ke, bindGroupLayouts: E, pipelineLayout: A, shaderModule: p, pipelineStore: o, pipelineLayouts: c, errorSink: u, trackSettled: l, resolvedPipelineKeys: /* @__PURE__ */ new Set(), recordedIn: b, ..._, ...k, ...C, ...Z, ...B, ...M, ...F }), r.set && this.set(r.set);
    for (const Q of r.targets ?? [])
      this.compileSync(Q);
  }
  get gpu() {
    const t = P(this);
    for (const n of t.resolvedPipelineKeys) {
      const r = t.pipelineStore.getReady(n);
      if (r)
        return r;
    }
  }
  get targets() {
    return P(this).opts.targets;
  }
  /**
   * Frame drawable protocol: a `Frame` encodes through this instead of importing draw.ts, so a
   * program that never draws never pulls this module. The instance is its own protocol object —
   * `encode`, `label` and the depth/stencil metadata below are exactly what a pass needs.
   */
  get [Ht]() {
    return this;
  }
  /** @internal Frame drawable protocol; see {@link drawWritesDepth}. */
  writesDepth() {
    return wl(this);
  }
  /** @internal Frame drawable protocol; see {@link drawStencilWritingOps}. */
  stencilWritingOps() {
    return xl(this);
  }
  set(t) {
    const n = P(this);
    G(n.device, `${this.label}.set`);
    for (const r of n.setCore.set(t))
      n.recordedIn.markStale({ kind: "binding-identity", drawLabel: this.label, ...r });
    return this;
  }
  group(t, n) {
    const r = P(this);
    G(r.device, `${this.label}.group`);
    const i = this.#e.get(t) ?? this.layout(t), s = r.setCore.claimGroup(t, n, i);
    return r.recordedIn.markStale({ kind: "group-claim", drawLabel: this.label, group: t, previousIdentity: s, newIdentity: `claimed-group:${t}` }), this;
  }
  layout(t, n = {}) {
    return G(P(this).device, `${this.label}.layout`), n.dynamicOffsets ? this.#t(t) : P(this).setCore.layout(t);
  }
  #t(t) {
    const n = P(this);
    n.setCore.layout(t);
    const r = this.#e.get(t);
    if (r)
      return r;
    const i = kl(this, t), s = ys(n.device, `${this.label}.group${t}.dynamic.bgl`, i);
    return this.#e.set(t, s), n.bindGroupLayouts.set(t, s), n.pipelineLayout = n.pipelineLayouts.get(n.bindGroupLayouts), s;
  }
  /**
   * Encodes and submits this draw as a one-shot render pass.
   *
   * Raw claimed-bind-group validation failures are delivered asynchronously via
   * `gpu.onError` as `VGPU-R4-GROUP-VALIDATION`.
   */
  draw(t = {}) {
    G(P(this).device, `${this.label}.draw`);
    const n = nn(t) ? { target: t } : t, r = P(this), i = n.target ?? r.defaultTarget;
    if (!i)
      throw En(`${this.label}.draw`);
    di(i, `${this.label}.draw`);
    const s = r.device.gpu.createCommandEncoder(), o = s.beginRenderPass(i.renderPassDescriptor()), a = [];
    try {
      this.encode(o, i, n, (f) => a.push(f));
    } catch (f) {
      j(a), as(r.device);
      try {
        o.end();
      } catch {
      }
      throw f;
    }
    us(r.device, o, a, a[0]?.context);
    let c;
    const u = a[0]?.context;
    u && ut(r.device, u);
    try {
      c = s.finish();
    } catch (f) {
      const d = u ? Y(r.device) : void 0;
      j(a), d && j([d]);
      const m = d?.context ?? u;
      if (m) {
        li(r, m.label, m.group, f);
        return;
      }
      throw f;
    }
    if (u) {
      const f = Y(r.device);
      f && (a[0] = a[0] ? Kt(f, a[0]) : f);
    }
    const l = a[0]?.context;
    l && ut(r.device, l);
    try {
      r.device.gpu.queue.submit([c]);
    } catch (f) {
      const d = l ? Y(r.device) : void 0;
      j(a), d && j([d]);
      const m = d?.context ?? l;
      if (m) {
        li(r, m.label, m.group, f);
        return;
      }
      throw f;
    }
    if (l) {
      const f = Y(r.device);
      f && (a[0] = a[0] ? Kt(f, a[0]) : f);
    }
    if (a.length) {
      const f = cs(r.device, a, { errorSink: r.errorSink });
      r.trackSettled?.(f);
    }
  }
  encode(t, n, r = {}, i) {
    G(P(this).device, `${this.label}.encode`);
    const s = this.pipelineFor(n, !0);
    if (!s)
      return;
    t.setPipeline(s);
    const o = P(this);
    o.blendConstant && t.setBlendConstant(o.blendConstant), o.stencilRef !== void 0 && t.setStencilReference(o.stencilRef);
    for (const a of o.setCore.bindGroups())
      this.#n(t, a, r, i);
    this.#a(t, r);
  }
  #n(t, n, r, i) {
    const s = _l(r.offsets, n.group, n.offsets);
    if (!n.claimValidation || !i) {
      t.setBindGroup(n.group, n.bindGroup, s);
      return;
    }
    ut(P(this).device, n.claimValidation);
    try {
      t.setBindGroup(n.group, n.bindGroup, s);
    } catch (a) {
      throw $u(P(this).device), Ke(n.claimValidation.label, n.claimValidation.group, a);
    }
    const o = Y(P(this).device);
    o && i(o);
  }
  compile(t) {
    G(P(this).device, `${this.label}.compile`);
    const { key: n, signature: r, signatureKey: i } = this.#r(t, `${this.label}.compile`);
    return P(this).pipelineStore.getAsync(n, () => this.#c(r), { where: `${this.label}.compile`, signature: i }).then(() => (G(P(this).device, `${this.label}.compile`), P(this).resolvedPipelineKeys.add(n), this));
  }
  compileSync(t) {
    G(P(this).device, `${this.label}.compileSync`);
    const { key: n, signature: r, signatureKey: i } = this.#r(t, `${this.label}.compileSync`);
    return P(this).pipelineStore.getSync(n, () => this.#o(r), { where: `${this.label}.compileSync`, signature: i }) && P(this).resolvedPipelineKeys.add(n), this;
  }
  pipelineFor(t, n = !1) {
    G(P(this).device, `${this.label}.pipelineFor`);
    const { key: r, signature: i, signatureKey: s } = this.#r(t, `${this.label}.pipelineFor`, n), o = P(this).pipelineStore.getSync(r, () => this.#o(i), { where: `${this.label}.pipelineFor`, signature: s });
    return o && P(this).resolvedPipelineKeys.add(r), o;
  }
  pipelineForAsync(t) {
    G(P(this).device, `${this.label}.pipelineForAsync`);
    const { key: n, signature: r, signatureKey: i } = this.#r(t, `${this.label}.pipelineForAsync`);
    return P(this).pipelineStore.getAsync(n, () => this.#c(r), { where: `${this.label}.pipelineForAsync`, signature: i }).then((o) => (G(P(this).device, `${this.label}.pipelineForAsync`), P(this).resolvedPipelineKeys.add(n), o));
  }
  #r(t, n, r = !1) {
    const i = this.#s(t, n, r), s = ks(i);
    return { signature: i, signatureKey: s, key: this.#i(i) };
  }
  #s(t, n, r = !1) {
    const i = P(this), s = t ?? i.defaultTarget;
    if (!s)
      throw En(n);
    r || di(s, n);
    const o = gf(s);
    if (bf(o, n), i.colorStates && i.colorStates.length !== o.colors.length)
      throw kn(this.label, `expected one entry per color attachment; colors has ${i.colorStates.length}, but the target signature has ${o.colors.length}.`, n);
    if (i.multisampleState?.alphaToCoverageEnabled && (o.sampleCount ?? 1) <= 1)
      throw At(this.label, `alphaToCoverage requires a multisampled target, but the target signature has sampleCount ${o.sampleCount ?? 1}; create the target with msaa: true.`, n);
    if ((i.stencilState || i.stencilRef !== void 0) && !mt(o.depth))
      throw Oe(this.label, `stencil requires a depth format with a stencil aspect, but the target signature has ${o.depth ? `"${o.depth}"` : "no depth"}; create the target with depth: "depth24plus-stencil8".`, n);
    return o;
  }
  #i(t) {
    const n = P(this), r = n.opts.geometry;
    return yf({ module: n.shaderModule, pipelineLayout: n.pipelineLayout, vertexBufferLayouts: n.vertexBufferLayouts, signature: t, fragmentKey: n.fragmentKey, topology: r?.topology, stripIndexFormat: Ds(r), cullMode: n.cullMode, frontFace: n.frontFace, unclippedDepth: n.unclippedDepth, depthKey: n.depthKey, stencilKey: n.stencilKey, multisampleKey: n.multisampleKey, constantsKey: n.constantsKey, entryKey: n.entryKey });
  }
  #a(t, n = {}) {
    const r = P(this).opts.geometry;
    if (r?.vertexBuffers && r.vertexBuffers.forEach((s, o) => t.setVertexBuffer(o, s)), n.indirect !== void 0)
      return this.#f(t, r, n);
    const i = Qf(this.label, r, P(this).opts, n);
    if (!r?.indexBuffer)
      return t.draw(i.vertexCount, i.instanceCount, i.firstVertex, i.firstInstance);
    t.setIndexBuffer(r.indexBuffer, r.indexFormat ?? "uint32"), t.drawIndexed(i.indexCount, i.instanceCount, i.firstIndex, i.baseVertex, i.firstInstance);
  }
  /**
   * The GPU reads the draw arguments from the buffer, so per-call counts alongside indirect are dead options and throw.
   * A non-zero firstInstance in the buffered arguments cannot be validated on the CPU; per WebGPU, it "must be 0,
   * unless the 'indirect-first-instance' feature is enabled", otherwise the indirect call "will be treated as a no-op".
   */
  #f(t, n, r) {
    const i = `${this.label}.draw`, s = Zf.find((u) => r[u] !== void 0);
    if (s !== void 0)
      throw Pe(this.label, `indirect cannot be combined with ${s} in the same call; the GPU reads the draw arguments from the buffer, so the CPU-side value would be ignored.`, i);
    const o = !!n?.indexBuffer, { buffer: a, offset: c } = As(this.label, i, r.indirect, o ? "drawIndexedIndirect" : "drawIndirect");
    if (!o)
      return t.drawIndirect(a, c);
    t.setIndexBuffer(n.indexBuffer, n.indexFormat ?? "uint32"), t.drawIndexedIndirect(a, c);
  }
  #o(t) {
    const n = P(this);
    return n.device.gpu.createRenderPipeline({
      label: `${this.label}.pipeline`,
      layout: n.pipelineLayout,
      vertex: { module: n.shaderModule, entryPoint: n.vertexEntry, buffers: [...n.vertexBufferLayouts ?? []], ...n.constants ? { constants: n.constants } : {} },
      fragment: { module: n.shaderModule, entryPoint: n.fragmentEntry, targets: Jr(t, n), ...n.constants ? { constants: n.constants } : {} },
      primitive: ei(n.opts.geometry, n.cullMode, n.frontFace, n.unclippedDepth),
      depthStencil: oi(t, n),
      multisample: ui(t, n)
    });
  }
  #c(t) {
    const n = P(this);
    return n.device.gpu.createRenderPipelineAsync({
      label: `${this.label}.pipeline`,
      layout: n.pipelineLayout,
      vertex: { module: n.shaderModule, entryPoint: n.vertexEntry, buffers: [...n.vertexBufferLayouts ?? []], ...n.constants ? { constants: n.constants } : {} },
      fragment: { module: n.shaderModule, entryPoint: n.fragmentEntry, targets: Jr(t, n), ...n.constants ? { constants: n.constants } : {} },
      primitive: ei(n.opts.geometry, n.cullMode, n.frontFace, n.unclippedDepth),
      depthStencil: oi(t, n),
      multisample: ui(t, n)
    });
  }
}
function Hf(e, t, n, r, i) {
  const s = e.limits;
  for (const [o, a, c] of [["vertex", 1, "maxStorageBuffersInVertexStage"], ["fragment", 2, "maxStorageBuffersInFragmentStage"]]) {
    const u = r.find((d) => d.stage === o);
    if (!u)
      continue;
    const l = n.filter((d) => d.bindingLayout?.kind === "buffer" && d.bindingLayout.buffer.type !== "uniform" && i(d) & a), f = s[c] ?? s.maxStorageBuffersPerShaderStage;
    if (f !== void 0 && l.length > f)
      throw No(t, o, u.name, l.length, f, l);
  }
}
const Zf = ["vertices", "indices", "instances", "firstVertex", "firstIndex", "baseVertex", "firstInstance"];
function Jr(e, t) {
  return e.colors.map((n, r) => {
    const i = t.colorStates?.[r], s = i?.blendState ?? t.blendState, o = i?.writeMask ?? t.writeMask, a = { format: n };
    return s && (a.blend = s), o !== void 0 && (a.writeMask = o), a;
  });
}
function Qf(e, t, n, r) {
  ye(e, "DrawOptions.instances", n.instances), ye(e, "DrawOptions.vertices", n.vertices), ye(e, "DrawOptions.firstInstance", n.firstInstance), ye(e, "DrawCallOptions.instances", r.instances), be(e, "DrawCallOptions.vertices", r.vertices), be(e, "DrawCallOptions.indices", r.indices), be(e, "DrawCallOptions.firstVertex", r.firstVertex), be(e, "DrawCallOptions.firstIndex", r.firstIndex), be(e, "DrawCallOptions.baseVertex", r.baseVertex), ye(e, "DrawCallOptions.firstInstance", r.firstInstance), ye(e, "GeometryLike.vertexCount", t?.vertexCount), ye(e, "GeometryLike.indexCount", t?.indexCount), ye(e, "GeometryLike.instanceCount", t?.instanceCount), be(e, "GeometryLike.firstVertex", t?.firstVertex), be(e, "GeometryLike.firstIndex", t?.firstIndex), be(e, "GeometryLike.baseVertex", t?.baseVertex);
  const i = !!t?.indexBuffer, o = t?.geometry ?? (t && Xe in t ? t : void 0), a = r.firstVertex ?? t?.firstVertex ?? 0, c = r.vertices ?? t?.vertexCount ?? n.vertices ?? 3, u = r.firstIndex ?? t?.firstIndex ?? 0, l = r.indices ?? t?.indexCount ?? 0, f = r.baseVertex ?? t?.baseVertex ?? 0;
  if (i)
    ti(e, "index", u, l, o?.indexCount);
  else if (r.indices !== void 0 || r.firstIndex !== void 0 || r.baseVertex !== void 0)
    throw Ye(`${e}.draw`, "Index range needs an indexed geometry.");
  return i || ti(e, "vertex", a, c, o?.vertexCount), {
    instanceCount: r.instances ?? n.instances ?? t?.instanceCount ?? 1,
    firstInstance: r.firstInstance ?? n.firstInstance ?? 0,
    vertexCount: c,
    firstVertex: a,
    indexCount: l,
    firstIndex: u,
    baseVertex: f
  };
}
function Ds(e) {
  const t = e?.topology ?? "triangle-list";
  return e?.stripIndexFormat ?? (t.endsWith("strip") ? e?.indexFormat : void 0);
}
function ei(e, t, n, r) {
  const i = e?.topology ?? "triangle-list", s = Ds(e), o = s ? { topology: i, stripIndexFormat: s } : { topology: i };
  return t !== void 0 && (o.cullMode = t), n !== void 0 && (o.frontFace = n), r && (o.unclippedDepth = !0), o;
}
function ti(e, t, n, r, i) {
  if (!(i === void 0 || n + r <= i))
    throw Ye(`${e}.draw`, `${t} range [${n}, ${n + r}) exceeds parent geometry ${t} count ${i}.`);
}
function be(e, t, n) {
  if (!(n === void 0 || Number.isInteger(n) && n >= 0))
    throw Ye(`${e}.draw`, `${t} must be an integer >= 0; received ${String(n)}.`);
}
function ye(e, t, n) {
  if (n !== void 0 && !(Number.isInteger(n) && n >= 0))
    throw new y({
      code: "VGPU-R1-DRAW-COUNT",
      message: `${t} of '${e}' must be an integer >= 0; received ${String(n)}. Use 0 only when you want to issue a valid draw with no vertices/instances.`,
      where: `${e}.draw`
    });
}
function Jf(e, t) {
  const n = t.blend === void 0 ? void 0 : Us(e, t.blend), r = t.writeMask === void 0 ? void 0 : Ns(e, t.writeMask), i = t.colors === void 0 ? void 0 : el(e, t.colors), s = i ? `${fi(n, r)}@${i.map(yl).join("@")}` : n || r !== void 0 ? fi(n, r) : void 0;
  return { blendState: n, writeMask: r, colorStates: i, fragmentKey: s };
}
function el(e, t) {
  if (!Array.isArray(t))
    throw kn(e, `colors must be an array; received ${L(t)}.`);
  return t.map((n, r) => {
    if (n == null)
      return null;
    if (typeof n != "object" || Array.isArray(n))
      throw kn(e, `colors[${r}] must be null or { blend?, writeMask? }; received ${L(n)}.`);
    const i = n.blend === void 0 ? void 0 : Us(`${e}.colors[${r}]`, n.blend), s = n.writeMask === void 0 ? void 0 : Ns(`${e}.colors[${r}]`, n.writeMask);
    return !i && s === void 0 ? null : { blendState: i, writeMask: s };
  });
}
function Us(e, t) {
  if (t === "alpha")
    return It({ src: "src-alpha", dst: "one-minus-src-alpha" }, { src: "one", dst: "one-minus-src-alpha" });
  if (t === "premultiplied")
    return It({ src: "one", dst: "one-minus-src-alpha" }, { src: "one", dst: "one-minus-src-alpha" });
  if (t === "additive")
    return It({ src: "one", dst: "one" }, { src: "one", dst: "one" });
  if (typeof t != "object" || t === null || !ni(t.color))
    throw gr(e, t);
  const n = t.color, r = t.alpha;
  if (r !== void 0 && !ni(r))
    throw gr(e, t);
  return It(n, r ?? n);
}
function ni(e) {
  return typeof e == "object" && e !== null && typeof e.src == "string" && typeof e.dst == "string";
}
function It(e, t) {
  return { color: ri(e), alpha: ri(t) };
}
function ri(e) {
  return { srcFactor: e.src, dstFactor: e.dst, operation: e.op ?? "add" };
}
function tl(e, t, n) {
  if (t.blendConstant === void 0)
    return {};
  const r = t.blendConstant;
  if (!Array.isArray(r) || r.length !== 4 || r.some((i) => typeof i != "number" || !Number.isFinite(i)))
    throw br(e, `received ${L(r)}; expected [r, g, b, a] finite numbers.`);
  if (!nl(n).some((i) => i && rl(i)))
    throw br(e, `no color target's effective blend uses a "constant"/"one-minus-constant" factor (colors[i].blend replaces the top-level blend for that target), so blendConstant would have no effect.`);
  return { blendConstant: { r: r[0], g: r[1], b: r[2], a: r[3] } };
}
function nl(e) {
  return e.colorStates ? e.colorStates.map((t) => t?.blendState ?? e.blendState) : [e.blendState];
}
function rl(e) {
  return [e.color.srcFactor, e.color.dstFactor, e.alpha.srcFactor, e.alpha.dstFactor].some((t) => t === "constant" || t === "one-minus-constant");
}
function il(e, t) {
  if (t === void 0)
    return {};
  if (typeof t != "object" || t === null || Array.isArray(t))
    throw Lt(e, `received ${L(t)}; expected { vertex?, fragment? } entry point names.`);
  return t;
}
function sl(e, t, n) {
  const r = e.entryPoints.find((s) => s.stage === "vertex"), i = e.entryPoints.find((s) => s.stage === "fragment");
  if (!(t === r && n === i))
    return `en~${t?.name ?? ""}~${n?.name ?? ""}`;
}
function ol(e, t, n) {
  const r = n.cull === void 0 ? void 0 : cl(t, n.cull), i = n.frontFace === void 0 ? void 0 : ul(t, n.frontFace), s = n.unclippedDepth === void 0 ? void 0 : al(e, t, n.unclippedDepth);
  return { cullMode: r, frontFace: i, unclippedDepth: s };
}
function al(e, t, n) {
  if (typeof n != "boolean")
    throw wr(t, `received ${L(n)}; expected a boolean.`);
  if (n) {
    if (!e.features.has("depth-clip-control"))
      throw wr(t, 'the device lacks the "depth-clip-control" feature; request it at init: init({ requiredFeatures: ["depth-clip-control"] }) on an adapter that supports it.');
    return !0;
  }
}
function cl(e, t) {
  if (t === "none" || t === "front" || t === "back")
    return t;
  throw qo(e, t);
}
function ul(e, t) {
  if (t === "ccw" || t === "cw")
    return t;
  throw Ko(e, t);
}
const Vs = { depthWriteEnabled: !0, depthCompare: "less-equal" }, zs = ["never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"], ii = -2147483648, si = 2147483647;
function oi(e, t) {
  if (e.depth)
    return { format: e.depth, ...t.depthState ?? Vs, ...t.stencilState ?? {} };
}
function fl(e, t, n) {
  if (n.depth === void 0)
    return {};
  const r = ll(e, t, n.depth, n.geometry?.topology ?? "triangle-list");
  return { depthState: r, depthKey: dl(r) };
}
function ll(e, t, n, r) {
  if (n === !1)
    return { depthWriteEnabled: !1, depthCompare: "always" };
  if (typeof n != "object" || n === null)
    throw ue(t, `received ${L(n)}.`);
  if (n.write !== void 0 && typeof n.write != "boolean")
    throw ue(t, `write must be a boolean; received ${L(n.write)}.`);
  if (n.compare !== void 0 && !zs.includes(n.compare))
    throw ue(t, `compare must be a GPUCompareFunction; received ${L(n.compare)}.`);
  if (n.bias !== void 0 && !Number.isInteger(n.bias))
    throw ue(t, `bias must be an integer (WebGPU depthBias is i32); received ${L(n.bias)}.`);
  if (n.bias !== void 0 && (n.bias < ii || n.bias > si))
    throw ue(t, `bias must fit in the i32 range [${ii}, ${si}] (WebGPU depthBias is i32); received ${L(n.bias)}.`);
  if (n.biasSlopeScale !== void 0 && !Number.isFinite(n.biasSlopeScale))
    throw ue(t, `biasSlopeScale must be a finite number; received ${L(n.biasSlopeScale)}.`);
  if (n.biasClamp !== void 0 && !Number.isFinite(n.biasClamp))
    throw ue(t, `biasClamp must be a finite number; received ${L(n.biasClamp)}.`);
  const i = n.bias ?? 0, s = n.biasSlopeScale ?? 0, o = n.biasClamp ?? 0;
  if ((i !== 0 || s !== 0 || o !== 0) && !r.startsWith("triangle"))
    throw ue(t, `bias, biasSlopeScale, and biasClamp must be 0 for "${r}" topology.`);
  if (o !== 0 && e.isCompatibilityMode)
    throw ue(t, `biasClamp must be 0 on a compatibility-mode device; received ${L(n.biasClamp)}.`);
  return {
    depthWriteEnabled: n.write ?? !0,
    depthCompare: n.compare ?? "less-equal",
    ...i !== 0 ? { depthBias: i } : {},
    ...s !== 0 ? { depthBiasSlopeScale: s } : {},
    ...o !== 0 ? { depthBiasClamp: o } : {}
  };
}
function dl(e) {
  return `${e.depthWriteEnabled ? 1 : 0}~${e.depthCompare}~${e.depthBias ?? 0}~${e.depthBiasSlopeScale ?? 0}~${e.depthBiasClamp ?? 0}`;
}
const hl = ["keep", "zero", "replace", "invert", "increment-clamp", "decrement-clamp", "increment-wrap", "decrement-wrap"];
function pl(e, t) {
  if (t.stencil === void 0)
    return {};
  const n = t.stencil;
  if (typeof n != "object" || n === null || Array.isArray(n))
    throw Oe(e, `received ${L(n)}; expected { front?, back?, readMask?, writeMask?, ref? }.`);
  const r = n.front === void 0 ? void 0 : ai(e, "front", n.front), i = n.back === void 0 ? void 0 : ai(e, "back", n.back);
  gn(e, "readMask", n.readMask), gn(e, "writeMask", n.writeMask), gn(e, "ref", n.ref);
  const s = {
    ...r ? { stencilFront: r } : {},
    // Omitted back mirrors the normalized front so both faces behave the same; with neither given, both keep the WebGPU defaults.
    ...i ?? r ? { stencilBack: i ?? { ...r } } : {},
    ...n.readMask !== void 0 ? { stencilReadMask: n.readMask } : {},
    ...n.writeMask !== void 0 ? { stencilWriteMask: n.writeMask } : {}
  }, o = s.stencilFront !== void 0 || s.stencilBack !== void 0 || s.stencilReadMask !== void 0 || s.stencilWriteMask !== void 0;
  return !o && n.ref === void 0 ? {} : {
    ...o ? { stencilState: s, stencilKey: ml(s) } : {},
    // The reference is encoder state (setStencilReference), not pipeline state; it stays out of the pipeline key.
    ...n.ref !== void 0 ? { stencilRef: n.ref } : {}
  };
}
function ai(e, t, n) {
  if (typeof n != "object" || n === null || Array.isArray(n))
    throw Oe(e, `${t} must be a { compare?, fail?, depthFail?, pass? } object; received ${L(n)}.`);
  if (n.compare !== void 0 && !zs.includes(n.compare))
    throw Oe(e, `${t}.compare must be a GPUCompareFunction; received ${L(n.compare)}.`);
  for (const [r, i] of [["fail", n.fail], ["depthFail", n.depthFail], ["pass", n.pass]])
    if (i !== void 0 && !hl.includes(i))
      throw Oe(e, `${t}.${r} must be a GPUStencilOperation; received ${L(i)}.`);
  return { compare: n.compare ?? "always", failOp: n.fail ?? "keep", depthFailOp: n.depthFail ?? "keep", passOp: n.pass ?? "keep" };
}
function gn(e, t, n) {
  if (n !== void 0 && (typeof n != "number" || !Number.isInteger(n) || n < 0 || n > 4294967295))
    throw Oe(e, `${t} must be an integer in [0, 0xFFFFFFFF] (WebGPU GPUStencilValue is u32); received ${L(n)}.`);
}
function ml(e) {
  return `st~${ci(e.stencilFront)}~${ci(e.stencilBack)}~${e.stencilReadMask ?? 4294967295}~${e.stencilWriteMask ?? 4294967295}`;
}
function ci(e) {
  return e ? `${e.compare},${e.failOp},${e.depthFailOp},${e.passOp}` : "default";
}
function ui(e, t) {
  return { count: e.sampleCount ?? 1, ...t.multisampleState ?? {} };
}
function gl(e, t) {
  if (t.multisample === void 0)
    return {};
  const n = t.multisample;
  if (typeof n != "object" || n === null || Array.isArray(n))
    throw At(e, `received ${L(n)}; expected { alphaToCoverage?, mask? }.`);
  if (n.alphaToCoverage !== void 0 && typeof n.alphaToCoverage != "boolean")
    throw At(e, `alphaToCoverage must be a boolean; received ${L(n.alphaToCoverage)}.`);
  if (n.mask !== void 0 && (typeof n.mask != "number" || !Number.isInteger(n.mask) || n.mask < 0 || n.mask > 4294967295))
    throw At(e, `mask must be an integer in [0, 0xFFFFFFFF] (WebGPU GPUSampleMask is u32); received ${L(n.mask)}.`);
  const r = {
    ...n.alphaToCoverage !== void 0 ? { alphaToCoverageEnabled: n.alphaToCoverage } : {},
    ...n.mask !== void 0 ? { mask: n.mask } : {}
  };
  return r.alphaToCoverageEnabled === void 0 && r.mask === void 0 ? {} : { multisampleState: r, multisampleKey: bl(r) };
}
function bl(e) {
  return `ms~${e.alphaToCoverageEnabled ? 1 : 0}~${e.mask ?? 4294967295}`;
}
function Ns(e, t) {
  if (!Array.isArray(t))
    throw yr(e, L(t));
  let n = 0;
  for (const r of t)
    if (r === "r")
      n |= 1;
    else if (r === "g")
      n |= 2;
    else if (r === "b")
      n |= 4;
    else if (r === "a")
      n |= 8;
    else
      throw yr(e, L(r));
  return n;
}
function fi(e, t) {
  return `${Os(e)};${t ?? 15}`;
}
function Os(e) {
  if (!e)
    return "none;none";
  const t = e.color, n = e.alpha;
  return `${t.srcFactor},${t.dstFactor},${t.operation};${n.srcFactor},${n.dstFactor},${n.operation}`;
}
function yl(e) {
  return e ? `${e.blendState ? Os(e.blendState) : "inherit"};${e.writeMask ?? "inherit"}` : "inherit";
}
function L(e) {
  if (typeof e == "string")
    return `"${e}"`;
  try {
    return JSON.stringify(e) ?? String(e);
  } catch {
    return String(e);
  }
}
function wl(e) {
  return (P(e).depthState ?? Vs).depthWriteEnabled;
}
function xl(e) {
  const t = P(e), n = t.stencilState;
  if (!n || n.stencilWriteMask === 0)
    return [];
  const r = t.cullMode ?? "none", i = [], s = (o, a) => {
    if (a)
      for (const [c, u] of [["fail", a.failOp], ["depthFail", a.depthFailOp], ["pass", a.passOp]])
        u !== void 0 && u !== "keep" && i.push(`${o}.${c}: "${u}"`);
  };
  return r !== "front" && s("front", n.stencilFront), r !== "back" && s("back", n.stencilBack), i;
}
function vl(e, t, n, r = {}, i) {
  e.encode(t, n, r, i);
}
function P(e) {
  const t = Gs.get(e);
  if (!t)
    throw new TypeError("Invalid Draw instance");
  return t;
}
function li(e, t, n, r) {
  const i = (async () => {
    await Vn(e.device), G(e.device, `${t}.validation`);
    const s = Ke(t, n, r);
    e.errorSink ? await e.errorSink(s) : console.error(s);
  })();
  return e.trackSettled?.(i), i;
}
function Sl() {
  const e = /* @__PURE__ */ new Set();
  return {
    add(t) {
      e.add(t);
    },
    delete(t) {
      e.delete(t);
    },
    list() {
      return [...e];
    },
    markStale(t) {
      for (const n of e)
        n.markStale(t);
    }
  };
}
function _l(e, t, n) {
  return e ? Array.isArray(e) ? e : e[t] ?? n : n;
}
function kl(e, t) {
  const n = P(e);
  return gs(n.reflection.bindings, t, n.visibility).map(El);
}
function El(e) {
  return e.buffer ? { ...e, buffer: { ...e.buffer, hasDynamicOffset: !0 } } : e;
}
function di(e, t) {
  if (Cs(e) && !Af())
    throw Di(t);
}
function ot(e, t, n = {}) {
  if ("geometry" in n)
    throw N("effect", "effect() never accepts vertex buffers; use draw(gpu, { shader, geometry: geometry(gpu, descriptor) }).");
  const r = oe(e, "effect"), i = rn(r);
  return new $l(r.device, Hn(t), n, i.binds, void 0, i.pipelines, i.shaderModules, i.pipelineLayouts, (s) => r.reportError(s), (s) => {
    r.trackDelivery(s);
  });
}
const Bs = /* @__PURE__ */ new WeakMap();
class $l {
  get gpu() {
    return $e(this).gpu;
  }
  constructor(t, n, r = {}, i, s, o, a, c, u, l) {
    const f = Il(n), d = new Rs(t, f, { shader: f, set: r.set, label: r.label ?? "effect", blend: r.blend, writeMask: r.writeMask }, i, s, o, a, c, u, l);
    Bs.set(this, d);
  }
  set(t) {
    return $e(this).set(t), this;
  }
  draw(t = {}) {
    $e(this).draw(nn(t) ? { target: t } : t);
  }
  compile(t) {
    return $e(this).compile(t).then(() => this);
  }
  compileSync(t) {
    return $e(this).compileSync(t), this;
  }
  /** @internal FramePass delegates here; not part of the frozen public Effect surface. */
  encode(t, n, r = {}, i) {
    vl($e(this), t, n, r, i);
  }
  /**
   * Frame drawable protocol: an effect is encoded as its underlying draw, so it reuses that draw's
   * protocol object — same encode path, same depth/stencil metadata for read-only passes.
   */
  get [Ht]() {
    return $e(this)[Ht];
  }
}
function $e(e) {
  const t = Bs.get(e);
  if (!t)
    throw new TypeError("Invalid Effect instance");
  return t;
}
function Il(e) {
  return Pl(e) ? e : `
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
${e}`;
}
function Pl(e) {
  return Dn(e, "effect.wgsl").entryPoints.some((t) => t.stage === "vertex");
}
const Tl = bt("clock");
function js(e) {
  return Cl(oe(e, "clock"));
}
function Cl(e) {
  return e.service(Tl, (t) => {
    const n = Yn(t), r = (i) => {
      if (t.disposed)
        throw Ni(i);
      G(t.device, i);
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
          throw pa(i);
        n.advanceBy(i);
      }
    };
  });
}
function Ne(e, t, n = {}) {
  const r = oe(e, "compute");
  return new Fl(r.device, Hn(t), n, rn(r).binds);
}
let Ml = 1;
class Fl {
  device;
  source;
  opts;
  cache;
  id = Ml++;
  label;
  reflection;
  entryPoint;
  setCore;
  bindGroupLayouts;
  pipelineLayout;
  shaderModule;
  pipeline;
  #e;
  constructor(t, n, r = {}, i = Un()) {
    this.device = t, this.source = n, this.opts = r, this.cache = i, G(t, "Compute.constructor"), this.label = r.label ?? "compute", this.reflection = Dn(n, `${this.label}.wgsl`);
    const s = Al(this.reflection, this.label, r.entry);
    this.entryPoint = s.name;
    const { constants: o } = Es(this.label, r.constants, this.reflection.overrides, "compute");
    this.bindGroupLayouts = bs(t, this.label, this.reflection, ms(this.reflection.bindings, [s])), this.pipelineLayout = Ku(t, this.bindGroupLayouts), this.shaderModule = t.gpu.createShaderModule({ label: `${this.label}.shader`, code: n }), this.pipeline = t.gpu.createComputePipeline({
      label: `${this.label}.pipeline`,
      layout: this.pipelineLayout,
      compute: { module: this.shaderModule, entryPoint: this.entryPoint, ...o ? { constants: o } : {} }
    }), this.setCore = ws({ device: t, label: this.label, drawId: this.id, reflection: this.reflection, bindGroupLayouts: this.bindGroupLayouts, cache: this.cache });
    const a = new Set(ht(s, "bindings", this.label).map((c) => `${c.group}:${c.binding}`));
    this.#e = this.reflection.bindings.filter((c) => c.kind === "buffer" && c.addressSpace === "storage" && a.has(`${c.group}:${c.binding}`)), r.set && this.set(r.set);
  }
  set(t) {
    return G(this.device, `${this.label}.set`), this.setCore.set(t), this;
  }
  dispatch(t, n, r) {
    G(this.device, `${this.label}.dispatch`);
    const i = typeof t == "object" && t !== null ? this.#t(t, n, r) : void 0;
    this.#n();
    const s = this.device.gpu.createCommandEncoder({ label: `${this.label}.encoder` }), o = s.beginComputePass({ label: `${this.label}.pass` });
    o.setPipeline(this.pipeline);
    for (const a of this.setCore.bindGroups())
      o.setBindGroup(a.group, a.bindGroup, a.offsets);
    i ? o.dispatchWorkgroupsIndirect(i.buffer, i.offset) : o.dispatchWorkgroups(t, n ?? 1, r ?? 1), o.end(), this.device.gpu.queue.submit([s.finish()]);
  }
  /** The GPU reads the workgroup counts from the buffer, so explicit counts alongside indirect are dead options and throw. */
  #t(t, n, r) {
    const i = `${this.label}.dispatch`;
    if (n !== void 0 || r !== void 0)
      throw Pe(this.label, "indirect cannot be combined with explicit workgroup counts in the same call; the GPU reads the counts from the buffer, so the CPU-side values would be ignored.", i);
    return As(this.label, i, t.indirect, "dispatchWorkgroupsIndirect");
  }
  #n() {
    if (!this.#e.length)
      return;
    const t = /* @__PURE__ */ new Map();
    for (const n of this.#e) {
      const r = this.setCore.bindingState(n.name);
      if (!r)
        continue;
      const i = Wt(r.identity);
      t.has(i) || t.set(i, []), t.get(i).push({ identity: r.identity, writable: n.access !== "read" });
    }
    for (const n of t.values())
      if (!(n.length < 2) && n.some((r) => r.writable))
        throw ba(`${this.label}.dispatch`);
  }
}
function Al(e, t, n) {
  const r = Tn(t, e.entryPoints, "compute", n, "compute");
  if (!r)
    throw N(`${t}.compute`, "The compute shader requires a @compute entry point.");
  return r;
}
function Ws(e, t, n = {}) {
  return Gl(oe(e, "frameLoop")).loop(t, n);
}
const Ll = bt("frame-runner");
function Gl(e) {
  return e.service(Ll, (t) => {
    const n = Yn(t);
    return new ql(() => {
      let r = () => {
      };
      const i = new Rl(t.device, void 0, (s) => t.reportError(s), (s) => {
        t.trackDelivery(s);
      }, () => r());
      return r = t.own("scheduler", () => i.cancel()), i;
    }, () => n.tick(), (r) => t.own("scheduler", () => r.stop()));
  });
}
class Rl {
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
  constructor(t, n, r, i, s) {
    this.device = t, this.defaultTarget = n, this.errorSink = r, this.trackSettled = i, this.releaseLifecycle = s, G(t, "Frame.constructor"), this.#e = t.gpu.createCommandEncoder({ label: "vgpu.frame" });
  }
  pass(t, n) {
    if (this.#i)
      throw Er("Frame.pass");
    G(this.device, "Frame.pass");
    const r = nn(t), i = typeof n == "function" ? n : (h) => h.draw(n), s = r ? t : t.target ?? this.defaultTarget;
    if (!s)
      throw En("Frame.pass");
    if (Cs(s) && this.#s)
      throw Di("Frame.pass");
    const o = r ? void 0 : t.clear, a = o === !1;
    if (a && s.sampleCount === 4)
      throw Yo();
    const c = r ? void 0 : t.clearDepth;
    if (c !== void 0) {
      if (typeof c != "number" || !(c >= 0 && c <= 1))
        throw xr(c);
      if (a)
        throw Xo();
      if (!s.depth)
        throw xr(c, "but the target has no depth attachment, so clearDepth would have no effect.", "Create the target with depth: true (or a depth format), or drop clearDepth.");
    }
    const u = r ? void 0 : t.clearStencil;
    if (u !== void 0) {
      if (typeof u != "number" || !Number.isInteger(u) || u < 0 || u > 4294967295)
        throw vr(`received ${String(u)}; expected an integer in [0, 0xFFFFFFFF] (WebGPU GPUStencilValue).`);
      if (a)
        throw Ho();
      const h = s.depth?.format;
      if (!mt(h))
        throw vr(`received ${String(u)}, but the target's depth format ${h ? `"${h}"` : "(none)"} has no stencil aspect, so clearStencil would have no effect.`);
    }
    const l = r ? void 0 : t.depthReadOnly;
    if (l !== void 0 && typeof l != "boolean")
      throw Ce(`received ${Se(l)}; expected a boolean.`, "Pass depthReadOnly: true to open the pass with a read-only depth attachment, or omit it.");
    if (l) {
      if (!s.depth)
        throw Ce("is set, but the target has no depth attachment, so there is nothing to make read-only.", "Create the target with depth: true (or a depth format), or drop depthReadOnly.");
      if (s.sampleCount === 4)
        throw Zo();
      if (c !== void 0)
        throw Ce("cannot be combined with clearDepth; a read-only depth aspect omits its load/store ops and is never cleared.", "Remove clearDepth, or drop depthReadOnly.");
      if (u !== void 0)
        throw Ce("cannot be combined with clearStencil; a read-only stencil aspect omits its load/store ops and is never cleared.", "Remove clearStencil, or drop depthReadOnly.");
    }
    const f = r ? void 0 : Bl(t.viewport, this.device.gpu.limits, s.size), d = r ? void 0 : jl(t.scissor, s.size), m = [];
    let g;
    try {
      const h = r || t.timer === void 0 ? void 0 : this.#u(t.timer, s, m, Nl), x = (r || t.visibility === void 0 ? void 0 : this.#u(t.visibility, s, m, Ol))?.occlusion;
      let w = s.renderPassDescriptor({ clear: o === void 0 || o === !0 || o === !1 ? s.clearColor ?? qn : o, preserve: a, clearDepth: c, clearStencil: u, depthReadOnly: l });
      h?.timestampWrites && (w = { ...w, timestampWrites: h.timestampWrites }), x && (w = { ...w, occlusionQuerySet: x.querySet }), g = this.#e.beginRenderPass(w), f && g.setViewport(f.x, f.y, f.width, f.height, f.minDepth, f.maxDepth), d && g.setScissorRect(d[0], d[1], d[2], d[3]), this.#a = !0;
      try {
        i(new Dl(g, s, this.#t, l === !0, x, this, ($) => {
          if (G(this.device, $), this.#i)
            throw Er($);
        }));
      } finally {
        this.#a = !1;
      }
    } catch (h) {
      this.#c(m), j(this.#t), this.#t.length = 0, as(this.device);
      try {
        g?.end();
      } catch {
      }
      throw h;
    }
    us(this.device, g, this.#t);
  }
  submit() {
    if (this.#s || this.#i)
      return;
    G(this.device, "Frame.submit"), this.#s = !0, this.releaseLifecycle?.();
    for (const i of this.#l())
      i.finalizeFrame(this, this.#e);
    let t;
    const n = this.#t[0]?.context;
    n && ut(this.device, n);
    try {
      t = this.#e.finish();
    } catch (i) {
      this.#f(this.#o());
      const s = n ? Y(this.device) : void 0;
      j(this.#t), s && j([s]);
      const o = s?.context ?? n;
      if (!o)
        throw i;
      this.done = this.#h(this.#d(o.label, o.group, i));
      return;
    }
    if (n) {
      const i = Y(this.device);
      i && (this.#t[0] = this.#t[0] ? Kt(i, this.#t[0]) : i);
    }
    const r = this.#t[0]?.context;
    r && ut(this.device, r);
    try {
      this.device.gpu.queue.submit([t]);
    } catch (i) {
      this.#f(this.#o());
      const s = r ? Y(this.device) : void 0;
      j(this.#t), s && j([s]);
      const o = s?.context ?? r;
      if (!o)
        throw i;
      this.done = this.#h(this.#d(o.label, o.group, i));
      return;
    }
    if (r) {
      const i = Y(this.device);
      i && (this.#t[0] = this.#t[0] ? Kt(i, this.#t[0]) : i);
    }
    for (const i of this.#l())
      i.frameSubmitted(this);
    this.#f(this.#r), this.done = this.#h(cs(this.device, this.#t, { errorSink: this.errorSink }));
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
        throw ga("Frame.cancel");
      if (this.#a)
        throw ma("Frame.cancel");
      this.#i = !0, this.releaseLifecycle?.(), this.#f(this.#o()), this.#n.clear(), this.#r.clear(), j(this.#t), this.#t.length = 0;
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
  #f(t) {
    for (const n of [...t])
      n.frameAbandoned(this);
  }
  /** Every owner this frame attached, discarded ones included. */
  #o() {
    return [...this.#n, ...this.#r];
  }
  /** Moves owners out of this frame's live set: they are neither finalized nor read back. */
  #c(t) {
    for (const n of [...t])
      this.#n.delete(n), this.#r.add(n);
  }
  #l() {
    return [...this.#n].filter((t) => !this.#r.has(t));
  }
  /**
   * Attaches one `FramePassOptions` telemetry value to this pass through the nominal attachment
   * protocol, so the frame never learns whether it is a timer span, a visibility or a future
   * scene-view generation: it only records the owner it must settle exactly once.
   */
  #u(t, n, r, i) {
    const s = jf(t);
    if (!s)
      throw i(t);
    let o;
    try {
      o = s[Ls]({ frame: this, device: this.device, target: n });
    } catch (a) {
      throw this.#c(this.#n), a;
    }
    return this.#n.add(o.owner), r.push(o.owner), o;
  }
  async #d(t, n, r) {
    await Vn(this.device), G(this.device, "Frame.validation");
    const i = Ke(t, n, r);
    this.errorSink ? await this.errorSink(i) : console.error(i);
  }
  #h(t) {
    return this.trackSettled?.(t), t;
  }
}
class Dl {
  encoder;
  target;
  validations;
  depthReadOnly;
  occlusionSource;
  frame;
  assertFrameOpen;
  #e = !1;
  constructor(t, n, r, i = !1, s, o, a) {
    this.encoder = t, this.target = n, this.validations = r, this.depthReadOnly = i, this.occlusionSource = s, this.frame = o, this.assertFrameOpen = a;
  }
  draw(t, n = {}) {
    this.assertFrameOpen?.("FramePass.draw");
    const r = Vl(t);
    this.depthReadOnly && Ul(r, this.target), r.encode(this.encoder, this.target, n, (i) => this.validations.push(i));
  }
  /**
   * Wraps one or more draws in begin/endOcclusionQuery. The body ALWAYS executes; condition your
   * real draws on `q.hidden` outside.
   */
  occlusion(t, n) {
    if (this.assertFrameOpen?.("FramePass.occlusion"), !this.occlusionSource)
      throw ea();
    if (this.#e)
      throw ta();
    const r = this.occlusionSource.beginQuery(t, this.frame);
    this.encoder.beginOcclusionQuery(r), this.#e = !0;
    try {
      typeof n == "function" ? n() : this.draw(n);
    } finally {
      this.#e = !1, this.encoder.endOcclusionQuery();
    }
  }
  bundles(...t) {
    if (this.assertFrameOpen?.("FramePass.bundles"), this.depthReadOnly)
      throw Ce("pass cannot replay bundles: bundle records bundles with writable depth/stencil, and WebGPU only executes read-only-recorded bundles in a read-only pass.", "Encode the draws directly with pass.draw(...) inside the depthReadOnly pass.", "FramePass.bundles");
    const n = t.map((r) => Bf(r) ?? zl());
    for (const r of n)
      r.assertReplayable(this.target);
    this.encoder.executeBundles(n.map((r) => r.gpu));
  }
}
function Ul(e, t) {
  if (e.writesDepth())
    throw Ce(`pass cannot encode draw '${e.label}': its depth state writes depth (the default is write: true). Give the draw depth: { write: false } (or depth: false to disable depth testing).`, "Use depth: { write: false } on the draw, or open the pass without depthReadOnly.", "FramePass.draw");
  if (mt(t.depth?.format)) {
    const n = e.stencilWritingOps();
    if (n.length)
      throw Ce(`pass cannot encode draw '${e.label}': its stencil ops can write (${n.join(", ")}), and the pass's stencil aspect is read-only too.`, 'Use "keep" for those ops or stencil writeMask: 0, or open the pass without depthReadOnly.', "FramePass.draw");
  }
}
function Vl(e) {
  const t = Nf(e);
  if (!t)
    throw new TypeError("Invalid Effect instance: pass.draw() expects a Draw or an Effect created by this library.");
  return t;
}
function zl() {
  throw new y({ code: "VGPU-R3-BUNDLE-INVALID", message: "p.bundles() expected bundles created by bundle(gpu, { target }, cb).", where: "FramePass.bundles" });
}
function Nl(e) {
  return Qo(`FramePassOptions.timer received ${Se(e)}; expected a TimerSpan from timer.span(name).`, 'Create const passTimer = timer(gpu) once, then pass passTimer.span("name") per pass.', "Frame.pass");
}
function Ol(e) {
  return Jo(`FramePassOptions.visibility received ${Se(e)}; expected a Visibility from visibility(gpu).`, "Create const vis = visibility(gpu) once, then pass { target, visibility: vis } per pass.", "Frame.pass");
}
function Bl(e, t, n) {
  if (e === void 0)
    return;
  if (typeof e != "object" || e === null || Array.isArray(e))
    throw fe(`received ${Se(e)}; expected { x?, y?, width, height, minDepth?, maxDepth? }.`);
  const { x: r = 0, y: i = 0, width: s, height: o, minDepth: a = 0, maxDepth: c = 1 } = e;
  for (const [d, m] of [["x", r], ["y", i], ["width", s], ["height", o], ["minDepth", a], ["maxDepth", c]])
    if (typeof m != "number" || !Number.isFinite(m))
      throw fe(`${d} received ${Se(m)}; expected a finite number.`);
  const u = t.maxTextureDimension2D, l = u * 2, f = `target is ${n[0]}x${n[1]}px, device maxTextureDimension2D is ${u}`;
  if (!(s >= 0 && s <= u))
    throw fe(`width ${s} is outside [0, ${u}] (${f}).`);
  if (!(o >= 0 && o <= u))
    throw fe(`height ${o} is outside [0, ${u}] (${f}).`);
  if (!(r >= -l && r + s <= l - 1))
    throw fe(`x ${r} with width ${s} is outside [${-l}, ${l - 1}] (${f}).`);
  if (!(i >= -l && i + o <= l - 1))
    throw fe(`y ${i} with height ${o} is outside [${-l}, ${l - 1}] (${f}).`);
  if (!(a >= 0 && a <= 1))
    throw fe(`minDepth ${a} is outside [0, 1].`);
  if (!(c >= 0 && c <= 1))
    throw fe(`maxDepth ${c} is outside [0, 1].`);
  if (!(a <= c))
    throw fe(`minDepth ${a} exceeds maxDepth ${c}.`);
  return { x: r, y: i, width: s, height: o, minDepth: a, maxDepth: c };
}
function jl(e, t) {
  if (e === void 0)
    return;
  if (!Array.isArray(e) || e.length !== 4)
    throw ln(`received ${Se(e)}; expected [x, y, width, height].`);
  const [n, r, i, s] = e;
  for (const [c, u] of [["x", n], ["y", r], ["width", i], ["height", s]])
    if (typeof u != "number" || !Number.isInteger(u) || u < 0)
      throw ln(`${c} received ${Se(u)}; expected a non-negative integer.`);
  const [o, a] = t;
  if (n + i > o || r + s > a)
    throw ln(`[${n}, ${r}, ${i}, ${s}] exceeds the target's current size ${o}x${a}px (x + width <= ${o}, y + height <= ${a}).`);
  return [n, r, i, s];
}
function Se(e) {
  return typeof e == "string" ? `'${e}'` : Array.isArray(e) ? `[${e.map((t) => Se(t)).join(", ")}]` : typeof e == "object" && e !== null ? "an object" : String(e);
}
function Wl(e) {
  const t = e?.code;
  return t === "VGPU-DEVICE-DISPOSED" || t === "VGPU-DEVICE-LOST";
}
class ql {
  createFrame;
  advance;
  trackLoop;
  #e = !1;
  /**
   * @param trackLoop Lifecycle hook for the owning gpu: called with each started loop handle and
   * returns the untrack function the handle runs when it stops on its own, so `gpu.dispose()` can
   * stop the loops still running without holding on to the ones already stopped.
   */
  constructor(t, n, r) {
    this.createFrame = t, this.advance = n, this.trackLoop = r;
  }
  frame(t) {
    if (this.#e || Ff())
      throw Ui();
    this.#e = !0, Lf();
    try {
      this.advance();
      const n = this.createFrame();
      if (t)
        try {
          t(n);
        } finally {
          try {
            n.submit();
          } catch (r) {
            if (!Wl(r))
              throw r;
          }
        }
      return n;
    } finally {
      Gf(), this.#e = !1;
    }
  }
  loop(t, n = {}) {
    let r = !1;
    const i = globalThis.requestAnimationFrame ?? ((d) => setTimeout(() => d(performance.now()), 16)), s = globalThis.cancelAnimationFrame ?? ((d) => clearTimeout(d)), o = n.fps && n.fps > 0 ? 1e3 / n.fps : 0;
    let a, c = 0;
    const u = (d) => {
      r || (Kl(d, a, o) && (a = d, this.frame(t)), r || (c = i(u)));
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
function Kl(e, t, n) {
  return t === void 0 || n <= 0 ? !0 : e - t >= n;
}
function Ie(e, t) {
  return new Yl(oe(e, "target").device, t);
}
class Yl {
  device;
  options;
  resourceIdentity = Jt("render-target");
  #e = new en();
  #t = /* @__PURE__ */ new Set();
  #n;
  #r;
  #s;
  #i;
  #a;
  constructor(t, n) {
    this.device = t, this.options = n, cf(n, t), this.#a = n.clearColor === void 0 ? qn : Yt(n.clearColor, "target.clearColor"), this.#n = n.size, this.#r = this.#l(), this.#s = this.sampleCount === 4 ? this.#u() : void 0, this.#i = this.#d();
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
    return Vt(this.options)[0]?.format ?? "rgba8unorm";
  }
  /** Default clear color of this target; passes that clear without naming a color use it. */
  get clearColor() {
    return Kn(this.#a);
  }
  set clearColor(t) {
    this.#a = Yt(t, "target.clearColor");
  }
  get sampleCount() {
    return vs(this.options);
  }
  resize(t) {
    _s(this.#n, t) || this.#f(t);
  }
  async read() {
    return this.color.read();
  }
  async readFloats() {
    return this.color.readFloats();
  }
  onDestroy(t) {
    return this.#e.onDestroy(this, t);
  }
  onTexturesRecreated(t) {
    return this.#t.add(t), () => {
      this.#t.delete(t);
    };
  }
  destroy() {
    this.#e.emit(this), this.#t.clear(), this.#c();
  }
  renderPassDescriptor(t = {}) {
    const { clear: n = [0, 0, 0, 1], preserve: r, clearDepth: i, clearStencil: s, depthReadOnly: o } = t;
    return {
      colorAttachments: this.#r.map((a, c) => ff(a, this.#s?.[c], n, r)),
      depthStencilAttachment: this.#i ? lf(this.#i, r, i, s, o) : void 0
    };
  }
  #f(t) {
    this.#c(), this.#n = [t[0], t[1]], this.#r = this.#l(), this.#s = this.sampleCount === 4 ? this.#u() : void 0, this.#i = this.#d(), this.#o();
  }
  #o() {
    for (const t of [...this.#t])
      t();
  }
  #c() {
    for (const t of this.#r)
      t.destroy();
    for (const t of this.#s ?? [])
      t.destroy();
    this.#i?.destroy();
  }
  #l() {
    return Vt(this.options).map((t, n) => this.device.createTexture({
      size: this.#n,
      format: t.format,
      usage: ["render_attachment", "texture_binding", "copy_src"],
      sampleCount: 1,
      label: this.options.label ? `${this.options.label}.color${n}.resolve` : void 0
    }));
  }
  #u() {
    return Vt(this.options).map((t, n) => this.device.createTexture({
      size: this.#n,
      format: t.format,
      usage: ["render_attachment"],
      sampleCount: 4,
      label: this.options.label ? `${this.options.label}.color${n}` : void 0
    }));
  }
  #d() {
    const t = xs(this.options);
    return t ? this.device.createTexture({
      size: this.#n,
      format: t,
      usage: ["render_attachment", "texture_binding"],
      sampleCount: this.sampleCount,
      label: this.options.label ? `${this.options.label}.depth` : void 0
    }) : void 0;
  }
}
function ne(e, t, n = "read-write") {
  const r = oe(e, "storage"), i = typeof n == "string" ? { access: n } : n, s = Xl(r.device, t, i.access ?? "read-write", void 0, i.indirect ?? !1);
  return Oi(r, s, (o) => o.destroy(), (o) => {
    s.onDestroy(o);
  });
}
class Zn {
  size;
  access;
  buffer;
  constructor(t, n) {
    this.buffer = t, this.access = n, this.size = t.options.size;
  }
  static create(t, n, r, i, s = !1) {
    const o = s ? ["storage", "copy_dst", "copy_src", "indirect"] : ["storage", "copy_dst", "copy_src"], a = t.createBuffer({
      size: n,
      usage: o,
      label: i
    });
    return new Zn(a, r);
  }
  read() {
    return this.buffer.read(this.size);
  }
  write(t, n = 0) {
    this.buffer.write(Hl(t), n);
  }
  get gpu() {
    return this.buffer.gpu;
  }
  get resourceIdentity() {
    return this.buffer.resourceIdentity;
  }
  onDestroy(t) {
    return this.buffer.onDestroy(t);
  }
  /** Frees the GPU allocation. Idempotent; bind groups holding it are invalidated through the buffer's destroy signal. */
  destroy() {
    this.buffer.destroy();
  }
}
function Xl(e, t, n, r, i = !1) {
  return Zn.create(e, t, n, r, i);
}
function Hl(e) {
  if (e instanceof ArrayBuffer || ArrayBuffer.isView(e))
    return e;
  throw new TypeError("StorageBuffer.write() requires ArrayBuffer or ArrayBufferView.");
}
function Zl(e) {
  return ka("browser", e);
}
const Ql = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Geometry: Bi,
  VGPUError: y,
  clock: js,
  compute: Ne,
  draw: ze,
  effect: ot,
  frameLoop: Ws,
  geometry: Gt,
  init: Zl,
  sampler: Mn,
  storage: ne,
  surface: Ts,
  target: Ie
}, Symbol.toStringTag, { value: "Module" }));
function Jl(e, t, n) {
  const r = Object.freeze({ ...t });
  return Object.freeze({
    kind: e,
    props: r,
    build: (i) => ed(n(i, r))
  });
}
function ed(e) {
  const t = e.attributes, n = {
    position: { ...t.position, location: 0 }
  };
  return t.normal && (n.normal = { ...t.normal, location: 1 }), t.uv && (n.uv = { ...t.uv, location: 2 }), {
    buffers: [{
      buffer: e.gpu?.vertexBuffer ?? e.vertexBuffer.gpu,
      stride: t.stride,
      attributes: n
    }],
    vertexCount: e.vertexCount,
    indexBuffer: e.gpu?.indexBuffer ?? e.indexBuffer?.gpu,
    indexFormat: e.indexFormat,
    indexCount: e.indexCount
  };
}
function td(e, t, n, r) {
  let i = e.get(t);
  i || (i = /* @__PURE__ */ new Map(), e.set(t, i));
  const s = i.get(n);
  if (s)
    return s;
  const o = r();
  return i.set(n, o), o;
}
function Pt(e, t) {
  return new Qt({ code: "VGPU-CORE-INVALID-USAGE", message: t, where: e });
}
function nd(e) {
  const { radius: t, widthSegments: n, heightSegments: r } = e, i = [], s = [];
  for (let a = 0; a <= r; a++) {
    const c = a / r, u = c * Math.PI, l = Math.sin(u), f = Math.cos(u);
    for (let d = 0; d <= n; d++) {
      const m = d / n, g = m * Math.PI * 2, h = l * Math.cos(g), S = f, x = l * Math.sin(g);
      i.push(t * h, t * S, t * x, h, S, x, m, c);
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
const rd = Object.freeze({
  stride: 32,
  position: Object.freeze({ offset: 0, format: "float32x3" }),
  normal: Object.freeze({ offset: 12, format: "float32x3" }),
  uv: Object.freeze({ offset: 24, format: "float32x2" })
}), id = /* @__PURE__ */ new WeakMap();
function sd(e) {
  const t = e.radius ?? 0.5, n = e.widthSegments ?? 32, r = e.heightSegments ?? 16;
  od(t, n, r);
  const i = `${t}|${n}|${r}`;
  return td(id, e.device, i, () => {
    const s = nd({ radius: t, widthSegments: n, heightSegments: r }), o = e.device.createBuffer({ label: `mesh.sphere.vertices.${i}`, size: s.vertices.byteLength, usage: ["vertex", "copy_dst"] });
    o.write(s.vertices);
    const a = e.device.createBuffer({ label: `mesh.sphere.indices.${i}`, size: s.indices.byteLength, usage: ["index", "copy_dst"] });
    return a.write(s.indices), Object.freeze({
      vertexBuffer: o,
      vertexCount: s.vertices.length / 8,
      attributes: rd,
      bbox: Object.freeze({
        min: new Float32Array([-t, -t, -t]),
        max: new Float32Array([t, t, t])
      }),
      indexBuffer: a,
      indexCount: s.indices.length,
      indexFormat: "uint16",
      layout: "position-normal-uv",
      gpu: Object.freeze({ vertexBuffer: o.gpu, indexBuffer: a.gpu })
    });
  });
}
function od(e, t, n) {
  if (e <= 0)
    throw Pt("Mesh.sphere", "Radius must be greater than 0.");
  if (t < 3)
    throw Pt("Mesh.sphere", "Width segments must be at least 3.");
  if (n < 2)
    throw Pt("Mesh.sphere", "Height segments must be at least 2.");
  const r = (t + 1) * (n + 1);
  if (r > 65535)
    throw Pt("Mesh.sphere", `Segments ${t}x${n} make ${r} vertices > uint16 limit 65535; reduce them.`);
}
function ad(e = {}) {
  return Jl("sphere", e, (t, n) => sd({ device: t, ...n }));
}
function cd(e) {
  return e * Math.PI / 180;
}
function ud(e, t, n, r) {
  const i = Math.tan(Math.PI * 0.5 - 0.5 * e), s = 1 / (n - r);
  return new Float32Array([
    i / t,
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
function fd(e, t) {
  const n = t ? `'${t}'` : "the node";
  return new y({
    code: "VGPU-SCENE-CYCLE",
    message: `add() would make ${n} an ancestor of itself.`,
    fix: "Remove the node from the ancestor chain first, or add a different node.",
    where: e
  });
}
function he(e, t, n) {
  return new y({
    code: "VGPU-SCENE-VALUE-INVALID",
    message: `\`${t}\` is invalid; expected ${n}.`,
    fix: `Pass ${n} for \`${t}\`.`,
    where: e
  });
}
function ft(e) {
  return e.fill(0), e[0] = e[5] = e[10] = e[15] = 1, e;
}
function ld(e, t) {
  return e.set(t), e;
}
function dd(e, t, n, r) {
  const i = n[0], s = n[1], o = n[2], a = n[3], c = i + i, u = s + s, l = o + o, f = i * c, d = i * u, m = i * l, g = s * u, h = s * l, S = o * l, x = a * c, w = a * u, $ = a * l, I = r[0], T = r[1], E = r[2];
  return e[0] = (1 - (g + S)) * I, e[1] = (d + $) * I, e[2] = (m - w) * I, e[3] = 0, e[4] = (d - $) * T, e[5] = (1 - (f + S)) * T, e[6] = (h + x) * T, e[7] = 0, e[8] = (m + w) * E, e[9] = (h - x) * E, e[10] = (1 - (f + g)) * E, e[11] = 0, e[12] = t[0], e[13] = t[1], e[14] = t[2], e[15] = 1, e;
}
function qs(e, t, n) {
  const r = t[0], i = t[1], s = t[2], o = t[3], a = t[4], c = t[5], u = t[6], l = t[7], f = t[8], d = t[9], m = t[10], g = t[11], h = t[12], S = t[13], x = t[14], w = t[15];
  for (let $ = 0; $ < 4; $++) {
    const I = $ * 4, T = n[I], E = n[I + 1], A = n[I + 2], p = n[I + 3];
    e[I] = r * T + a * E + f * A + h * p, e[I + 1] = i * T + c * E + d * A + S * p, e[I + 2] = s * T + u * E + m * A + x * p, e[I + 3] = o * T + l * E + g * A + w * p;
  }
  return e;
}
function Ks(e, t) {
  const n = t[0], r = t[1], i = t[2], s = t[4], o = t[5], a = t[6], c = t[8], u = t[9], l = t[10], f = t[12], d = t[13], m = t[14], g = o * l - a * u, h = a * c - s * l, S = s * u - o * c, x = n * g + r * h + i * S, w = x === 0 ? 0 : 1 / x, $ = g * w, I = h * w, T = S * w, E = (i * u - r * l) * w, A = (n * l - i * c) * w, p = (r * c - n * u) * w, b = (r * a - i * o) * w, _ = (i * s - n * a) * w, k = (n * o - r * s) * w;
  return e[0] = $, e[1] = E, e[2] = b, e[3] = 0, e[4] = I, e[5] = A, e[6] = _, e[7] = 0, e[8] = T, e[9] = p, e[10] = k, e[11] = 0, e[12] = -($ * f + I * d + T * m), e[13] = -(E * f + A * d + p * m), e[14] = -(b * f + _ * d + k * m), e[15] = 1, e;
}
function hd(e, t, n) {
  const r = n[0], i = n[1], s = n[2];
  return e[0] = t[0] * r + t[4] * i + t[8] * s + t[12], e[1] = t[1] * r + t[5] * i + t[9] * s + t[13], e[2] = t[2] * r + t[6] * i + t[10] * s + t[14], e;
}
function pd(e, t, n) {
  const r = n[0], i = n[1], s = n[2];
  return e[0] = t[0] * r + t[4] * i + t[8] * s, e[1] = t[1] * r + t[5] * i + t[9] * s, e[2] = t[2] * r + t[6] * i + t[10] * s, e;
}
function md(e, t, n, r) {
  const i = Math.cos(t / 2), s = Math.sin(t / 2), o = Math.cos(n / 2), a = Math.sin(n / 2), c = Math.cos(r / 2), u = Math.sin(r / 2);
  return e[0] = s * o * c + i * a * u, e[1] = i * a * c - s * o * u, e[2] = i * o * u + s * a * c, e[3] = i * o * c - s * a * u, e;
}
function gd(e, t, n, r, i, s, o, a, c, u) {
  const l = t + s + u;
  if (l > 0) {
    const f = 0.5 / Math.sqrt(l + 1);
    e[3] = 0.25 / f, e[0] = (o - c) * f, e[1] = (a - r) * f, e[2] = (n - i) * f;
  } else if (t > s && t > u) {
    const f = 2 * Math.sqrt(1 + t - s - u);
    e[3] = (o - c) / f, e[0] = 0.25 * f, e[1] = (i + n) / f, e[2] = (a + r) / f;
  } else if (s > u) {
    const f = 2 * Math.sqrt(1 + s - t - u);
    e[3] = (a - r) / f, e[0] = (i + n) / f, e[1] = 0.25 * f, e[2] = (c + o) / f;
  } else {
    const f = 2 * Math.sqrt(1 + u - t - s);
    e[3] = (n - i) / f, e[0] = (a + r) / f, e[1] = (c + o) / f, e[2] = 0.25 * f;
  }
  return e;
}
function bd(e, t, n, r) {
  let i = t[0] - n[0], s = t[1] - n[1], o = t[2] - n[2];
  const a = Math.hypot(i, s, o);
  if (a === 0)
    return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 1, e;
  i /= a, s /= a, o /= a;
  let c = r[1] * o - r[2] * s, u = r[2] * i - r[0] * o, l = r[0] * s - r[1] * i, f = Math.hypot(c, u, l);
  f === 0 && (c = o, u = 0, l = -i, f = Math.hypot(c, u, l), f === 0 && (c = 1, u = 0, l = 0, f = 1)), c /= f, u /= f, l /= f;
  const d = s * l - o * u, m = o * c - i * l, g = i * u - s * c;
  return gd(e, c, u, l, d, m, g, i, s, o);
}
const yd = new Float32Array([0, 1, 0]), hi = new Float32Array(3), Tt = new Float32Array(3), Ct = new Float32Array(3), bn = new Float32Array(16);
class wd {
  kind;
  label;
  visible = !0;
  #e = new Float32Array(3);
  #t = new Float32Array([0, 0, 0, 1]);
  #n = new Float32Array([1, 1, 1]);
  #r = ft(new Float32Array(16));
  #s = ft(new Float32Array(16));
  #i = new Float32Array(3);
  #a = !1;
  #f = !1;
  #o = null;
  #c = [];
  _worldVersion = 0;
  constructor(t, n = {}) {
    this.kind = t, this.label = n.label, this.#l(n), n.children && this.add(...n.children);
  }
  /** Updates transform components in place; unspecified components are left untouched. */
  set(t) {
    return this.#l(t), this;
  }
  #l(t) {
    const n = `${this.label ?? this.kind}.set`;
    let r = !1;
    if (t.position !== void 0 && (Mt(this.#e, t.position, "position", n), r = !0), t.quaternion !== void 0) {
      if (t.quaternion.length !== 4)
        throw he(n, "quaternion", "an array of 4 numbers (x, y, z, w)");
      this.#t[0] = t.quaternion[0], this.#t[1] = t.quaternion[1], this.#t[2] = t.quaternion[2], this.#t[3] = t.quaternion[3], r = !0;
    } else if (t.rotation !== void 0) {
      if (t.rotation.length !== 3)
        throw he(n, "rotation", "an array of 3 Euler angles in radians");
      md(this.#t, t.rotation[0], t.rotation[1], t.rotation[2]), r = !0;
    }
    t.scale !== void 0 && (typeof t.scale == "number" ? this.#n.fill(t.scale) : Mt(this.#n, t.scale, "scale", n), r = !0), t.visible !== void 0 && (this.visible = t.visible), t.label !== void 0 && (this.label = t.label), r && this.#u();
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
  lookAt(t, n = yd) {
    const r = `${this.label ?? this.kind}.lookAt`;
    Mt(Tt, t, "target", r), Mt(Ct, n, "up", r), hi.set(this.#e);
    const i = this.#o;
    return i && (Ks(bn, i.worldMatrix), hd(Tt, bn, Tt), pd(Ct, bn, Ct)), bd(this.#t, hi, Tt, Ct), this.#u(), this;
  }
  /** Adds children, reparenting them if needed. Throws `VGPU-SCENE-CYCLE` on cycles. */
  add(...t) {
    const n = `${this.label ?? this.kind}.add`;
    for (const r of t) {
      for (let i = this; i; i = i.#o)
        if (i === r)
          throw fd(n, r.label ?? r.kind);
      r.#o && r.#o.#h(r), r.#o = this, this.#c.push(r), r.#d();
    }
    return this;
  }
  /** Removes direct children; nodes that are not children are ignored. */
  remove(...t) {
    for (const n of t)
      n.#o === this && this.#h(n);
    return this;
  }
  /** Detaches this node from its parent, keeping its local transform. */
  removeFromParent() {
    return this.#o && this.#o.#h(this), this;
  }
  /** Depth-first visit of this node and all descendants. */
  traverse(t) {
    t(this);
    for (const n of this.#c)
      n.traverse(t);
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
    return this.#a && (dd(this.#r, this.#e, this.#t, this.#n), this.#a = !1), this.#r;
  }
  /** Column-major world matrix, recomputed lazily for dirty subtrees. Stable array identity. */
  get worldMatrix() {
    if (this.#f || this.#a) {
      const t = this.localMatrix, n = this.#o;
      n ? qs(this.#s, n.worldMatrix, t) : ld(this.#s, t), this.#f = !1, this._worldVersion++;
    }
    return this.#s;
  }
  /** World-space position derived from `worldMatrix`. Stable array identity. */
  get worldPosition() {
    const t = this.worldMatrix;
    return this.#i[0] = t[12], this.#i[1] = t[13], this.#i[2] = t[14], this.#i;
  }
  #u() {
    this.#a = !0, this.#d(!0);
  }
  #d(t = !1) {
    if (!(this.#f && !t)) {
      this.#f = !0;
      for (const n of this.#c)
        n.#d();
    }
  }
  #h(t) {
    const n = this.#c.indexOf(t);
    n >= 0 && this.#c.splice(n, 1), t.#o = null, t.#d(!0);
  }
}
function Mt(e, t, n, r) {
  if (t.length !== 3)
    throw he(r, n, "an array of 3 numbers");
  e[0] = t[0], e[1] = t[1], e[2] = t[2];
}
class xd extends wd {
  #e = ft(new Float32Array(16));
  #t = ft(new Float32Array(16));
  #n = ft(new Float32Array(16));
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
    const t = this.projection;
    return this.#i(), this.#s && (qs(this.#n, t, this.#t), this.#s = !1), this.#n;
  }
  get viewProjectionMatrix() {
    return this.viewProjection;
  }
  #i() {
    const t = this.worldMatrix;
    this.#r !== this._worldVersion && (Ks(this.#t, t), this.#r = this._worldVersion, this.#s = !0);
  }
}
class vd extends xd {
  #e;
  #t;
  #n;
  #r;
  constructor(t) {
    pi("perspectiveCamera", t.fov), t.aspect !== void 0 && gi("perspectiveCamera", t.aspect), mi("perspectiveCamera", t.near ?? 0.1, t.far ?? 100), _d("perspectiveCamera", t.target, t.up), super("perspective-camera", t), this.#e = t.fov, this.#t = t.aspect, this.#n = t.near ?? 0.1, this.#r = t.far ?? 100, t.target && this.lookAt(t.target, t.up);
  }
  set(t) {
    super.set(t);
    const n = `${this.label ?? this.kind}.set`;
    if (t.fov !== void 0 && (pi(n, t.fov), this.#e = t.fov, this._projectionDirty = !0), t.aspect !== void 0 && (gi(n, t.aspect), this.#t = t.aspect, this._projectionDirty = !0), t.near !== void 0 || t.far !== void 0) {
      const r = t.near ?? this.#n, i = t.far ?? this.#r;
      mi(n, r, i), this.#n = r, this.#r = i, this._projectionDirty = !0;
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
  _updateProjection(t) {
    t.set(ud(cd(this.#e), this.#t ?? 1, this.#n, this.#r));
  }
}
function Sd(e) {
  return new vd(e);
}
function _d(e, t, n) {
  if (t !== void 0) {
    if (t.length !== 3)
      throw he(e, "target", "an array of 3 numbers");
    if (n !== void 0 && n.length !== 3)
      throw he(e, "up", "an array of 3 numbers");
  }
}
function pi(e, t) {
  if (!(t > 0 && t < 180))
    throw he(e, "fov", "a field of view in degrees between 0 and 180 (exclusive)");
}
function mi(e, t, n) {
  if (!(t > 0))
    throw he(e, "near", "a positive near plane distance");
  if (!(n > t))
    throw he(e, "far", "a far plane distance greater than `near`");
}
function gi(e, t) {
  if (!(t > 0) || !Number.isFinite(t))
    throw he(e, "aspect", "a positive, finite width/height ratio");
}
const kd = { version: 1, wgsl: "const NU:u32=256u;@group(0) @binding(0) var<storage,read> disp:array<vec4f>;@fragment fn fs_main(@location(0) a:vec2f)-> @location(0) vec4f{let x=min(u32(a.x*f32(NU)),NU-1u);let b=min(u32(a.y*f32(NU)),NU-1u);return disp[b*NU+x];}" }, We = 20, at = 1e-6, D = {
  hullRed: [0.7, 0.17, 0.1],
  hullRust: [0.4, 0.17, 0.12],
  deckRed: [0.6, 0.15, 0.1],
  tubeDark: [0.2, 0.12, 0.1],
  iron: [0.15, 0.145, 0.155],
  steel: [0.55, 0.56, 0.58],
  solar: [0.07, 0.09, 0.16],
  lantern: [1, 0.84, 0.55]
}, Me = (e, t) => [e[0] - t[0], e[1] - t[1], e[2] - t[2]], K = (e, t) => [e[0] + t[0], e[1] + t[1], e[2] + t[2]], J = (e, t) => [e[0] * t, e[1] * t, e[2] * t], Ys = (e, t) => e[0] * t[0] + e[1] * t[1] + e[2] * t[2], sn = (e, t) => [
  e[1] * t[2] - e[2] * t[1],
  e[2] * t[0] - e[0] * t[2],
  e[0] * t[1] - e[1] * t[0]
], qe = (e) => {
  const t = Math.hypot(e[0], e[1], e[2]);
  return t > at ? J(e, 1 / t) : [0, 1, 0];
};
function Ed(e) {
  let t = e >>> 0;
  return () => {
    t = t + 1831565813 >>> 0;
    let n = t;
    return n = Math.imul(n ^ n >>> 15, n | 1), n ^= n + Math.imul(n ^ n >>> 7, n | 61), ((n ^ n >>> 14) >>> 0) / 4294967296;
  };
}
function bi() {
  return { positions: [], normals: [], colors: [], tris: 0 };
}
function X(e, t, n, r, i) {
  const s = qe(sn(Me(n, t), Me(r, t)));
  for (const o of [t, n, r])
    e.positions.push(o[0], o[1], o[2]), e.normals.push(s[0], s[1], s[2]), e.colors.push(i[0], i[1], i[2]);
  e.tris += 1;
}
function Xs(e, t, n, r, i, s, o) {
  const a = sn(Me(n, t), Me(r, t));
  Ys(a, s) >= 0 ? (X(e, t, n, r, o), X(e, t, r, i, o)) : (X(e, t, r, n, o), X(e, t, i, r, o));
}
const re = (e, t, n) => {
  const r = n / We * Math.PI * 2;
  return [e * Math.cos(r), t, e * Math.sin(r)];
};
function Nt(e, t, n, r = 0, i) {
  const s = (o) => {
    if (!r || !i) return o;
    const a = 1 + (i() - 0.5) * r;
    return [o[0] * a, o[1] * a, o[2] * a];
  };
  for (let o = 0; o < t.length - 1; o++) {
    const [a, c] = t[o], [u, l] = t[o + 1];
    if (a < at && u < at) continue;
    const f = n((c + l) / 2);
    for (let d = 0; d < We; d++) {
      const m = s(f);
      if (a < at)
        X(e, [0, c, 0], re(u, l, d), re(u, l, d + 1), m);
      else if (u < at)
        X(e, [0, l, 0], re(a, c, d + 1), re(a, c, d), m);
      else {
        const g = re(a, c, d), h = re(a, c, d + 1), S = re(u, l, d), x = re(u, l, d + 1);
        X(e, g, x, h, m), X(e, g, S, x, m);
      }
    }
  }
}
function Zt(e, t, n, r, i, s = 0, o) {
  for (let a = 0; a < We; a++) {
    const c = s && o ? 1 + (o() - 0.5) * s : 1, u = [i[0] * c, i[1] * c, i[2] * c], l = re(t, n, a), f = re(t, n, a + 1);
    r ? X(e, [0, n, 0], f, l, u) : X(e, [0, n, 0], l, f, u);
  }
}
function Ft(e, t, n, r, i, s = {}) {
  Nt(e, [
    [t, n],
    [t, r]
  ], () => i), s.capTop && Zt(e, t, r, !0, i), s.capBottom && Zt(e, t, n, !1, i);
}
function yn(e, t, n, r, i, s) {
  const o = (c, u) => {
    const l = c / We * Math.PI * 2, f = u / i * Math.PI * 2, d = t + n * Math.cos(f);
    return [d * Math.cos(l), r + n * Math.sin(f), d * Math.sin(l)];
  }, a = (c, u) => {
    const l = (c + 0.5) / We * Math.PI * 2, f = (u + 0.5) / i * Math.PI * 2;
    return [Math.cos(f) * Math.cos(l), Math.sin(f), Math.cos(f) * Math.sin(l)];
  };
  for (let c = 0; c < We; c++)
    for (let u = 0; u < i; u++)
      Xs(e, o(c, u), o(c + 1, u), o(c + 1, u + 1), o(c, u + 1), a(c, u), s);
}
function Hs(e, t, n, r, i, s, o) {
  const a = (u, l, f) => K(t, K(J(n, u * s[0]), K(J(r, l * s[1]), J(i, f * s[2])))), c = [
    [a(1, -1, -1), a(1, 1, -1), a(1, 1, 1), a(1, -1, 1), n],
    [a(-1, -1, -1), a(-1, 1, -1), a(-1, 1, 1), a(-1, -1, 1), J(n, -1)],
    [a(-1, 1, -1), a(1, 1, -1), a(1, 1, 1), a(-1, 1, 1), r],
    [a(-1, -1, -1), a(1, -1, -1), a(1, -1, 1), a(-1, -1, 1), J(r, -1)],
    [a(-1, -1, 1), a(1, -1, 1), a(1, 1, 1), a(-1, 1, 1), i],
    [a(-1, -1, -1), a(1, -1, -1), a(1, 1, -1), a(-1, 1, -1), J(i, -1)]
  ];
  for (const [u, l, f, d, m] of c) Xs(e, u, l, f, d, m, o);
}
function nt(e, t, n, r, i) {
  const s = qe(Me(n, t)), o = qe([t[0] + n[0], 0, t[2] + n[2]]), a = qe(Me(o, J(s, Ys(o, s)))), c = sn(s, a), u = Math.hypot(...Me(n, t)) / 2, l = J(K(t, n), 0.5);
  Hs(e, l, a, c, s, [r, r, u], i);
}
function $d() {
  const e = bi(), t = bi(), n = Ed(7);
  Nt(e, [
    [0, -5],
    [0.5, -4.7],
    [0.58, -4.15],
    [0.34, -3.9],
    [0.3, -1.6]
  ], () => D.tubeDark, 0.06, n), Nt(e, [
    [0.3, -1.6],
    [1.9, -1.05],
    [2.42, -0.8],
    [2.5, -0.15],
    [2.46, 0.55],
    [2.2, 0.9],
    [1.75, 1.05]
  ], (o) => o < -0.45 ? D.hullRust : D.hullRed, 0.14, n), Zt(e, 1.75, 1.05, !0, D.deckRed, 0.1, n), yn(e, 2.56, 0.11, 0.6, 6, D.iron), yn(e, 2.52, 0.09, -0.5, 6, D.hullRust);
  const r = (o) => o / 4 * Math.PI * 2 + Math.PI / 4, i = (o, a, c) => {
    const u = r(o);
    return [a * Math.cos(u), c, a * Math.sin(u)];
  }, s = (o) => 1.3 + (0.62 - 1.3) * (o - 1.05) / (4.5 - 1.05);
  for (let o = 0; o < 4; o++)
    nt(e, i(o, 1.3, 1.05), i(o, 0.62, 4.5), 0.075, D.iron);
  for (let o = 0; o < 4; o++)
    nt(e, i(o, s(2.5), 2.5), i(o + 1, s(2.5), 2.5), 0.045, D.iron), nt(e, i(o, s(1.35), 1.35), i(o + 1, s(3.6), 3.6), 0.04, D.iron);
  {
    const o = [0, 3.45, 0], a = 0.5, c = 0.65, u = K(o, [0, c, 0]), l = K(o, [0, -c, 0]), f = [
      K(o, [a, 0, 0]),
      K(o, [0, 0, a]),
      K(o, [-a, 0, 0]),
      K(o, [0, 0, -a])
    ];
    for (let d = 0; d < 4; d++) {
      const m = f[d], g = f[(d + 1) % 4];
      X(e, u, g, m, D.steel), X(e, l, m, g, D.steel);
    }
  }
  Ft(e, 0.98, 4.5, 4.64, D.iron, { capTop: !0, capBottom: !0 });
  for (let o = 0; o < 4; o++) {
    const a = r(o), c = [0.9 * Math.cos(a), 0, 0.9 * Math.sin(a)];
    nt(e, [c[0], 4.64, c[2]], [c[0], 5.28, c[2]], 0.028, D.iron);
  }
  yn(e, 0.9, 0.032, 5.28, 4, D.iron);
  for (const o of [30, 150, 270]) {
    const a = o * Math.PI / 180, c = [Math.cos(a), 0, Math.sin(a)], u = [-Math.sin(a), 0, Math.cos(a)], l = 35 * Math.PI / 180, f = qe(K(J(c, Math.sin(l)), [0, Math.cos(l), 0])), d = qe(sn(u, f));
    Hs(e, K(J(c, 0.58), [0, 4.94, 0]), u, d, f, [0.32, 0.24, 0.02], D.solar);
  }
  Ft(e, 0.2, 4.64, 5, D.iron), Ft(e, 0.4, 4.94, 5, D.iron, { capTop: !0 }), Ft(t, 0.34, 5, 5.58, D.lantern);
  for (let o = 0; o < 6; o++) {
    const a = o / 6 * Math.PI * 2 + Math.PI / 12, c = [0.38 * Math.cos(a), 0, 0.38 * Math.sin(a)];
    nt(e, [c[0], 4.98, c[2]], [c[0], 5.6, c[2]], 0.024, D.iron);
  }
  return Nt(e, [
    [0.5, 5.58],
    [0.3, 5.8],
    [0.1, 5.92],
    [0.1, 6.06],
    [0.04, 6.1],
    [0, 6.22]
  ], () => D.iron), Zt(e, 0.5, 5.58, !1, D.iron), { body: e, lantern: t, mastTop: 6.22, keelBottom: -5, waterline: -0.35 };
}
function Id(e = 48) {
  const t = new Float32Array(e * 6 * 3);
  let n = 0;
  const r = (i, s) => {
    const o = i / e * Math.PI * 2;
    t[n++] = Math.cos(o), t[n++] = Math.sin(o), t[n++] = s;
  };
  for (let i = 0; i < e; i++)
    r(i, 0), r(i + 1, 0), r(i + 1, 1), r(i, 0), r(i + 1, 1), r(i, 1);
  return t;
}
function Pd(e) {
  const t = [
    [e.body, 0],
    [e.lantern, 1]
  ];
  let n = 0;
  for (const [s] of t) n += s.positions.length / 3;
  const r = new Float32Array(n * 10);
  let i = 0;
  for (const [s, o] of t) {
    const a = s.positions.length / 3;
    for (let c = 0; c < a; c++)
      r[i++] = s.positions[c * 3], r[i++] = s.positions[c * 3 + 1], r[i++] = s.positions[c * 3 + 2], r[i++] = s.normals[c * 3], r[i++] = s.normals[c * 3 + 1], r[i++] = s.normals[c * 3 + 2], r[i++] = Math.pow(s.colors[c * 3], 2.2), r[i++] = Math.pow(s.colors[c * 3 + 1], 2.2), r[i++] = Math.pow(s.colors[c * 3 + 2], 2.2), r[i++] = o;
  }
  return r;
}
const Td = { version: 1, wgsl: "struct _vgsl_5a3057a2__BuoyUniforms{viewProj:mat4x4f,camPos:vec3f,time:f32,sunDir:vec3f,night:f32,}@group(0) @binding(0) var<uniform> u:_vgsl_5a3057a2__BuoyUniforms;struct _vgsl_5a3057a2__VertexIn{@location(0) position:vec3f,@location(1) normal:vec3f,@location(2) color:vec3f,@location(3) emissive:f32,@location(4) m0:vec4f,@location(5) m1:vec4f,@location(6) m2:vec4f,@location(7) m3:vec4f,@location(8) light:vec4f,}struct _vgsl_5a3057a2__VertexOut{@builtin(position) clip:vec4f,@location(0) world:vec3f,@location(1) normal:vec3f,@location(2) color:vec3f,@location(3) emissive:f32,@location(4) light:vec4f,@location(5) lantern:vec3f,}@vertex fn vs_main(b:_vgsl_5a3057a2__VertexIn)-> _vgsl_5a3057a2__VertexOut{let c=mat4x4f(b.m0,b.m1,b.m2,b.m3);let world=c*vec4f(b.position,1.0);let d=normalize((c*vec4f(b.normal,0.0)).xyz);var e:_vgsl_5a3057a2__VertexOut;e.clip=u.viewProj*world;e.world=world.xyz;e.normal=d;e.color=b.color;e.emissive=b.emissive;e.light=b.light;e.lantern=(c*vec4f(0.0,5.3,0.0,1.0)).xyz;return e;}@fragment fn fs_main(b:_vgsl_5a3057a2__VertexOut)-> @location(0) vec4f{let c=normalize(b.normal);let d=normalize(u.sunDir);let e=normalize(u.camPos-b.world);let f=max(dot(c,d),0.0);let g=0.32+max(c.y,0.0)*0.34;let h=normalize(d+e);let i=pow(max(dot(c,h),0.0),34.0)*0.16;let j=normalize(b.world-u.camPos);let k=a(normalize(vec3f(j.x,0.04,j.z)),u.sunDir);var color=b.color*(g+f*0.72);color+=vec3f(1.0,0.66,0.34)*i;let l=pow(1.0-max(dot(c,e),0.0),3.0);color+=k*l*0.16;let m=max(b.light.w,0.5);let n=fract(u.time/m);let o=smoothstep(0.0,0.06,n)*(1.0-smoothstep(0.16,0.34,n));if(b.emissive>0.5){let p=mix(0.5,3.2,u.night);let q=mix(6.0,16.0,u.night);color=b.light.rgb*(p+o*q);}else{let r=b.lantern-b.world;let s=length(r);let t=1.0/(1.0+s*s*0.06);let v=max(dot(c,normalize(r)),0.0);color+=b.light.rgb*(0.25+o*2.4)*t*v*u.night*2.2;}let A=length(u.camPos-b.world);let B=smoothstep(205.0,420.0,A);color=mix(color,k,B*0.82);return vec4f(color,1.0);}fn a(b:vec3f,c:vec3f)-> vec3f{let d=normalize(b);let e=normalize(c);let f=clamp(d.y,0.0,1.0);let g=vec3f(1.15,0.44,0.19);let h=vec3f(0.05,0.08,0.22);var i=mix(g,h,pow(f,0.5));let j=exp(-abs(d.y)*7.0);i+=vec3f(0.45,0.15,0.04)*j;let k=clamp(-d.y,0.0,1.0);i=mix(i,vec3f(0.18,0.08,0.09),k*0.75);let l=max(dot(d,e),0.0);i+=vec3f(1.35,0.62,0.24)*pow(l,12.0)*0.55;i+=vec3f(1.5,0.85,0.42)*pow(l,170.0)*1.5;let m=smoothstep(0.9993,0.9997,l);i+=vec3f(1.7,1.05,0.6)*m*4.5;return i;}" }, Cd = { version: 1, wgsl: "@group(0) @binding(0) var src:texture_2d<f32>;@group(0) @binding(1) var samp:sampler;fn aces(a:vec3f)-> vec3f{let b=2.51;let c=0.03;let d=2.43;let e=0.59;let f=0.14;return clamp((a*(b*a+c))/(a*(d*a+e)+f),vec3f(0.0),vec3f(1.0));}const EXPOSURE=0.62;@fragment fn fs_main(@location(0) a:vec2f)-> @location(0) vec4f{let b=textureSampleLevel(src,samp,a,0.0).rgb*EXPOSURE;var c=pow(aces(b),vec3f(1.0/2.2));c=(c-0.5)*1.07+0.5;c*=vec3f(1.05,1.0,0.95);let d=a-vec2f(0.5);c*=1.0-0.28*dot(d,d);return vec4f(clamp(c,vec3f(0.0),vec3f(1.0)),1.0);}" }, Md = { version: 1, wgsl: "@group(0) @binding(0) var<storage,read> inX:array<vec2f>;@group(0) @binding(1) var<storage,read> inY:array<vec2f>;@group(0) @binding(2) var<storage,read> inZ:array<vec2f>;@group(0) @binding(3) var<storage,read_write> disp:array<vec4f>;var<workgroup> _vgsl_91affbde__shX:array<vec2f,256>;var<workgroup> _vgsl_91affbde__shY:array<vec2f,256>;var<workgroup> _vgsl_91affbde__shZ:array<vec2f,256>;fn d(a:u32,b:u32,c:f32){let h=select(1.0,-1.0,((a+b)&1u)==1u);let i=c*h;disp[b*_vgsl_beed7fc1__N+a]=vec4f(_vgsl_91affbde__shX[b].x*i,_vgsl_91affbde__shY[b].x*i,_vgsl_91affbde__shZ[b].x*i,0.0);}@compute @workgroup_size(128) fn fftCol(@builtin(workgroup_id) a:vec3u,@builtin(local_invocation_id) b:vec3u,){let c=a.x;let h=b.x;let i=h;let j=h+128u;let k=f(i);let l=f(j);_vgsl_91affbde__shX[k]=inX[i*_vgsl_beed7fc1__N+c];_vgsl_91affbde__shY[k]=inY[i*_vgsl_beed7fc1__N+c];_vgsl_91affbde__shZ[k]=inZ[i*_vgsl_beed7fc1__N+c];_vgsl_91affbde__shX[l]=inX[j*_vgsl_beed7fc1__N+c];_vgsl_91affbde__shY[l]=inY[j*_vgsl_beed7fc1__N+c];_vgsl_91affbde__shZ[l]=inZ[j*_vgsl_beed7fc1__N+c];workgroupBarrier();g(&_vgsl_91affbde__shX,&_vgsl_91affbde__shY,&_vgsl_91affbde__shZ,h);let m=1.0/f32(_vgsl_beed7fc1__N);d(c,i,m);d(c,j,m);}fn e(a:vec2f,b:vec2f)-> vec2f{return vec2f(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);}fn f(a:u32)-> u32{return reverseBits(a)>>(32u-_vgsl_beed7fc1__LOG2N);}fn g(a:ptr<workgroup,array<vec2f,256>>,b:ptr<workgroup,array<vec2f,256>>,c:ptr<workgroup,array<vec2f,256>>,h:u32,){for(var i:u32=0u;i<_vgsl_beed7fc1__LOG2N;i=i+1u){let j=1u<<i;let k=j<<1u;if(h<128u){let l=h&(j-1u);let m=(h>> i)<<(i+1u);let n=m+l;let o=n+j;let p=_vgsl_beed7fc1__TWO_PI*f32(l)/f32(k);let q=vec2f(cos(p),sin(p));let r=(*a)[n];let s=e(q,(*a)[o]);(*a)[n]=r+s;(*a)[o]=r-s;let t=(*b)[n];let u=e(q,(*b)[o]);(*b)[n]=t+u;(*b)[o]=t-u;let v=(*c)[n];let w=e(q,(*c)[o]);(*c)[n]=v+w;(*c)[o]=v-w;}workgroupBarrier();}}const _vgsl_beed7fc1__TWO_PI:f32=6.28318530718;const _vgsl_beed7fc1__N:u32=256u;const _vgsl_beed7fc1__LOG2N:u32=8u;" }, Fd = { version: 1, wgsl: "@group(0) @binding(0) var<storage,read> inX:array<vec2f>;@group(0) @binding(1) var<storage,read> inY:array<vec2f>;@group(0) @binding(2) var<storage,read> inZ:array<vec2f>;@group(0) @binding(3) var<storage,read_write> outX:array<vec2f>;@group(0) @binding(4) var<storage,read_write> outY:array<vec2f>;@group(0) @binding(5) var<storage,read_write> outZ:array<vec2f>;var<workgroup> _vgsl_f18016b3__shX:array<vec2f,256>;var<workgroup> _vgsl_f18016b3__shY:array<vec2f,256>;var<workgroup> _vgsl_f18016b3__shZ:array<vec2f,256>;@compute @workgroup_size(128) fn fftRow(@builtin(workgroup_id) a:vec3u,@builtin(local_invocation_id) b:vec3u,){let c=a.x*_vgsl_beed7fc1__N;let g=b.x;let h=g;let i=g+128u;let j=e(h);let k=e(i);_vgsl_f18016b3__shX[j]=inX[c+h];_vgsl_f18016b3__shY[j]=inY[c+h];_vgsl_f18016b3__shZ[j]=inZ[c+h];_vgsl_f18016b3__shX[k]=inX[c+i];_vgsl_f18016b3__shY[k]=inY[c+i];_vgsl_f18016b3__shZ[k]=inZ[c+i];workgroupBarrier();f(&_vgsl_f18016b3__shX,&_vgsl_f18016b3__shY,&_vgsl_f18016b3__shZ,g);let l=1.0/f32(_vgsl_beed7fc1__N);outX[c+h]=_vgsl_f18016b3__shX[h]*l;outY[c+h]=_vgsl_f18016b3__shY[h]*l;outZ[c+h]=_vgsl_f18016b3__shZ[h]*l;outX[c+i]=_vgsl_f18016b3__shX[i]*l;outY[c+i]=_vgsl_f18016b3__shY[i]*l;outZ[c+i]=_vgsl_f18016b3__shZ[i]*l;}fn d(a:vec2f,b:vec2f)-> vec2f{return vec2f(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);}fn e(a:u32)-> u32{return reverseBits(a)>>(32u-_vgsl_beed7fc1__LOG2N);}fn f(a:ptr<workgroup,array<vec2f,256>>,b:ptr<workgroup,array<vec2f,256>>,c:ptr<workgroup,array<vec2f,256>>,g:u32,){for(var h:u32=0u;h<_vgsl_beed7fc1__LOG2N;h=h+1u){let i=1u<<h;let j=i<<1u;if(g<128u){let k=g&(i-1u);let l=(g>> h)<<(h+1u);let m=l+k;let n=m+i;let o=_vgsl_beed7fc1__TWO_PI*f32(k)/f32(j);let p=vec2f(cos(o),sin(o));let q=(*a)[m];let r=d(p,(*a)[n]);(*a)[m]=q+r;(*a)[n]=q-r;let s=(*b)[m];let t=d(p,(*b)[n]);(*b)[m]=s+t;(*b)[n]=s-t;let u=(*c)[m];let v=d(p,(*c)[n]);(*c)[m]=u+v;(*c)[n]=u-v;}workgroupBarrier();}}const _vgsl_beed7fc1__TWO_PI:f32=6.28318530718;const _vgsl_beed7fc1__N:u32=256u;const _vgsl_beed7fc1__LOG2N:u32=8u;" }, Ad = { version: 1, wgsl: "struct _vgsl_9049d02b__GradeUniforms{night:f32,aspect:f32,moonPos:vec2f,moonRadius:f32,}@group(0) @binding(0) var<uniform> u:_vgsl_9049d02b__GradeUniforms;@group(0) @binding(1) var src:texture_2d<f32>;@group(0) @binding(2) var samp:sampler;fn a(b:vec2f)-> f32{let d=sqrt(max(1.0-dot(b,b),0.0));var f=0.93+0.07*c(b*16.0+vec2f(3.7,8.1));let g=e(b*1.7+vec2f(5.2,2.4),3,2.17,0.5);f*=1.0-smoothstep(-0.05,0.35,g)*0.52;var i=array<vec3f,7>(vec3f(-0.32,0.28,0.16),vec3f(0.22,-0.35,0.2),vec3f(0.45,0.18,0.11),vec3f(-0.12,-0.08,0.09),vec3f(0.05,0.48,0.12),vec3f(-0.52,-0.3,0.1),vec3f(0.6,-0.05,0.07),);for(var m=0;m<7;m++){let n=i[m];let o=length(b-n.xy);let p=exp(-pow((o-n.z)/(n.z*0.3),2.0))*0.12;let q=1.0-smoothstep(0.0,n.z*0.85,o);let r=normalize(b-n.xy+vec2f(1e-4,0.0));let s=dot(r,vec2f(-0.707,-0.707))*0.5+0.5;f+=p-q*0.34*(0.5+0.5*s);}f*=0.72+0.28*d;return clamp(f,0.32,1.15);}@fragment fn fs_main(@location(0) d:vec2f)-> @location(0) vec4f{let f=textureSampleLevel(src,samp,d,0.0).rgb;let i=dot(f,vec3f(0.2126,0.7152,0.0722));var night=mix(vec3f(i),f,0.3)*vec3f(0.36,0.5,0.86)*0.26;let m=max(f.r,max(f.g,f.b));let n=smoothstep(2.0,4.5,m);night=mix(night,f*vec3f(0.8,0.87,1.05),n);let o=(d-u.moonPos)*vec2f(u.aspect,1.0);let p=length(o);let q=1.0-smoothstep(u.moonRadius*1.6,0.4,p);night=mix(night,min(night,vec3f(0.085,0.1,0.16)),q*0.92);let s=1.0-smoothstep(u.moonRadius*0.92,u.moonRadius,p);let t=pow(clamp(1.0-(p-u.moonRadius)/(u.moonRadius*2.2),0.0,1.0),3.0);let v=a(o/u.moonRadius);night+=vec3f(0.95,0.97,1.0)*2.1*s*v;night+=vec3f(0.7,0.78,0.95)*0.3*t*(1.0-s);return vec4f(mix(f,night,u.night),1.0);}const _vgsl_6c505218__perlinNormalize2:f32=1.4142;fn c(b:vec2f)-> f32{let d=floor(b);let f=vec2i(d);let g=b-d;let i=k(g);let m=j(h(f),g);let n=j(h(f+vec2i(1,0)),g-vec2f(1.0,0.0));let o=j(h(f+vec2i(0,1)),g-vec2f(0.0,1.0));let p=j(h(f+vec2i(1,1)),g-vec2f(1.0,1.0));return _vgsl_6c505218__perlinNormalize2*mix(mix(m,n,i.x),mix(o,p,i.x),i.y);}fn e(b:vec2f,d:i32,f:f32,g:f32)-> f32{let i=clamp(d,1,16);let m=clamp(g,0.0,1.0);var n=0.0;var o=1.0;var p=0.0;var q=b;for(var r=0;r<i;r=r+1){n=n+o*c(q);p=p+o;q=q*f;o=o*m;}return n/p;}const _vgsl_30235ef4__noiseInvSqrt2:f32=0.7071067811865476;fn h(b:vec2i)-> u32{return l(bitcast<vec2u>(b)).x&7u;}fn j(b:u32,d:vec2f)-> f32{let f=select(d.x,d.y,(b&2u)!=0u);let g=select(f,-f,(b&1u)!=0u);let i=select(d.x,-d.x,(b&1u)!=0u);let m=select(d.y,-d.y,(b&2u)!=0u);return select(g,_vgsl_30235ef4__noiseInvSqrt2*(i+m),b>=4u);}fn k(b:vec2f)-> vec2f{return b*b*b*(b*(b*6.0-15.0)+10.0);}fn l(b:vec2u)-> vec2u{var d=b*1664525u+1013904223u;d.x=d.x+d.y*1664525u;d.y=d.y+d.x*1664525u;d=d^(d>> vec2u(16u));d.x=d.x+d.y*1664525u;d.y=d.y+d.x*1664525u;d=d^(d>> vec2u(16u));return d;}" }, Ld = { version: 1, wgsl: "override GRID:u32=512u;const _vgsl_2dd3e63d__NU:u32=256u;struct _vgsl_2dd3e63d__Ocean{viewProj:mat4x4f,camPos:vec3f,worldSize:f32,sunDir:vec3f,patchSize:f32,heightScale:f32,choppyScale:f32,foamScale:f32,_pad:f32,}@group(0) @binding(0) var<uniform> u:_vgsl_2dd3e63d__Ocean;@group(0) @binding(1) var disp:texture_2d<f32>;@group(0) @binding(2) var dispSamp:sampler;fn a(d:vec2f)-> vec3f{return textureSampleLevel(disp,dispSamp,d,0.0).xyz;}fn b(d:vec3f)-> vec3f{return vec3f(d.x*u.choppyScale,d.y*u.heightScale,d.z*u.choppyScale);}struct _vgsl_2dd3e63d__VOut{@builtin(position) clip:vec4f,@location(0) world:vec3f,@location(1) uv:vec2f,}@vertex fn vs_main(@builtin(vertex_index) d:u32)-> _vgsl_2dd3e63d__VOut{let e=d/6u;let f=d%6u;let g=e%GRID;let h=e/GRID;var i=array<vec2u,6>(vec2u(0u,0u),vec2u(1u,0u),vec2u(0u,1u),vec2u(0u,1u),vec2u(1u,0u),vec2u(1u,1u),);let j=i[f];let k=vec2f(f32(g+j.x),f32(h+j.y))/f32(GRID);let l=(k-0.5)*u.worldSize;let uv=l/u.patchSize;let world=vec3f(l.x,0.0,l.y)+b(a(uv));var m:_vgsl_2dd3e63d__VOut;m.clip=u.viewProj*vec4f(world,1.0);m.world=world;m.uv=uv;return m;}@fragment fn fs_main(@location(0) d:vec3f,@location(1) e:vec2f)-> @location(0) vec4f{let f=1.0/f32(_vgsl_2dd3e63d__NU);let g=u.patchSize/f32(_vgsl_2dd3e63d__NU);let h=a(e);let i=a(e+vec2f(f,0.0));let j=a(e+vec2f(0.0,f));let k=vec3f(g+(i.x-h.x)*u.choppyScale,(i.y-h.y)*u.heightScale,(i.z-h.z)*u.choppyScale,);let l=vec3f((j.x-h.x)*u.choppyScale,(j.y-h.y)*u.heightScale,g+(j.z-h.z)*u.choppyScale,);var m=normalize(cross(l,k));if(m.y<0.0){m=-m;}let n=(i.x-h.x)*u.choppyScale/g;let o=(j.z-h.z)*u.choppyScale/g;let p=(j.x-h.x)*u.choppyScale/g;let q=(i.z-h.z)*u.choppyScale/g;let r=(1.0+n)*(1.0+o)-p*q;let s=smoothstep(u.foamScale,u.foamScale*0.35,r);let t=normalize(u.camPos-d);let v=normalize(u.sunDir);let w=length(u.camPos-d);let A=reflect(-t,m);let B=c(A,u.sunDir);let C=0.02;let D=C+(1.0-C)*pow(1.0-max(dot(m,t),0.0),5.0);let E=max(dot(m,t),0.0);let F=vec3f(0.002,0.028,0.055);let G=vec3f(0.03,0.16,0.19);var H=mix(F,G,pow(E,0.5));let I=clamp(d.y*0.06+0.35,0.0,1.0);let J=pow(max(dot(t,-v),0.0),3.0)*I;H+=vec3f(0.95,0.34,0.14)*J*0.8;let K=mix(0.03,0.92,D);var L=mix(H,B,K);let M=normalize(v+t);let N=pow(max(dot(m,M),0.0),600.0);L+=vec3f(1.8,1.1,0.62)*N*4.5;L=mix(L,vec3f(0.96,0.90,0.84),s);let O=normalize(d-u.camPos);let P=c(normalize(vec3f(O.x,0.04,O.z)),u.sunDir);let Q=smoothstep(u.worldSize*0.42,u.worldSize*0.62,w);L=mix(L,P,Q);return vec4f(L,1.0);}fn c(d:vec3f,e:vec3f)-> vec3f{let f=normalize(d);let g=normalize(e);let h=clamp(f.y,0.0,1.0);let i=vec3f(1.15,0.44,0.19);let j=vec3f(0.05,0.08,0.22);var k=mix(i,j,pow(h,0.5));let l=exp(-abs(f.y)*7.0);k+=vec3f(0.45,0.15,0.04)*l;let m=clamp(-f.y,0.0,1.0);k=mix(k,vec3f(0.18,0.08,0.09),m*0.75);let n=max(dot(f,g),0.0);k+=vec3f(1.35,0.62,0.24)*pow(n,12.0)*0.55;k+=vec3f(1.5,0.85,0.42)*pow(n,170.0)*1.5;let o=smoothstep(0.9993,0.9997,n);k+=vec3f(1.7,1.05,0.6)*o*4.5;return k;}" }, Gd = { version: 1, wgsl: "struct ProbeUniforms{anchorA:vec4f,anchorB:vec4f,}@group(0) @binding(0) var<uniform> u:ProbeUniforms;@group(0) @binding(1) var disp:texture_2d<f32>;@group(0) @binding(2) var dispSamp:sampler;const WIDTH:f32=16.0;@fragment fn fs_main(@location(0) a:vec2f)-> @location(0) vec4f{let x=u32(a.x*WIDTH);let b=x/3u;let c=x%3u;var d=u.anchorB.xy;if(b==0u){d=u.anchorA.xy;}else if(b==1u){d=u.anchorA.zw;}let e=u.anchorB.z;var f=vec2f(0.0,0.0);if(c==1u){f=vec2f(e,0.0);}else if(c==2u){f=vec2f(0.0,e);}return textureSampleLevel(disp,dispSamp,d+f,0.0);}" }, yi = { version: 1, wgsl: "struct _vgsl_84d0a84a__WakeUniforms{viewProj:mat4x4f,patchSize:f32,heightScale:f32,choppyScale:f32,time:f32,night:f32,}@group(0) @binding(0) var<uniform> u:_vgsl_84d0a84a__WakeUniforms;@group(0) @binding(1) var disp:texture_2d<f32>;@group(0) @binding(2) var dispSamp:sampler;struct _vgsl_84d0a84a__VertexIn{@location(0) ring:vec3f,@location(1) deco0:vec4f,@location(2) deco1:vec4f,}struct _vgsl_84d0a84a__VertexOut{@builtin(position) clip:vec4f,@location(0) t:f32,@location(1) world:vec2f,@location(2) agitation:f32,@location(3) light:vec4f,}fn a(d:vec2f)-> vec3f{return textureSampleLevel(disp,dispSamp,d,0.0).xyz;}fn b(d:vec2f)-> vec3f{let f=a(d/u.patchSize);return vec3f(d.x+f.x*u.choppyScale,f.y*u.heightScale+0.14,d.y+f.z*u.choppyScale,);}fn c(d:_vgsl_84d0a84a__VertexIn,f:f32)-> _vgsl_84d0a84a__VertexOut{let m=d.deco0 .xy+vec2f(d.ring.x,d.ring.y)*f;let world=b(m);var n:_vgsl_84d0a84a__VertexOut;n.clip=u.viewProj*vec4f(world,1.0);n.t=d.ring.z;n.world=world.xz;n.agitation=d.deco0 .w;n.light=d.deco1;return n;}fn e(d:f32)-> f32{let f=fract(u.time/max(d,0.5));return smoothstep(0.0,0.06,f)*(1.0-smoothstep(0.16,0.34,f));}fn g(d:vec2f)-> f32{return fract(sin(dot(d,vec2f(127.1,311.7)))*43758.5453);}@vertex fn vs_main(d:_vgsl_84d0a84a__VertexIn)-> _vgsl_84d0a84a__VertexOut{return c(d,d.deco0 .z*mix(2.62,6.6,d.ring.z));}@fragment fn fs_main(d:_vgsl_84d0a84a__VertexOut)-> @location(0) vec4f{let f=pow(1.0-d.t,2.4);let m=fract(d.t*3.0-u.time*0.45+g(floor(d.world))*0.05);let n=smoothstep(0.0,0.14,m)*(1.0-smoothstep(0.2,0.52,m))*(1.0-d.t)*0.55;let o=h(d.world*0.85+vec2f(u.time*0.22,-u.time*0.13))*0.5+0.5;let p=smoothstep(0.25,0.75,o);let q=0.42+0.58*d.agitation;let r=clamp((f+n)*p*q,0.0,0.85);let s=vec3f(0.93,0.9,0.85)*(0.85+0.45*o);let v=pow(1.0-d.t,2.8)*mix(0.3,0.14,u.night);let w=vec3f(0.01,0.02,0.035);let x=clamp(r+v*(1.0-r),0.0,0.9);let y=mix(w,s,r/max(x,1e-4));return vec4f(y,x);}@vertex fn vs_pool(d:_vgsl_84d0a84a__VertexIn)-> _vgsl_84d0a84a__VertexOut{return c(d,d.deco0 .z*mix(0.3,9.0,d.ring.z));}@fragment fn fs_pool(d:_vgsl_84d0a84a__VertexOut)-> @location(0) vec4f{let f=e(d.light.w);let m=mix(0.06,1.0,u.night)*(0.5+f*2.0);let n=h(d.world*1.6+vec2f(u.time*0.35,u.time*0.27))*0.5+0.5;let o=0.65+0.7*n;let p=pow(1.0-d.t,2.1);let q=d.light.rgb*m*p*o*1.6;return vec4f(q,1.0);}const _vgsl_6c505218__perlinNormalize2:f32=1.4142;fn h(d:vec2f)-> f32{let f=floor(d);let m=vec2i(f);let n=d-f;let o=k(n);let p=j(i(m),n);let q=j(i(m+vec2i(1,0)),n-vec2f(1.0,0.0));let r=j(i(m+vec2i(0,1)),n-vec2f(0.0,1.0));let s=j(i(m+vec2i(1,1)),n-vec2f(1.0,1.0));return _vgsl_6c505218__perlinNormalize2*mix(mix(p,q,o.x),mix(r,s,o.x),o.y);}const _vgsl_30235ef4__noiseInvSqrt2:f32=0.7071067811865476;fn i(d:vec2i)-> u32{return l(bitcast<vec2u>(d)).x&7u;}fn j(d:u32,f:vec2f)-> f32{let m=select(f.x,f.y,(d&2u)!=0u);let n=select(m,-m,(d&1u)!=0u);let o=select(f.x,-f.x,(d&1u)!=0u);let p=select(f.y,-f.y,(d&2u)!=0u);return select(n,_vgsl_30235ef4__noiseInvSqrt2*(o+p),d>=4u);}fn k(d:vec2f)-> vec2f{return d*d*d*(d*(d*6.0-15.0)+10.0);}fn l(d:vec2u)-> vec2u{var f=d*1664525u+1013904223u;f.x=f.x+f.y*1664525u;f.y=f.y+f.x*1664525u;f=f^(f>> vec2u(16u));f.x=f.x+f.y*1664525u;f.y=f.y+f.x*1664525u;f=f^(f>> vec2u(16u));return f;}" }, Rd = { version: 1, wgsl: "struct _vgsl_b87fc858__Sky{viewProj:mat4x4f,camPos:vec3f,radius:f32,sunDir:vec3f,_pad:f32,}@group(0) @binding(0) var<uniform> u:_vgsl_b87fc858__Sky;struct _vgsl_b87fc858__VOut{@builtin(position) clip:vec4f,@location(0) dir:vec3f,}@vertex fn vs_main(@location(0) b:vec3f)-> _vgsl_b87fc858__VOut{var c:_vgsl_b87fc858__VOut;let d=b*u.radius+u.camPos;c.clip=u.viewProj*vec4f(d,1.0);c.dir=normalize(b);return c;}@fragment fn fs_main(@location(0) b:vec3f)-> @location(0) vec4f{return vec4f(a(b,u.sunDir),1.0);}fn a(b:vec3f,c:vec3f)-> vec3f{let d=normalize(b);let e=normalize(c);let f=clamp(d.y,0.0,1.0);let g=vec3f(1.15,0.44,0.19);let h=vec3f(0.05,0.08,0.22);var i=mix(g,h,pow(f,0.5));let j=exp(-abs(d.y)*7.0);i+=vec3f(0.45,0.15,0.04)*j;let k=clamp(-d.y,0.0,1.0);i=mix(i,vec3f(0.18,0.08,0.09),k*0.75);let l=max(dot(d,e),0.0);i+=vec3f(1.35,0.62,0.24)*pow(l,12.0)*0.55;i+=vec3f(1.5,0.85,0.42)*pow(l,170.0)*1.5;let m=smoothstep(0.9993,0.9997,l);i+=vec3f(1.7,1.05,0.6)*m*4.5;return i;}" }, wi = { version: 1, wgsl: "@group(0) @binding(0) var<storage,read_write> h0:array<vec4f>;@group(0) @binding(1) var<uniform> sim:_vgsl_beed7fc1__SimParams;fn a(e:u32)-> u32{var f=e;f^=f>>16u;f*=0x7feb352du;f^=f>>15u;f*=0x846ca68bu;f^=f>>16u;return f;}fn b(e:vec2u,f:u32)-> f32{let g=a(e.x*1973u+e.y*9277u+f*26699u+1u);return f32(g)*(1.0/4294967296.0);}fn c(e:vec2u)-> vec2f{let f=max(b(e,0u),1e-6);let g=b(e,1u);let h=sqrt(-2.0*log(f));return vec2f(h*cos(_vgsl_beed7fc1__TWO_PI*g),h*sin(_vgsl_beed7fc1__TWO_PI*g));}fn d(e:vec2f)-> f32{let f=length(e);if(f<1e-4){return 0.0;}let g=f*f;let h=sim.windSpeed*sim.windSpeed/_vgsl_beed7fc1__GRAVITY;let i=e/f;let j=dot(i,normalize(sim.windDir));var k=sim.amplitude*exp(-1.0/(g*h*h))/(g*g);k*=j*j;let l=sim.patchSize/2000.0;k*=exp(-g*l*l);if(j<0.0){k*=0.07;}return k;}@compute @workgroup_size(8,8) fn init(@builtin(global_invocation_id) e:vec3u){let x=e.x;let f=e.y;if(x>=_vgsl_beed7fc1__N||f>=_vgsl_beed7fc1__N){return;}let g=f*_vgsl_beed7fc1__N+x;let h=f32(i32(x)-i32(_vgsl_beed7fc1__N)/2);let i=f32(i32(f)-i32(_vgsl_beed7fc1__N)/2);let j=_vgsl_beed7fc1__TWO_PI*vec2f(h,i)/sim.patchSize;let k=d(j);let l=d(-j);let m=sqrt(k*0.5)*c(vec2u(x,f));let n=(_vgsl_beed7fc1__N-x)%_vgsl_beed7fc1__N;let o=(_vgsl_beed7fc1__N-f)%_vgsl_beed7fc1__N;let p=sqrt(l*0.5)*c(vec2u(n,o));h0[g]=vec4f(m,vec2f(p.x,-p.y));}const _vgsl_beed7fc1__TWO_PI:f32=6.28318530718;const _vgsl_beed7fc1__N:u32=256u;const _vgsl_beed7fc1__GRAVITY:f32=9.81;struct _vgsl_beed7fc1__SimParams{windDir:vec2f,windSpeed:f32,amplitude:f32,patchSize:f32,time:f32,_pad:vec2f,}" }, Dd = { version: 1, wgsl: "@group(0) @binding(0) var<storage,read> h0:array<vec4f>;@group(0) @binding(1) var<storage,read_write> specX:array<vec2f>;@group(0) @binding(2) var<storage,read_write> specY:array<vec2f>;@group(0) @binding(3) var<storage,read_write> specZ:array<vec2f>;@group(0) @binding(4) var<uniform> sim:_vgsl_beed7fc1__SimParams;fn c(a:vec2f,b:vec2f)-> vec2f{return vec2f(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);}fn d(a:f32)-> vec2f{return vec2f(cos(a),sin(a));}@compute @workgroup_size(8,8) fn update(@builtin(global_invocation_id) a:vec3u){let x=a.x;let b=a.y;if(x>=_vgsl_beed7fc1__N||b>=_vgsl_beed7fc1__N){return;}let e=b*_vgsl_beed7fc1__N+x;let f=f32(i32(x)-i32(_vgsl_beed7fc1__N)/2);let g=f32(i32(b)-i32(_vgsl_beed7fc1__N)/2);let h=_vgsl_beed7fc1__TWO_PI*vec2f(f,g)/sim.patchSize;let i=length(h);let j=h0[e];let k=j.xy;let l=j.zw;let m=sqrt(_vgsl_beed7fc1__GRAVITY*i);let n=d(m*sim.time);let o=vec2f(n.x,-n.y);let p=c(k,n)+c(l,o);specY[e]=p;let q=select(vec2f(0.0),h/i,i>1e-6);let r=vec2f(p.y,-p.x);specX[e]=r*q.x;specZ[e]=r*q.y;}const _vgsl_beed7fc1__TWO_PI:f32=6.28318530718;const _vgsl_beed7fc1__N:u32=256u;const _vgsl_beed7fc1__GRAVITY:f32=9.81;struct _vgsl_beed7fc1__SimParams{windDir:vec2f,windSpeed:f32,amplitude:f32,patchSize:f32,time:f32,_pad:vec2f,}" }, Qn = {
  fov: 48,
  near: 1,
  far: 8e3,
  position: [0, 24, 128],
  target: [0, 5, 0]
}, wn = {
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
}, O = 256, Ue = O * O * 2 * 4, xn = O * O * 4 * 4, vn = 512, Ud = 1e3, Vd = 6e3, Sn = Math.PI / 180, zd = [0.02, 0.02, 0.04, 1];
function Nd(e, t) {
  const n = /* @__PURE__ */ new Set(), r = (s) => (n.add(s), s), i = (s) => {
    n.delete(s), s.destroy();
  };
  try {
    let s = function(v, U, V = S()) {
      return {
        viewProj: v,
        camPos: U,
        worldSize: Ud,
        sunDir: V,
        patchSize: c.patchSize,
        heightScale: c.heightScale,
        choppyScale: c.choppyScale,
        foamScale: c.foamScale
      };
    }, o = function(v, U, V, te, De = 0) {
      return { viewProj: v, camPos: U, time: te, sunDir: V, night: De };
    }, a = function(v, U) {
      return {
        viewProj: v,
        patchSize: c.patchSize,
        heightScale: c.heightScale,
        choppyScale: c.choppyScale,
        time: U,
        night: u
      };
    };
    const c = { ...wn };
    let u = 0, l = 0;
    const f = wn.sunElevation, d = wn.sunAzimuth, m = 12, g = 258, h = () => {
      const v = c.windAngle * Sn;
      return [Math.cos(v), Math.sin(v)];
    }, S = () => {
      const v = c.sunElevation * Sn, U = c.sunAzimuth * Sn;
      return [Math.cos(v) * Math.cos(U), Math.sin(v), Math.cos(v) * Math.sin(U)];
    }, x = (v) => ({
      windDir: h(),
      windSpeed: c.windSpeed,
      amplitude: c.amplitude,
      patchSize: c.patchSize,
      time: v
    }), w = (v, U, V = S()) => ({
      viewProj: v,
      camPos: U,
      radius: Vd,
      sunDir: V
    });
    let $ = r(ne(e, xn, "read-write"));
    const I = r(ne(e, Ue, "read-write")), T = r(ne(e, Ue, "read-write")), E = r(ne(e, Ue, "read-write")), A = r(ne(e, Ue, "read-write")), p = r(ne(e, Ue, "read-write")), b = r(ne(e, Ue, "read-write")), _ = r(ne(e, xn, "read-write")), k = Ne(e, wi, {
      set: { h0: $, sim: x(0) }
    }), C = Ne(e, Dd, {
      set: { h0: $, specX: I, specY: T, specZ: E, sim: x(0) }
    }), Z = Ne(e, Fd, {
      set: {
        inX: I,
        inY: T,
        inZ: E,
        outX: A,
        outY: p,
        outZ: b
      }
    }), B = Ne(e, Md, {
      set: { inX: A, inY: p, inZ: b, disp: _ }
    }), M = r(Ie(e, { size: [O, O], format: "rgba16float" })), F = Mn(e, {
      addressModeU: "repeat",
      addressModeV: "repeat",
      minFilter: "linear",
      magFilter: "linear"
    }), ke = ot(e, kd, {
      set: { disp: _ }
    }), Q = r(Gt(e, ad({ radius: 1 }))), pe = new Float32Array(16), ae = ze(e, {
      shader: Rd,
      geometry: Q,
      cull: "front",
      set: { u: w(pe, [0, 0, 0]) }
    }), ce = ze(e, {
      shader: Ld,
      cull: "none",
      constants: { GRID: vn },
      vertices: 6 * vn * vn,
      set: {
        u: s(pe, [0, 0, 0]),
        disp: M,
        dispSamp: F
      }
    }), me = $d(), Ee = Pd(me), Ge = new Float32Array(ee.length * 20), Re = r(
      Gt(e, {
        label: "sw-capital-buoys",
        buffers: [
          {
            data: Ee.buffer,
            stride: 40,
            attributes: {
              position: "float32x3",
              normal: "float32x3",
              color: "float32x3",
              emissive: "float32"
            }
          },
          {
            data: Ge.buffer,
            stride: 80,
            stepMode: "instance",
            attributes: {
              m0: "float32x4",
              m1: "float32x4",
              m2: "float32x4",
              m3: "float32x4",
              light: "float32x4"
            }
          }
        ]
      })
    ), Jn = ze(e, {
      shader: Td,
      geometry: Re,
      cull: "back",
      set: {
        u: o(pe, [0, 0, 0], S(), 0)
      }
    }), er = r(Ie(e, { size: [to, 1], format: "rgba16float" })), Zs = ot(e, Gd, {
      set: {
        u: io(c),
        disp: M,
        dispSamp: F
      }
    }), Qs = new Float32Array(ee.length * 8), on = r(
      Gt(e, {
        label: "sw-capital-wakes",
        buffers: [
          {
            data: Id().buffer,
            stride: 12,
            attributes: { ring: "float32x3" }
          },
          {
            data: Qs.buffer,
            stride: 32,
            stepMode: "instance",
            attributes: { deco0: "float32x4", deco1: "float32x4" }
          }
        ]
      })
    ), tr = ze(e, {
      shader: yi,
      geometry: on,
      cull: "none",
      blend: "alpha",
      depth: { write: !1 },
      set: {
        u: a(pe, 0),
        disp: M,
        dispSamp: F
      }
    }), nr = ze(e, {
      shader: yi,
      geometry: on,
      entry: { vertex: "vs_pool", fragment: "fs_pool" },
      cull: "none",
      blend: "additive",
      depth: { write: !1 },
      set: {
        u: a(pe, 0),
        disp: M,
        dispSamp: F
      }
    });
    let ge = r(
      Ie(e, {
        size: [t[0], t[1]],
        format: "rgba16float",
        depth: !0
      })
    ), wt = r(
      Ie(e, {
        size: [t[0], t[1]],
        format: "rgba16float"
      })
    );
    const xt = Mn(e, {
      minFilter: "linear",
      magFilter: "linear"
    }), an = ot(e, Ad, {
      set: { u: { night: 0 }, src: ge, samp: xt }
    }), rr = ot(e, Cd, {
      set: { src: wt, samp: xt }
    });
    let vt = 0, ir = !1;
    return k.set({ sim: x(0) }), k.dispatch(O / 8, O / 8), {
      params: c,
      get hdr() {
        return ge;
      },
      skydome: ae,
      ocean: ce,
      buoys: Jn,
      wake: tr,
      lightPool: nr,
      composite: rr,
      grade: an,
      get graded() {
        return wt;
      },
      clear: zd,
      buoyMastTop: me.mastTop,
      buoyWaterline: me.waterline,
      setNight(v) {
        l = Math.min(1, Math.max(0, v));
      },
      updateBuoys(v) {
        Re.buffers[1].write(v);
      },
      updateWake(v) {
        on.buffers[1].write(v);
      },
      readProbe() {
        return er.readFloats();
      },
      rebuildSpectrum() {
        const v = r(ne(e, xn, "read-write"));
        try {
          Ne(e, wi, {
            set: { h0: v, sim: x(0) }
          }).dispatch(O / 8, O / 8), C.set({ h0: v });
        } catch (V) {
          _n(V, () => i(v));
        }
        const U = $;
        $ = v, i(U);
      },
      simulate(v) {
        vt += v * c.timeScale, u += (l - u) * (1 - Math.exp(-v / 1.2)), c.sunElevation = f + (m - f) * u, c.sunAzimuth = d + (g - d) * u, C.set({ sim: x(vt) }), C.dispatch(O / 8, O / 8), Z.dispatch(O, 1), B.dispatch(O, 1), ke.draw(M), Zs.draw(er);
      },
      updateCamera(v, U) {
        const V = [U[0], U[1], U[2]], te = S();
        ae.set({ u: w(v, V, te) }), ce.set({ u: s(v, V, te) }), Jn.set({ u: o(v, V, te, vt, u) });
        const De = a(v, vt);
        tr.set({ u: De }), nr.set({ u: De });
        const Je = V[0] + te[0] * 5e3, cn = V[1] + te[1] * 5e3, un = V[2] + te[2] * 5e3, fn = v[3] * Je + v[7] * cn + v[11] * un + v[15];
        let sr = -10, or = -10;
        if (fn > 0) {
          const Js = v[0] * Je + v[4] * cn + v[8] * un + v[12], eo = v[1] * Je + v[5] * cn + v[9] * un + v[13];
          sr = Js / fn * 0.5 + 0.5, or = 1 - (eo / fn * 0.5 + 0.5);
        }
        an.set({
          u: {
            night: u,
            aspect: ge.size[0] / Math.max(1, ge.size[1]),
            moonPos: [sr, or],
            moonRadius: 0.05
          }
        });
      },
      resize(v) {
        if (ge.size[0] === v[0] && ge.size[1] === v[1]) return;
        const U = r(
          Ie(e, {
            size: [v[0], v[1]],
            format: "rgba16float",
            depth: !0
          })
        ), V = r(
          Ie(e, {
            size: [v[0], v[1]],
            format: "rgba16float"
          })
        );
        try {
          an.set({ src: U, samp: xt }), rr.set({ src: V, samp: xt });
        } catch (Je) {
          _n(Je, () => {
            i(V), i(U);
          });
        }
        const te = ge, De = wt;
        ge = U, wt = V, i(te), i(De);
      },
      destroy() {
        if (ir) return;
        ir = !0;
        const v = [...n].reverse();
        n.clear(), xi(v);
      }
    };
  } catch (s) {
    _n(s, () => xi([...n].reverse()));
  }
}
function xi(e) {
  const t = [];
  for (const n of e)
    try {
      n.destroy();
    } catch (r) {
      t.push(r);
    }
  if (t.length) throw t[0];
}
function _n(e, t) {
  try {
    t();
  } catch {
  }
  throw e;
}
const vi = Math.PI / 180;
function Si(e) {
  const t = 2 * Math.atan(Math.tan(20 * vi) / Math.max(e, 0.2)) / vi;
  return Math.min(72, Math.max(Qn.fov, t));
}
function _i(e) {
  const t = Math.min(1, Math.max(0, (1.2 - e) / 0.75));
  return [t * 16, Qn.target[1] + t * 25, 0];
}
function Od({ canvas: e, onView: t, onFatal: n, onGpu: r }) {
  let i = !1, s = !1, o, a, c, u, l, f, d = !1;
  function m() {
    i || (i = !0, Bd([() => l?.stop(), () => f?.(), () => o?.dispose()]));
  }
  function g(E) {
    s = !0;
    try {
      m();
    } catch {
    }
    throw E;
  }
  function h(E) {
    try {
      return E();
    } catch (A) {
      if (l && n) {
        try {
          m();
        } catch {
        }
        s = !0, n(A);
        return;
      }
      return g(A);
    }
  }
  let S;
  function x() {
    u && t({
      viewProjection: u.viewProjection,
      size: [Math.max(1, e.clientWidth), Math.max(1, e.clientHeight)],
      anchors: S
    });
  }
  function w() {
    h(() => {
      if (!c || !u || !a) return;
      c.resize(a.size);
      const E = a.size[0] / Math.max(1, a.size[1]);
      u.set({ aspect: E, fov: Si(E) }), u.lookAt(_i(E)), x();
    });
  }
  const I = (async () => {
    const { init: E } = await Promise.resolve().then(() => Ql);
    if (i) return;
    const A = await E();
    if (i) {
      A.dispose();
      return;
    }
    o = A, r?.(o), a = Ts(o, e, { dpr: [1, 2] }), c = Nd(o, a.size), c.setNight(d ? 1 : 0);
    const p = a.size[0] / Math.max(1, a.size[1]);
    u = Sd({
      ...Qn,
      aspect: p,
      fov: Si(p),
      target: _i(p)
    }), f = a.onResize(w), x();
    const b = so(c.buoyMastTop, c.buoyWaterline);
    let _ = null, k = !1, C = !1;
    const Z = js(o);
    l = Ws(o, (B) => {
      h(() => {
        if (i || !a || !c || !u) return;
        c.simulate(Z.deltaTime), C || (C = !0, c.readProbe().then((F) => {
          _ = F, k = !0;
        }).catch(() => {
        }).finally(() => {
          C = !1;
        }));
        const M = b.step(Z.deltaTime, _, c.params, k);
        k = !1, c.updateBuoys(M.instanceData), c.updateWake(M.wakeData), S = M.labelAnchors, x(), c.updateCamera(u.viewProjection, u.worldPosition), B.pass({ target: c.hdr, clear: c.clear }, (F) => {
          F.draw(c.skydome), F.draw(c.ocean), F.draw(c.buoys), F.draw(c.wake), F.draw(c.lightPool);
        }), B.pass(c.graded, c.grade), B.pass(a, c.composite);
      });
    });
  })().catch((E) => {
    i && !s || g(E);
  });
  function T(E) {
    d = E, c?.setNight(E ? 1 : 0);
  }
  return { ready: I, dispose: m, setNight: T };
}
function Bd(e) {
  const t = [];
  for (const n of e)
    try {
      n();
    } catch (r) {
      t.push(r);
    }
  if (t.length) throw t[0];
}
const lt = document.body, ki = document.querySelector("#ocean-canvas"), jd = new Map(
  [...document.querySelectorAll("[data-island]")].map((e) => [e.dataset.island, e])
), Ei = document.querySelector(".studio-intro");
function Wd({ viewProjection: e, size: t, anchors: n }) {
  const r = t[0] < 700 && Ei ? Math.max(138, Ei.getBoundingClientRect().bottom + 26) : 138;
  for (const i of ee) {
    const s = jd.get(i.id);
    if (!s) continue;
    const o = n?.get(i.id) ?? [i.anchor[0], 7 * i.scale, i.anchor[1]], [a, c] = qd(o, e, t), u = Math.max(88, s.offsetWidth / 2), l = $i(a, u + 10, t[0] - u - 10), f = $i(c, r, t[1] - 110);
    s.style.setProperty("--island-left", `${l.toFixed(2)}px`), s.style.setProperty("--island-top", `${f.toFixed(2)}px`);
  }
}
function qd(e, t, n) {
  const [r, i, s] = e, o = t[0] * r + t[4] * i + t[8] * s + t[12], a = t[1] * r + t[5] * i + t[9] * s + t[13], c = t[3] * r + t[7] * i + t[11] * s + t[15], u = c === 0 ? 1 : 1 / c;
  return [(o * u * 0.5 + 0.5) * n[0], (-a * u * 0.5 + 0.5) * n[1]];
}
function $i(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
const Ii = "gpu" in navigator && !!navigator.gpu;
let rt = null;
function Ot(e, t) {
  if (window.location.hash !== "#debug") return;
  rt || (rt = document.createElement("pre"), rt.style.cssText = "position:fixed;left:8px;right:8px;bottom:8px;z-index:99;max-height:40vh;overflow:auto;margin:0;padding:10px;background:rgba(0,0,0,.82);color:#9fe08d;font:11px/1.4 monospace;white-space:pre-wrap;", document.body.append(rt));
  const n = t instanceof Error ? `${t.name}: ${t.message}
${t.stack ?? ""}` : String(t);
  rt.textContent += `[ocean ${e}] ${n}
`;
}
function Pi(e, t) {
  console.error("The live ocean stopped.", t), lt.dataset.ocean = "fallback", delete lt.dataset.islands, Ot(e, t);
}
if (!ki || !Ii)
  lt.dataset.ocean = "fallback", Ii || Ot("gate", "navigator.gpu is unavailable");
else {
  const e = Od({
    canvas: ki,
    onView: Wd,
    onFatal: (i) => Pi("frame", i),
    onGpu: (i) => {
      if (window.location.hash !== "#debug") return;
      Ot("info", `ua: ${navigator.userAgent}`);
      const s = i.device;
      (s && typeof s == "object" && "raw" in s ? s.raw : s)?.addEventListener?.("uncapturederror", (c) => {
        Ot("gpu", c.error?.message ?? "uncaptured GPU error");
      });
    }
  }), t = document.documentElement, n = () => e.setNight(t.dataset.theme === "dark");
  n(), new MutationObserver(n).observe(t, { attributes: !0, attributeFilter: ["data-theme"] });
  try {
    await e.ready, requestAnimationFrame(() => {
      lt.dataset.ocean = "ready", lt.dataset.islands = "ready";
    }), window.addEventListener("pagehide", () => e.dispose(), { once: !0 });
  } catch (i) {
    Pi("init", i), e.dispose();
  }
}
