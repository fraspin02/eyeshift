import type { Metadata } from "next";
import { BackpackConfigurator } from "@/components/configurator/BackpackConfigurator";

export const metadata: Metadata = {
  title: "Configuratore 3D",
  description: "Personalizza in tempo reale scocca, espressione degli occhi, colore LED e animazione del tuo EYE//SHIFT Knight.",
};

export default function ConfiguratorPage() {
  return (
    <main id="main">
      <BackpackConfigurator />
    </main>
  );
}
