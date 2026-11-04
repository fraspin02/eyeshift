"use client";

import dynamic from "next/dynamic";
import { DEFAULT_LOOK } from "@/lib/store";

const ProductViewer = dynamic(() => import("@/components/three/ProductViewer").then((m) => m.ProductViewer), { ssr: false });

/** Small decorative 3D model (slow auto-rotation). */
export function FaqVisual() {
  return <ProductViewer className="h-full w-full" gesture="swipe" autoRotate floor={false} look={{ ...DEFAULT_LOOK, preset: "ghost", led: "cyan", animation: "blink" }} view="three-quarter" mood="graphite" label="Modello 3D decorativo" />;
}
