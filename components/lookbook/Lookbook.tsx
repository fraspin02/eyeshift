"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMAGES, eyeCloseup, variantImage, type EditorialImage } from "@/lib/data/editorial";
import { EYE_PRESETS } from "@/lib/data/eyes";
import { SHELL_VARIANTS } from "@/lib/data/variants";
import { RevealLines, FadeUp } from "@/components/ui/RevealText";

gsap.registerPlugin(ScrollTrigger);

function Shot({ img, className = "", sizes = "100vw", priority = false, caption }: { img: Pick<EditorialImage, "src" | "alt">; className?: string; sizes?: string; priority?: boolean; caption?: string }) {
  return (
    <figure className={`group relative overflow-hidden bg-black ${className}`}>
      <div className="lb-parallax absolute inset-[-8%_0]">
        <Image src={img.src} alt={img.alt} fill sizes={sizes} priority={priority} className="object-cover transition duration-[1.4s] ease-out group-hover:scale-[1.03]" />
      </div>
      {caption && <figcaption className="absolute bottom-3 left-4 font-grotesk text-[10px] uppercase tracking-[0.2em] text-ice/70">{caption}</figcaption>}
    </figure>
  );
}

function Chapter({ n, title, text, id }: { n: string; title: string; text: string; id: string }) {
  return (
    <div className="gutter grid gap-6 py-16 md:grid-cols-[1fr_1.4fr] md:items-end md:py-24" id={id}>
      <div>
        <p className="eyebrow mb-3">Capitolo {n}</p>
        <RevealLines as="h2" lines={[title]} className="display text-[14vw] md:text-[7vw] xl:text-[112px]" />
      </div>
      <FadeUp>
        <p className="max-w-[44ch] text-ice/60 md:justify-self-end md:text-lg">{text}</p>
      </FadeUp>
    </div>
  );
}

