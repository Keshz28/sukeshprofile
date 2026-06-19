"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

// Scroll-triggered reveal matching the Portfolio.dc "data-reveal" feel:
// fades up from 48px with a long expressive ease, once, when it enters view.
// Reduced-motion users get the final state instantly (Framer Motion + the
// global CSS reset both honour the preference).
const EASE = [0.16, 1, 0.3, 1] as const;

type Props = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
};

export default function Reveal({
  children,
  delay = 0,
  y = 48,
  ...rest
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 1, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
