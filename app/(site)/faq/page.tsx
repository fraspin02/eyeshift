import type { Metadata } from "next";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { FaqVisual } from "@/components/faq/FaqVisual";
import { RevealLines } from "@/components/ui/RevealText";

export const metadata: Metadata = { title: "FAQ", description: "Domande frequenti su EYE//SHIFT Knight: app, LED, alimentazione, colori." };

export default function FaqPage() {
  return (
    <main id="main" className="bg-carbon">
      <div className="gutter grid gap-10 pb-24 pt-32 md:pt-44 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-5">FAQ</p>
          <RevealLines as="h1" lines={["Domande.", "Risposte."]} className="display text-[15vw] md:text-[8vw] lg:text-[6vw] xl:text-[104px]" />
          <p className="mt-6 max-w-[40ch] text-ice/60">Quando un dato non è verificato per la versione in vendita, lo diciamo chiaramente.</p>
          <div className="mt-8 aspect-square w-full max-w-[380px] overflow-hidden rounded-3xl border hairline bg-obsidian/60">
            <FaqVisual />
          </div>
        </div>
        <FaqAccordion />
      </div>
    </main>
  );
}
