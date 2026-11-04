import { asset } from "@/lib/asset";

/** Original CGI renders produced from the 3D model (scripts/render-assets.mjs). */
export interface EditorialImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  category?: "night-rider" | "urban-identity" | "studio-collection" | "cyber-details" | "color-stories";
}

const img = (src: string, alt: string, width: number, height: number, category?: EditorialImage["category"]): EditorialImage => ({
  src: asset(`/images/${src}`),
  alt,
  width,
  height,
  category,
});

export const IMAGES = {
  hero: img("hero-16x9.jpg", "Lo zaino EYE//SHIFT Knight nero sospeso nel buio, occhi LED rossi accesi e luce cyan sui bordi", 2400, 1350),
  heroMobile: img("hero-4x5.jpg", "Lo zaino EYE//SHIFT Knight nero con occhi LED rossi, inquadratura verticale", 1200, 1500),
  nightFull: img("night-rider-16x9.jpg", "Un motociclista di spalle indossa lo zaino Knight con occhi LED rossi in una strada bagnata di notte", 2400, 1350, "night-rider"),
  nightBg: img("night-bg-16x9.jpg", "Strada urbana bagnata di notte con riflessi rossi e cyan", 2400, 1350),
  nightFg: img("night-fg-16x9.png", "Motociclista di spalle con lo zaino Knight", 2400, 1350),
  nightVertical: img("night-rider-9x16.jpg", "Motociclista con lo zaino Knight, inquadratura verticale notturna", 1080, 1920, "night-rider"),
  colorCollection: img("color-collection-16x9.jpg", "Sei varianti cromatiche dello zaino Knight allineate in studio", 2400, 1350, "color-stories"),
  macro: img("macro-16x9.jpg", "Macro della scocca sfaccettata e di una porzione dell'occhio LED", 2400, 1350, "cyber-details"),
  exploded: img("exploded-16x9.jpg", "Vista esplosa dello zaino: scocca, display, corpo e spallacci separati", 2400, 1350, "studio-collection"),
  editorial4x5: img("editorial-4x5.jpg", "Persona in outfit streetwear indossa lo zaino Knight tra architetture di cemento", 1200, 1500, "urban-identity"),
  editorial9x16: img("editorial-9x16.jpg", "Ritratto verticale streetwear con lo zaino Knight", 1080, 1920, "urban-identity"),
  studioFront: img("studio-front.jpg", "Zaino Knight Shadow Black, vista frontale in studio", 1500, 1500, "studio-collection"),
  studioThreeQuarter: img("studio-three-quarter.jpg", "Zaino Knight Shadow Black, vista di tre quarti", 1500, 1500, "studio-collection"),
  studioProfile: img("studio-profile.jpg", "Zaino Knight Shadow Black, vista di profilo", 1500, 1500, "studio-collection"),
  studioBack: img("studio-back.jpg", "Zaino Knight, vista posteriore con spallacci e pannello imbottito", 1500, 1500, "studio-collection"),
  studioEyes: img("studio-eyes.jpg", "Dettaglio degli occhi LED incassati nella scocca", 1500, 1500, "cyber-details"),
  studioFinish: img("studio-finish.jpg", "Dettaglio delle finiture della scocca e della cerniera perimetrale", 1500, 1500, "cyber-details"),
  studioWorn: img("studio-worn.jpg", "Lo zaino Knight indossato, vista posteriore in studio", 1500, 1500, "urban-identity"),
};

export const eyeCloseup = (preset: string) => asset(`/images/eyes-${preset}.jpg`);
export const variantImage = (shell: string, state: "on" | "off") => asset(`/images/variant-${shell}-${state}.jpg`);
