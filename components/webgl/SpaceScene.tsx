"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// The heavy WebGL scene is client-only (ssr:false) so the static export never
// touches Three.js during prerender.
const SpaceGL = dynamic(() => import("./SpaceGL"), { ssr: false });

// Static nebula used on mobile / reduced-motion / no-WebGL, and as the
// first-paint look before the canvas mounts. Cheap layered gradients — no
// 19MB video download on phones.
const NEBULA_CSS =
  "radial-gradient(120% 90% at 78% 12%, rgba(124,58,237,0.28), transparent 52%)," +
  "radial-gradient(90% 80% at 12% 88%, rgba(236,72,153,0.18), transparent 55%)," +
  "radial-gradient(80% 70% at 85% 80%, rgba(59,130,246,0.16), transparent 55%)," +
  "#05060A";

export default function SpaceScene() {
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

  if (mode === "full") return <SpaceGL />;

  // lite / pending
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ background: NEBULA_CSS }}
    />
  );
}
