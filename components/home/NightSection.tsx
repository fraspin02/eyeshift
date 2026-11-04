"use client";

import Image from "next/image";
import { IMAGES } from "@/lib/data/editorial";
import { RevealLines, FadeUp } from "@/components/ui/RevealText";

/** SCENE 06 — layered parallax: city plate, rider plate, copy (driven by GSAP in ScrollExperience). */
export function NightSection() {
  return (
    <section id="s-night" aria-labelledby="night-title" className="pointer-events-auto relative z-[2] h-[150vh] overflow-hidden bg-obsidian">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="night-bg absolute inset-[-8%] will-change-transform">
          <Image src={IMAGES.nightBg.src} alt={IMAGES.nightBg.alt} fill sizes="100vw" className="object-cover" />
        </div>
        <div className="night-fg absolute inset-[-4%] will-change-transform">
          <Image src={IMAGES.nightFg.src} alt={IMAGES.nightFg.alt} fill sizes="100vw" className="object-cover object-[60%_50%]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/70" />
        <div className="night-copy gutter absolute inset-x-0 bottom-0 pb-14 md:pb-20">
          <p className="eyebrow mb-4">06 — Night mode</p>
          <RevealLines as="h2" lines={["Own the", "night."]} className="display text-[18vw] md:text-[11vw] xl:text-[180px]" />
          <FadeUp delay={0.2}>
            <p className="mt-4 max-w-[30ch] text-ice/70 md:text-lg">Un design impossibile da confondere.</p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
