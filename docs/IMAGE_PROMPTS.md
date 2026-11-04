# Prompt per gli asset fotografici con persone (da generare con un tool di image generation)

Gli asset del sito sono render CGI originali prodotti dal modello 3D (`/studio` + `scripts/render-assets.mjs`).
Le scene con persone (Night Rider, Streetwear, Indossato) usano una figura CGI stilizzata: per una
campagna definitiva vanno sostituite con fotografia reale o con immagini generate da un modello di
image generation, usando **i render del sito come reference di prodotto** (image-to-image / reference image)
per mantenere silhouette, tagli e posizione degli occhi identici.

Reference di prodotto da allegare a ogni prompt: `public/images/studio-front.jpg`, `studio-three-quarter.jpg`, `studio-profile.jpg`.

## Regole comuni
Hard-shell backpack, faceted polygonal black front shell shaped like a robotic mask, two large
angular LED-matrix eye displays recessed into the shell with an aggressive slant, a thin vertical
light bar at the top centre of the shell, fabric body with perimeter zipper, padded shoulder straps,
top grab handle. Keep exact silhouette and proportions of the reference. No text, no logos, no
watermark. Photorealistic, premium campaign photography.

## Asset 02 — Night Rider (16:9)
A motorcyclist standing next to a parked naked motorcycle on a wet city street at night, seen from
behind three-quarter, wearing the reference backpack; the backpack is in the foreground and sharp,
its LED eyes glowing red; reflections of red and cyan lights on wet asphalt, contemporary
architecture, shallow depth of field, cinematic contrast, 35mm, f/1.8. The motorcycle is secondary
and partly out of focus.

## Asset 07 — Streetwear Editorial (4:5 e 9:16)
A person in contemporary dark streetwear (oversized technical jacket, cargo pants, sneakers) walking
through brutalist concrete architecture, three-quarter back view, wearing the reference backpack with
cyan LED eyes; overcast cool light, hard diagonal shadows, muted dark palette, premium fashion
campaign, 50mm.

## Asset 08 — Vista indossata (1:1)
Studio shot on seamless dark graphite background, a model seen from behind wearing the reference
backpack, straps adjusted, LED eyes on in red, soft key light and cyan rim light, product sharp.

## Dettagli interni
Non generare viste interne: non esistono riferimenti verificati sulla struttura interna.
