import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";

export const metadata: Metadata = {
  title: "Collezione",
  description: "EYE//SHIFT Knight: la versione di riferimento Shadow Black e le finiture concept.",
};

export default function CatalogPage() {
  return (
    <main id="main" className="bg-obsidian">
      <PageHero
        eyebrow="Collezione"
        lines={["Choose", "your look."]}
        intro={
          <>
            Un solo zaino, una sola geometria. <strong className="font-medium text-ice">Shadow Black</strong> corrisponde alla versione confermata del modello Knight. Le altre
            finiture sono concept dimostrativi: puoi esplorarle in 3D, ma non sono acquistabili.
          </>
        }
      />
      <CatalogGrid />
    </main>
  );
}
