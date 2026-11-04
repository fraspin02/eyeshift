"use client";

import { useEffect, useState } from "react";

export type Tier = "low" | "mid" | "high";

export function detectTier(): Tier {
  if (typeof window === "undefined") return "mid";
  const forced = new URLSearchParams(window.location.search).get("quality");
  if (forced === "low" || forced === "mid" || forced === "high") return forced;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 4;
  if (nav.connection?.saveData || cores <= 2 || mem <= 2) return "low";
  if (coarse || small || cores <= 4) return "mid";
  return "high";
}

export function useDeviceTier(): Tier {
  const [tier, setTier] = useState<Tier>("mid");
  useEffect(() => setTier(detectTier()), []);
  return tier;
}

export function useReducedMotionPref(): boolean {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(m.matches);
    const on = () => setR(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return r;
}

export function useIsMobile(bp = 768): boolean {
  const [m, setM] = useState(false);
  useEffect(() => {
    const q = window.matchMedia(`(max-width: ${bp - 1}px)`);
    setM(q.matches);
    const on = () => setM(q.matches);
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, [bp]);
  return m;
}

export function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
