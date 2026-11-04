/** LED display options. All eye content is a web demo — it is not sent to any device. */

export type EyePresetId = "predator" | "cyber" | "phantom" | "rage" | "ghost" | "neon" | "glitch" | "heart";
export type LedColorId = "red" | "cyan" | "blue" | "violet" | "green" | "white" | "pink";
export type EyeAnimationId = "static" | "blink" | "pulse" | "scan" | "glitch";

export interface EyePreset {
  id: EyePresetId;
  name: string;
  mood: string;
  defaultColor: LedColorId;
  /** neon draws a multi-colour gradient; the chosen colour becomes its base hue */
  multicolor?: boolean;
}

export interface LedColor {
  id: LedColorId;
  name: string;
  hex: string;
}

export interface EyeAnimation {
  id: EyeAnimationId;
  name: string;
  description: string;
}

export const EYE_PRESETS: EyePreset[] = [
  { id: "predator", name: "Predator", mood: "Aggressivo", defaultColor: "red" },
  { id: "cyber", name: "Cyber", mood: "Futuristico", defaultColor: "cyan" },
  { id: "phantom", name: "Phantom", mood: "Misterioso", defaultColor: "violet" },
  { id: "rage", name: "Rage", mood: "Furioso", defaultColor: "red" },
  { id: "ghost", name: "Ghost", mood: "Giocoso", defaultColor: "white" },
  { id: "neon", name: "Neon", mood: "Elettrico", defaultColor: "cyan", multicolor: true },
  { id: "glitch", name: "Glitch", mood: "Instabile", defaultColor: "green" },
  { id: "heart", name: "Heart", mood: "Affettuoso", defaultColor: "pink" },
];

export const LED_COLORS: LedColor[] = [
  { id: "red", name: "Rosso", hex: "#FF243E" },
  { id: "cyan", name: "Cyan", hex: "#00E5FF" },
  { id: "blue", name: "Blu", hex: "#2F6BFF" },
  { id: "violet", name: "Viola", hex: "#8D46FF" },
  { id: "green", name: "Verde", hex: "#2BFF88" },
  { id: "white", name: "Bianco", hex: "#F4F6FA" },
  { id: "pink", name: "Rosa", hex: "#FF4FB8" },
];

export const EYE_ANIMATIONS: EyeAnimation[] = [
  { id: "static", name: "Static", description: "Immagine fissa" },
  { id: "blink", name: "Blink", description: "Battito delle palpebre" },
  { id: "pulse", name: "Pulse", description: "Respiro luminoso" },
  { id: "scan", name: "Scan", description: "Scansione e sguardo" },
  { id: "glitch", name: "Glitch", description: "Interferenza digitale" },
];

export const PRESET_BY_ID = Object.fromEntries(EYE_PRESETS.map((p) => [p.id, p])) as Record<EyePresetId, EyePreset>;
export const LED_BY_ID = Object.fromEntries(LED_COLORS.map((c) => [c.id, c])) as Record<LedColorId, LedColor>;
export const ANIM_BY_ID = Object.fromEntries(EYE_ANIMATIONS.map((a) => [a.id, a])) as Record<EyeAnimationId, EyeAnimation>;
