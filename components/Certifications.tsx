"use client";

import { certifications, education } from "@/lib/data";
import Reveal from "./ui/Reveal";
import TiltCard from "./ui/TiltCard";

type Credential = {
  kind: string;
  title: string;
  issuer: string;
  year?: string;
};

// Merge certifications + education into one unified credential timeline.
const credentials: Credential[] = [
  ...certifications.map((c) => ({
    kind: "Certification",
    title: c.title,
    issuer: c.issuer,
    year: c.year,
  })),
  ...education.map((e) => ({
    kind: e.kind,
    title: e.degree,
    issuer: e.institution,
    year: e.year,
  })),
];

export default function Certifications() {
  return (
    <section
      id="certs"
      className="relative z-[5] mx-auto max-w-[1400px] px-[clamp(20px,4.5vw,64px)] py-[clamp(60px,10vh,120px)]"
    >
      <Reveal className="mb-[clamp(28px,5vh,52px)]">
        <div className="mb-4 font-mono text-xs tracking-[0.2em] text-blue-glow">
          ( 05 — CREDENTIALS )
        </div>
        <h2 className="m-0 font-display text-[clamp(2rem,5.5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em]">
          Proof of orbit
        </h2>
      </Reveal>

      {/* ── timeline: gradient rail, node per credential ── */}
      <div className="relative ml-2 border-l border-white/10 pl-[clamp(22px,4vw,48px)] sm:ml-4">
        {/* glowing gradient overlay on the rail */}
        <span
          aria-hidden
          className="absolute -left-px top-0 h-full w-px bg-gradient-to-b from-blue-brand via-azure-brand to-red-brand opacity-60"
        />

        <div className="flex flex-col gap-[clamp(18px,3vh,28px)]">
          {credentials.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07} className="relative">
              {/* node */}
              <span
                aria-hidden
                className="absolute -left-[clamp(22px,4vw,48px)] top-7 flex -translate-x-1/2 items-center justify-center"
                style={{ left: `calc(-1 * clamp(22px, 4vw, 48px))` }}
              >
                <span className="absolute h-4 w-4 animate-ping rounded-full bg-blue-glow/30" style={{ animationDuration: "3s" }} />
                <span className="relative h-2.5 w-2.5 rounded-full border border-blue-glow bg-[var(--panel-strong)]" />
              </span>

              <TiltCard className="rounded-[18px] border border-white/10 bg-white/[0.035] p-[clamp(18px,2.6vw,26px)] backdrop-blur-[10px] transition-colors duration-300 hover:border-white/25">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full border border-blue-glow/30 px-2.5 py-[5px] font-mono text-[10px] uppercase tracking-[0.12em] text-blue-glow">
                    {c.kind}
                  </span>
                  {c.year ? (
                    <span className="font-mono text-[11px] text-white/45 tabular-nums">
                      {c.year}
                    </span>
                  ) : null}
                </div>
                <h3 className="mb-1.5 mt-3.5 font-display text-[clamp(1.1rem,2vw,1.4rem)] font-semibold leading-[1.25] text-white">
                  {c.title}
                </h3>
                <div className="font-mono text-xs text-white/55">{c.issuer}</div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
