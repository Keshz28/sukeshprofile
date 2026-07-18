"use client";

import { useEffect, useRef, useState } from "react";
import { about, profile } from "@/lib/data";
import Reveal from "./ui/Reveal";
import TiltCard from "./ui/TiltCard";
import { useClock } from "./ui/useClock";
import Scramble from "./ui/Scramble";

// Counts up from 0 → target the first time it scrolls into view, preserving any
// non-numeric suffix ("+", "%").
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const m = value.trim().match(/^(\d+)(.*)$/);
    if (!m) {
      setDisplay(value);
      return;
    }
    const target = +m[1];
    const suffix = m[2] || "";
    setDisplay("0" + suffix);

    let started = false;
    const run = () => {
      const t0 = performance.now();
      const dur = 1300;
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(e * target) + suffix);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((x) => {
          if (x.isIntersecting && !started) {
            started = true;
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      className="text-gradient font-display text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-none"
    >
      {display}
    </div>
  );
}

const CARD =
  "rounded-[20px] border border-white/10 bg-white/[0.035] backdrop-blur-[10px]";

export default function About() {
  const clock = useClock();

  return (
    <section
      id="about"
      className="relative z-[5] mx-auto max-w-[1400px] px-[clamp(20px,4.5vw,64px)] py-[clamp(70px,12vh,140px)]"
    >
      <Reveal className="mb-[clamp(28px,5vh,52px)]">
        <Scramble
          text="( 01 — ABOUT )"
          className="mb-4 block font-mono text-xs tracking-[0.2em] text-blue-glow"
        />
        <h2 className="m-0 font-display text-[clamp(2rem,5.5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em]">
          Building across the{" "}
          <span className="bg-brand-gradient bg-clip-text text-transparent">
            entire stack.
          </span>
        </h2>
      </Reveal>

      {/* ── bento grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
        {/* bio — the big tile */}
        <Reveal className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
          <div className={`${CARD} h-full p-[clamp(22px,3vw,36px)]`}>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              The story
            </div>
            {about.paragraphs.map((p, i) => (
              <p
                key={i}
                className={`mb-[16px] text-pretty text-[clamp(0.98rem,1.3vw,1.1rem)] leading-[1.75] last:mb-0 ${
                  i === 0 ? "text-white/[0.72]" : "text-white/[0.6]"
                }`}
              >
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        {/* identity tile */}
        <Reveal delay={0.08}>
          <TiltCard className={`${CARD} flex h-full flex-col justify-between gap-6 p-6`}>
            <span className="grid h-12 w-12 place-items-center rounded-[12px] bg-brand-gradient font-display text-lg font-bold text-ink">
              {profile.initials}
            </span>
            <div>
              <div className="font-display text-lg font-bold leading-tight text-white">
                {profile.name}
              </div>
              <div className="mt-1.5 font-mono text-[11px] leading-relaxed text-white/50">
                {profile.roles[0]}
              </div>
            </div>
          </TiltCard>
        </Reveal>

        {/* local time tile */}
        <Reveal delay={0.14}>
          <TiltCard className={`${CARD} flex h-full flex-col justify-between gap-6 p-6`}>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              Local time
            </div>
            <div>
              <div className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] font-bold tabular-nums text-white">
                {clock}
              </div>
              <div className="mt-1.5 font-mono text-[11px] text-white/50">
                {profile.location}
              </div>
            </div>
          </TiltCard>
        </Reveal>

        {/* stats tile */}
        <Reveal delay={0.2}>
          <div className={`${CARD} flex h-full flex-col justify-between gap-5 p-6`}>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              By the numbers
            </div>
            <div className="grid grid-cols-3 gap-3">
              {about.stats.map((s) => (
                <div key={s.label} className="min-w-0">
                  <CountUp value={s.value} />
                  <div className="mt-2 font-mono text-[9.5px] leading-tight tracking-[0.06em] text-white/50">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* interests tile */}
        <Reveal delay={0.26}>
          <div className={`${CARD} flex h-full flex-col justify-between gap-5 p-6`}>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              Orbiting interests
            </div>
            <div className="flex flex-wrap gap-2">
              {about.interests.map((it) => (
                <span
                  key={it}
                  data-cursor="hover"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-[6px] font-mono text-[10.5px] tracking-[0.04em] text-white/[0.72] transition-colors duration-200 hover:border-blue-glow/40 hover:text-white"
                >
                  {it}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
