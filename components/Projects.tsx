"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { projects, type Project, type Accent } from "@/lib/data";
import Reveal from "./ui/Reveal";
import Scramble from "./ui/Scramble";
import SplitReveal from "./ui/SplitReveal";

const ACCENT_BAR: Record<Accent, string> = {
  blue: "from-blue-brand to-blue-glow",
  azure: "from-azure-brand to-azure-glow",
  red: "from-red-brand to-red-glow",
};
const ACCENT_TEXT: Record<Accent, string> = {
  blue: "text-blue-glow",
  azure: "text-azure-glow",
  red: "text-red-glow",
};
/** Raw token so we can build rgba() atmospheres per accent. */
const ACCENT_VAR: Record<Accent, string> = {
  blue: "--acc1",
  azure: "--acc2",
  red: "--acc3",
};

const TAKEOVER_MS = 460;

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [shown, setShown] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // play the takeover in on the tick after mount
  useEffect(() => {
    if (!selected) return;
    const t = setTimeout(() => setShown(true), 20);
    return () => clearTimeout(t);
  }, [selected]);

  // Close is wall-clock driven — never gated on an animation callback, so a
  // throttled frame loop can't strand a fullscreen panel with scroll locked.
  const close = () => {
    setShown(false);
    window.setTimeout(() => setSelected(null), TAKEOVER_MS);
  };

  // scroll lock + Escape while the takeover is up
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lenis = (
      window as unknown as { __lenis?: { stop?: () => void; start?: () => void } }
    ).__lenis;
    lenis?.stop?.();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      lenis?.start?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <section
      id="projects"
      className="relative z-[5] mx-auto max-w-[1400px] px-[clamp(20px,4.5vw,64px)] py-[clamp(60px,10vh,120px)]"
    >
      <Reveal className="mb-[clamp(24px,4.5vh,52px)] flex flex-wrap items-end justify-between gap-3.5">
        <div>
          <Scramble
            text="( 04 — SELECTED WORK )"
            className="mb-4 block font-mono text-xs tracking-[0.2em] text-blue-glow"
          />
          <SplitReveal
            as="h2"
            text="Projects"
            className="m-0 font-display text-[clamp(2rem,6vw,4.6rem)] font-bold leading-[0.92] tracking-[-0.02em]"
          />
        </div>
        <span className="font-mono text-xs tracking-[0.12em] text-white/50">
          [ {String(projects.length).padStart(2, "0")} — 2026 ]
        </span>
      </Reveal>

      {/* ── sticky deck: each card pins under the nav, the next slides over ── */}
      <div className="flex flex-col gap-[clamp(20px,4vh,40px)]">
        {projects.map((p, i) => (
          <StackCard
            key={p.title}
            project={p}
            index={i}
            onOpen={() => setSelected(p)}
          />
        ))}
      </div>

      {/* case-study takeover — portaled so it sits above every overlay */}
      {mounted &&
        selected &&
        createPortal(
          <Takeover project={selected} shown={shown} onClose={close} />,
          document.body
        )}
    </section>
  );
}

function StackCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const bar = ACCENT_BAR[project.accent] ?? ACCENT_BAR.blue;
  const txt = ACCENT_TEXT[project.accent] ?? ACCENT_TEXT.blue;
  const av = ACCENT_VAR[project.accent] ?? ACCENT_VAR.blue;
  const ref = useRef<HTMLButtonElement>(null);

  // X1 — planetary atmosphere: a light source slides across the card surface
  // with the cursor, so hovering feels like turning a small world to the sun.
  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div className="sticky" style={{ top: `calc(84px + ${index * 18}px)` }}>
      <button
        ref={ref}
        type="button"
        data-cursor="hover"
        onClick={onOpen}
        onMouseMove={onMove}
        aria-label={`View details for ${project.title}`}
        className="card-fx group relative block w-full overflow-hidden rounded-[24px] border border-white/12 bg-[var(--panel)] text-left shadow-[var(--shadow-lg)] backdrop-blur-2xl transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-white/25"
        style={{ animationDelay: `${index * 1.7}s` }}
      >
        <div className={`h-[5px] bg-gradient-to-r ${bar}`} />

        {/* atmosphere */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgb(var(${av}) / 0.16), transparent 62%)`,
          }}
        />
        {/* limb glow along the top edge, like light wrapping a sphere */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(120% 100% at 50% 0%, rgb(var(${av}) / 0.14), transparent 70%)`,
          }}
        />

        {/* giant index watermark */}
        <span
          aria-hidden
          className="text-stroke pointer-events-none absolute -right-3 -top-2 select-none font-display text-[clamp(5rem,14vw,11rem)] font-bold leading-none opacity-25 transition-transform duration-500 group-hover:-translate-x-2"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative grid gap-6 p-[clamp(22px,4vw,44px)] lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className={`font-mono text-[11px] uppercase tracking-[0.16em] ${txt}`}>
              {project.category} · {project.year}
            </div>

            <h3 className="mt-3 max-w-[16ch] font-display text-[clamp(1.9rem,5vw,3.6rem)] font-bold leading-[0.98] tracking-[-0.015em] text-white">
              {project.title}
            </h3>

            <p className="mt-4 max-w-[58ch] text-pretty text-[clamp(0.95rem,1.4vw,1.08rem)] leading-[1.7] text-white/[0.62]">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-[6px] font-mono text-[10.5px] tracking-[0.04em] text-white/[0.72]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 justify-self-start lg:flex-col lg:items-end lg:justify-self-end">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 transition-colors group-hover:text-white/70">
              Read case
            </span>
            <span className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/[0.05] font-display text-xl text-white transition-transform duration-300 group-hover:rotate-45">
              ↗
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}

