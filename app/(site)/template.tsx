"use client";

import { motion, useReducedMotion } from "motion/react";

/** Smooth page transitions. Opacity only: transforms would break the fixed 3D stage. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}
