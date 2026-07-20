"use client";

import { useEffect, useRef, useState } from "react";
import { applyTheme, FLIP_EVENT, type Theme } from "./useTheme";

/**
 * Singularity theme swap — the concept made literal:
 *   → sun  : a white hole ignites, a brilliant flash blooms from the toggle
 *   → space: a black hole forms, a dark collapse swallows the page from it
 *
 * Cheap on purpose: one GPU-transformed circle grows to cover the viewport,
 * applyTheme() runs while it's opaque (so the Three.js scene tears down and
 * rebuilds unseen), then the cover fades to reveal. No page snapshot, unlike
 * the View Transitions API — that snapshotting of the live canvas was the lag.
 * All timing is wall-clock, so a throttled frame loop can't strand the cover.
 */
const COVER = 360; // grow to full
const HOLD = 340; // stay opaque while the new scene mounts + sizes
const REVEAL = 480; // fade away

type Stage = "idle" | "cover" | "reveal";

export default function ThemeTransition() {
  const [stage, setStage] = useState<Stage>("idle");
  const [grown, setGrown] = useState(false);
  const cfg = useRef({ dir: "to-sun" as "to-sun" | "to-space", x: 0, y: 0, r: 0 });
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    const onFlip = (e: Event) => {
      const { theme, x, y } = (e as CustomEvent<{ theme: Theme; x: number; y: number }>)
        .detail;
      clear();
      const r =
        Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        ) * 1.06;
      cfg.current = { dir: theme === "sun" ? "to-sun" : "to-space", x, y, r };

      setStage("cover");
      setGrown(false);
      // flip to grown on a wall-clock tick so the transition fires
      timers.current.push(window.setTimeout(() => setGrown(true), 20));
      // swap theme (+ WebGL scene) while fully covered
      timers.current.push(window.setTimeout(() => applyTheme(theme), COVER));
      // begin the reveal
      timers.current.push(window.setTimeout(() => setStage("reveal"), COVER + HOLD));
      // done
      timers.current.push(
        window.setTimeout(() => setStage("idle"), COVER + HOLD + REVEAL)
      );
    };

    window.addEventListener(FLIP_EVENT, onFlip);
    return () => {
      window.removeEventListener(FLIP_EVENT, onFlip);
      clear();
    };
  }, []);

  if (stage === "idle") return null;

  const { dir, x, y, r } = cfg.current;
  const sun = dir === "to-sun";

  return (
    <div className="pointer-events-none fixed inset-0 z-[250] overflow-hidden">
      <div
        style={{
          position: "absolute",
          left: x - r,
          top: y - r,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          transform: `scale(${grown ? 1 : 0})`,
          opacity: stage === "reveal" ? 0 : 1,
          transition:
            stage === "reveal"
              ? `opacity ${REVEAL}ms cubic-bezier(.4,0,.2,1)`
              : `transform ${COVER}ms cubic-bezier(.22,1,.36,1)`,
          background: sun
            ? "radial-gradient(circle, #FFFDF6 0%, #FFE9A8 38%, #FDBA5C 72%, #F0912E 100%)"
            : "radial-gradient(circle, #1c1636 0%, #0A0C14 55%, #05060A 100%)",
          boxShadow: sun
            ? "0 0 90px 20px rgba(253,186,60,0.55)"
            : "0 0 90px 24px rgba(120,150,255,0.35)",
        }}
      />
    </div>
  );
}
