"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import type { Tier } from "@/lib/hooks/useDeviceTier";

/** Selective-looking bloom: only HDR (toneMapped=false) LED materials exceed the threshold. */
export function Effects({ tier, bloom = 1.1, vignette = true }: { tier: Tier; bloom?: number; vignette?: boolean }) {
  if (tier === "low") return null;
  return (
    <EffectComposer multisampling={tier === "high" ? 4 : 0}>
      <Bloom intensity={bloom} luminanceThreshold={1} luminanceSmoothing={0.2} mipmapBlur radius={0.7} />
      {vignette ? <Vignette eskil={false} offset={0.25} darkness={0.75} /> : <></>}
    </EffectComposer>
  );
}
