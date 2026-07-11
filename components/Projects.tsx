"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type Project, type Accent } from "@/lib/data";
import Reveal from "./ui/Reveal";

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

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Close on Escape + lock body scroll while the panel is open.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [selected]);

  return (
    <section
      id="projects"
      className="relative z-[5] mx-auto max-w-[1400px] px-[clamp(20px,4.5vw,64px)] py-[clamp(60px,10vh,120px)]"
    >
      <Reveal className="mb-[clamp(24px,4.5vh,52px)] flex flex-wrap items-end justify-between gap-3.5">
        <div>
          <div className="mb-4 font-mono text-xs tracking-[0.2em] text-blue-glow">
            ( 04 — SELECTED WORK )
          </div>
          <h2 className="m-0 font-display text-[clamp(2rem,6vw,4.6rem)] font-bold leading-[0.92] tracking-[-0.02em]">
            Projects
          </h2>
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

      {/* detail panel — portaled to <body> so it sits above all overlays */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {selected && (
              <ProjectModal project={selected} onClose={() => setSelected(null)} />
            )}
          </AnimatePresence>,
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
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="sticky"
      style={{ top: `calc(84px + ${index * 18}px)` }}
    >
      <button
        type="button"
        data-cursor="hover"
        onClick={onOpen}
        aria-label={`View details for ${project.title}`}
        className="group relative block w-full overflow-hidden rounded-[24px] border border-white/12 bg-[var(--panel)] text-left shadow-[var(--shadow-lg)] backdrop-blur-2xl transition-[border-color,transform] duration-300 hover:border-white/25 hover:-translate-y-1"
      >
        <div className={`h-[5px] bg-gradient-to-r ${bar}`} />

        {/* giant index watermark */}
        <span
          aria-hidden
          className="text-stroke pointer-events-none absolute -right-3 -top-2 select-none font-display text-[clamp(5rem,14vw,11rem)] font-bold leading-none opacity-25"
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

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const bar = ACCENT_BAR[project.accent] ?? ACCENT_BAR.blue;
  const txt = ACCENT_TEXT[project.accent] ?? ACCENT_TEXT.blue;

  // Move focus into the panel when it opens.
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden />

      <motion.div
        ref={panelRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[640px] max-h-[88vh] overflow-hidden rounded-t-[24px] border border-white/12 bg-[var(--panel-strong)] shadow-[var(--shadow-lg)] outline-none backdrop-blur-2xl sm:rounded-[24px]"
      >
        <div className={`h-[4px] bg-gradient-to-r ${bar}`} />

        <button
          type="button"
          onClick={onClose}
          data-cursor="hover"
          aria-label="Close"
          className="absolute right-4 top-5 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/[0.06] text-lg text-white/60 backdrop-blur-sm transition hover:border-white/30 hover:text-white"
        >
          ×
        </button>

        <div className="max-h-[calc(88vh-4px)] overflow-y-auto p-[clamp(22px,4vw,40px)]">
          <div className={`font-mono text-[11px] uppercase tracking-[0.16em] ${txt}`}>
            {project.category} · {project.year}
          </div>

          <h3
            id="project-modal-title"
            className="mt-2.5 pr-10 font-display text-[clamp(1.7rem,4.5vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.01em] text-white"
          >
            {project.title}
          </h3>

          <p className="mt-4 text-pretty text-[clamp(0.98rem,1.6vw,1.1rem)] leading-[1.75] text-white/[0.72]">
            {project.longDescription}
          </p>

          <div className="mt-6">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Tech stack
            </div>
            <div className="font-mono text-[12.5px] leading-[1.8] tracking-[0.02em] text-white/65">
              {project.tech.join("  ·  ")}
            </div>
          </div>

          {(project.liveUrl || project.repoUrl) && (
            <div className="mt-6 flex flex-wrap gap-2.5">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 font-display text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Live demo ↗
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 font-display text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Source ↗
                </a>
              )}
            </div>
          )}

          <div className="mt-8 border-t border-white/10 pt-6">
            <a
              href="#contact"
              onClick={onClose}
              data-cursor="hover"
              className="inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-brand-gradient px-6 py-3.5 font-display text-[15px] font-bold text-ink transition hover:opacity-90 sm:w-auto"
            >
              Let&apos;s build something →
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
