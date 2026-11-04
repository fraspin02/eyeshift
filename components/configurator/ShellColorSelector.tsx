"use client";

import { SHELL_VARIANTS, type ShellId } from "@/lib/data/variants";

/** Circular swatches for the hard shell. Concept variants are marked and never purchasable. */
export function ShellColorSelector({
  value,
  onChange,
  size = "md",
  showNames = false,
  className = "",
}: {
  value: ShellId;
  onChange: (id: ShellId) => void;
  size?: "md" | "lg";
  showNames?: boolean;
  className?: string;
}) {
  const dim = size === "lg" ? "h-14 w-14" : "h-11 w-11";
  return (
    <div role="radiogroup" aria-label="Colore della scocca" className={`flex flex-wrap gap-3 ${className}`}>
      {SHELL_VARIANTS.map((v) => {
        const active = v.id === value;
        return (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${v.name} — ${v.finishLabel}${v.availability === "concept" ? " (concept, non acquistabile)" : ""}`}
            onClick={() => onChange(v.id)}
            className={`group flex flex-col items-center gap-2 ${showNames ? "w-[72px]" : ""}`}
          >
            <span
              className={`relative flex ${dim} items-center justify-center rounded-full transition duration-300 ${
                active ? "ring-2 ring-ice ring-offset-4 ring-offset-obsidian" : "ring-1 ring-ice/15 group-hover:ring-ice/50"
              }`}
            >
              <span
                className="absolute inset-[3px] rounded-full"
                style={{
                  background: v.material.carbon
                    ? `repeating-linear-gradient(45deg, #2a2d34 0 4px, #15171b 4px 8px)`
                    : `radial-gradient(circle at 32% 28%, ${v.swatchAccent ?? "rgba(255,255,255,0.35)"} 0%, ${v.swatch} 45%, #000 120%)`,
                }}
              />
              {v.availability === "concept" && (
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-obsidian bg-violet" aria-hidden />
              )}
            </span>
            {showNames && (
              <span className={`text-center font-grotesk text-[10px] uppercase leading-tight tracking-[0.12em] ${active ? "text-ice" : "text-ice/45"}`}>
                {v.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
