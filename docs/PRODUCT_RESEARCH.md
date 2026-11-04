# EYE//SHIFT — Product research (Fase 1)

Prodotto di riferimento: zaino a scocca rigida "Knight" con occhi LED, venduto come
*LED Knight Backpack*, *Eyes Knight Bag*, *APP Control LED Eyes Backpack*, *Hard Shell Motorcycle LED Backpack*.

> Nota sul metodo: la pagina iLEDShow indicata e le schede dei rivenditori non erano raggiungibili
> direttamente dalla rete della sessione di sviluppo; i dati sono stati raccolti tramite ricerca web
> sui riepiloghi delle inserzioni. Vanno ricontrollati sulla scheda ufficiale prima della pubblicazione.
> L'immagine prodotto citata nel brief non era allegata alla conversazione: la forma è stata
> ricostruita dalla descrizione del brief (scocca poligonale a maschera, due occhi aggressivi,
> elemento luminoso verticale centrale, spallacci, maniglia).

## Confermato (riportato in modo coerente da più inserzioni)
| Voce | Valore |
|---|---|
| Scocca | rigida, ABS + PC |
| Corpo / pannello posteriore | PVC 1680D |
| Display | matrici LED full-color nelle aree occhi |
| Controllo | app smartphone via Bluetooth (nome riportato: iLEDEyes; altri rivenditori: LOY EYES) |
| Contenuti | libreria effetti, testo, immagini, GIF |
| Alimentazione | power bank USB esterna; **non inclusa** secondo le inserzioni |
| Colore | nero |

## Variabile tra versioni
- Risoluzione display: 40×48, 48×48, 60×48 px a seconda dell'inserzione.
- Dimensioni: es. 36 × 18 × 49 cm (Polo), altre misure in altre inserzioni.
- Capacità: alcune versioni dichiarano 30 L espandibili, altre meno.
- Prezzo: forbice molto ampia tra rivenditori → nel sito **"Prezzo da definire"** (`PRODUCT.price = null`).

## Non verificato (risposta neutra nel sito)
- Impermeabilità: il termine "waterproof" è usato senza standard/certificazione.
- Uso in moto: commercializzato come zaino moto, ma nessuna indicazione di sicurezza verificata.

## Concept (mostrati ma non acquistabili)
Carbon Fiber, Titanium Grey, Arctic White, Crimson Red, Electric Blue. Gli 8 preset occhi
(Predator, Cyber, Phantom, Rage, Ghost, Neon, Glitch, Heart) e le 5 animazioni sono creazioni
originali del sito, non contenuti dell'app.

## Fonti
- https://www.iledshow.com/product/led-backpack-hard-shell-waterproof-diy-cool-face-mask-eyes-motorcycle-riding-knight-black-led-backpack-for-teenage-boys-2/
- https://www.pbtech.com/product/NBGBSD0003/BIOSLED-LOY-Knight-LED-Display-Motorcycle-Backpack
- https://www.polo-motorrad.com/en-gb/polo-led-backpack-hard-shell-black-36-x-18-x-49-cm/0000652190000000/pdp
- https://jumbosouq.com/crelander-led-knight-hard-shell-motorcycle-backpack-black
- https://www.fruugo.ca/led-backpack-bluetooth-app-control-programmable-screen-waterproof-hard-shell-helmet-bag-for-travel-motorcycle-riding/p-339969948

Tutti i dati strutturati vivono in `lib/data/product.ts`, `lib/data/variants.ts`, `lib/data/faq.ts`.