/* ───────────────────────── P3 — case-study takeover ─────────────────────── */
function Takeover({
  project,
  shown,
  onClose,
}: {
  project: Project;
  shown: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const bar = ACCENT_BAR[project.accent] ?? ACCENT_BAR.blue;
  const txt = ACCENT_TEXT[project.accent] ?? ACCENT_TEXT.blue;
  const av = ACCENT_VAR[project.accent] ?? ACCENT_VAR.blue;

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
      className="fixed inset-0 z-[140]"
    >
      {/* scrim */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-ink/85 backdrop-blur-xl transition-opacity ease-out"
        style={{ opacity: shown ? 1 : 0, transitionDuration: `${TAKEOVER_MS}ms` }}
      />

      {/* panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="absolute inset-0 overflow-y-auto outline-none transition-transform ease-out"
        style={{
          transform: shown ? "translateY(0)" : "translateY(4%)",
          opacity: shown ? 1 : 0,
          transitionProperty: "transform, opacity",
          transitionDuration: `${TAKEOVER_MS}ms`,
        }}
      >
        {/* accent wash behind the header */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[70vh]"
          style={{
            background: `radial-gradient(90% 70% at 70% 0%, rgb(var(${av}) / 0.18), transparent 65%)`,
          }}
        />

        <div className="relative mx-auto min-h-full max-w-[1100px] px-[clamp(20px,5vw,72px)] pb-24 pt-[clamp(80px,12vh,140px)]">
          {/* close */}
          <button
            type="button"
            onClick={onClose}
            data-cursor="hover"
            aria-label="Close case study"
            className="fixed right-[clamp(16px,4vw,56px)] top-[clamp(16px,3vh,32px)] z-10 flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 font-mono text-[10px] tracking-[0.18em] text-white/75 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
          >
            CLOSE
            <span className="relative grid h-3 w-3.5 place-items-center">
              <span className="absolute h-px w-full rotate-45 bg-current" />
              <span className="absolute h-px w-full -rotate-45 bg-current" />
            </span>
          </button>

          <div className={`h-[4px] w-24 rounded-full bg-gradient-to-r ${bar}`} />

          <div className={`mt-6 font-mono text-[11px] uppercase tracking-[0.18em] ${txt}`}>
            {project.category} · {project.year}
          </div>

          <h2
            id="case-title"
            className="mt-4 max-w-[14ch] font-display text-[clamp(2.4rem,8vw,6rem)] font-bold leading-[0.94] tracking-[-0.025em] text-white"
          >
            {project.title}
          </h2>

          {/* body: story + spec rail */}
          <div className="mt-[clamp(32px,6vh,64px)] grid gap-[clamp(28px,5vw,64px)] lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <p className="text-pretty text-[clamp(1.05rem,1.8vw,1.35rem)] leading-[1.7] text-white/[0.78]">
                {project.description}
              </p>
              <p className="mt-6 text-pretty text-[clamp(0.98rem,1.5vw,1.12rem)] leading-[1.8] text-white/[0.62]">
                {project.longDescription}
              </p>
            </div>

            <aside className="lg:border-l lg:border-white/10 lg:pl-[clamp(20px,3vw,40px)]">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                Tech stack
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-[6px] font-mono text-[11px] text-white/75"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-8 mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                Year
              </div>
              <div className="font-display text-2xl font-bold text-white">
                {project.year}
              </div>

              {(project.liveUrl || project.repoUrl) && (
                <div className="mt-8 flex flex-col gap-2.5">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      className="inline-flex items-center justify-between gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-display text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Live demo <span aria-hidden>↗</span>
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      className="inline-flex items-center justify-between gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-display text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Source <span aria-hidden>↗</span>
                    </a>
                  )}
                </div>
              )}
            </aside>
          </div>

          <div className="mt-[clamp(40px,8vh,90px)] border-t border-white/10 pt-8">
            <a
              href="#contact"
              onClick={onClose}
              data-cursor="hover"
              className="inline-flex items-center gap-2 rounded-[14px] bg-brand-gradient px-6 py-3.5 font-display text-[15px] font-bold text-ink transition hover:opacity-90"
            >
              Let&apos;s build something →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
