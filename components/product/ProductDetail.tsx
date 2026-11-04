"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag, SlidersHorizontal, X, ExternalLink, Info } from "lucide-react";
import { useLook, useResolvedLook } from "@/lib/store";
import { SHELL_BY_ID, isPurchasable, type ShellId } from "@/lib/data/variants";
import { EYE_ANIMATIONS, PRESET_BY_ID } from "@/lib/data/eyes";
import { PRODUCT, PRODUCT_SPECS, RESEARCH_SOURCES, STATUS_LABEL, formatPrice } from "@/lib/data/product";
import { IMAGES } from "@/lib/data/editorial";
import { ShellColorSelector } from "@/components/configurator/ShellColorSelector";
import { EyePresetSelector } from "@/components/configurator/EyePresetSelector";
import { AvailabilityBadge } from "@/components/ui/ConceptBadge";
import { useIsMobile } from "@/lib/hooks/useDeviceTier";
import type { ViewPreset } from "@/components/three/ProductViewer";

const ProductViewer = dynamic(() => import("@/components/three/ProductViewer").then((m) => m.ProductViewer), { ssr: false });
const MobileProductViewer = dynamic(() => import("@/components/three/ProductViewer").then((m) => m.MobileProductViewer), { ssr: false });

const VIEW_BUTTONS: { id: ViewPreset; label: string }[] = [
  { id: "front", label: "Frontale" },
  { id: "three-quarter", label: "3/4" },
  { id: "side", label: "Laterale" },
  { id: "back", label: "Posteriore" },
  { id: "eyes", label: "Occhi" },
];

const GALLERY = [IMAGES.studioThreeQuarter, IMAGES.studioProfile, IMAGES.studioBack, IMAGES.studioEyes, IMAGES.studioFinish, IMAGES.macro, IMAGES.exploded, IMAGES.studioWorn];

