import * as THREE from "three";
import type { EyeAnimationId, EyePresetId } from "@/lib/data/eyes";
import { PRESET_FNS, type PresetCtx } from "./presets";
import { EYE_ASPECT, EYE_POLY_ISO, sdPolygon } from "./shape";

export const EYE_COLS = 36;
export const EYE_ROWS = 28;

interface Led {
  X: number;
  Y: number;
  d: number;
  row: number;
  col: number;
  rand: number;
  rand2: number;
}

const LEDS: Led[] = (() => {
  const out: Led[] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let r = 0; r < EYE_ROWS; r++) {
    for (let c = 0; c < EYE_COLS; c++) {
      const X = ((c + 0.5) / EYE_COLS) * EYE_ASPECT;
      const Y = 1 - (r + 0.5) / EYE_ROWS;
      const d = sdPolygon(X, Y, EYE_POLY_ISO);
      if (d < -0.012) out.push({ X, Y, d, row: r, col: c, rand: rnd(), rand2: rnd() });
    }
  }
  return out;
})();

export interface EyeLook {
  preset: EyePresetId;
  color: string;
  animation: EyeAnimationId;
  playing: boolean;
}

const tmpColor = new THREE.Color();

function hexToRgb(hex: string): [number, number, number] {
  tmpColor.set(hex);
  return [tmpColor.r, tmpColor.g, tmpColor.b];
}

/** Rotate an rgb triple around the hue wheel (degrees). */
function hueRotate(r: number, g: number, b: number, deg: number): [number, number, number] {
  if (!deg) return [r, g, b];
  const a = (deg * Math.PI) / 180;
  const cosA = Math.cos(a);
  const sinA = Math.sin(a);
  const k = 1 / 3;
  const sq = Math.sqrt(k);
  const m0 = cosA + (1 - cosA) * k;
  const m1 = k * (1 - cosA) - sq * sinA;
  const m2 = k * (1 - cosA) + sq * sinA;
  return [
    Math.min(1, Math.max(0, r * m0 + g * m1 + b * m2)),
    Math.min(1, Math.max(0, r * m2 + g * m0 + b * m1)),
    Math.min(1, Math.max(0, r * m1 + g * m2 + b * m0)),
  ];
}

export interface EyeEngineOptions {
  /** pixel size of one LED on the canvas */
  dot?: number;
  /** autonomous micro-behaviour: random blinks and saccades */
  alive?: boolean;
}

/**
 * Renders both LED eyes into one canvas (left half = eye on +x side, right half = eye on −x side).
 * The canvas feeds a THREE.CanvasTexture used by the emissive display meshes.
 */
export class EyeEngine {
  readonly canvas: HTMLCanvasElement;
  readonly texture: THREE.CanvasTexture;
  private ctx: CanvasRenderingContext2D;
  private bg: HTMLCanvasElement;
  private dot: number;

  look: EyeLook = { preset: "predator", color: "#FF243E", animation: "static", playing: true };
  alive: boolean;
  /** 0 → displays off, 1 → fully on (animated externally, e.g. by the hero intro) */
  power = 1;
  /** 0..1 forehead strip power */
  stripPower = 1;
  /** current strip intensity (read by the 3D strip material) */
  stripLevel = 1;

  private rgb: [number, number, number] = hexToRgb("#FF243E");
  private targetRgb: [number, number, number] = hexToRgb("#FF243E");
  private activatedAt = -10;
  private animT = 0;
  private lastT = 0;
  private gaze = { x: 0, y: 0 };
  private gazeTarget = { x: 0, y: 0 };
  private pointer = { x: 0, y: 0, active: false };
  private nextBlink = 2;
  private blinkStart = -10;
  private nextSaccade = 1.5;
  private saccade = { x: 0, y: 0 };
  private lastDraw = -1;
  private ctxObj: PresetCtx = { t: 0, gx: 0, gy: 0, hue: 0, row: 0, rand: 0 };

  constructor(opts: EyeEngineOptions = {}) {
    this.dot = opts.dot ?? 10;
    this.alive = opts.alive ?? false;
    this.canvas = document.createElement("canvas");
    this.canvas.width = EYE_COLS * this.dot * 2;
    this.canvas.height = EYE_ROWS * this.dot;
    this.ctx = this.canvas.getContext("2d")!;
    this.bg = document.createElement("canvas");
    this.bg.width = this.canvas.width;
    this.bg.height = this.canvas.height;
    this.paintBackground();
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = 4;
    this.texture.minFilter = THREE.LinearMipmapLinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
  }

  /** Physical matrix: unlit LEDs are visible as tiny dark dots — the hardware is always there. */
  private paintBackground() {
    const g = this.bg.getContext("2d")!;
    const s = this.dot;
    g.fillStyle = "#020203";
    g.fillRect(0, 0, this.bg.width, this.bg.height);
    g.fillStyle = "#16181f";
    for (let eye = 0; eye < 2; eye++) {
      const ox = eye * EYE_COLS * s;
      for (const l of LEDS) {
        g.beginPath();
        g.arc(ox + (l.col + 0.5) * s, (l.row + 0.5) * s, s * 0.32, 0, Math.PI * 2);
        g.fill();
      }
    }
  }

