import { ISLANDS } from "./ocean/islands";
import { createRenderer, type ViewSnapshot } from "./ocean/renderer";

const body = document.body;
const canvas = document.querySelector<HTMLCanvasElement>("#ocean-canvas");
const islandLinks = new Map(
  [...document.querySelectorAll<HTMLElement>("[data-island]")].map((element) => [element.dataset.island, element]),
);

function positionIslandLinks({ viewProjection, size }: ViewSnapshot): void {
  for (const island of ISLANDS) {
    const element = islandLinks.get(island.id);
    if (!element) continue;
    const [left, top] = project(island.anchor, viewProjection, size);
    const halfWidth = Math.max(88, element.offsetWidth / 2);
    const safeLeft = clamp(left, halfWidth + 10, size[0] - halfWidth - 10);
    const safeTop = clamp(top, 138, size[1] - 110);
    element.style.setProperty("--island-left", `${safeLeft.toFixed(2)}px`);
    element.style.setProperty("--island-top", `${safeTop.toFixed(2)}px`);
  }
}

function project(
  point: readonly [number, number, number],
  matrix: Float32Array,
  size: readonly [number, number],
): readonly [number, number] {
  const [x, y, z] = point;
  const clipX = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12];
  const clipY = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
  const clipW = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
  const inverseW = clipW === 0 ? 1 : 1 / clipW;
  return [(clipX * inverseW * 0.5 + 0.5) * size[0], (-clipY * inverseW * 0.5 + 0.5) * size[1]];
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

const supportsWebGpu = "gpu" in navigator && Boolean((navigator as Navigator & { gpu?: unknown }).gpu);

if (!canvas || !supportsWebGpu) {
  body.dataset.ocean = "fallback";
} else {
  const renderer = createRenderer({ canvas, onView: positionIslandLinks });
  try {
    await renderer.ready;
    requestAnimationFrame(() => {
      body.dataset.ocean = "ready";
      body.dataset.islands = "ready";
    });
    window.addEventListener("pagehide", () => renderer.dispose(), { once: true });
  } catch (error) {
    console.error("The live ocean could not start.", error);
    body.dataset.ocean = "fallback";
    renderer.dispose();
  }
}
