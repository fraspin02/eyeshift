"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Download, RotateCcw, Save, Trash2, Info } from "lucide-react";
import { useLook, useResolvedLook } from "@/lib/store";
import { SHELL_BY_ID } from "@/lib/data/variants";
import { ANIM_BY_ID, LED_BY_ID, PRESET_BY_ID } from "@/lib/data/eyes";
import { ShellColorSelector } from "./ShellColorSelector";
import { EyePresetSelector } from "./EyePresetSelector";
import { LedColorPicker } from "./LedColorPicker";
import { AnimationSelector } from "./AnimationSelector";
import { AvailabilityBadge } from "@/components/ui/ConceptBadge";
import { EyeThumb } from "@/components/ui/EyeThumb";
import { useIsMobile } from "@/lib/hooks/useDeviceTier";
import type { ViewPreset } from "@/components/three/ProductViewer";

const ProductViewer = dynamic(() => import("@/components/three/ProductViewer").then((m) => m.ProductViewer), { ssr: false });
const MobileProductViewer = dynamic(() => import("@/components/three/ProductViewer").then((m) => m.MobileProductViewer), { ssr: false });

const STEPS = [
  { id: "shell", n: "01", label: "Scocca", title: "Scegli la scocca" },
  { id: "eyes", n: "02", label: "Occhi", title: "Scegli gli occhi" },
  { id: "led", n: "03", label: "Colore LED", title: "Colore della luce" },
  { id: "anim", n: "04", label: "Animazione", title: "Animazione" },
  { id: "final", n: "05", label: "Creazione", title: "Your creation" },
] as const;

const STEP_VIEW: Record<(typeof STEPS)[number]["id"], ViewPreset> = {
  shell: "three-quarter",
  eyes: "eyes",
  led: "eyes",
  anim: "front",
  final: "three-quarter",
};

