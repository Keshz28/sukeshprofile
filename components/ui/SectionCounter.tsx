"use client";

import { useEffect, useRef, useState } from "react";

// Fixed left-edge section indicator: a rolling 2-digit counter + label that
// tracks whichever section currently owns the most of the viewport. Decorative
// (aria-hidden) and hidden on small screens; blend-difference keeps it legible
// over any background.
const SECTIONS = [
  { id: "home", label: "HOME" },
  { id: "about", label: "ABOUT" },
  { id: "skills", label: "SKILLS" },
  { id: "ai-workflow", label: "AI WORKFLOW" },
  { id: "projects", label: "WORK" },
  { id: "certs", label: "CREDENTIALS" },
  { id: "contact", label: "CONTACT" },
];

export default function SectionCounter() {
  const [idx, setIdx] = useState(0);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const els = SECTIONS.map((s) => document.getElementById(s.id));
    const ratios = new Array(SECTIONS.length).fill(0);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const i = els.indexOf(e.target as HTMLElement);
          if (i >= 0) ratios[i] = e.intersectionRatio;
        });
        let best = -1;
        let bi = 0;
        for (let i = 0; i < ratios.length; i++) {
          if (ratios[i] > best) {
            best = ratios[i];
            bi = i;
          }
        }
        setIdx(bi);
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.7, 0.9, 1] }
    );

    els.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // replay the roll animation each time the active section changes
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "numRoll .5s cubic-bezier(.16,1,.3,1) both";
  }, [idx]);

  return (
    <div
      aria-hidden
      className="fixed left-[clamp(12px,2.2vw,28px)] top-1/2 z-[65] hidden -translate-y-1/2 select-none flex-col items-start gap-1 text-white md:flex"
      style={{ mixBlendMode: "difference" }}
    >
      <div className="h-[1em] overflow-hidden">
        <span
          ref={numRef}
          className="inline-block font-display text-[clamp(26px,3vw,44px)] font-bold leading-none tracking-[-0.02em]"
        >
          {String(idx).padStart(2, "0")}
        </span>
      </div>
      <span className="font-mono text-[10px] tracking-[0.22em]">
        {SECTIONS[idx].label}
      </span>
      <span className="font-mono text-[10px] tracking-[0.22em] opacity-50">
        / {String(SECTIONS.length - 1).padStart(2, "0")}
      </span>
    </div>
  );
}
