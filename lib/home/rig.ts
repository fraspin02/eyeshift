import { create } from "zustand";

/**
 * Mutable camera / model rig for the home page.
 * GSAP ScrollTrigger tweens these numbers; the R3F scene reads them every frame.
 * No React re-render is involved in scroll-driven motion.
 */
export interface Rig {
  mx: number;
  my: number;
  mz: number;
  ry: number;
  rx: number;
  cx: number;
  cy: number;
  cz: number;
  lx: number;
  ly: number;
  /** ambient model float amplitude */
  float: number;
  /** 0 = red, 1 = cyan — final call colour shift */
  eyeShift: number;
  env: number;
  /** reflective floor visibility */
  floor: number;
  [k: string]: number;
}

export type Keyframe = Partial<Rig>;

export const rig: Rig = {
  mx: 0,
  my: 0,
  mz: 0,
  ry: 0,
  rx: 0,
  cx: 0,
  cy: 0.02,
  cz: 1.45,
  lx: 0,
  ly: 0,
  float: 1,
  eyeShift: 0,
  env: 1,
  floor: 1,
};

/** Hero awakening — composited on top of the scroll rig so both can run at once. */
export const intro = {
  cz: -0.4,
  ry: -0.4,
  light: 0,
  power: 0,
  strip: 0,
  done: false,
};

/** Pointer + drag state shared between DOM handlers and the scene. */
export const pointer = { x: 0, y: 0, dragRy: 0, dragVel: 0, dragging: false };

export function resetHomeRig(kf: Keyframe) {
  Object.assign(rig, kf);
  intro.cz = -0.4;
  intro.ry = -0.4;
  intro.light = 0;
  intro.power = 0;
  intro.strip = 0;
  intro.done = false;
  pointer.dragRy = 0;
  pointer.dragVel = 0;
}

export const KF_DESKTOP: Record<string, Keyframe> = {
  hero: { mx: 0, my: 0, ry: 0, rx: 0, cx: 0, cy: 0.02, cz: 1.45, lx: 0, ly: 0, float: 1, eyeShift: 0, floor: 1 },
  eyes: { mx: 0.13, my: -0.06, ry: -0.08, rx: 0, cx: 0, cy: 0, cz: 0.64, lx: 0, ly: 0, float: 0.3, floor: 0 },
  color: { mx: -0.16, my: 0, ry: 0.72, rx: 0.05, cx: 0, cy: 0.05, cz: 1.38, lx: 0, ly: 0, float: 1, floor: 0 },
  detailsA: { mx: 0.02, my: 0, ry: -0.55, rx: 0.02, cx: 0, cy: 0.04, cz: 1.08, lx: 0, ly: 0, float: 0.4, floor: 0 },
  detailsB: { mx: 0.02, my: 0, ry: -2.2, rx: 0.02, cx: 0, cy: 0.04, cz: 1.12, lx: 0, ly: 0, float: 0.4, floor: 0 },
  control: { mx: 0.2, my: 0, ry: -0.28, rx: 0, cx: 0, cy: 0.02, cz: 1.55, lx: 0, ly: 0, float: 1, floor: 0 },
  finalA: { mx: 0, my: 0, ry: 0, rx: 0, cx: 0, cy: 0, cz: 2.1, lx: 0, ly: 0, float: 1, eyeShift: 0, floor: 1 },
  finalB: { mx: 0, my: 0, ry: 0, rx: 0, cx: 0, cy: 0.03, cz: 0.95, lx: 0, ly: 0.02, float: 0.5, eyeShift: 1, floor: 1 },
};

export const KF_MOBILE: Record<string, Keyframe> = {
  hero: { mx: 0, my: 0.13, ry: 0, rx: 0, cx: 0, cy: 0, cz: 1.95, lx: 0, ly: 0, float: 1, eyeShift: 0, floor: 1 },
  eyes: { mx: 0, my: 0.08, ry: 0, rx: 0, cx: 0, cy: 0, cz: 1.15, lx: 0, ly: 0, float: 0.3, floor: 0 },
  color: { mx: 0, my: 0.16, ry: 0.72, rx: 0.05, cx: 0, cy: 0.04, cz: 2.0, lx: 0, ly: 0, float: 1, floor: 0 },
  detailsA: { mx: 0, my: 0.1, ry: -0.55, rx: 0.02, cx: 0, cy: 0.03, cz: 1.75, lx: 0, ly: 0, float: 0.4, floor: 0 },
  detailsB: { mx: 0, my: 0.1, ry: -2.2, rx: 0.02, cx: 0, cy: 0.03, cz: 1.75, lx: 0, ly: 0, float: 0.4, floor: 0 },
  control: { mx: 0, my: 0.07, ry: -0.2, rx: 0, cx: 0, cy: 0, cz: 2.7, lx: 0, ly: 0, float: 1, floor: 0 },
  finalA: { mx: 0, my: 0.08, ry: 0, rx: 0, cx: 0, cy: 0, cz: 2.6, lx: 0, ly: 0, float: 1, eyeShift: 0, floor: 1 },
  finalB: { mx: 0, my: 0.1, ry: 0, rx: 0, cx: 0, cy: 0, cz: 1.5, lx: 0, ly: 0, float: 0.5, eyeShift: 1, floor: 1 },
};

/** UI state shared between DOM sections and the canvas tree. */
interface HomeUI {
  hotspots: boolean;
  activeHotspot: string | null;
  paused: boolean;
  setHotspots: (v: boolean) => void;
  setActive: (id: string | null) => void;
  setPaused: (v: boolean) => void;
}

export const useHomeUI = create<HomeUI>((set) => ({
  hotspots: false,
  activeHotspot: null,
  paused: false,
  setHotspots: (v) => set((s) => ({ hotspots: v, activeHotspot: v ? s.activeHotspot : null })),
  setActive: (id) => set({ activeHotspot: id }),
  setPaused: (v) => set({ paused: v }),
}));
