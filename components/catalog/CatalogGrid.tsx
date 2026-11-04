"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SHELL_VARIANTS, FINISH_LABEL, type FinishId, type ShellVariant, type Availability } from "@/lib/data/variants";
import { VariantCard } from "@/components/ui/VariantCard";
import { QuickView } from "./QuickView";
import type { EyePresetId } from "@/lib/data/eyes";

const PREVIEW: Record<string, EyePresetId> = {
  "shadow-black": "predator",
  "carbon-fiber": "cyber",
  "titanium-grey": "phantom",
  "arctic-white": "ghost",
  "crimson-red": "rage",
  "electric-blue": "neon",
};

type FinishFilter = FinishId | "tutte";
type AvailFilter = Availability | "tutte";

export function CatalogGrid() {
  const [finish, setFinish] = useState<FinishFilter>("tutte");
  const [avail, setAvail] = useState<AvailFilter>("tutte");
  const [qv, setQv] = useState<ShellVariant | null>(null);
  const list = useMemo(() => SHELL_VARIANTS.filter((v) => (finish === "tutte" || v.finish === finish) && (avail === "tutte" || v.availability === avail)), [finish, avail]);
  const finishes = Array.from(new Set(SHELL_VARIANTS.map((v) => v.finish)));

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 font-grotesk text-[11px] uppercase tracking-[0.16em] transition ${active ? "border-ice bg-ice text-obsidian" : "border-ice/15 text-ice/70 hover:border-ice/50"}`;

  return (
    <section aria-label="Catalogo" className="gutter pb-24">
      <div className="sticky top-16 z-20 -mx-[var(--gutter)] mb-8 border-y hairline bg-obsidian/85 px-[var(--gutter)] py-4 backdrop-blur-xl md:top-20">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label="Filtra per finitura" className="no-scrollbar flex gap-2 overflow-x-auto">
            <button type="button" aria-pressed={finish === "tutte"} className={chip(finish === "tutte")} onClick={() => setFinish("tutte")}>
              Tutte le finiture
            </button>
            {finishes.map((f) => (
              <button key={f} type="button" aria-pressed={finish === f} className={chip(finish === f)} onClick={() => setFinish(f)}>
                {FINISH_LABEL[f]}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Filtra per disponibilità" className="flex gap-2">
            {(["tutte", "disponibile", "concept"] as AvailFilter[]).map((a) => (
              <button key={a} type="button" aria-pressed={avail === a} className={chip(avail === a)} onClick={() => setAvail(a)}>
                {a === "tutte" ? "Tutte" : a === "disponibile" ? "Riferimento" : "Concept"}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="mb-6 text-sm text-ice/45" aria-live="polite">
        {list.length} {list.length === 1 ? "variante" : "varianti"} · un solo prodotto, EYE//SHIFT Knight
      </p>
      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((v) => (
            <motion.div key={v.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.35 }}>
              <VariantCard variant={v} preset={PREVIEW[v.id]} href={`/prodotto/knight?variante=${v.id}`} onQuickView={() => setQv(v)} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && <p className="py-20 text-center text-ice/50">Nessuna variante con questi filtri.</p>}
      <QuickView variant={qv} onClose={() => setQv(null)} />
    </section>
  );
}
