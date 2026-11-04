"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Smartphone, Library, PenTool, BatteryCharging } from "lucide-react";
import { useLook, useResolvedLook } from "@/lib/store";
import { SHELL_VARIANTS } from "@/lib/data/variants";
import { EYE_PRESETS, LED_BY_ID, PRESET_BY_ID } from "@/lib/data/eyes";
import { PRODUCT } from "@/lib/data/product";
import { EyeThumb } from "@/components/ui/EyeThumb";
import { RevealLines, FadeUp } from "@/components/ui/RevealText";
import type { ViewPreset } from "@/components/three/ProductViewer";

const ProductViewer = dynamic(() => import("@/components/three/ProductViewer").then((m) => m.ProductViewer), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { n: "01", title: "Scegli il tuo stile", text: "Scegli il look che ti rappresenta.", body: "La scocca rigida è il volto dello zaino. La versione di riferimento è nera; sul sito puoi esplorare anche finiture concept.", view: "three-quarter" as ViewPreset },
  { n: "02", title: "Cambia espressione", text: "Un nuovo sguardo, quando vuoi.", body: "I due display LED a forma di occhio mostrano espressioni, animazioni e contenuti. Cambiarli richiede un tocco.", view: "eyes" as ViewPreset },
  { n: "03", title: "Personalizza tramite app", text: "Il tuo zaino, la tua creatività.", body: "Lo smartphone comunica con lo zaino via Bluetooth tramite l'app indicata dal venditore. Qui sotto trovi cosa è documentato.", view: "front" as ViewPreset },
];

const DOCUMENTED = [
  { icon: Smartphone, title: "Controllo via app", text: `Connessione Bluetooth con l'app per smartphone (le inserzioni citano ${PRODUCT.referenceApp}; il nome può variare tra rivenditori).` },
  { icon: Library, title: "Libreria effetti", text: "Espressioni e animazioni predefinite selezionabili dall'app." },
  { icon: PenTool, title: "Contenuti personalizzabili", text: "Testi, immagini e GIF caricabili sul display, secondo le inserzioni." },
  { icon: BatteryCharging, title: "Alimentazione", text: "Serve una power bank USB esterna collegata al cavo interno. Le inserzioni consultate indicano che non è inclusa: verifica con il venditore." },
];

export function HowItWorks() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const look = useResolvedLook();
  const setOverride = useLook((s) => s.setOverride);
  const [tick, setTick] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".how-step").forEach((el, i) => {
        ScrollTrigger.create({ trigger: el, start: "top 55%", end: "bottom 55%", onToggle: (self) => self.isActive && setActive(i) });
      });
    }, root);
    return () => {
      ctx.revert();
      setOverride(null);
    };
  }, [setOverride]);

  // the scene follows the story: finishes cycle in step 1, expressions in step 2
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setTick((x) => x + 1), 1800);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (active === 0) setOverride({ shell: SHELL_VARIANTS[tick % SHELL_VARIANTS.length].id, preset: "predator", led: "red", animation: "blink" });
    else if (active === 1) {
      const p = EYE_PRESETS[tick % EYE_PRESETS.length];
      setOverride({ shell: "shadow-black", preset: p.id, led: p.defaultColor, animation: p.id === "glitch" ? "glitch" : "static" });
    } else setOverride({ shell: "shadow-black", preset: "cyber", led: "cyan", animation: "scan" });
  }, [active, tick, setOverride]);

  return (
    <div ref={root} className="relative md:grid md:grid-cols-2">
      <div className="sticky top-0 z-10 h-[52svh] bg-obsidian md:z-0 md:h-[100svh] md:bg-transparent">
        <ProductViewer className="h-full w-full pt-16" gesture="swipe" look={look} view={STEPS[active].view} mood="graphite" label="Modello 3D che accompagna la spiegazione" />
        {active === 2 && (
          <div className="pointer-events-none absolute bottom-6 right-6 hidden w-40 rounded-[28px] border border-ice/15 bg-obsidian/80 p-3 backdrop-blur md:block" aria-hidden>
            <p className="font-grotesk text-[9px] uppercase tracking-[0.16em] text-ice/50">Demo</p>
            <div className="mt-2 flex h-14 items-center justify-center rounded-xl bg-black">
              <EyeThumb preset={look.preset} color={LED_BY_ID[look.led].hex} width={160} height={60} className="h-full p-1" />
            </div>
            <p className="mt-2 text-center text-[9px] text-ice/40">{PRESET_BY_ID[look.preset].name}</p>
          </div>
        )}
      </div>
      <div className="relative">
        {STEPS.map((s, i) => (
          <section key={s.n} className="how-step gutter flex min-h-[80svh] flex-col justify-center py-16 md:min-h-[100svh]" aria-labelledby={`how-${i}`}>
            <p className={`display text-[90px] leading-none transition-colors duration-500 md:text-[140px] ${active === i ? "text-danger" : "text-ice/10"}`}>{s.n}</p>
            <RevealLines as="h2" lines={[s.title]} className="display mt-2 text-5xl md:text-7xl" />
            <FadeUp delay={0.1}>
              <p className="mt-4 font-grotesk text-xl text-ice/85">{s.text}</p>
              <p className="mt-3 max-w-[46ch] text-ice/55">{s.body}</p>
            </FadeUp>
            {i === 2 && (
              <ul className="mt-10 grid gap-3">
                {DOCUMENTED.map((d) => (
                  <li key={d.title} className="flex gap-4 rounded-2xl border hairline bg-carbon/60 p-5">
                    <d.icon size={20} className="mt-0.5 shrink-0 text-cyan" aria-hidden />
                    <div>
                      <p className="font-grotesk font-medium">{d.title}</p>
                      <p className="mt-1 text-sm text-ice/55">{d.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
