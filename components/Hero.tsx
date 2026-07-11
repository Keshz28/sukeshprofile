"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/lib/data";
import Magnetic from "./ui/Magnetic";
import OrbitRings from "./ui/OrbitRings";

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
        <text className="fill-current font-mono text-[10.5px] tracking-[0.26em]">
          <textPath href="#badge-circle">
            OPEN TO OPPORTUNITIES ✦ REMOTE / WORLDWIDE ✦
          </textPath>
        </text>
      </svg>
      <span className="grid h-[54px] w-[54px] place-items-center rounded-full border border-white/15 bg-white/[0.05] font-display text-xl text-white backdrop-blur-sm transition-transform duration-300 hover:scale-110">
        ↗
      </span>
    </a>
  );
}

export default function Hero() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 70]);

  return (
    <section
      id="home"
      className="relative z-[5] flex min-h-screen flex-col justify-center px-[clamp(20px,4.5vw,64px)] pb-[90px] pt-[110px]"
    >
      <OrbitRings />

      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto]">
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

          {/* name — solid line, gradient line, hollow echo */}
          <motion.h1
            style={{ y: heroY }}
            className="m-0 font-display text-[clamp(3rem,10.5vw,9.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.03em] will-change-transform"
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
            <span className="block overflow-hidden" aria-hidden>
              <span
                className="text-stroke inline-block select-none"
                style={{ animation: "riseIn 1s .45s both", opacity: 0.5 }}
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

        {/* ── right: spinning badge rail (desktop) ── */}
        <div
          className="hidden flex-col items-center gap-8 self-stretch justify-self-end lg:flex lg:justify-center"
          style={{ animation: "fadeUp 1.2s .9s both" }}
        >
          <SpinBadge />
          <div className="h-24 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent" />
          <span
            className="font-mono text-[10px] tracking-[0.3em] text-white/40"
            style={{ writingMode: "vertical-rl" }}
          >
            EARTH · SOL SYSTEM
          </span>
        </div>
      </div>

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
