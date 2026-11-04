"use client";

import { EYE_PRESETS, LED_BY_ID, type EyePresetId, type LedColorId } from "@/lib/data/eyes";
import { EyeThumb } from "@/components/ui/EyeThumb";

interface Props {
  value: EyePresetId;
  led?: LedColorId;
  /** use each preset's own default colour in the thumbnails */
  presetColors?: boolean;
  onChange: (id: EyePresetId) => void;
  layout?: "grid" | "list" | "row";
  className?: string;
}

/** Grid / list of eye expressions with live LED thumbnails. */
export function EyePresetSelector({ value, led, presetColors, onChange, layout = "grid", className = "" }: Props) {
  const wrap =
    layout === "grid"
      ? "grid grid-cols-2 gap-2.5 sm:grid-cols-4"
      : layout === "row"
        ? "flex snap-x snap-mandatory gap-2.5 overflow-x-auto no-scrollbar"
        : "grid gap-1.5";
  return (
    <div role="radiogroup" aria-label="Espressione degli occhi" className={`${wrap} ${className}`}>
      {EYE_PRESETS.map((p) => {
        const active = p.id === value;
        const color = LED_BY_ID[presetColors || !led ? p.defaultColor : led].hex;
        return (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(p.id)}
            className={`group relative shrink-0 snap-start overflow-hidden rounded-xl border text-left transition duration-300 ${
              layout === "list" ? "flex items-center gap-4 px-3 py-2.5" : "flex flex-col gap-2 p-3"
            } ${layout === "row" ? "w-[132px]" : ""} ${
              active ? "border-ice/70 bg-ice/[0.07]" : "border-ice/10 bg-carbon/60 hover:border-ice/30 hover:bg-carbon"
            }`}
          >
            <span className={`flex items-center justify-center rounded-lg bg-black/70 ${layout === "list" ? "h-10 w-24 shrink-0" : "h-12 w-full"}`}>
              <EyeThumb preset={p.id} color={color} width={layout === "list" ? 192 : 220} height={layout === "list" ? 80 : 90} className="h-full w-full object-contain p-1.5" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="font-grotesk text-[13px] font-medium uppercase tracking-[0.12em] text-ice">{p.name}</span>
              <span className="text-[11px] text-ice/45">{p.mood}</span>
            </span>
            {active && <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-danger shadow-[0_0_8px_#FF243E]" />}
          </button>
        );
      })}
    </div>
  );
}
