import type { EyePresetId } from "@/lib/data/eyes";
import { EYE_ASPECT, EYE_POLY_ISO } from "./shape";

/**
 * Each preset is a pure function evaluated per LED in isotropic eye space:
 *   X: 0 (inner corner, towards the nose) → EYE_ASPECT (outer corner)
 *   Y: 0 (bottom) → 1 (top)
 *   d: signed distance to the display edge (negative inside)
 * It returns an intensity 0..1 and may write a hue shift (degrees) into ctx.hue.
 */
export interface PresetCtx {
  t: number;
  /** gaze -1..1 (already mirrored per eye so both eyes look the same way) */
  gx: number;
  gy: number;
  hue: number;
  row: number;
  rand: number;
}

export type PresetFn = (X: number, Y: number, d: number, c: PresetCtx) => number;

const [P0, P1, , P3, P4] = EYE_POLY_ISO;
const topY = (X: number) => P0[1] + ((X - P0[0]) * (P1[1] - P0[1])) / (P1[0] - P0[0]);
const botY = (X: number) => P4[1] + ((X - P4[0]) * (P3[1] - P4[1])) / (P3[0] - P4[0]);

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

const CX = EYE_ASPECT * 0.56;
const CY = 0.5;

const predator: PresetFn = (X, Y, d, c) => {
  if (d > -0.025) return 0;
  const rim = d > -0.085 ? 1 : 0.62;
  // vertical slit pupil that follows the gaze
  const px = CX + c.gx * 0.26;
  const slit = Math.abs(X - px) < 0.03 && Math.abs(Y - (CY + c.gy * 0.12)) < 0.3 ? 0.22 : 1;
  return rim * slit;
};

const cyber: PresetFn = (X, Y, d, c) => {
  if (d > -0.02) return 0;
  const ring = d > -0.075 ? 1 : 0;
  const px = CX + c.gx * 0.3;
  const py = CY - 0.04 + c.gy * 0.14;
  const pupil = Math.abs(X - px) < 0.13 && Math.abs(Y - py) < 0.13 ? 1 : 0;
  const core = Math.abs(X - px) < 0.045 && Math.abs(Y - py) < 0.045 ? 0 : pupil;
  const scan = c.row % 4 === 0 ? 0.12 : 0;
  return Math.max(ring, core, scan);
};

const phantom: PresetFn = (X, Y, d, c) => {
  if (d > -0.02) return 0;
  const fromTop = topY(X) - Y;
  const veil = Math.pow(Math.max(0, 1 - fromTop / 0.42), 1.8);
  const edge = fromTop < 0.09 ? 1 : 0;
  const glintX = CX + 0.12 + c.gx * 0.2;
  const glint = Math.hypot(X - glintX, Y - (topY(glintX) - 0.2)) < 0.06 ? 1 : 0;
  return Math.max(edge, veil * 0.75, glint);
};

const rage: PresetFn = (X, Y, d, c) => {
  if (d > -0.02) return 0;
  const lid = Y > topY(X) - 0.2 ? 1 : 0;
  const px = CX + 0.05 + c.gx * 0.24;
  const py = 0.3 + c.gy * 0.06;
  const pupil = Math.hypot(X - px, Y - py) < 0.13 ? 1 : 0;
  const lower = Y < botY(X) + 0.07 && X > 0.25 ? 0.55 : 0;
  return Math.max(lid, pupil, lower);
};

const ghost: PresetFn = (X, Y, _d, c) => {
  const cx = CX + 0.06;
  const cy = 0.5;
  const r = Math.hypot(X - cx, Y - cy);
  const ring = r < 0.3 && r > 0.22 ? 1 : 0;
  const dot = Math.hypot(X - (cx + c.gx * 0.08), Y - (cy + c.gy * 0.06)) < 0.11 ? 1 : 0;
  return Math.max(ring, dot);
};

const neon: PresetFn = (_X, _Y, d, c) => {
  if (d > -0.015) return 0;
  const band = Math.sin(-d * 62 - c.t * 3.2);
  c.hue = (-d * 520 + c.t * 40) % 360;
  return band > 0.15 ? 1 : 0.08;
};

const glitch: PresetFn = (X, Y, d, c) => {
  // horizontal tearing: each row gets a time-dependent offset
  const seed = Math.sin(c.row * 12.9898 + Math.floor(c.t * 7) * 78.233) * 43758.5453;
  const n = seed - Math.floor(seed);
  const shift = n > 0.72 ? (n - 0.72) * 1.6 : 0;
  const x = X - shift;
  if (d > -0.02) return 0;
  const inner = Math.abs(x - CX) < 0.38 && Math.abs(Y - CY) < 0.24 ? 1 : 0;
  const bars = (c.row + Math.floor(c.t * 5)) % 7 === 0 ? 0.6 : 0;
  if (n > 0.86) c.hue = 180;
  else if (n < 0.08) c.hue = 300;
  const drop = c.rand > 0.93 ? 0 : 1;
  return Math.max(inner, bars) * drop;
};

const heartSdf = (x: number, y: number) => {
  // classic implicit heart: (x²+y²-1)³ - x²y³ ≤ 0
  const a = x * x + y * y - 1;
  return a * a * a - x * x * y * y * y;
};

const heart: PresetFn = (X, Y) => {
  const s = 0.34;
  const x = (X - (CX + 0.04)) / s;
  const y = (Y - 0.46) / s;
  return heartSdf(x * 1.05, y * 1.15 + 0.2) <= 0 ? 1 : 0;
};

export const PRESET_FNS: Record<EyePresetId, PresetFn> = {
  predator,
  cyber,
  phantom,
  rage,
  ghost,
  neon,
  glitch,
  heart,
};
