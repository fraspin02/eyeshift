"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { EyeAnimationId, EyePresetId, LedColorId } from "@/lib/data/eyes";
import type { ShellId } from "@/lib/data/variants";

/** The single shared configuration that feeds every 3D viewer on the site. */
export interface Look {
  shell: ShellId;
  preset: EyePresetId;
  led: LedColorId;
  animation: EyeAnimationId;
  playing: boolean;
}

export const DEFAULT_LOOK: Look = {
  shell: "shadow-black",
  preset: "predator",
  led: "red",
  animation: "blink",
  playing: true,
};

export interface SavedLook extends Look {
  id: string;
  savedAt: number;
}

interface ConfigState extends Look {
  /** temporary values used by scroll-driven demos (never persisted, never overwrite the user's look) */
  override: Partial<Look> | null;
  saved: SavedLook[];
  set: (patch: Partial<Look>) => void;
  setOverride: (o: Partial<Look> | null) => void;
  reset: () => void;
  save: () => SavedLook;
  removeSaved: (id: string) => void;
  load: (id: string) => void;
}

export const useLook = create<ConfigState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_LOOK,
      override: null,
      saved: [],
      set: (patch) => set({ ...patch, override: null }),
      setOverride: (o) => set({ override: o }),
      reset: () => set({ ...DEFAULT_LOOK, override: null }),
      save: () => {
        const s = get();
        const item: SavedLook = {
          shell: s.shell,
          preset: s.preset,
          led: s.led,
          animation: s.animation,
          playing: s.playing,
          id: Math.random().toString(36).slice(2, 9),
          savedAt: Date.now(),
        };
        set({ saved: [item, ...s.saved].slice(0, 6) });
        return item;
      },
      removeSaved: (id) => set({ saved: get().saved.filter((x) => x.id !== id) }),
      load: (id) => {
        const it = get().saved.find((x) => x.id === id);
        if (it) set({ shell: it.shell, preset: it.preset, led: it.led, animation: it.animation, playing: true, override: null });
      },
    }),
    {
      name: "eyeshift-look",
      storage: createJSONStorage(() => {
        try {
          return localStorage;
        } catch {
          return undefined as unknown as Storage;
        }
      }),
      partialize: (s) => ({
        shell: s.shell,
        preset: s.preset,
        led: s.led,
        animation: s.animation,
        playing: s.playing,
        saved: s.saved,
      }),
      skipHydration: true,
    }
  )
);

/** Resolved look = user look + scene override. */
export function useResolvedLook(): Look {
  const shell = useLook((s) => s.override?.shell ?? s.shell);
  const preset = useLook((s) => s.override?.preset ?? s.preset);
  const led = useLook((s) => s.override?.led ?? s.led);
  const animation = useLook((s) => s.override?.animation ?? s.animation);
  const playing = useLook((s) => s.override?.playing ?? s.playing);
  return { shell, preset, led, animation, playing };
}
