"use client";

import { useEffect, useRef } from "react";
import type { EyePresetId } from "@/lib/data/eyes";
import { drawEyeThumbnail } from "@/lib/eyes/engine";

/** Mini LED preview of a preset, drawn with the same engine as the 3D displays. */
export function EyeThumb({
  preset,
  color,
  both = true,
  className = "",
  width = 240,
  height = 90,
}: {
  preset: EyePresetId;
  color: string;
  both?: boolean;
  className?: string;
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) drawEyeThumbnail(ref.current, preset, color, { both });
  }, [preset, color, both]);
  return <canvas ref={ref} width={width} height={height} className={className} aria-hidden="true" style={{ filter: `drop-shadow(0 0 6px ${color}88)` }} />;
}
