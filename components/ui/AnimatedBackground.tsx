"use client";

import { motion } from "framer-motion";

/**
 * Fixed, full-page ambient background:
 * - subtle animated grid
 * - three floating gradient "aurora" blobs
 * Sits behind all content (z -10) and ignores pointer events.
 */
export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-ink" />

      {/* grid */}
      <div className="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      {/* aurora blobs */}
      <motion.div
        className="absolute -left-32 top-[-10%] h-[42rem] w-[42rem] rounded-full bg-blue-brand/30 blur-[140px]"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-10%] top-[20%] h-[38rem] w-[38rem] rounded-full bg-azure-brand/25 blur-[150px]"
        animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-15%] left-[30%] h-[34rem] w-[34rem] rounded-full bg-red-brand/20 blur-[150px]"
        animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,6,10,0.85)_100%)]" />
    </div>
  );
}
