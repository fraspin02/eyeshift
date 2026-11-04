export interface Feature {
  id: "shell" | "eyes" | "strip" | "custom" | "structure" | "straps";
  anchor: "shell" | "eyes" | "strip" | "structure" | "straps" | "handle";
  title: string;
  body: string;
  note?: string;
}

/** Hotspot content — only reported characteristics, no invented certifications or figures. */
export const FEATURES: Feature[] = [
  {
    id: "shell",
    anchor: "shell",
    title: "Geometria della scocca",
    body: "Guscio frontale rigido, sfaccettato come una maschera robotica. Le superfici spezzate catturano la luce da ogni angolazione.",
    note: "Materiale riportato dai rivenditori: ABS + PC.",
  },
  {
    id: "eyes",
    anchor: "eyes",
    title: "Display degli occhi",
    body: "Due matrici LED full-color incassate nella scocca, con la forma degli occhi. Mostrano espressioni, animazioni e contenuti personalizzati.",
    note: "La risoluzione varia in base alla versione: verifica la scheda tecnica.",
  },
  {
    id: "strip",
    anchor: "strip",
    title: "Linea luminosa frontale",
    body: "L'elemento verticale al centro della fronte completa lo sguardo e rende la silhouette riconoscibile anche da lontano.",
    note: "Nella demo segue il colore LED scelto.",
  },
  {
    id: "custom",
    anchor: "handle",
    title: "Sistema di personalizzazione",
    body: "Espressioni, colori e animazioni si gestiscono dall'app per smartphone tramite Bluetooth, con alimentazione da power bank USB esterna.",
    note: "Questa pagina è una demo web: non si collega allo zaino.",
  },
  {
    id: "structure",
    anchor: "structure",
    title: "Struttura dello zaino",
    body: "Dietro la scocca, un corpo in tessuto tecnico con cerniera perimetrale e pannello posteriore imbottito.",
    note: "Tessuto riportato dai rivenditori: PVC 1680D.",
  },
  {
    id: "straps",
    anchor: "straps",
    title: "Maniglia e spallacci",
    body: "Spallacci regolabili per l'uso quotidiano e maniglia superiore per afferrarlo al volo.",
  },
];
