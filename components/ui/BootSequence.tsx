"use client";

import { useEffect, useState } from "react";

// E1 — "system boot": a mission-control style preloader that counts the ship
// up to 100% while status lines resolve, then lifts like a curtain to reveal
// the universe. Plays once per session (sessionStorage) and is skipped
// entirely for reduced-motion visitors.
//
// Deliberately NOT gated on animation callbacks: rAF is paused in background
// tabs and throttled in embedded views, so both the progress *and* the unmount
// are backed by wall-clock timers. The curtain always lifts; scroll is never
// left locked.
const LINES = [
  "ESTABLISHING UPLINK",
  "LOADING STAR CATALOGUE",
  "CALIBRATING EVENT HORIZON",
  "SPOOLING ACCRETION DISK",
  "ALL SYSTEMS NOMINAL",
];

const DUR = 2200;
const FADE = 700;

export default function BootSequence() {
  const [active, setActive] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [pct, setPct] = useState(0);
  const [line, setLine] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("kesh-booted") === "1";
    } catch {
      /* private mode — just play it */
    }
    if (reduce || seen) return;

    setActive(true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const start = performance.now();
    let raf = 0;
    let done = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem("kesh-booted", "1");
      } catch {
        /* ignore */
      }
      setPct(100);
      setLine(LINES.length - 1);
      setLeaving(true);
      // unmount on a timer, never on an animation event
      done = window.setTimeout(() => {
        setActive(false);
        document.body.style.overflow = prevOverflow;
      }, FADE);
    };

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DUR);
      const eased = 1 - Math.pow(1 - p, 2);
      setPct(Math.round(eased * 100));
      setLine(Math.min(LINES.length - 1, Math.floor(eased * LINES.length)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);

    // wall-clock safety in case rAF is throttled or paused entirely
    const safety = window.setTimeout(finish, DUR + 900);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
      clearTimeout(safety);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!active) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[200] grid place-items-center bg-ink px-6 transition-all ease-out ${
        leaving
          ? "pointer-events-none scale-[1.04] opacity-0 blur-[8px]"
          : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE}ms` }}
    >
      {/* faint scanning grid */}
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="relative w-full max-w-[420px]">
        <div className="mb-3 font-mono text-[10px] tracking-[0.3em] text-blue-glow">
          SUKESH SURASE / PORTFOLIO
        </div>

        <div className="flex items-end justify-between gap-4">
          <span className="font-display text-[clamp(3.5rem,12vw,6rem)] font-bold leading-none tabular-nums text-white">
            {String(pct).padStart(3, "0")}
          </span>
          <span className="mb-2 font-mono text-xs tracking-[0.2em] text-white/45">
            %
          </span>
        </div>

        {/* progress rail */}
        <div className="mt-5 h-px w-full bg-white/15">
          <div
            className="h-px bg-brand-gradient transition-[width] duration-100 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-4 font-mono text-[11px] tracking-[0.16em] text-white/55">
          <span className="text-blue-glow">›</span> {LINES[line]}
        </div>
      </div>
    </div>
  );
}
