"use client";

import { Html } from "@react-three/drei";
import type { Vector3 } from "three";

interface Props {
  position: Vector3;
  label: string;
  index: number;
  active: boolean;
  visible: boolean;
  onSelect: () => void;
}

/** Discreet 3D-anchored hotspot (DOM button projected onto the model). */
export function FeatureHotspot({ position, label, index, active, visible, onSelect }: Props) {
  return (
    <Html position={position} center zIndexRange={[20, 10]} style={{ pointerEvents: visible ? "auto" : "none" }}>
      <button
        type="button"
        onClick={onSelect}
        aria-label={`${label} — mostra dettagli`}
        aria-pressed={active}
        tabIndex={visible ? 0 : -1}
        className={`group relative flex h-9 w-9 items-center justify-center transition-all duration-500 ${visible ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
      >
        <span className={`absolute inset-0 rounded-full border ${active ? "border-danger" : "border-ice/50"} animate-ping opacity-30`} />
        <span
          className={`relative flex h-6 w-6 items-center justify-center rounded-full border font-grotesk text-[9px] backdrop-blur-md transition ${
            active ? "border-danger bg-danger text-ice" : "border-ice/60 bg-obsidian/60 text-ice group-hover:border-cyan group-hover:text-cyan"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </button>
    </Html>
  );
}