export function Lookbook() {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".lb-parallax").forEach((el) => {
        gsap.fromTo(el, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>(".lb-reveal").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(12% 0% 12% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%", end: "top 40%", scrub: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <nav aria-label="Capitoli" className="gutter no-scrollbar sticky top-16 z-20 flex gap-2 overflow-x-auto border-y hairline bg-obsidian/85 py-3 backdrop-blur md:top-20">
        {[
          ["night-rider", "Night Rider"],
          ["urban-identity", "Urban Identity"],
          ["studio-collection", "Studio Collection"],
          ["cyber-details", "Cyber Details"],
          ["color-stories", "Color Stories"],
        ].map(([id, l]) => (
          <a key={id} href={`#${id}`} className="shrink-0 rounded-full border border-ice/15 px-4 py-2 font-grotesk text-[11px] uppercase tracking-[0.16em] text-ice/70 transition hover:border-ice/50 hover:text-ice">
            {l}
          </a>
        ))}
      </nav>

      {/* 01 NIGHT RIDER */}
      <Chapter id="night-rider" n="01" title="Night Rider" text="Asfalto bagnato, luci rosse e cyan. Lo sguardo dello zaino è l'unica cosa che resta impressa." />
      <Shot img={IMAGES.nightFull} className="lb-reveal aspect-[4/5] w-full md:aspect-[21/9]" priority />
      <div className="gutter mt-4 grid gap-4 md:mt-6 md:grid-cols-[1fr_2fr] md:gap-6">
        <Shot img={IMAGES.nightVertical} className="aspect-[9/16] rounded-2xl" sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="flex flex-col justify-end gap-6 md:p-10">
          <p className="display text-[11vw] text-ice/90 md:text-[5vw]">“Change the way they see you.”</p>
          <p className="max-w-[40ch] text-sm text-ice/50">Render CGI originale. La silhouette, la scocca e gli occhi sono quelli del modello 3D del sito.</p>
        </div>
      </div>

      {/* 02 URBAN IDENTITY */}
      <Chapter id="urban-identity" n="02" title="Urban Identity" text="Cemento, luce fredda e un outfit essenziale. Lo zaino diventa la firma dell'outfit." />
      <div className="gutter grid gap-4 md:grid-cols-12 md:gap-6">
        <Shot img={IMAGES.editorial4x5} className="aspect-[4/5] rounded-2xl md:col-span-7" sizes="(max-width: 768px) 100vw, 58vw" />
        <div className="grid gap-4 md:col-span-5 md:gap-6">
          <Shot img={IMAGES.editorial9x16} className="aspect-[4/5] rounded-2xl md:aspect-[9/14]" sizes="(max-width: 768px) 100vw, 40vw" />
        </div>
        <Shot img={IMAGES.studioWorn} className="aspect-square rounded-2xl md:col-span-5 md:col-start-2" sizes="(max-width: 768px) 100vw, 40vw" />
        <div className="flex items-end md:col-span-5 md:p-8">
          <p className="display text-[10vw] md:text-[4vw]">Non passare inosservato.</p>
        </div>
      </div>

      {/* 03 STUDIO COLLECTION */}
      <Chapter id="studio-collection" n="03" title="Studio Collection" text="Frontale, tre quarti, profilo, retro. La geometria della scocca, senza distrazioni." />
      <div className="gutter grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {[IMAGES.studioFront, IMAGES.studioThreeQuarter, IMAGES.studioProfile, IMAGES.studioBack].map((img, i) => (
          <Shot key={img.src} img={img} className={`aspect-square rounded-2xl ${i % 2 ? "md:translate-y-16" : ""}`} sizes="(max-width: 768px) 50vw, 25vw" />
        ))}
      </div>
      <Shot img={IMAGES.exploded} className="lb-reveal mt-20 aspect-[4/3] w-full md:mt-32 md:aspect-[21/9]" caption="Vista esplosa — scocca, display, corpo, spallacci" />

      {/* 04 CYBER DETAILS */}
      <Chapter id="cyber-details" n="04" title="Cyber Details" text="Ogni LED è un punto. Ogni espressione è un'identità. Otto sguardi concept, una sola matrice." />
      <Shot img={IMAGES.macro} className="lb-reveal aspect-[4/3] w-full md:aspect-[21/9]" caption="Macro — superficie sfaccettata e display" />
      <div className="gutter mt-4 grid grid-cols-2 gap-3 md:mt-6 md:grid-cols-4 md:gap-4">
        {EYE_PRESETS.map((p) => (
          <Shot key={p.id} img={{ src: eyeCloseup(p.id), alt: `Primo piano degli occhi LED con espressione ${p.name}` }} className="aspect-square rounded-xl" sizes="(max-width: 768px) 50vw, 25vw" caption={`${p.name} · ${p.mood}`} />
        ))}
      </div>
      <div className="gutter mt-4 grid gap-4 md:mt-6 md:grid-cols-2 md:gap-6">
        <Shot img={IMAGES.studioEyes} className="aspect-square rounded-2xl" sizes="(max-width: 768px) 100vw, 50vw" />
        <Shot img={IMAGES.studioFinish} className="aspect-square rounded-2xl md:translate-y-20" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>

      {/* 05 COLOR STORIES */}
      <Chapter id="color-stories" n="05" title="Color Stories" text="Stessa energia, pelle diversa. Shadow Black è la versione confermata; le altre finiture sono concept." />
      <Shot img={IMAGES.colorCollection} className="lb-reveal aspect-[4/3] w-full md:aspect-[21/9]" caption="Da sinistra: Shadow Black, Carbon Fiber, Titanium Grey, Arctic White, Crimson Red, Electric Blue" />
      <div className="no-scrollbar mt-4 flex snap-x gap-3 overflow-x-auto px-[var(--gutter)] pb-24 md:mt-6 md:gap-4">
        {SHELL_VARIANTS.map((v) => (
          <Shot key={v.id} img={{ src: variantImage(v.id, "on"), alt: `${v.name}${v.availability === "concept" ? " (concept)" : ""}` }} className="aspect-[4/5] w-[62vw] shrink-0 snap-start rounded-2xl md:w-[22vw]" sizes="(max-width: 768px) 62vw, 22vw" caption={`${v.name}${v.availability === "concept" ? " · concept" : ""}`} />
        ))}
      </div>
    </div>
  );
}
