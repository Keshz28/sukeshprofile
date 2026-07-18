"use client";

import { useEffect, useState } from "react";

// E3 — ↑↑↓↓←→←→ B A detonates a supernova right in front of the camera,
// punches a warp flash, and prints a little transmission. Purely for fun.
const CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function KonamiEgg() {
  const [fired, setFired] = useState(false);

  useEffect(() => {
    let idx = 0;
    let hide = 0;

    const onKey = (e: KeyboardEvent) => {
      const want = CODE[idx];
      const got = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (got === want) {
        idx++;
        if (idx === CODE.length) {
          idx = 0;
          window.dispatchEvent(new CustomEvent("kesh:supernova"));
          window.dispatchEvent(new CustomEvent("kesh:warp"));
          setFired(true);
          clearTimeout(hide);
          hide = window.setTimeout(() => setFired(false), 4000);
        }
      } else {
        idx = got === CODE[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(hide);
    };
  }, []);

  if (!fired) return null;

  return (
    <div
      role="status"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[160] -translate-x-1/2 rounded-full border border-white/15 bg-ink/80 px-5 py-2.5 font-mono text-[11px] tracking-[0.18em] text-white backdrop-blur-md"
      style={{ animation: "fadeUp .5s both" }}
    >
      <span className="text-blue-glow">✦</span> SUPERNOVA DETONATED — NICE FIND
    </div>
  );
}
