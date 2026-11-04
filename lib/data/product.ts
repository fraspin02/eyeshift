/**
 * Product research data.
 *
 * Every spec carries a `status`:
 *  - "riportato"     → reported consistently by several independent seller listings
 *  - "variabile"     → reported, but values differ between listings / versions
 *  - "da-verificare" → not confirmed: must be checked on the technical sheet of the model sold
 *
 * Nothing here is invented: when a value is not verified, the UI shows a neutral message.
 */

export type SpecStatus = "riportato" | "variabile" | "da-verificare";

export interface ProductSpec {
  id: string;
  label: string;
  value: string;
  status: SpecStatus;
  note?: string;
}

export interface ResearchSource {
  label: string;
  url: string;
}

export const PRODUCT = {
  slug: "knight",
  brand: "EYE//SHIFT",
  name: "EYE//SHIFT Knight",
  tagline: "Lo zaino a scocca rigida con occhi LED programmabili.",
  description:
    "Scocca frontale rigida e sfaccettata, ispirata a una maschera robotica. Due display LED a forma di occhio integrati nel guscio e una linea luminosa verticale sulla fronte. Gli sguardi si cambiano dallo smartphone.",
  /** Commercial names under which the reference product is sold. */
  marketNames: [
    "LED Knight Backpack",
    "Eyes Knight Bag",
    "APP Control LED Eyes Backpack",
    "Hard Shell Motorcycle LED Backpack",
  ],
  /** Verified price of the specific model. `null` → UI shows "Prezzo da definire". */
  price: null as number | null,
  currency: "EUR",
  /** Name of the reference companion app as reported by listings (it varies between sellers). */
  referenceApp: "iLEDEyes",
};

export const PRODUCT_SPECS: ProductSpec[] = [
  {
    id: "shell",
    label: "Scocca",
    value: "Guscio rigido in ABS + PC",
    status: "riportato",
    note: "Materiale indicato dalla maggior parte delle inserzioni del modello Knight.",
  },
  {
    id: "body",
    label: "Corpo",
    value: "Tessuto tecnico PVC 1680D",
    status: "riportato",
    note: "Riportato da più rivenditori per corpo e pannello posteriore.",
  },
  {
    id: "display",
    label: "Display",
    value: "Matrice LED full-color nelle aree degli occhi",
    status: "riportato",
  },
  {
    id: "resolution",
    label: "Risoluzione display",
    value: "Varia tra le inserzioni (es. 40×48, 48×48, 60×48 pixel)",
    status: "variabile",
    note: "Verificare la risoluzione sulla scheda tecnica della versione acquistata.",
  },
  {
    id: "control",
    label: "Controllo",
    value: "App per smartphone via Bluetooth",
    status: "riportato",
    note: "Il nome dell'app varia tra rivenditori (es. iLEDEyes, LOY EYES).",
  },
  {
    id: "content",
    label: "Contenuti",
    value: "Libreria di effetti, testo, immagini e GIF personalizzate",
    status: "riportato",
  },
  {
    id: "power",
    label: "Alimentazione",
    value: "Power bank USB esterna",
    status: "riportato",
    note: "Le inserzioni indicano che la power bank non è inclusa. Lo zaino non si accende senza alimentazione esterna.",
  },
  {
    id: "size",
    label: "Dimensioni",
    value: "Variano in base alla versione (circa 36 × 18 × 49 cm in alcune inserzioni)",
    status: "variabile",
  },
  {
    id: "capacity",
    label: "Capacità",
    value: "Da verificare sulla scheda tecnica",
    status: "da-verificare",
    note: "Alcune versioni dichiarano 30 L espandibili, altre capacità inferiori.",
  },
  {
    id: "water",
    label: "Resistenza all'acqua",
    value: "Da verificare sulla scheda tecnica",
    status: "da-verificare",
    note: "Molte inserzioni usano il termine \"waterproof\" senza indicare uno standard o una certificazione.",
  },
  {
    id: "colors",
    label: "Colori confermati",
    value: "Nero",
    status: "riportato",
    note: "Le altre colorazioni presentate sul sito sono concept dimostrativi.",
  },
];

export const STATUS_LABEL: Record<SpecStatus, string> = {
  riportato: "Riportato dai rivenditori",
  variabile: "Varia per versione",
  "da-verificare": "Da verificare",
};

export const RESEARCH_SOURCES: ResearchSource[] = [
  {
    label: "iLEDShow — LED Backpack Hard Shell Knight (riferimento iniziale)",
    url: "https://www.iledshow.com/product/led-backpack-hard-shell-waterproof-diy-cool-face-mask-eyes-motorcycle-riding-knight-black-led-backpack-for-teenage-boys-2/",
  },
  {
    label: "PB Tech — BIOSLED LOY Knight LED Display Motorcycle Backpack",
    url: "https://www.pbtech.com/product/NBGBSD0003/BIOSLED-LOY-Knight-LED-Display-Motorcycle-Backpack",
  },
  {
    label: "Polo Motorrad — LED backpack hard shell, black, 36 × 18 × 49 cm",
    url: "https://www.polo-motorrad.com/en-gb/polo-led-backpack-hard-shell-black-36-x-18-x-49-cm/0000652190000000/pdp",
  },
  {
    label: "Jumbosouq — Crelander LED Knight Hard Shell Motorcycle Backpack (Black)",
    url: "https://jumbosouq.com/crelander-led-knight-hard-shell-motorcycle-backpack-black",
  },
  {
    label: "Fruugo — LED Backpack Bluetooth APP Control Hard Shell",
    url: "https://www.fruugo.ca/led-backpack-bluetooth-app-control-programmable-screen-waterproof-hard-shell-helmet-bag-for-travel-motorcycle-riding/p-339969948",
  },
];

export function formatPrice(price: number | null): string {
  if (price == null) return "Prezzo da definire";
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: PRODUCT.currency }).format(price);
}
