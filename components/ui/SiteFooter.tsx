import Link from "next/link";
import { NAV } from "@/lib/data/nav";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t hairline bg-obsidian">
      <div className="gutter grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-24">
        <div>
          <Logo className="text-3xl md:text-4xl" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ice/55">
            Prototipo di esperienza e-commerce. I configuratori e le interfacce mostrate sono dimostrazioni visive: non comunicano con
            alcun dispositivo e non generano ordini o pagamenti.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow mb-5">Esplora</p>
          <ul className="space-y-3 text-sm">
            {[{ href: "/", label: "Home" }, ...NAV].map((n) => (
              <li key={n.href}>
                <Link className="text-ice/70 transition hover:text-ice" href={n.href}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow mb-5">Trasparenza</p>
          <ul className="space-y-3 text-sm text-ice/70">
            <li>Le colorazioni diverse dal nero sono concept.</li>
            <li>Prezzo e disponibilità: da definire.</li>
            <li>Immagini: render CGI originali.</li>
          </ul>
        </div>
      </div>
      <div className="gutter flex flex-col justify-between gap-3 border-t hairline py-6 text-xs text-ice/40 md:flex-row">
        <span>© {new Date().getFullYear()} EYE//SHIFT — nome provvisorio del brand</span>
        <span>YOUR BAG. YOUR EYES. YOUR IDENTITY.</span>
      </div>
    </footer>
  );
}
