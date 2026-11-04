"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ShellVariant } from "@/lib/data/variants";
import { variantImage } from "@/lib/data/editorial";
import { AvailabilityBadge } from "./ConceptBadge";
import { EyeThumb } from "./EyeThumb";
import { LED_BY_ID, PRESET_BY_ID, type EyePresetId } from "@/lib/data/eyes";

/** Premium product card: lift + contained tilt on hover, LED eyes light up (off → on render crossfade). */
export function VariantCard({
  variant,
  preset = "predator",
  href,
  onQuickView,
  className = "",
  sizes = "(max-width: 768px) 80vw, 30vw",
}: {
  variant: ShellVariant;
  preset?: EyePresetId;
  href: string;
  onQuickView?: () => void;
  className?: string;
  sizes?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(900px) translateY(-8px) rotateY(${x * 6}deg) rotateX(${-y * 5}deg)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  const p = PRESET_BY_ID[preset];
  return (
    <article
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`group relative flex flex-col overflow-hidden rounded-[22px] border hairline bg-carbon/70 transition-[transform,border-color,box-shadow] duration-500 ease-out hover:border-ice/25 hover:shadow-[0_30px_80px_-30px_rgba(0,229,255,0.25)] motion-reduce:!transform-none ${className}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-black">
        <Image src={variantImage(variant.id, "off")} alt={`${variant.name}, occhi LED spenti`} fill sizes={sizes} className="object-cover transition duration-700 group-hover:scale-[1.03]" />
        <Image
          src={variantImage(variant.id, "on")}
          alt={`${variant.name}, occhi LED accesi`}
          fill
          sizes={sizes}
          className="object-cover opacity-0 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100 group-focus-within:opacity-100"
        />
        <div className="absolute left-4 top-4">
          <AvailabilityBadge availability={variant.availability} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="display text-3xl">{variant.name}</h3>
            <p className="mt-1 text-xs text-ice/50">Finitura: {variant.finishLabel}</p>
          </div>
          <span className="flex h-9 w-20 items-center justify-center rounded-md bg-black" title={`Anteprima LED: ${p.name}`}>
            <EyeThumb preset={preset} color={LED_BY_ID[p.defaultColor].hex} width={160} height={60} className="h-full w-full p-1" />
          </span>
        </div>
        <div className="mt-auto flex items-center gap-2">
          <Link
            href={href}
            className="inline-flex flex-1 items-center justify-between rounded-full border border-ice/15 px-5 py-3 font-grotesk text-[12px] uppercase tracking-[0.16em] transition group-hover:border-ice/50 group-hover:bg-ice group-hover:text-obsidian"
          >
            Scopri <ArrowUpRight size={16} aria-hidden />
          </Link>
          {onQuickView && (
            <button type="button" onClick={onQuickView} className="rounded-full border border-ice/15 px-4 py-3 font-grotesk text-[12px] uppercase tracking-[0.16em] text-ice/70 transition hover:border-ice/50 hover:text-ice">
              Quick view
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
