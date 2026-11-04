import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Lookbook } from "@/components/lookbook/Lookbook";

export const metadata: Metadata = { title: "Lookbook", description: "Night Rider, Urban Identity, Studio Collection, Cyber Details, Color Stories." };

export default function LookbookPage() {
  return (
    <main id="main" className="bg-obsidian">
      <PageHero eyebrow="Lookbook — Campaign 01" lines={["Not just", "a backpack."]} intro="Una campagna di render CGI originali, generati dallo stesso modello 3D che puoi ruotare e personalizzare sul sito." />
      <Lookbook />
    </main>
  );
}
