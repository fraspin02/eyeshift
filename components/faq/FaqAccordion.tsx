"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { FAQ } from "@/lib/data/faq";

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <ul className="divide-y divide-ice/10 border-y hairline">
      {FAQ.map((f, i) => {
        const isOpen = open === i;
        return (
          <li key={f.q}>
            <h3>
              <button
                type="button"
                id={`${base}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-a${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className={`font-grotesk text-lg transition md:text-xl ${isOpen ? "text-ice" : "text-ice/75 group-hover:text-ice"}`}>{f.q}</span>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition duration-300 ${isOpen ? "rotate-45 border-danger bg-danger" : "border-ice/20"}`}>
                  <Plus size={16} aria-hidden />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${base}-a${i}`}
                  role="region"
                  aria-labelledby={`${base}-q${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[62ch] pb-7 leading-relaxed text-ice/65">{f.a}</p>
                  {!f.verified && <p className="-mt-4 pb-7 text-xs text-violet">Informazione da verificare</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
