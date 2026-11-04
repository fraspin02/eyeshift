import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { StoreHydrator } from "@/components/ui/StoreHydrator";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-ice focus:px-4 focus:py-2 focus:text-obsidian">
        Vai al contenuto
      </a>
      <StoreHydrator />
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
