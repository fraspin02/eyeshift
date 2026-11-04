"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Line-by-line mask reveal for editorial headlines. */
export function RevealLines({ lines, className = "", delay = 0, as = "h2" }: { lines: ReactNode[]; className?: string; delay?: number; as?: "h1" | "h2" | "h3" | "p" }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.04em]">
          <motion.span
            className="block"
            initial={reduce ? false : { y: "105%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.1, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function FadeUp({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
