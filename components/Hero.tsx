"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/lib/data";
import Magnetic from "./ui/Magnetic";

function RoleRotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setI((p) => (p + 1) % profile.roles.length),
      2600
    );
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-block overflow-hidden align-bottom">
      <span
        key={profile.roles[i]}
        className="text-gradient inline-block"
        style={{ animation: "wordIn .55s cubic-bezier(.16,1,.3,1) both" }}
      >
        {profile.roles[i]}
      </span>
    </span>
  );
}

/** Spinning circular text badge — pure SVG, wheels forever. */
function SpinBadge() {
  const r = 54;
  return (
    <a
      href="#contact"
      data-cursor="hover"
      aria-label="Open to opportunities — contact me"
      className="relative grid h-[150px] w-[150px] place-items-center"
    >
      <svg
        viewBox="0 0 140 140"
        className="absolute inset-0 h-full w-full animate-spin-slow text-white/70"
        style={{ animationDuration: "22s" }}
        aria-hidden
      >
        <defs>
          <path
            id="badge-circle"
            d={`M 70,70 m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`}
          />
        </defs>
        {/* text budget: 2πr ≈ 339 units — keep the label short so the loop
            never overlaps its own start */}
        <text className="fill-current font-mono text-[10.5px] tracking-[0.26em]">
          <textPath href="#badge-circle">
            OPEN TO OPPORTUNITIES ✦ REMOTE ✦
          </textPath>
        </text>
      </svg>
      <span className="grid h-[54px] w-[54px] place-items-center rounded-full border border-white/15 bg-white/[0.05] font-display text-xl text-white backdrop-blur-sm transition-transform duration-300 hover:scale-110">
        ↗
      </span>
    </a>
  );
}

/**
 * Animated solar system filling the hero's right half: the eight planets on
 * concentric orbits circle the spinning "open to opportunities" badge — inner
 * orbits fast, outer slow (Kepler would approve), each starting at its own
 * phase via a negative animation-delay. Pure CSS animation.
 */
