import type { Metadata } from "next";
import { StudioClient } from "./StudioClient";

export const metadata: Metadata = { title: "Render studio", robots: { index: false, follow: false } };

/** Internal route used to render the original campaign assets from the 3D model. */
export default function StudioPage() {
  return <StudioClient />;
}
