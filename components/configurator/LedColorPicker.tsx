"use client";

import { LED_COLORS, type LedColorId } from "@/lib/data/eyes";

/** LED light colours — rendered as glowing emitters, distinct from the shell swatches. */
export function LedColorPicker({ value, onChange, className = "" }: { value: LedColorId; onChange: (id: LedColorId) => void; className?: string }) {
  return (
    <div role="radiogroup" aria-label="Colore dei LED" className={`flex flex-wrap gap-2.5 ${className}`}>
      {LED_COLORS.map((c) => {
        const active = c.id === value;
        return (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(c.id)}
            className={`flex items-center gap-2.5 rounded-full border py-2 pl-2.5 pr-4 transition ${
              active ? "border-ice/70 bg-ice/[0.07]" : "border-ice/10 hover:border-ice/35"
            }`}
          >
            <span
              className="h-4 w-4 rounded-full"
              style={{ background: c.hex, boxShadow: `0 0 ${active ? 16 : 8}px ${c.hex}, inset 0 0 4px rgba(255,255,255,0.8)` }}
            />
            <span className="font-grotesk text-[12px] uppercase tracking-[0.12em] text-ice/85">{c.name}</span>
          </button>
        );
      })}
    </div>
  );
}