export function ProductDetail() {
  const look = useResolvedLook();
  const set = useLook((s) => s.set);
  const [view, setView] = useState<ViewPreset>("three-quarter");
  const [nudge, setNudge] = useState(0);
  const [buy, setBuy] = useState(false);
  const isMobile = useIsMobile();
  const variant = SHELL_BY_ID[look.shell];

  useEffect(() => {
    const v = new URLSearchParams(location.search).get("variante") as ShellId | null;
    if (v && SHELL_BY_ID[v]) set({ shell: v });
  }, [set]);

  const viewerProps = { look, view, nudge, mood: "studio" as const, label: `Modello 3D di ${PRODUCT.name} ${variant.name}` };

  return (
    <>
      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        {/* 3D viewer */}
        <div className="relative h-[62svh] bg-gradient-to-b from-carbon to-obsidian lg:sticky lg:top-0 lg:h-[100svh]">
          {isMobile ? <MobileProductViewer className="h-full w-full pt-16" {...viewerProps} /> : <ProductViewer className="h-full w-full pt-20" gesture="orbit" {...viewerProps} />}
          <div role="group" aria-label="Viste del prodotto" className="no-scrollbar absolute inset-x-0 bottom-4 flex justify-start gap-1.5 overflow-x-auto px-4 md:bottom-6 md:justify-center">
            {VIEW_BUTTONS.map((b) => (
              <button
                key={b.id}
                type="button"
                aria-pressed={view === b.id}
                onClick={() => setView(b.id)}
                className={`shrink-0 rounded-full border px-4 py-2 font-grotesk text-[11px] uppercase tracking-[0.14em] backdrop-blur transition ${
                  view === b.id ? "border-ice bg-ice text-obsidian" : "border-ice/15 bg-obsidian/50 text-ice/75 hover:border-ice/50"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
          <p className="pointer-events-none absolute left-4 top-20 text-[11px] text-ice/40 md:left-6 md:top-28">{isMobile ? "Scorri di lato per ruotare a 360°" : "Trascina per ruotare a 360° · rotella per lo zoom"}</p>
        </div>

        {/* Info */}
        <div className="gutter py-10 lg:pt-32">
          <AvailabilityBadge availability={variant.availability} />
          <h1 className="display mt-4 text-[14vw] md:text-7xl">{PRODUCT.name}</h1>
          <AnimatePresence mode="wait">
            <motion.p key={variant.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 font-grotesk text-lg text-ice/80">
              {variant.name} <span className="text-ice/40">· {variant.finishLabel}</span>
            </motion.p>
          </AnimatePresence>
          <p className="mt-5 max-w-[52ch] leading-relaxed text-ice/65">{PRODUCT.description}</p>
          <p className="mt-6 font-grotesk text-2xl">{variant.availability === "concept" ? "Concept — non acquistabile" : formatPrice(PRODUCT.price)}</p>

          <div className="mt-8 border-t hairline pt-6">
            <p className="eyebrow mb-4">Colore scocca</p>
            <ShellColorSelector
              value={look.shell}
              onChange={(id) => {
                set({ shell: id });
                setNudge((n) => n + 1);
              }}
            />
          </div>

          <div className="mt-8 border-t hairline pt-6">
            <p className="eyebrow mb-4">Anteprima occhi</p>
            <EyePresetSelector value={look.preset} led={look.led} presetColors onChange={(id) => set({ preset: id, led: PRESET_BY_ID[id].defaultColor })} />
          </div>

          <div className="mt-8 border-t hairline pt-6">
            <p className="eyebrow mb-4">Anteprima animazioni</p>
            <div role="radiogroup" aria-label="Animazione" className="flex flex-wrap gap-2">
              {EYE_ANIMATIONS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  role="radio"
                  aria-checked={look.animation === a.id}
                  onClick={() => set({ animation: a.id, playing: true })}
                  className={`rounded-full border px-4 py-2 font-grotesk text-[11px] uppercase tracking-[0.14em] transition ${look.animation === a.id ? "border-ice bg-ice/10" : "border-ice/15 text-ice/70 hover:border-ice/50"}`}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setBuy(true)}
              disabled={!isPurchasable(look.shell)}
              className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-danger font-grotesk text-[12px] uppercase tracking-[0.18em] transition hover:bg-[#ff3b52] disabled:cursor-not-allowed disabled:bg-ice/10 disabled:text-ice/40"
            >
              <ShoppingBag size={16} aria-hidden /> {isPurchasable(look.shell) ? "Acquista" : "Non acquistabile (concept)"}
            </button>
            <Link href="/configuratore" className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full border border-ice/20 font-grotesk text-[12px] uppercase tracking-[0.18em] transition hover:border-ice/60">
              <SlidersHorizontal size={16} aria-hidden /> Personalizza
            </Link>
          </div>

          <section aria-labelledby="specs-title" className="mt-14">
            <h2 id="specs-title" className="eyebrow mb-4">
              Informazioni tecniche
            </h2>
            <dl className="divide-y divide-ice/10 border-y hairline">
              {PRODUCT_SPECS.map((s) => (
                <div key={s.id} className="grid gap-1 py-4 sm:grid-cols-[140px_1fr]">
                  <dt className="text-sm text-ice/50">{s.label}</dt>
                  <dd>
                    <p className="text-sm">{s.value}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-ice/40">
                      <span className={`rounded-full px-2 py-0.5 ${s.status === "riportato" ? "bg-cyan/10 text-cyan" : s.status === "variabile" ? "bg-violet/10 text-violet" : "bg-ice/10 text-ice/60"}`}>{STATUS_LABEL[s.status]}</span>
                      {s.note}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex gap-2 text-xs leading-relaxed text-ice/40">
              <Info size={14} className="mt-0.5 shrink-0" aria-hidden />
              Dati raccolti da inserzioni pubbliche di rivenditori del modello &quot;Knight&quot;; possono variare tra versioni. Verifica sempre la scheda tecnica del venditore.
            </p>
            <details className="mt-4 text-xs text-ice/50">
              <summary className="cursor-pointer font-grotesk uppercase tracking-[0.14em]">Fonti consultate</summary>
              <ul className="mt-3 space-y-2">
                {RESEARCH_SOURCES.map((r) => (
                  <li key={r.url}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 underline-offset-4 hover:text-ice hover:underline">
                      {r.label} <ExternalLink size={11} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </section>
        </div>
      </div>

      {/* Gallery */}
      <section aria-labelledby="gallery-title" className="gutter border-t hairline py-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 id="gallery-title" className="display text-5xl md:text-7xl">
            Galleria
          </h2>
          <Link href="/lookbook" className="font-grotesk text-[12px] uppercase tracking-[0.16em] text-ice/60 hover:text-ice">
            Lookbook →
          </Link>
        </div>
        <div className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
          {GALLERY.map((img, i) => (
            <figure key={img.src} className={`relative shrink-0 snap-start overflow-hidden rounded-2xl bg-black ${i === 5 || i === 6 ? "w-[85vw] md:col-span-2 md:w-auto" : "w-[70vw] md:w-auto"} ${i === 5 || i === 6 ? "aspect-[16/9]" : "aspect-square"}`}>
              <Image src={img.src} alt={img.alt} fill sizes="(max-width: 768px) 85vw, 25vw" className="object-cover transition duration-700 hover:scale-[1.03]" />
            </figure>
          ))}
        </div>
        <p className="mt-4 text-xs text-ice/40">Render CGI originali generati dal modello 3D del sito.</p>
      </section>

      <AnimatePresence>
        {buy && (
          <motion.div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setBuy(false)}>
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="buy-title"
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl border hairline bg-carbon p-7"
            >
              <button type="button" onClick={() => setBuy(false)} aria-label="Chiudi" className="absolute right-4 top-4 text-ice/50 hover:text-ice" autoFocus>
                <X size={18} />
              </button>
              <span className="rounded-full bg-violet/15 px-3 py-1 font-grotesk text-[10px] uppercase tracking-[0.2em] text-violet">Simulazione</span>
              <h2 id="buy-title" className="display mt-4 text-4xl">
                Acquisto simulato
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ice/65">
                Questo è un prototipo: non esistono checkout, pagamenti o ordini reali. Nessun dato viene inviato e nessun prodotto verrà spedito.
              </p>
              <dl className="mt-5 divide-y divide-ice/10 rounded-xl border hairline text-sm">
                <div className="flex justify-between px-4 py-3">
                  <dt className="text-ice/50">Prodotto</dt>
                  <dd>{PRODUCT.name}</dd>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <dt className="text-ice/50">Scocca</dt>
                  <dd>{variant.name}</dd>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <dt className="text-ice/50">Prezzo</dt>
                  <dd>{formatPrice(PRODUCT.price)}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs text-ice/40">Espressioni e colori LED si impostano dall&apos;app dello zaino dopo l&apos;acquisto: non fanno parte dell&apos;ordine.</p>
              <button type="button" onClick={() => setBuy(false)} className="mt-6 h-12 w-full rounded-full bg-ice font-grotesk text-[12px] uppercase tracking-[0.18em] text-obsidian">
                Ho capito
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
