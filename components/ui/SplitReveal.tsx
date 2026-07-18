"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { createElement, type ElementType } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

const parent = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const child: Variants = {
  hidden: { y: "115%" },
  show: { y: 0, transition: { duration: 0.72, ease: EASE } },
};

/**
 * Per-character mask-up reveal for headings (T2). Words never break mid-word;
 * each letter rises from behind a clip on scroll into view. Screen readers get
 * the plain string via aria-label, and reduced-motion renders static text.
 */
export default function SplitReveal({
  text,
  className,
  as = "span",
  delay = 0,
  stagger = 0.018,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return createElement(as, { className }, text);
  }

  const words = text.split(" ");

  return (
    <motion.span
      className={className}
      style={{ display: "inline-block" }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
      variants={parent(stagger, delay)}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span
          key={wi}
          aria-hidden
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: "0.08em", marginBottom: "-0.08em" }}
        >
          {[...word].map((ch, ci) => (
            <motion.span key={ci} className="inline-block" variants={child}>
              {ch}
            </motion.span>
          ))}
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}