function HeroOrbital() {
  return (
    <div className="relative mx-auto aspect-square w-[clamp(350px,36vw,620px)]">
      {PLANETS.map((p) => (
        <div
          key={p.name}
          className={`absolute rounded-full border ${p.dashed ? "border-dashed" : ""} border-white/[0.11]`}
          style={{
            inset: `${(100 - p.ring) / 2}%`,
            animation: `orbit ${p.dur}s linear infinite`,
            animationDelay: `-${p.phase}s`,
          }}
        >
          <span
            title={p.name}
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle at 32% 30%, ${p.hi}, ${p.color} 62%)`,
              boxShadow: `0 0 ${p.size * 1.4}px ${p.size / 4}px ${p.color}55`,
            }}
          >
            {/* Saturn keeps its ring */}
            {p.ringed && (
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 rounded-full border border-white/55"
                style={{
                  width: p.size * 1.9,
                  height: p.size * 0.42,
                  transform: "translate(-50%,-50%) rotate(-24deg)",
                }}
              />
            )}
          </span>
        </div>
      ))}

      {/* twinkling specks between the orbits */}
      {SPECKS.map((s, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute rounded-full bg-white/80"
          style={{
            left: s.x,
            top: s.y,
            width: s.r,
            height: s.r,
            animation: `pulse-slow ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* the badge is the star everything orbits */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgb(var(--acc1)/0.16)] blur-2xl"
          style={{ animation: "sunPulse 7s ease-in-out infinite" }}
        />
        <SpinBadge />
      </div>
    </div>
  );
}

// The family, inside out — ring = orbit diameter (% of container),
// dur = seconds per revolution, phase = starting-angle offset.
const PLANETS = [
  { name: "Mercury", ring: 48,  dur: 12, phase: 3,  size: 9,  color: "#9CA3AF", hi: "#E5E7EB", ringed: false, dashed: false },
  { name: "Venus",   ring: 55,  dur: 18, phase: 11, size: 13, color: "#E8B15C", hi: "#FCE1B0", ringed: false, dashed: false },
  { name: "Earth",   ring: 62,  dur: 24, phase: 7,  size: 14, color: "#4A90E2", hi: "#A8D8F0", ringed: false, dashed: false },
  { name: "Mars",    ring: 70,  dur: 30, phase: 21, size: 11, color: "#DC5B45", hi: "#F4A88F", ringed: false, dashed: false },
  { name: "Jupiter", ring: 77.5, dur: 42, phase: 16, size: 24, color: "#D9A066", hi: "#F2D3AC", ringed: false, dashed: false },
  { name: "Saturn",  ring: 85,  dur: 54, phase: 34, size: 20, color: "#E3C179", hi: "#F6E4B8", ringed: true,  dashed: false },
  { name: "Uranus",  ring: 92.5, dur: 68, phase: 50, size: 16, color: "#7DD3E0", hi: "#C6EEF5", ringed: false, dashed: false },
  { name: "Neptune", ring: 100, dur: 84, phase: 27, size: 16, color: "#5B76F7", hi: "#AEBCFB", ringed: false, dashed: true },
];

const SPECKS = [
  { x: "16%", y: "22%", r: 3, dur: 6, delay: 0 },
  { x: "78%", y: "14%", r: 2, dur: 7, delay: 1.2 },
  { x: "88%", y: "58%", r: 3, dur: 5, delay: 0.6 },
  { x: "30%", y: "82%", r: 2, dur: 8, delay: 2 },
  { x: "8%", y: "56%", r: 2, dur: 6.5, delay: 3 },
  { x: "62%", y: "88%", r: 2.5, dur: 7.5, delay: 1.8 },
];

export default function Hero() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 70]);

  return (
    <section
      id="home"
      className="relative z-[5] flex min-h-screen flex-col justify-center px-[clamp(20px,4.5vw,64px)] pb-[90px] pt-[110px]"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ── left: editorial stack ── */}
        <div>
          {/* availability */}
          <div
            className="mb-[clamp(22px,4vh,40px)] inline-flex items-center gap-2.5 rounded-full border border-blue-glow/25 bg-blue-brand/[0.12] px-4 py-[7px] font-mono text-[11px] tracking-[0.06em] text-white/[0.78] backdrop-blur-sm sm:text-xs"
            style={{ animation: "fadeUp 1s .1s both" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-glow opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-brand" />
            </span>
            Open to opportunities · Available worldwide
          </div>

          {/* name — one clean stack: solid first name, gradient surname */}
          <motion.h1
            style={{ y: heroY }}
            className="m-0 font-display text-[clamp(3rem,9.5vw,8.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em] will-change-transform"
          >
            <span className="block overflow-hidden">
              <span
                className="inline-block text-white"
                style={{ animation: "riseIn 1s .15s both", textShadow: "var(--halo)" }}
              >
                Sukesh
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="bg-brand-gradient inline-block bg-clip-text text-transparent"
                style={{
                  backgroundSize: "220% 220%",
                  animation:
                    "riseIn 1s .3s both, gradShift 7s 1.3s ease-in-out infinite",
                }}
              >
                Surase
              </span>
            </span>
          </motion.h1>

          {/* role */}
          <div
            className="mt-[clamp(20px,3.5vh,36px)] flex flex-wrap items-baseline gap-3 font-display text-[clamp(1.15rem,3vw,2rem)] font-semibold"
            style={{ animation: "fadeUp 1s .55s both" }}
          >
            <span className="text-white/55">I&apos;m a</span>
            <RoleRotator />
          </div>

          {/* tagline */}
          <p
            className="mt-[clamp(18px,3vh,30px)] max-w-[560px] text-pretty text-[clamp(1rem,1.5vw,1.18rem)] leading-[1.65] text-white/[0.62]"
            style={{ animation: "fadeUp 1s .7s both" }}
          >
            {profile.tagline}
          </p>

          {/* CTAs */}
          <div
            className="mt-[clamp(26px,4.5vh,44px)] flex flex-wrap gap-3.5"
            style={{ animation: "fadeUp 1s .82s both" }}
          >
            <Magnetic>
              <a
                href="#projects"
                data-cursor="hover"
                className="inline-flex items-center gap-2 rounded-[14px] bg-brand-gradient px-[26px] py-3.5 font-display text-[15px] font-bold text-ink"
              >
                View Projects ↗
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.resumeUrl}
                download
                data-cursor="hover"
                className="inline-flex items-center gap-2 rounded-[14px] border border-white/15 bg-white/5 px-[26px] py-3.5 font-display text-[15px] font-semibold text-white backdrop-blur-md"
              >
                ↓ Download Resume
              </a>
            </Magnetic>
          </div>

          {/* socials */}
          <div
            className="mt-[clamp(24px,4vh,36px)] flex flex-wrap gap-2.5"
            style={{ animation: "fadeUp 1s .95s both" }}
          >
            <SocialPill href={profile.socials.github}>GitHub</SocialPill>
            <SocialPill href={profile.socials.linkedin}>LinkedIn</SocialPill>
            <SocialPill href={`mailto:${profile.email}`}>{profile.email}</SocialPill>
          </div>
        </div>

        {/* ── right: living solar system ── */}
        <div
          className="hidden lg:block"
          style={{ animation: "fadeUp 1.2s .8s both" }}
        >
          <HeroOrbital />
        </div>
      </div>

      {/* vertical meta label pinned to the section's right edge */}
      <span
        aria-hidden
        className="absolute right-[clamp(14px,2vw,28px)] top-1/2 hidden -translate-y-1/2 font-mono text-[10px] tracking-[0.3em] text-white/35 lg:block"
        style={{ writingMode: "vertical-rl", animation: "fadeUp 1.2s 1.1s both" }}
      >
        EARTH · SOL SYSTEM · {new Date().getFullYear()}
      </span>

      {/* scroll hint */}
      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-[26px] left-[clamp(20px,4.5vw,64px)] flex items-center gap-2.5 font-mono text-[10px] tracking-[0.25em] text-white/50"
      >
        <span className="inline-block" style={{ animation: "bob 1.8s infinite" }}>
          ↓
        </span>
        SCROLL
      </a>
    </section>
  );
}

function SocialPill({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      data-cursor="hover"
      className="inline-flex h-[42px] items-center rounded-xl border border-white/10 bg-white/[0.04] px-4 font-mono text-xs tracking-[0.06em] text-white/[0.78] transition-colors duration-200 hover:border-white/25 hover:text-white"
    >
      {children}
    </a>
  );
}
