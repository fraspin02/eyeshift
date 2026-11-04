import type { Availability } from "@/lib/data/variants";

export function AvailabilityBadge({ availability, className = "" }: { availability: Availability; className?: string }) {
  const concept = availability === "concept";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-grotesk text-[10px] uppercase tracking-[0.2em] ${
        concept ? "border-violet/40 text-violet bg-violet/10" : "border-cyan/40 text-cyan bg-cyan/10"
      } ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${concept ? "bg-violet" : "bg-cyan"}`} />
      {concept ? "Concept · non acquistabile" : "Versione di riferimento"}
    </span>
  );
}