export function BackpackConfigurator() {
  const look = useResolvedLook();
  const set = useLook((s) => s.set);
  const reset = useLook((s) => s.reset);
  const save = useLook((s) => s.save);
  const saved = useLook((s) => s.saved);
  const load = useLook((s) => s.load);
  const removeSaved = useLook((s) => s.removeSaved);
  const [step, setStep] = useState(0);
  const [nudge, setNudge] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const current = STEPS[step];
  const shell = SHELL_BY_ID[look.shell];

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  // allow deep links like /configuratore?step=eyes
  useEffect(() => {
    const s = new URLSearchParams(location.search).get("step");
    const i = STEPS.findIndex((x) => x.id === s);
    if (i >= 0) setStep(i);
  }, []);

  const download = async () => {
    const { captureViewer } = await import("@/components/three/ProductViewer");
    const url = captureViewer();
    if (!url) return setToast("Screenshot non disponibile");
    const a = document.createElement("a");
    a.href = url;
    a.download = `eyeshift-${look.shell}-${look.preset}-${look.led}.png`;
    a.click();
    setToast("Screenshot scaricato");
  };

  const viewerProps = {
    look,
    view: STEP_VIEW[current.id],
    nudge,
    mood: current.id === "final" ? ("studio" as const) : ("graphite" as const),
    autoRotate: current.id === "final",
    preserve: true,
    label: `Anteprima 3D: ${shell.name}, occhi ${PRESET_BY_ID[look.preset].name}, LED ${LED_BY_ID[look.led].name}, animazione ${ANIM_BY_ID[look.animation].name}`,
  };

  return (
    <div className="relative flex min-h-[100svh] flex-col bg-obsidian pt-16 md:pt-20 lg:h-[100svh] lg:flex-row lg:overflow-hidden">
      {/* Viewer — top on mobile, right on desktop */}
      <div className="sticky top-16 z-10 h-[46svh] shrink-0 border-b hairline bg-gradient-to-b from-carbon to-obsidian md:top-20 lg:order-2 lg:h-auto lg:flex-1 lg:border-b-0">
        {isMobile ? <MobileProductViewer className="h-full w-full" {...viewerProps} /> : <ProductViewer className="h-full w-full" gesture="orbit" {...viewerProps} />}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-6">
          <div>
            <p className="eyebrow">Configuratore 3D · demo</p>
            <AnimatePresence mode="wait">
              <motion.p key={shell.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="display mt-2 text-2xl md:text-4xl">
                {shell.name}
              </motion.p>
            </AnimatePresence>
          </div>
          <AvailabilityBadge availability={shell.availability} />
        </div>
        <p className="pointer-events-none absolute bottom-3 left-4 text-[11px] text-ice/40 md:bottom-6 md:left-6">
          {isMobile ? "Scorri di lato sul modello per ruotarlo" : "Trascina per ruotare · rotella per lo zoom"}
        </p>
      </div>

      {/* Control panel */}
      <section aria-labelledby="cfg-title" className="relative flex flex-1 flex-col lg:order-1 lg:w-[460px] lg:flex-none lg:overflow-y-auto lg:border-r hairline">
        <nav aria-label="Passaggi" className="sticky top-[calc(46svh+4rem)] z-10 border-b hairline bg-obsidian/90 backdrop-blur md:top-[calc(46svh+5rem)] lg:top-0">
          <ol className="no-scrollbar flex overflow-x-auto px-3">
            {STEPS.map((s, i) => (
              <li key={s.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  aria-current={i === step ? "step" : undefined}
                  className={`relative px-3 py-4 font-grotesk text-[11px] uppercase tracking-[0.16em] transition ${i === step ? "text-ice" : "text-ice/40 hover:text-ice/70"}`}
                >
                  <span className="mr-1.5 text-danger">{s.n}</span>
                  {s.label}
                  {i === step && <motion.span layoutId="step-underline" className="absolute inset-x-3 bottom-0 h-px bg-ice" />}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex-1 px-5 py-7 md:px-8">
          <h1 id="cfg-title" className="sr-only">
            Configuratore EYE//SHIFT
          </h1>
          <AnimatePresence mode="wait">
            <motion.div key={current.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
              <p className="eyebrow">Step {current.n}</p>
              <h2 className="display mt-2 text-5xl">{current.title}</h2>

              {current.id === "shell" && (
                <div className="mt-6">
                  <ShellColorSelector
                    value={look.shell}
                    size="lg"
                    showNames
                    onChange={(id) => {
                      set({ shell: id });
                      setNudge((n) => n + 1);
                    }}
                  />
                  <div className="mt-6 rounded-xl border hairline bg-carbon/50 p-4">
                    <p className="font-grotesk text-sm">{shell.finishLabel}</p>
                    <p className="mt-1 text-sm text-ice/55">{shell.description}</p>
                    {shell.availability === "concept" && (
                      <p className="mt-3 flex gap-2 text-xs text-violet">
                        <Info size={14} className="mt-0.5 shrink-0" aria-hidden /> Colorazione concept: visualizzabile ma non acquistabile.
                      </p>
                    )}
                  </div>
                  <p className="mt-4 text-xs text-ice/40">La scocca cambia materiale in tempo reale. Le aree LED restano invariate.</p>
                </div>
              )}

              {current.id === "eyes" && (
                <div className="mt-6">
                  <EyePresetSelector value={look.preset} led={look.led} onChange={(id) => set({ preset: id })} />
                  <p className="mt-4 text-xs text-ice/40">Le espressioni sono preset dimostrativi creati per questo sito.</p>
                </div>
              )}

              {current.id === "led" && (
                <div className="mt-6">
                  <LedColorPicker value={look.led} onChange={(id) => set({ led: id })} />
                  <div className="mt-6 flex h-20 items-center justify-center rounded-xl border hairline bg-black">
                    <EyeThumb preset={look.preset} color={LED_BY_ID[look.led].hex} width={300} height={100} className="h-full p-2" />
                  </div>
                  <p className="mt-4 text-xs text-ice/40">Il colore modifica solo le parti luminose. {PRESET_BY_ID[look.preset].multicolor ? "Neon usa il colore scelto come base per il suo gradiente." : ""}</p>
                </div>
              )}

              {current.id === "anim" && (
                <div className="mt-6">
                  <AnimationSelector value={look.animation} playing={look.playing} onChange={(id) => set({ animation: id, playing: true })} onTogglePlay={() => set({ playing: !look.playing })} />
                </div>
              )}

              {current.id === "final" && (
                <div className="mt-6">
                  <dl className="divide-y divide-ice/10 rounded-xl border hairline">
                    {[
                      ["Scocca", `${shell.name} · ${shell.finishLabel}`],
                      ["Espressione", PRESET_BY_ID[look.preset].name],
                      ["Colore LED", LED_BY_ID[look.led].name],
                      ["Animazione", `${ANIM_BY_ID[look.animation].name}${look.playing ? "" : " (in pausa)"}`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between px-4 py-3.5">
                        <dt className="eyebrow">{k}</dt>
                        <dd className="font-grotesk text-sm">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        save();
                        setToast("Look salvato su questo dispositivo");
                      }}
                      className="inline-flex h-12 items-center gap-2 rounded-full bg-danger px-6 font-grotesk text-[12px] uppercase tracking-[0.18em] transition hover:bg-[#ff3b52]"
                    >
                      <Save size={15} aria-hidden /> Salva il tuo look
                    </button>
                    <button type="button" onClick={download} className="inline-flex h-12 items-center gap-2 rounded-full border border-ice/20 px-5 font-grotesk text-[12px] uppercase tracking-[0.16em] transition hover:border-ice/60">
                      <Download size={15} aria-hidden /> Screenshot
                    </button>
                  </div>
                  {saved.length > 0 && (
                    <div className="mt-7">
                      <p className="eyebrow mb-3">Look salvati</p>
                      <ul className="grid gap-2">
                        {saved.map((s) => (
                          <li key={s.id} className="flex items-center gap-3 rounded-xl border hairline p-2.5">
                            <span className="flex h-9 w-20 items-center justify-center rounded-md bg-black">
                              <EyeThumb preset={s.preset} color={LED_BY_ID[s.led].hex} width={160} height={60} className="h-full w-full p-1" />
                            </span>
                            <button type="button" onClick={() => load(s.id)} className="flex-1 text-left text-sm">
                              <span className="block font-grotesk">{SHELL_BY_ID[s.shell].name}</span>
                              <span className="text-xs text-ice/45">
                                {PRESET_BY_ID[s.preset].name} · {LED_BY_ID[s.led].name} · {ANIM_BY_ID[s.animation].name}
                              </span>
                            </button>
                            <button type="button" onClick={() => removeSaved(s.id)} aria-label="Elimina look salvato" className="p-2 text-ice/40 hover:text-danger">
                              <Trash2 size={15} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="sticky bottom-0 border-t hairline bg-obsidian/95 px-5 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                reset();
                setStep(0);
                setToast("Configurazione ripristinata");
              }}
              className="inline-flex items-center gap-2 font-grotesk text-[11px] uppercase tracking-[0.16em] text-ice/50 transition hover:text-ice"
            >
              <RotateCcw size={14} aria-hidden /> Ripristina
            </button>
            <div className="flex gap-2">
              <button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)} aria-label="Passaggio precedente" className="flex h-11 w-11 items-center justify-center rounded-full border border-ice/15 transition hover:border-ice/50 disabled:opacity-30">
                <ArrowLeft size={16} />
              </button>
              {step < STEPS.length - 1 ? (
                <button type="button" onClick={() => setStep((s) => s + 1)} className="inline-flex h-11 items-center gap-2 rounded-full bg-ice px-5 font-grotesk text-[12px] uppercase tracking-[0.16em] text-obsidian transition hover:bg-white">
                  {STEPS[step + 1].label} <ArrowRight size={15} aria-hidden />
                </button>
              ) : null}
            </div>
          </div>
          <p className="mt-3 text-[10.5px] leading-snug text-ice/35">
            Configuratore dimostrativo: non trasferisce impostazioni all&apos;app ufficiale e non si collega via Bluetooth. Il look viene salvato solo in questo browser.
          </p>
        </div>
      </section>

      <AnimatePresence>
        {toast && (
          <motion.div role="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border hairline bg-carbon px-5 py-3 text-sm shadow-xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
