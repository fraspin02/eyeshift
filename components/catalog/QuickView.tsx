"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ArrowUpRight } from "lucide-react";
import type { ShellVariant } from "@/lib/data/variants";
import { variantImage } from "@/lib/data/editorial";
import { PRODUCT, formatPrice } from "@/lib/data/product";
import { AvailabilityBadge } from "@/components/ui/ConceptBadge";

export function QuickView({ variant, onClose }: { variant: ShellVariant | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!variant) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [variant, onClose]);
  return (
    <AnimatePresence>
      {variant && (
        <motion.div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="qv-title"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-t-3xl border hairline bg-carbon md:grid-cols-2 md:rounded-3xl"
          >
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Chiudi anteprima" className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-obsidian/70 backdrop-blur">
              <X size={18} />
            </button>
            <div className="relative aspect-[4/5] bg-black">
              <Image src={variantImage(variant.id, "on")} alt={`${PRODUCT.name} ${variant.name}`} fill sizes="(max-width: 768px) 100vw, 450px" className="object-cover" />
            </div>
            <div className="flex flex-col p-6 md:p-8">
              <AvailabilityBadge availability={variant.availability} className="self-start" />
              <h2 id="qv-title" className="display mt-4 text-5xl">
                {variant.name}
              </h2>
              <p className="mt-1 text-sm text-ice/50">{variant.finishLabel}</p>
              <p className="mt-5 text-ice/70">{variant.description}</p>
              <p className="mt-6 font-grotesk text-lg">{variant.availability === "concept" ? "Non acquistabile" : formatPrice(PRODUCT.price)}</p>
              <div className="mt-auto flex flex-col gap-2 pt-8">
                <Link href={`/prodotto/knight?variante=${variant.id}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ice font-grotesk text-[12px] uppercase tracking-[0.16em] text-obsidian">
                  Scheda prodotto <ArrowUpRight size={16} aria-hidden />
                </Link>
                <Link href="/configuratore" className="inline-flex h-12 items-center justify-center rounded-full border border-ice/20 font-grotesk text-[12px] uppercase tracking-[0.16em]">
                  Personalizza in 3D
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
