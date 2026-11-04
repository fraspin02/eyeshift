"use client";

import { ArrowDown, Move3d } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function HeroSection() {
  return (
    <section id="s-hero" aria-labelledby="hero-title" className="pointer-events-none relative h-[100svh] min-h-[620px]">
      <div className="gutter relative flex h-full flex-col justify-end pb-8 pt-24 md:pb-12">
        <p className="hero-reveal eyebrow absolute left-[var(--gutter)] top-24 md:top-28">
          <span className="text-danger">●</span>&nbsp; Knight — zaino a scocca rigida con occhi LED
        </p>

        <div className="grid items-end gap-6 md:grid-cols-[1.2fr_1fr] md:gap-10">
          <h1 id="hero-title" className="display text-[17vw] text-ice md:text-[9.4vw] xl:text-[150px]">
            <span className="block overflow-hidden">
              <span className="hero-line block">Your bag.</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line block">
                Your <span className="text-danger">eyes.</span>
              </span>
            </span>
          </h1>
          <div className="hero-reveal md:justify-self-end md:pb-3 md:text-right">
            <p className="max-w-[34ch] text-[15px] leading-relaxed text-ice/70 md:ml-auto md:text-base">
              Non è uno zaino qualsiasi. È il tuo modo di farti notare.
            </p>
            <div className="pointer-events-auto mt-6 flex flex-col gap-3 sm:flex-row md:justify-end">
              <MagneticButton href="/configuratore">Personalizza il tuo</MagneticButton>
              <MagneticButton href="#s-collection" variant="ghost">
                Scopri la collezione
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="hero-reveal mt-8 flex items-center justify-between border-t hairline pt-4 text-ice/45">
          <span className="flex items-center gap-2 font-grotesk text-[11px] uppercase tracking-[0.22em]">
            <Move3d size={14} aria-hidden /> <span className="hidden sm:inline">Trascina per ruotare</span>
            <span className="sm:hidden">Scorri di lato per ruotare</span>
          </span>
          <span className="flex items-center gap-2 font-grotesk text-[11px] uppercase tracking-[0.22em]">
            Scorri <ArrowDown size={14} aria-hidden className="animate-bounce" />
          </span>
        </div>
      </div>
    </section>
  );
}
