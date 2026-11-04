"use client";

import { SHELL_VARIANTS } from "@/lib/data/variants";
import { VariantCard } from "@/components/ui/VariantCard";
import { RevealLines } from "@/components/ui/RevealText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { EyePresetId } from "@/lib/data/eyes";

const PREVIEW: EyePresetId[] = ["predator", "cyber", "phantom", "ghost", "rage", "neon"];

/** SCENE 07 — editorial horizontal gallery with native swipe / scroll-snap (no scroll hijacking). */
export function CollectionSection() {
  return (
    <section id="s-collection" aria-labelledby="collection-title" className="pointer-events-auto relative z-[2] flex min-h-[100svh] flex-col justify-center bg-obsidian py-24">
      <div className="gutter mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-4">07 — The collection</p>
          <RevealLines as="h2" lines={["One bag.", "Infinite attitudes."]} className="display text-[12vw] md:text-[6vw] xl:text-[96px]" />
        </div>
        <div className="max-w-[40ch] text-sm text-ice/55 md:text-right">
          <p>Una sola geometria, sei pelli. Shadow Black è la versione confermata; le altre finiture sono concept dimostrativi e non sono acquistabili.</p>
          <div className="mt-5">
            <MagneticButton href="/collezione" variant="ghost">
              Vai al catalogo
            </MagneticButton>
          </div>
        </div>
      </div>
      <div
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[var(--gutter)] pb-6 md:gap-6"
        tabIndex={0}
        aria-label="Galleria varianti, scorri orizzontalmente"
      >
        {SHELL_VARIANTS.map((v, i) => (
          <VariantCard key={v.id} variant={v} preset={PREVIEW[i]} href={`/prodotto/knight?variante=${v.id}`} className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[25vw]" />
        ))}
        <div className="w-px shrink-0" aria-hidden />
      </div>
    </section>
  );
}
