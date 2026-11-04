import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { HowItWorks } from "@/components/how/HowItWorks";
import { MagneticButton } from "@/components/ui/MagneticButton";

export const metadata: Metadata = { title: "Come funziona", description: "Scocca, display LED e app: come funziona lo zaino EYE//SHIFT Knight." };

export default function HowPage() {
  return (
    <main id="main" className="bg-obsidian">
      <PageHero eyebrow="Come funziona" lines={["Three steps.", "One identity."]} intro="Dalla scocca allo sguardo: ecco come lo zaino prende vita. Riportiamo solo funzionalità documentate dai rivenditori del modello." />
      <HowItWorks />
      <section className="gutter flex flex-col items-start gap-6 border-t hairline py-24 md:flex-row md:items-center md:justify-between">
        <h2 className="display text-5xl md:text-7xl">Prova ora in 3D.</h2>
        <MagneticButton href="/configuratore" size="lg">
          Apri il configuratore
        </MagneticButton>
      </section>
    </main>
  );
}
