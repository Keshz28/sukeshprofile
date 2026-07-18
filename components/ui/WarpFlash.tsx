"use client";

import { useEffect, useState } from "react";

/**
 * TR1 — the DOM half of the "hyperspace jump" that fires when you navigate to
 * a section. A radial light bloom flashes over the page while the WebGL camera
 * lurches (see SpaceGL's WarpRig), masking the scroll between sections.
 *
 * Driven by the `kesh:warp` window event so any anchor — navbar, overlay menu,
 * scroll hint — triggers it. Wall-clock timed, never animation-gated.
 */
export const WARP_EVENT = "kesh:warp";

export function triggerWarp() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(WARP_EVENT));
}

export default function WarpFlash() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let off = 0;
    const onWarp = () => {
      setOn(true);
      clearTimeout(off);
      off = window.setTimeout(() => setOn(false), 90);
    };
    window.addEventListener(WARP_EVENT, onWarp);
    return () => {
      window.removeEventListener(WARP_EVENT, onWarp);
      clearTimeout(off);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] transition-opacity ease-out"
      style={{
        opacity: on ? 1 : 0,
        transitionDuration: on ? "90ms" : "620ms",
        background:
          "radial-gradient(120% 80% at 50% 50%, rgb(var(--acc1) / 0.20), rgb(var(--acc2) / 0.10) 45%, transparent 72%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
