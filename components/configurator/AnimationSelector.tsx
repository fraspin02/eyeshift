"use client";

import { Pause, Play } from "lucide-react";
import { EYE_ANIMATIONS, type EyeAnimationId } from "@/lib/data/eyes";

export function AnimationSelector({
  value,
  playing,
  onChange,
  onTogglePlay,
  className = "",
}: {
  value: EyeAnimationId;
  playing: boolean;
  onChange: (id: EyeAnimationId) => void;
  onTogglePlay: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div role="radiogroup" aria-label="Animazione degli occhi" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {EYE_ANIMATIONS.map((a) => {
          const active = a.id === value;
          return (
            <button
              key={a.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(a.id)}
              className={`rounded-xl border px-3.5 py-3 text-left transition ${active ? "border-ice/70 bg-ice/[0.07]" : "border-ice/10 hover:border-ice/35"}`}
            >
              <span className="block font-grotesk text-[13px] uppercase tracking-[0.12em] text-ice">{a.name}</span>
              <span className="block text-[11px] text-ice/45">{a.description}</span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onTogglePlay}
        aria-pressed={!playing}
        className="mt-3 inline-flex items-center gap-2 rounded-full border border-ice/15 px-4 py-2.5 font-grotesk text-[12px] uppercase tracking-[0.16em] text-ice/80 transition hover:border-ice/50"
      >
        {playing ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}
        {playing ? "Pausa" : "Riproduci"}
      </button>
    </div>
  );
}
