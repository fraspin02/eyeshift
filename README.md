# EYE//SHIFT — Immersive 3D e-commerce (prototipo)

Esperienza e-commerce 3D per lo zaino a scocca rigida **Knight** con occhi LED programmabili.
Next.js (App Router) · TypeScript · Tailwind CSS 4 · Three.js · React Three Fiber · drei · postprocessing · GSAP + ScrollTrigger · Motion · Zustand · Lucide.

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

## Pagine
| Route | Contenuto |
|---|---|
| `/` | Homepage cinematografica: 8 scene guidate dallo scroll su un unico canvas WebGL fisso |
| `/configuratore` | Configuratore 3D in 5 step: scocca, occhi, colore LED, animazione, riepilogo + salva/screenshot/ripristina |
| `/collezione` | Catalogo con filtri finitura/disponibilità, hover con LED che si accendono, quick view |
| `/prodotto/knight` | Scheda prodotto: viewer 360° con zoom e viste, varianti, anteprima occhi/animazioni, specifiche con stato di verifica, acquisto **simulato** |
| `/come-funziona` | Storytelling in 3 passi con scena 3D sticky guidata da ScrollTrigger |
| `/lookbook` | Editoriale asimmetrico in 5 capitoli con parallax e reveal |
| `/faq` | Accordion accessibile + modello 3D decorativo |
| `/studio` | Route interna (noindex) che renderizza gli asset della campagna |

## Architettura
```
lib/data/        product.ts (specifiche + stato di verifica + fonti) · variants.ts (scocche/materiali)
                 eyes.ts (preset, colori LED, animazioni) · features.ts (hotspot) · faq.ts · editorial.ts
lib/eyes/        shape.ts (poligono degli occhi condiviso tra mesh e matrice LED)
                 presets.ts (8 espressioni come funzioni per-LED) · engine.ts (EyeEngine → CanvasTexture)
lib/three/       backpackGeometry.ts (ricostruzione procedurale) · textures.ts (carbonio, tessuto, grana)
lib/store.ts     stato unico condiviso (Zustand + persist) con layer "override" per le demo scroll
lib/home/rig.ts  rig camera/modello animato da GSAP, letto ogni frame dalla scena
components/three BackpackModel · HeroScene · ProductViewer / MobileProductViewer · FeatureHotspot
                 SceneCanvas (fallback WebGL, DPR adattivo, tier qualità) · SceneLoader · Effects · Smoke
components/home  ScrollExperience (timeline risveglio + ScrollTrigger) e le sezioni 01–08
components/configurator  BackpackConfigurator · EyePresetSelector · ShellColorSelector · LedColorPicker · AnimationSelector
```

### Il modello 3D
Nessun GLB affidabile e utilizzabile legalmente era disponibile, quindi lo zaino è ricostruito in codice:
punti di rilievo disegnati a mano → triangolazione di Delaunay vincolata (creste, sopracciglia, zigomi) →
faccette a shading piatto. Gli occhi sono **tasche incassate nella stessa mesh**, con cornice e lente;
la matrice LED (36×28 per occhio) è disegnata da `EyeEngine` su un canvas e mappata come texture emissiva
(HDR → bloom). Stesso poligono per geometria e grafica: le espressioni restano sempre dentro il display.
Materiali PBR (MeshPhysicalMaterial con clearcoat; texture procedurali carbonio/tessuto), transizioni
di colore interpolate frame per frame, scocca e LED totalmente indipendenti.

### Occhi "vivi"
Accensione LED in ordine casuale, sweep di attivazione al cambio preset, battito palpebre, respiro,
scansione con sguardo, glitch, sguardo che segue il cursore e micro-saccadi in homepage.

## Asset visivi
Gli asset sono **render CGI originali** generati dal modello stesso (nessuna foto stock, nessuna immagine di
marketplace). Rigenerarli:
```bash
npm run build && npx next start -p 3100
BASE_URL=http://localhost:3100 NODE_PATH=$(npm root -g) node scripts/render-assets.mjs [shotId ...]
```
Definizioni in `lib/render/shots.ts` (hero, night rider con layer separati per il parallax, color collection,
8 close-up occhi, macro con DOF, vista esplosa, editoriali, studio pack, 12 card varianti on/off).
Le scene con persone usano una figura CGI stilizzata: vedi `docs/IMAGE_PROMPTS.md` per sostituirle con
fotografia o image generation mantenendo il prodotto identico.

## Onestà dei dati
Vedi `docs/PRODUCT_RESEARCH.md`. Prezzo non verificato → "Prezzo da definire". Solo Shadow Black è
presentato come acquistabile; le altre finiture sono concept. Nessuna recensione, sconto, spedizione,
certificazione o autonomia inventata. Il configuratore e la UI smartphone sono dimostrazioni: niente
Bluetooth simulato, niente trasferimento all'app, acquisto solo simulato.

## Performance e accessibilità
Tier qualità automatico (`?quality=low|mid|high` per forzarlo): DPR adattivo con PerformanceMonitor,
bloom/ombre/riflessi/fumo ridotti o disattivati su dispositivi meno potenti; rendering in pausa quando
le sezioni opache coprono il canvas; cleanup di geometrie, materiali, texture e contesti GSAP.
`prefers-reduced-motion` salta l'intro e disattiva parallax e micro-movimenti. Navigazione da tastiera
(frecce per ruotare il modello in homepage), skip link, ruoli ARIA su selettori/accordion/dialog,
alt text su tutte le immagini, fallback statico se WebGL non è disponibile. Su mobile lo swipe orizzontale
ruota il modello e lo swipe verticale scorre la pagina.