  setLook(next: Partial<EyeLook>, opts: { silent?: boolean } = {}) {
    const presetChanged = next.preset && next.preset !== this.look.preset;
    this.look = { ...this.look, ...next };
    if (next.color) this.targetRgb = hexToRgb(next.color);
    if (presetChanged && !opts.silent) this.activatedAt = this.lastT;
  }

  /** Snap colour immediately (no lerp) — useful for still renders. */
  snapColor() {
    this.rgb = [...this.targetRgb];
  }

  /** Trigger the LED activation sweep without changing the preset. */
  activate() {
    this.activatedAt = this.lastT;
  }

  /** Pointer in normalised device coords (-1..1). */
  setPointer(x: number, y: number) {
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.active = true;
  }

  dispose() {
    this.texture.dispose();
  }

  /** Advance and redraw. `fps` caps redraws to save battery. */
  update(t: number, fps = 30) {
    const dt = Math.min(0.1, Math.max(0, t - this.lastT));
    this.lastT = t;
    if (this.look.playing) this.animT += dt;

    // colour lerp
    const k = 1 - Math.exp(-dt * 9);
    for (let i = 0; i < 3; i++) this.rgb[i] += (this.targetRgb[i] - this.rgb[i]) * k;

    // gaze: pointer + autonomous saccades
    if (this.alive) {
      if (t > this.nextSaccade) {
        this.saccade = { x: (Math.random() - 0.5) * 0.7, y: (Math.random() - 0.5) * 0.5 };
        this.nextSaccade = t + 1.4 + Math.random() * 2.4;
      }
      if (t > this.nextBlink) {
        this.blinkStart = t;
        this.nextBlink = t + 2.8 + Math.random() * 3.6;
      }
    }
    const anim = this.look.animation;
    let gx = this.alive ? this.saccade.x * 0.5 + (this.pointer.active ? this.pointer.x * 0.8 : 0) : 0;
    let gy = this.alive ? this.saccade.y * 0.5 + (this.pointer.active ? this.pointer.y * 0.6 : 0) : 0;
    if (anim === "scan") {
      gx = Math.sin(this.animT * 1.1) * 0.9;
      gy = 0;
    }
    this.gazeTarget.x = Math.max(-1, Math.min(1, gx));
    this.gazeTarget.y = Math.max(-1, Math.min(1, gy));
    const gk = 1 - Math.exp(-dt * 12);
    this.gaze.x += (this.gazeTarget.x - this.gaze.x) * gk;
    this.gaze.y += (this.gazeTarget.y - this.gaze.y) * gk;

    // strip level
    let strip = this.stripPower;
    if (anim === "pulse") strip *= 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(this.animT * 2.6));
    this.stripLevel = strip;

