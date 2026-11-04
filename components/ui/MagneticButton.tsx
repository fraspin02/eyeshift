"use client";

import Link from "next/link";
import { useRef, type ReactNode, type MouseEvent } from "react";

type Variant = "primary" | "ghost" | "light";

const styles: Record<Variant, string> = {
  primary: "bg-danger text-ice hover:bg-[#ff3b52] shadow-[0_0_40px_-10px_rgba(255,36,62,0.8)]",
  ghost: "border border-ice/25 text-ice hover:border-ice/60 hover:bg-ice/5",
  light: "bg-ice text-obsidian hover:bg-white",
};

interface Props {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  size?: "md" | "lg";
  type?: "button" | "submit";
  ariaLabel?: string;
  disabled?: boolean;
}

/** Discreet magnetic CTA: follows the pointer by a few pixels on fine pointers only. */
export function MagneticButton({ href, onClick, children, variant = "primary", className = "", size = "md", type = "button", ariaLabel, disabled }: Props) {
  const ref = useRef<HTMLElement>(null);
  const move = (e: MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.28;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  const cls = `group relative inline-flex items-center justify-center gap-3 rounded-full font-grotesk uppercase tracking-[0.18em] transition-[transform,background-color,border-color,color] duration-300 ease-out disabled:opacity-40 disabled:pointer-events-none ${
    size === "lg" ? "h-16 px-10 text-[13px] md:h-[72px] md:px-12 md:text-sm" : "h-12 px-7 text-[12px]"
  } ${styles[variant]} ${className}`;
  if (href) {
    return (
      <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={cls} onMouseMove={move} onMouseLeave={leave} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      className={cls}
      onMouseMove={move}
      onMouseLeave={leave}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
