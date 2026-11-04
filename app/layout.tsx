import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "@fontsource/anton";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "EYE//SHIFT — Your bag. Your eyes.", template: "%s — EYE//SHIFT" },
  description:
    "EYE//SHIFT Knight: lo zaino a scocca rigida con occhi LED programmabili. Esperienza 3D, configuratore in tempo reale, collezione e lookbook.",
};

export const viewport: Viewport = {
  themeColor: "#08090D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
