/**
 * Shell variants (colour of the hard shell) — independent from LED colours.
 * Only variants with `availability: "disponibile"` are presented as purchasable.
 * Everything else is a visual concept and is never purchasable.
 */

export type ShellId = "shadow-black" | "carbon-fiber" | "titanium-grey" | "arctic-white" | "crimson-red" | "electric-blue";

export type FinishId = "opaco" | "carbonio" | "metallizzato" | "lucido";

export type Availability = "disponibile" | "concept";

export interface ShellMaterialSpec {
  color: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  /** procedural carbon weave texture */
  carbon?: boolean;
  /** colour of the soft body / straps behind the shell */
  body: string;
  /** subtle tint of the bezels around the displays */
  bezel: string;
}

export interface ShellVariant {
  id: ShellId;
  name: string;
  finish: FinishId;
  finishLabel: string;
  availability: Availability;
  description: string;
  swatch: string;
  swatchAccent?: string;
  material: ShellMaterialSpec;
}

export const FINISH_LABEL: Record<FinishId, string> = {
  opaco: "Opaco",
  carbonio: "Texture carbonio",
  metallizzato: "Metallizzato",
  lucido: "Lucido",
};

export const SHELL_VARIANTS: ShellVariant[] = [
  {
    id: "shadow-black",
    name: "Shadow Black",
    finish: "opaco",
    finishLabel: "Nero opaco",
    availability: "disponibile",
    description: "La versione di riferimento. Nero profondo, superfici opache, sguardo protagonista.",
    swatch: "#111216",
    material: {
      color: "#0e0f13",
      roughness: 0.5,
      metalness: 0.15,
      clearcoat: 0.25,
      clearcoatRoughness: 0.55,
      body: "#121318",
      bezel: "#050507",
    },
  },
  {
    id: "carbon-fiber",
    name: "Carbon Fiber",
    finish: "carbonio",
    finishLabel: "Carbon look",
    availability: "concept",
    description: "Trama intrecciata sotto una vernice trasparente. Un dettaglio da paddock.",
    swatch: "#1d1f24",
    swatchAccent: "#3a3d45",
    material: {
      color: "#1a1c21",
      roughness: 0.38,
      metalness: 0.35,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      carbon: true,
      body: "#121318",
      bezel: "#050507",
    },
  },
  {
    id: "titanium-grey",
    name: "Titanium Grey",
    finish: "metallizzato",
    finishLabel: "Grigio titanio",
    availability: "concept",
    description: "Riflessi freddi e metallici. Ingegneria resa visibile.",
    swatch: "#6b7079",
    material: {
      color: "#5a5f68",
      roughness: 0.32,
      metalness: 0.8,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      body: "#17191e",
      bezel: "#08090b",
    },
  },
  {
    id: "arctic-white",
    name: "Arctic White",
    finish: "lucido",
    finishLabel: "Bianco ghiaccio",
    availability: "concept",
    description: "Pulito, grafico, quasi clinico. Gli occhi diventano pura luce.",
    swatch: "#e9ecf1",
    material: {
      color: "#dfe3ea",
      roughness: 0.4,
      metalness: 0.05,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      body: "#2a2d33",
      bezel: "#0c0d10",
    },
  },
  {
    id: "crimson-red",
    name: "Crimson Red",
    finish: "lucido",
    finishLabel: "Rosso cremisi",
    availability: "concept",
    description: "Vernice profonda e brillante. Impossibile da ignorare.",
    swatch: "#9c1022",
    material: {
      color: "#7d0b18",
      roughness: 0.28,
      metalness: 0.25,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      body: "#141418",
      bezel: "#070506",
    },
  },
  {
    id: "electric-blue",
    name: "Electric Blue",
    finish: "metallizzato",
    finishLabel: "Blu elettrico",
    availability: "concept",
    description: "Un blu metallico saturo, nato per le luci della notte.",
    swatch: "#1446c4",
    material: {
      color: "#0c35a3",
      roughness: 0.3,
      metalness: 0.55,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      body: "#121318",
      bezel: "#05060a",
    },
  },
];

export const SHELL_BY_ID = Object.fromEntries(SHELL_VARIANTS.map((v) => [v.id, v])) as Record<ShellId, ShellVariant>;

export const isPurchasable = (id: ShellId) => SHELL_BY_ID[id].availability === "disponibile";
