/**
 * Renders a hero card's face to an offscreen canvas and samples it into a
 * point cloud (card-local units, centred on the card) so the card can
 * disintegrate into particles that look like the card itself.
 *
 * Layout constants mirror components/hero-card-fan/card-mesh.tsx.
 */

export const CARD_WIDTH = 1.5;
export const CARD_HEIGHT = 2.1;

const PX_PER_UNIT = 200;
const CANVAS_W = CARD_WIDTH * PX_PER_UNIT;
const CANVAS_H = CARD_HEIGHT * PX_PER_UNIT;

const PHOTO_MARGIN_SCALE = 0.94;
const ROLE_TEXT_SHIFT = 0.2;
const DISPLAY_FONT_URL = "/fonts/Fraunces-SemiBold.ttf";
const DISPLAY_FONT_FAMILY = "CardDustFraunces";
const PORTRAIT_URL = "/images/hero-portrait.jpg";

const SIGNAL = "#57d9ff";
const DIM_DUST: [number, number, number] = [0.08, 0.2, 0.25];

export interface CardFaceSpec {
  kind: "role" | "photo";
  label: string;
  index?: string;
  side: number;
  /** 1 on desktop, lower on small screens. */
  density: number;
}

export interface CardDustData {
  positions: Float32Array;
  colors: Float32Array;
  randoms: Float32Array;
  count: number;
  /** Approximate world-space spacing between samples, used for point size. */
  spacing: number;
}

let fontPromise: Promise<void> | null = null;
function loadDisplayFont() {
  fontPromise ??= new FontFace(DISPLAY_FONT_FAMILY, `url(${DISPLAY_FONT_URL})`)
    .load()
    .then((face) => {
      document.fonts.add(face);
    });
  return fontPromise;
}

let portraitPromise: Promise<HTMLImageElement> | null = null;
function loadPortrait() {
  portraitPromise ??= new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = PORTRAIT_URL;
  });
  return portraitPromise;
}

// Card-local units → canvas pixels (canvas y grows downward).
const toPxX = (x: number) => (x + CARD_WIDTH / 2) * PX_PER_UNIT;
const toPxY = (y: number) => (CARD_HEIGHT / 2 - y) * PX_PER_UNIT;

function wrapWords(ctx: CanvasRenderingContext2D, text: string, maxWidthPx: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxWidthPx) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawBorder(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = SIGNAL;
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, CANVAS_W - 2, CANVAS_H - 2);
}

function drawRoleFace(ctx: CanvasRenderingContext2D, spec: CardFaceSpec) {
  const { side, label, index } = spec;

  // Index, e.g. "// 01", in the outer top corner.
  ctx.fillStyle = SIGNAL;
  ctx.font = `${0.07 * PX_PER_UNIT}px ui-monospace, monospace`;
  ctx.textBaseline = "middle";
  ctx.textAlign = side > 0 ? "right" : "left";
  const indexX = side > 0 ? CARD_WIDTH / 2 - 0.14 : -CARD_WIDTH / 2 + 0.14;
  ctx.fillText(`// ${index ?? ""}`, toPxX(indexX), toPxY(CARD_HEIGHT / 2 - 0.16));

  // Role word, wrapped the same way troika wraps it (maxWidth 1.0, lineHeight 1.05).
  const fontPx = 0.2 * PX_PER_UNIT;
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 ${fontPx}px ${DISPLAY_FONT_FAMILY}, serif`;
  ctx.textAlign = "center";
  const lines = wrapWords(ctx, label, 1.0 * PX_PER_UNIT);
  const lineHeightPx = fontPx * 1.05;
  const centerX = toPxX(side * ROLE_TEXT_SHIFT);
  const firstLineY = toPxY(0.05) - ((lines.length - 1) * lineHeightPx) / 2;
  lines.forEach((text, i) => ctx.fillText(text, centerX, firstLineY + i * lineHeightPx));
}

function drawPhotoFace(ctx: CanvasRenderingContext2D, portrait: HTMLImageElement) {
  const w = CANVAS_W * PHOTO_MARGIN_SCALE;
  const h = CANVAS_H * PHOTO_MARGIN_SCALE;
  // Stretched to the plane, matching how the texture maps onto planeGeometry.
  ctx.drawImage(portrait, (CANVAS_W - w) / 2, (CANVAS_H - h) / 2, w, h);
}

function pickRandom<T>(items: T[], max: number) {
  if (items.length <= max) return items;
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items.slice(0, max);
}

type Sample = [x: number, y: number, r: number, g: number, b: number];

export async function sampleCardFace(spec: CardFaceSpec): Promise<CardDustData> {
  const isPhoto = spec.kind === "photo";
  const [portrait] = await Promise.all([
    isPhoto ? loadPortrait() : Promise.resolve(null),
    isPhoto ? Promise.resolve() : loadDisplayFont().catch(() => undefined),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2D canvas unavailable");

  if (portrait) drawPhotoFace(ctx, portrait);
  else drawRoleFace(ctx, spec);
  drawBorder(ctx);

  const pixels = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H).data;
  const budget = Math.round((isPhoto ? 4000 : 1800) * spec.density);
  // Photo: an even grid sized to the budget. Role: a fine grid, then keep bright pixels first.
  const step = isPhoto ? Math.sqrt((CANVAS_W * CANVAS_H) / budget) : 2;

  const bright: Sample[] = [];
  const dim: Sample[] = [];
  for (let py = 0; py < CANVAS_H; py += step) {
    for (let px = 0; px < CANVAS_W; px += step) {
      const sx = Math.min(CANVAS_W - 1, Math.floor(px + Math.random() * step));
      const sy = Math.min(CANVAS_H - 1, Math.floor(py + Math.random() * step));
      const o = (sy * CANVAS_W + sx) * 4;
      const alpha = pixels[o + 3] / 255;
      const r = (pixels[o] / 255) * alpha;
      const g = (pixels[o + 1] / 255) * alpha;
      const b = (pixels[o + 2] / 255) * alpha;
      const x = sx / PX_PER_UNIT - CARD_WIDTH / 2;
      const y = CARD_HEIGHT / 2 - sy / PX_PER_UNIT;
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (isPhoto || luminance > 0.2) bright.push([x, y, r, g, b]);
      else dim.push([x, y, ...DIM_DUST]);
    }
  }

  const samples = isPhoto
    ? pickRandom(bright, budget)
    : [
        ...pickRandom(bright, Math.round(budget * 0.82)),
        ...pickRandom(dim, Math.round(budget * 0.18)),
      ];

  const count = samples.length;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const randoms = new Float32Array(count * 3);
  samples.forEach(([x, y, r, g, b], i) => {
    positions.set([x, y, 0], i * 3);
    colors.set([r, g, b], i * 3);
    randoms.set([Math.random(), Math.random(), Math.random()], i * 3);
  });

  return {
    positions,
    colors,
    randoms,
    count,
    spacing: (isPhoto ? step : 3.2) / PX_PER_UNIT,
  };
}
