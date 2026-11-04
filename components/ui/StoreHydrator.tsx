"use client";

import { useEffect } from "react";
import { useLook } from "@/lib/store";

/** Rehydrates the persisted look after mount (avoids SSR mismatches). */
export function StoreHydrator() {
  useEffect(() => {
    useLook.persist.rehydrate();
  }, []);
  return null;
}
