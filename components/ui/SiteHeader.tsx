"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { NAV } from "@/lib/data/nav";
import { Logo } from "./Logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled && !open ? "bg-obsidian/70 backdrop-blur-xl border-b hairline" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="gutter flex h-16 items-center justify-between md:h-20">
        <Link href="/" aria-label="EYE//SHIFT — Home" className="text-lg md:text-xl">
          <Logo />
        </Link>
        <nav aria-label="Principale" className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`group relative font-grotesk text-[13px] uppercase tracking-[0.16em] transition-colors ${
                  active ? "text-ice" : "text-ice/60 hover:text-ice"
                }`}
                style={{ fontFamily: "var(--font-grotesk)" }}
              >
                {n.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-danger transition-all duration-500 ${active ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/configuratore"
            className="hidden rounded-full border border-ice/20 px-5 py-2.5 font-grotesk text-[12px] uppercase tracking-[0.18em] transition hover:border-danger hover:bg-danger sm:inline-flex"
            style={{ fontFamily: "var(--font-grotesk)" }}
          >
            Personalizza
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ice/15 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Chiudi menu" : "Apri menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-16 z-40 bg-obsidian/98 backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Mobile" className="gutter flex h-full flex-col justify-between pb-10 pt-8">
              <ul className="space-y-1">
                {[{ href: "/", label: "Home" }, ...NAV].map((n, i) => (
                  <motion.li
                    key={n.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link href={n.href} className="display block py-1 text-[13vw] leading-none text-ice">
                      {n.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <p className="eyebrow">Demo web — nessun ordine reale</p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
