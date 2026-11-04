import type { ReactNode } from "react";
import { RevealLines, FadeUp } from "./RevealText";

export function PageHero({ eyebrow, lines, intro, children }: { eyebrow: string; lines: ReactNode[]; intro?: ReactNode; children?: ReactNode }) {
  return (
    <header className="gutter relative pb-10 pt-32 md:pb-16 md:pt-44">
      <p className="eyebrow mb-5">{eyebrow}</p>
      <RevealLines as="h1" lines={lines} className="display text-[15vw] md:text-[8.5vw] xl:text-[140px]" />
      {intro && (
        <FadeUp delay={0.15}>
          <div className="mt-6 max-w-[56ch] text-ice/65 md:text-lg">{intro}</div>
        </FadeUp>
      )}
      {children}
    </header>
  );
}