    if (t - this.lastDraw < 1 / fps - 0.001) return;
    this.lastDraw = t;
    this.draw(t);
    this.texture.needsUpdate = true;
  }

  private lidAmount(t: number): number {
    let lid = 0;
    const anim = this.look.animation;
    if (anim === "blink") {
      const period = 3.2;
      const p = this.animT % period;
      if (p < 0.22) lid = Math.sin((p / 0.22) * Math.PI);
      // double blink every other cycle
      const cycle = Math.floor(this.animT / period);
      if (cycle % 2 === 1 && p > 0.32 && p < 0.54) lid = Math.max(lid, Math.sin(((p - 0.32) / 0.22) * Math.PI));
    }
    if (this.alive && anim !== "static") {
      const b = t - this.blinkStart;
      if (b >= 0 && b < 0.2) lid = Math.max(lid, Math.sin((b / 0.2) * Math.PI));
    }
    return lid;
  }

  private draw(t: number) {
    const g = this.ctx;
    const s = this.dot;
    g.drawImage(this.bg, 0, 0);
    if (this.power <= 0.001) return;

    const look = this.look;
    const fn = PRESET_FNS[look.preset];
    const anim = look.animation;
    const at = this.animT;
    const lid = this.lidAmount(t);
    const actP = (this.lastT - this.activatedAt) / 0.6;
    const flash = actP >= 0 && actP < 1 ? 1 - actP : 0;

    let gain = 1;
    if (anim === "pulse") gain = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(at * 2.6));
    let glitchFrame = false;
    let glitchShift = 0;
    if (anim === "glitch") {
      const q = Math.floor(at * 9);
      const h = Math.sin(q * 91.17) * 43758.5453;
      const n = h - Math.floor(h);
      glitchFrame = n > 0.7;
      glitchShift = glitchFrame ? (n - 0.7) * 2.2 : 0;
      if (n > 0.965) return; // brief blackout
      gain *= glitchFrame ? 0.75 + n * 0.3 : 1;
    }
    const sweepX = anim === "scan" ? ((at * 0.55) % 1.3) * EYE_ASPECT - 0.1 : -9;

    const c = this.ctxObj;
    c.t = at;
    const [br, bgc, bb] = this.rgb;

    for (let eye = 0; eye < 2; eye++) {
      const ox = eye * EYE_COLS * s;
      c.gx = eye === 0 ? this.gaze.x : -this.gaze.x;
      c.gy = this.gaze.y;
      for (let i = 0; i < LEDS.length; i++) {
        const l = LEDS[i];
        // power-up: LEDs switch on in a random order
        if (this.power < 1 && l.rand > this.power) continue;
        // activation sweep after a preset change
        if (actP >= 0 && actP < 1 && l.rand2 > actP * 1.15) continue;
        // eyelids close towards the centre line
        if (lid > 0 && Math.abs(l.Y - 0.5) > 0.56 * (1 - lid)) continue;

        let X = l.X;
        if (glitchFrame && (l.row + eye) % 3 === 0) X -= glitchShift;
        c.hue = 0;
        c.row = l.row;
        c.rand = (l.rand + Math.floor(at * 6) * 0.618) % 1;
        let v = fn(X, l.Y, l.d, c);
        if (sweepX > -5) {
          const dx = l.X - sweepX;
          v = Math.min(1, v + Math.exp(-(dx * dx) / 0.004) * 0.6);
        }
        if (v <= 0.02) continue;
        v *= gain;
        let [r, gg, b] = c.hue ? hueRotate(br, bgc, bb, c.hue) : [br, bgc, bb];
        if (glitchFrame && l.row % 5 === 0) [r, gg, b] = hueRotate(r, gg, b, 150);
        // white-hot core for bright LEDs + activation flash
        const w = Math.min(1, 0.22 * v + flash * 0.8);
        r = r + (1 - r) * w;
        gg = gg + (1 - gg) * w;
        b = b + (1 - b) * w;
        const cx = ox + (l.col + 0.5) * s;
        const cy = (l.row + 0.5) * s;
        g.fillStyle = `rgba(${(r * 255) | 0},${(gg * 255) | 0},${(b * 255) | 0},${Math.min(1, v * 0.35)})`;
        g.beginPath();
        g.arc(cx, cy, s * 0.56, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = `rgba(${(r * 255) | 0},${(gg * 255) | 0},${(b * 255) | 0},${Math.min(1, v)})`;
        g.beginPath();
        g.arc(cx, cy, s * 0.36, 0, Math.PI * 2);
        g.fill();
      }
    }
  }
}

/**
 * Static single-eye preview for UI thumbnails (2D canvas, no WebGL).
 * Draws the eye in its real display shape so thumbnails match the 3D product.
 */
export function drawEyeThumbnail(
  canvas: HTMLCanvasElement,
  preset: EyePresetId,
  colorHex: string,
  opts: { mirror?: boolean; t?: number; both?: boolean } = {}
) {
  const g = canvas.getContext("2d");
  if (!g) return;
  const W = canvas.width;
  const H = canvas.height;
  const eyes = opts.both ? 2 : 1;
  const gap = opts.both ? 0.14 : 0;
  const unitW = W / (eyes + gap);
  const s = Math.min(unitW / EYE_COLS, H / EYE_ROWS);
  const totalW = s * EYE_COLS * eyes + (eyes - 1) * gap * unitW;
  const oy = (H - s * EYE_ROWS) / 2;
  const [r0, g0, b0] = hexToRgb(colorHex);
  const fn = PRESET_FNS[preset];
  const c: PresetCtx = { t: opts.t ?? 1.2, gx: 0, gy: 0, hue: 0, row: 0, rand: 0 };
  g.clearRect(0, 0, W, H);
  for (let e = 0; e < eyes; e++) {
    // left eye on screen is the mirrored one
    const mirror = opts.both ? e === 0 : !!opts.mirror;
    const ox = (W - totalW) / 2 + e * (s * EYE_COLS + gap * unitW);
    for (const l of LEDS) {
      const col = mirror ? EYE_COLS - 1 - l.col : l.col;
      const cx = ox + (col + 0.5) * s;
      const cy = oy + (l.row + 0.5) * s;
      c.hue = 0;
      c.row = l.row;
      c.rand = l.rand;
      const v = fn(l.X, l.Y, l.d, c);
      if (v <= 0.02) {
        g.fillStyle = "#1a1c23";
        g.beginPath();
        g.arc(cx, cy, s * 0.3, 0, Math.PI * 2);
        g.fill();
        continue;
      }
      const [r, gg, b] = c.hue ? hueRotate(r0, g0, b0, c.hue) : [r0, g0, b0];
      const w = 0.2 * v;
      g.fillStyle = `rgba(${((r + (1 - r) * w) * 255) | 0},${((gg + (1 - gg) * w) * 255) | 0},${((b + (1 - b) * w) * 255) | 0},${v})`;
      g.beginPath();
      g.arc(cx, cy, s * 0.4, 0, Math.PI * 2);
      g.fill();
    }
  }
}
