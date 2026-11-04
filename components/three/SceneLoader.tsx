"use client";

import { AnimatePresence, motion } from "motion/react";

export function SceneLoader({ visible, label = "Inizializzazione display" }: { visible: boolean; label?: string }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-6">
              {[0, 1].map((i) => (
                <span key={i} className="block h-2 w-10 -skew-x-[20deg] animate-pulse rounded-sm bg-danger/70 shadow-[0_0_16px_rgba(255,36,62,0.7)]" />
              ))}
            </div>
            <span className="eyebrow">{label}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
