import type { Look } from "@/lib/store";
import type { ShellId } from "@/lib/data/variants";
import type { EyePresetId, LedColorId } from "@/lib/data/eyes";

/** Campaign asset definitions rendered by /studio + scripts/render-assets.mjs. */
export type ShotKind = "hero" | "night" | "colors" | "eyes" | "macro" | "exploded" | "urban" | "studio" | "worn" | "variant";

export interface Shot {
  id: string;
  file: string;
  w: number;
  h: number;
  kind: ShotKind;
  look?: Partial<Look>;
  cam: [number, number, number];
  target: [number, number, number];
  fov?: number;
  rotY?: number;
  power?: number;
  layer?: "all" | "bg" | "fg";
  alpha?: boolean;
}

const variantPresets: [ShellId, EyePresetId, LedColorId][] = [
  ["shadow-black", "predator", "red"],
  ["carbon-fiber", "cyber", "cyan"],
  ["titanium-grey", "phantom", "violet"],
  ["arctic-white", "ghost", "white"],
  ["crimson-red", "rage", "red"],
  ["electric-blue", "neon", "cyan"],
];

const EYE_SHOTS: [EyePresetId, LedColorId][] = [
  ["predator", "red"],
  ["cyber", "cyan"],
  ["phantom", "violet"],
  ["rage", "red"],
  ["ghost", "white"],
  ["neon", "blue"],
  ["glitch", "green"],
  ["heart", "pink"],
];

export const SHOTS: Shot[] = [
  { id: "hero-16x9", file: "hero-16x9.jpg", w: 2400, h: 1350, kind: "hero", cam: [0.02, -0.07, 1.42], target: [-0.2, 0.0, 0], fov: 30, rotY: -0.18 },
  { id: "hero-4x5", file: "hero-4x5.jpg", w: 1200, h: 1500, kind: "hero", cam: [0, -0.06, 1.75], target: [0, -0.04, 0], fov: 30, rotY: -0.1 },
  { id: "night-rider-16x9", file: "night-rider-16x9.jpg", w: 2400, h: 1350, kind: "night", cam: [0.78, 1.32, 1.8], target: [0.1, 1.2, 0.32], fov: 30, layer: "all", rotY: 0.32 },
  { id: "night-bg-16x9", file: "night-bg-16x9.jpg", w: 2400, h: 1350, kind: "night", cam: [0.78, 1.32, 1.8], target: [0.1, 1.2, 0.32], fov: 30, layer: "bg", rotY: 0.32 },
  { id: "night-fg-16x9", file: "night-fg-16x9.png", w: 2400, h: 1350, kind: "night", cam: [0.78, 1.32, 1.8], target: [0.1, 1.2, 0.32], fov: 30, layer: "fg", alpha: true, rotY: 0.32 },
  { id: "night-rider-9x16", file: "night-rider-9x16.jpg", w: 1080, h: 1920, kind: "night", cam: [0.5, 1.2, 2.05], target: [0.08, 1.15, 0.31], fov: 36, layer: "all", rotY: 0.25 },
  { id: "color-collection-16x9", file: "color-collection-16x9.jpg", w: 2400, h: 1350, kind: "colors", cam: [0, 0.32, 3.15], target: [0, 0.04, 0], fov: 30 },
  ...EYE_SHOTS.map(([p, c]): Shot => ({
    id: `eyes-${p}`,
    file: `eyes-${p}.jpg`,
    w: 1000,
    h: 1000,
    kind: "eyes",
    look: { preset: p, led: c },
    cam: [0, 0.07, 0.68],
    target: [0, 0.055, 0],
    fov: 30,
  })),
  { id: "macro-16x9", file: "macro-16x9.jpg", w: 2400, h: 1350, kind: "macro", cam: [0.25, 0.115, 0.2], target: [0.12, 0.075, 0.055], fov: 24 },
  { id: "exploded-16x9", file: "exploded-16x9.jpg", w: 2400, h: 1350, kind: "exploded", cam: [1.25, 0.25, 1.15], target: [0, 0.0, -0.05], fov: 30, rotY: 0 },
  { id: "editorial-4x5", file: "editorial-4x5.jpg", w: 1200, h: 1500, kind: "urban", cam: [0.95, 1.38, 1.95], target: [0.18, 1.2, 0.28], fov: 32, rotY: 0.55, look: { preset: "cyber", led: "cyan" } },
  { id: "editorial-9x16", file: "editorial-9x16.jpg", w: 1080, h: 1920, kind: "urban", cam: [-0.55, 1.3, 2.2], target: [-0.13, 1.18, 0.3], fov: 36, rotY: -0.4, look: { preset: "phantom", led: "violet" } },
  { id: "studio-front", file: "studio-front.jpg", w: 1500, h: 1500, kind: "studio", cam: [0, 0.03, 1.55], target: [0, 0.0, 0], fov: 30, rotY: 0 },
  { id: "studio-three-quarter", file: "studio-three-quarter.jpg", w: 1500, h: 1500, kind: "studio", cam: [0, 0.08, 1.55], target: [0, 0.0, 0], fov: 30, rotY: 0.62 },
  { id: "studio-profile", file: "studio-profile.jpg", w: 1500, h: 1500, kind: "studio", cam: [0, 0.05, 1.55], target: [0, 0.0, -0.06], fov: 30, rotY: Math.PI / 2 },
  { id: "studio-back", file: "studio-back.jpg", w: 1500, h: 1500, kind: "studio", cam: [0, 0.08, 1.55], target: [0, 0.0, -0.08], fov: 30, rotY: Math.PI + 0.35 },
  { id: "studio-eyes", file: "studio-eyes.jpg", w: 1500, h: 1500, kind: "studio", cam: [0.12, 0.09, 0.52], target: [0.0, 0.07, 0.03], fov: 30, rotY: 0.18 },
  { id: "studio-finish", file: "studio-finish.jpg", w: 1500, h: 1500, kind: "studio", cam: [0.5, 0.16, 0.2], target: [0.16, 0.04, -0.03], fov: 26, rotY: 0, look: { preset: "phantom", led: "violet" } },
  { id: "studio-worn", file: "studio-worn.jpg", w: 1500, h: 1500, kind: "worn", cam: [0.55, 1.32, 1.85], target: [0.11, 1.2, 0.31], fov: 32, rotY: 0.35 },
  ...variantPresets.flatMap(([shell, preset, led]): Shot[] =>
    (["on", "off"] as const).map((state) => ({
      id: `variant-${shell}-${state}`,
      file: `variant-${shell}-${state}.jpg`,
      w: 1200,
      h: 1500,
      kind: "variant",
      look: { shell, preset, led },
      cam: [0, 0.06, 1.62],
      target: [0, -0.02, 0],
      fov: 30,
      rotY: 0.48,
      power: state === "on" ? 1 : 0,
    }))
  ),
];

export const SHOT_BY_ID = Object.fromEntries(SHOTS.map((s) => [s.id, s]));
