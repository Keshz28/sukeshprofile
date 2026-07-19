"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Light mode's backdrop: a live WebGL white hole (the time-reverse of the dark
// theme's black hole). Client-only so the static export never touches Three.js
// during prerender.
const WhiteHoleGL = dynamic(() => import("../webgl/WhiteHoleGL"), { ssr: false });

// Static stand-in for mobile / reduced-motion / no-WebGL, and the first-paint
// look before the canvas mounts. Cheap gradients — phones download no video.
const CORONA_CSS =
  "radial-gradient(120% 95% at 78% 12%, rgba(255,214,140,0.75), transparent 55%)," +
  "radial-gradient(90% 80% at 15% 85%, rgba(255,190,150,0.35), transparent 58%)," +
  "radial-gradient(70% 60% at 82% 18%, rgba(255,255,245,0.85), transparent 45%)," +
  "#FFF6E8";

export default function SunScene() {
  const [mode, setMode] = useState<"pending" | "full" | "lite">("pending");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small =
      window.matchMedia("(max-width: 820px)").matches ||
      !window.matchMedia("(pointer: fine)").matches;
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(
        c.getContext("webgl2") ||
        c.getContext("webgl") ||
        c.getContext("experimental-webgl")
      );
    } catch {
      webgl = false;
    }
    setMode(reduce || small || !webgl ? "lite" : "full");
  }, []);

  if (mode === "full") return <WhiteHoleGL />;

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ background: CORONA_CSS }}
    />
  );
}
