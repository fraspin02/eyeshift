"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { EyePresetSelector } from "@/components/configurator/EyePresetSelector";
import { ShellColorSelector } from "@/components/configurator/ShellColorSelector";
import { AvailabilityBadge } from "@/components/ui/ConceptBadge";
import { RevealLines, FadeUp } from "@/components/ui/RevealText";
import { useLook, useResolvedLook } from "@/lib/store";
import { SHELL_BY_ID } from "@/lib/data/variants";
import { PRESET_BY_ID } from "@/lib/data/eyes";
import { FEATURES } from "@/lib/data/features";
import { pointer, useHomeUI } from "@/lib/home/rig";
import { PhoneDemo } from "./PhoneDemo";

/* ── SCENE 02 — CHANGE YOUR EYES ─────────────────────────────── */
export function ChangeEyesSection({ onUserPick }: { onUserPick: () => void }) {
  const look = useResolvedLook();
  const set = useLook((s) => s.set);
  return (
    <section id="s-eyes" aria-labelledby="eyes-title" className="pointer-events-none relative h-[260vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between gutter pb-6 pt-24 md:justify-center md:pb-0 md:pt-20">
        <div className="max-w-[560px]">
          <p className="eyebrow mb-4">02 — Change your eyes</p>
          <RevealLines as="h2" lines={["Un solo zaino.", "Mille espressioni."]} className="display text-[12vw] md:text-[5.6vw] xl:text-[88px]" />
          <FadeUp delay={0.2}>
            <p className="mt-4 max-w-[36ch] text-ice/65 md:mt-6 md:text-lg">Cambia sguardo. Cambia atmosfera. Esprimi il tuo stile.</p>
          </FadeUp>
        </div>
        <div className="pointer-events-auto mt-6 md:mt-10 md:max-w-[560px]">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="eyebrow">Espressione attiva</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={look.preset}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="font-grotesk text-sm uppercase tracking-[0.2em] text-ice"
              >
                {PRESET_BY_ID[look.preset].name}
              </motion.span>
            </AnimatePresence>
          </div>
          <EyePresetSelector
            value={look.preset}
            presetColors
            layout="row"
            className="md:!grid md:grid-cols-4 md:overflow-visible"
            onChange={(id) => {
              onUserPick();
              set({ preset: id, led: PRESET_BY_ID[id].defaultColor, animation: id === "glitch" ? "glitch" : "blink" });
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ── SCENE 03 — CHOOSE YOUR COLOR ────────────────────────────── */
export function ChooseColorSection() {
  const shell = useLook((s) => s.shell);
  const set = useLook((s) => s.set);
  const v = SHELL_BY_ID[shell];
  return (
    <section id="s-color" aria-labelledby="color-title" className="pointer-events-none relative h-[220vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between gutter pb-6 pt-24 md:items-end md:justify-center md:pb-0">
        <div className="max-w-[520px] md:text-right">
          <p className="eyebrow mb-4">03 — Choose your color</p>
          <RevealLines as="h2" lines={["Same energy.", "Different skin."]} className="display text-[12vw] md:text-[5.6vw] xl:text-[88px]" />
          <FadeUp delay={0.2}>
            <p className="mt-4 text-ice/65 md:mt-6 md:text-lg">Trova la finitura che rappresenta il tuo stile.</p>
          </FadeUp>
        </div>
        <div className="pointer-events-auto mt-8 w-full max-w-[520px] rounded-2xl border hairline bg-obsidian/55 p-5 backdrop-blur-xl md:mt-10">
          <div className="flex items-start justify-between gap-4">
            <div className="min-h-[64px]">
              <AnimatePresence mode="wait">
                <motion.div key={v.id} initial={{ opacity: 0, y: 12, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(6px)" }} transition={{ duration: 0.45 }}>
                  <p className="display text-3xl md:text-4xl">{v.name}</p>
                  <p className="mt-1 text-xs text-ice/50">{v.finishLabel}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <AvailabilityBadge availability={v.availability} />
          </div>
          <ShellColorSelector
            className="mt-5"
            value={shell}
            onChange={(id) => {
              set({ shell: id });
              pointer.dragVel += 0.025; // small camera move on change
            }}
          />
          <p className="mt-5 border-t hairline pt-4 text-[12px] leading-relaxed text-ice/45">
            Il colore della scocca è indipendente dal colore dei LED. Solo Shadow Black corrisponde alla versione confermata: le altre finiture sono concept.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── SCENE 04 — BUILT TO STAND OUT ───────────────────────────── */
export function DetailsSection() {
  const active = useHomeUI((s) => s.activeHotspot);
  const setActive = useHomeUI((s) => s.setActive);
  const f = FEATURES.find((x) => x.id === active);
  return (
    <section id="s-details" aria-labelledby="details-title" className="pointer-events-none relative h-[280vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between gutter pb-6 pt-24 md:pb-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="eyebrow mb-4">04 — Built to stand out</p>
            <RevealLines as="h2" lines={["Designed", "to be seen."]} className="display text-[12vw] md:text-[5.6vw] xl:text-[88px]" />
          </div>
          <p className="max-w-[30ch] text-sm text-ice/55 md:pt-10 md:text-right">Tocca i punti sul modello per scoprire i dettagli. Le informazioni riportano solo caratteristiche dichiarate.</p>
        </div>
        <div className="pointer-events-auto">
          <AnimatePresence mode="wait">
            {f ? (
              <motion.div
                key={f.id}
                role="dialog"
                aria-labelledby={`feat-${f.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
                className="relative max-w-[440px] rounded-2xl border hairline bg-obsidian/75 p-6 backdrop-blur-xl"
              >
                <button type="button" onClick={() => setActive(null)} aria-label="Chiudi scheda" className="absolute right-4 top-4 text-ice/50 hover:text-ice">
                  <X size={16} />
                </button>
                <p className="eyebrow mb-2">Dettaglio {String(FEATURES.indexOf(f) + 1).padStart(2, "0")}</p>
                <h3 id={`feat-${f.id}`} className="font-grotesk text-xl font-medium">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ice/70">{f.body}</p>
                {f.note && <p className="mt-3 border-t hairline pt-3 text-xs text-ice/45">{f.note}</p>}
              </motion.div>
            ) : (
              <motion.ul key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-wrap gap-2" aria-label="Dettagli del prodotto">
                {FEATURES.map((x, i) => (
                  <li key={x.id}>
                    <button
                      type="button"
                      onClick={() => setActive(x.id)}
                      className="rounded-full border border-ice/15 bg-obsidian/50 px-4 py-2 font-grotesk text-[11px] uppercase tracking-[0.16em] text-ice/75 backdrop-blur transition hover:border-ice/50 hover:text-ice"
                    >
                      <span className="mr-2 text-danger">{String(i + 1).padStart(2, "0")}</span>
                      {x.title}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ── SCENE 05 — CONTROL THE LOOK ─────────────────────────────── */
export function ControlSection({ active }: { active: boolean }) {
  return (
    <section id="s-control" aria-labelledby="control-title" className="pointer-events-none relative h-[230vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between gutter pb-4 pt-20 md:flex-row md:items-center md:justify-start md:gap-16 md:pb-6">
        <div className="md:w-[44%]">
          <p className="eyebrow mb-3">05 — Control the look</p>
          <RevealLines as="h2" lines={["Il controllo", "è nelle tue mani."]} className="display text-[9vw] md:text-[4.8vw] xl:text-[76px]" />
          <p className="mt-4 hidden max-w-[42ch] text-ice/65 md:block">
            Il modello reale si gestisce dall&apos;app per smartphone via Bluetooth: espressioni, colori, testi e animazioni. Qui accanto, una dimostrazione visiva di come
            cambia lo sguardo.
          </p>
        </div>
        <div className="pointer-events-auto flex origin-bottom scale-[0.74] justify-center md:w-[30%] md:scale-100 md:justify-start">
          <PhoneDemo active={active} />
        </div>
      </div>
    </section>
  );
}

/* ── SCENE 08 — FINAL CALL ───────────────────────────────────── */
export function FinalSection() {
  return (
    <section id="s-final" aria-labelledby="final-title" className="pointer-events-none relative h-[220vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-end gutter pb-12 pt-24 text-center md:pb-16">
        <RevealLines as="h2" lines={["Don't just carry it.", <span key="o" className="text-cyan">Own it.</span>]} className="display text-[12vw] md:text-[7.5vw] xl:text-[120px]" />
        <FadeUp delay={0.2}>
          <p className="mt-4 text-ice/65 md:text-lg">Il tuo stile. Il tuo colore. Il tuo sguardo.</p>
        </FadeUp>
        <FadeUp delay={0.3} className="pointer-events-auto mt-8">
          <FinalCta />
        </FadeUp>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <MagneticButton href="/configuratore" size="lg" className="!bg-ice !text-obsidian hover:!bg-cyan">
      Crea il tuo EYE//SHIFT <ArrowRight size={18} aria-hidden className="transition group-hover:translate-x-1" />
    </MagneticButton>
  );
}
