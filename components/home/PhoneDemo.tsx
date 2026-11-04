"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { EYE_PRESETS, LED_COLORS, LED_BY_ID, type EyePresetId, type LedColorId } from "@/lib/data/eyes";
import { EyeThumb } from "@/components/ui/EyeThumb";
import { useLook } from "@/lib/store";

const SEQUENCE: { preset: EyePresetId; led: LedColorId; target: "preset" | "color" }[] = [
  { preset: "cyber", led: "red", target: "preset" },
  { preset: "cyber", led: "cyan", target: "color" },
  { preset: "heart", led: "cyan", target: "preset" },
  { preset: "heart", led: "pink", target: "color" },
  { preset: "phantom", led: "pink", target: "preset" },
  { preset: "phantom", led: "violet", target: "color" },
  { preset: "predator", led: "violet", target: "preset" },
  { preset: "predator", led: "red", target: "color" },
];

const PHONE_PRESETS = EYE_PRESETS.filter((p) => ["predator", "cyber", "phantom", "ghost", "heart", "glitch"].includes(p.id));

/**
 * Original, illustrative control UI. It only drives the web model on this page —
 * it is not the official app and does not connect to any device.
 */
export function PhoneDemo({ active }: { active: boolean }) {
  const setOverride = useLook((s) => s.setOverride);
  const [preset, setPreset] = useState<EyePresetId>("predator");
  const [led, setLed] = useState<LedColorId>("red");
  const [step, setStep] = useState(-1);
  const [auto, setAuto] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      setOverride(null);
      setStep(-1);
      return;
    }
    setOverride({ preset, led, animation: "blink" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (!active || !auto) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let i = 0;
    timer.current = setInterval(() => {
      const s = SEQUENCE[i % SEQUENCE.length];
      setStep(i % SEQUENCE.length);
      setPreset(s.preset);
      setLed(s.led);
      setOverride({ preset: s.preset, led: s.led, animation: "blink" });
      i++;
    }, 1900);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [active, auto, setOverride]);

  const pick = (p: EyePresetId | null, c: LedColorId | null) => {
    setAuto(false);
    setStep(-1);
    const np = p ?? preset;
    const nc = c ?? led;
    setPreset(np);
    setLed(nc);
    setOverride({ preset: np, led: nc, animation: "blink" });
  };

  const tapTarget = step >= 0 ? SEQUENCE[step] : null;

  return (
    <figure className="relative w-[230px] md:w-[280px]" aria-label="Dimostrazione visiva di un'interfaccia di controllo LED">
      <div className="relative rounded-[42px] border border-ice/15 bg-[#0b0c10] p-2.5 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.04)]">
        <div className="relative overflow-hidden rounded-[34px] bg-obsidian">
          <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-black" aria-hidden />
          <div className="px-4 pb-4 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-grotesk text-[11px] font-semibold uppercase tracking-[0.18em]">LED Control</span>
              <span className="rounded-full bg-violet/20 px-2 py-0.5 font-grotesk text-[9px] uppercase tracking-[0.16em] text-violet">Demo</span>
            </div>
            <div className="mt-3 flex h-[74px] items-center justify-center rounded-2xl border hairline bg-black md:h-[88px]">
              <EyeThumb preset={preset} color={LED_BY_ID[led].hex} width={240} height={90} className="h-full w-full p-2" />
            </div>
            <p className="mt-4 font-grotesk text-[10px] uppercase tracking-[0.18em] text-ice/45">Espressioni</p>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {PHONE_PRESETS.map((p) => {
                const on = p.id === preset;
                const tapped = tapTarget?.target === "preset" && tapTarget.preset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => pick(p.id, null)}
                    aria-pressed={on}
                    className={`relative rounded-lg border py-2 font-grotesk text-[10px] uppercase tracking-[0.08em] transition ${
                      on ? "border-ice/60 bg-ice/10 text-ice" : "border-ice/10 text-ice/60"
                    }`}
                  >
                    {p.name}
                    {tapped && <TapRing />}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 font-grotesk text-[10px] uppercase tracking-[0.18em] text-ice/45">Colore LED</p>
            <div className="mt-2 flex justify-between">
              {LED_COLORS.map((c) => {
                const on = c.id === led;
                const tapped = tapTarget?.target === "color" && tapTarget.led === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => pick(null, c.id)}
                    aria-label={`Colore ${c.name}`}
                    aria-pressed={on}
                    className={`relative h-6 w-6 rounded-full transition ${on ? "ring-2 ring-ice ring-offset-2 ring-offset-obsidian" : ""}`}
                    style={{ background: c.hex, boxShadow: `0 0 10px ${c.hex}` }}
                  >
                    {tapped && <TapRing />}
                  </button>
                );
              })}
            </div>
            <p className="mt-5 text-center text-[9px] leading-snug text-ice/40">Dimostrazione visiva · non è l&apos;app ufficiale e non si collega allo zaino</p>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">Interfaccia dimostrativa originale: selezionando un&apos;espressione o un colore cambia lo sguardo del modello 3D.</figcaption>
    </figure>
  );
}

function TapRing() {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-0 -m-1 rounded-full border-2 border-ice/80"
      initial={{ scale: 1.6, opacity: 0 }}
      animate={{ scale: 1, opacity: [0, 1, 0] }}
      transition={{ duration: 0.9 }}
    />
  );
}
