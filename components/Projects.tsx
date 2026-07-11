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
  const [active, setActive] = useState<Project | null>(null);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);

  useEffect(() => setMounted(true), []);

  // Floating preview trails the cursor while a row is hovered.
  useEffect(() => {
    let raf = 0;
    let x = 0;
    let y = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf || !hoveredRef.current) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = previewRef.current;
        if (!el) return;
        const px = Math.min(x + 26, window.innerWidth - 340);
        const py = Math.min(Math.max(y - 150, 16), window.innerHeight - 260);
        el.style.transform = `translate(${px}px,${py}px)`;
      });
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const enter = (p: Project) => {
    setActive(p);
    setVisible(true);
    hoveredRef.current = true;
  };
  const leave = () => {
    setVisible(false);
    hoveredRef.current = false;
  };

  // Open the detail panel; hide the floating hover preview.
  const openModal = (p: Project) => {
    setSelected(p);
    setVisible(false);
    hoveredRef.current = false;
  };
  const closeModal = () => setSelected(null);

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
      className="relative z-[5] mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] py-[clamp(60px,10vh,120px)]"
    >
      <Reveal className="mb-[clamp(20px,4vh,44px)] flex flex-wrap items-end justify-between gap-3.5">
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

      <div className="border-t border-white/10">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <button
              type="button"
              data-cursor="hover"
              onClick={() => openModal(p)}
              onMouseEnter={() => enter(p)}
              onMouseLeave={leave}
              aria-label={`View details for ${p.title}`}
              className="group grid w-full grid-cols-[40px_1fr_auto_22px] items-center gap-3 border-b border-white/10 px-2 py-[clamp(18px,3vh,32px)] text-left text-white/[0.91] transition-[padding,background] duration-[0.45s] ease-out hover:bg-white/[0.04] hover:px-[22px] sm:grid-cols-[60px_1fr_auto_26px] sm:gap-[18px]"
            >
              <span className="bg-brand-gradient bg-clip-text font-mono text-[13px] text-transparent">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="min-w-0">
                <span className="block break-words font-display text-[clamp(1.5rem,4.5vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.01em]">
                  {p.title}
                </span>
                <span className="mt-1.5 block max-w-[60ch] text-[clamp(0.85rem,1.4vw,1rem)] text-white/50">
                  {p.description}
                </span>
              </span>

              <span className="hidden whitespace-nowrap text-right font-mono text-[11px] tracking-[0.1em] text-white/55 sm:block">
                {p.category}
                <br />
                {p.year}
              </span>

              <span className="font-display text-[22px] leading-none text-white opacity-0 -translate-x-2 transition-[opacity,transform] duration-[0.4s] group-hover:translate-x-0 group-hover:opacity-100">
                ↗
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {/* floating cursor-following preview (desktop hover teaser) */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] w-[320px] will-change-transform"
        style={{ opacity: visible ? 1 : 0, transition: "opacity .4s ease" }}
      >
        <div className="overflow-hidden rounded-2xl border border-white/[0.12] bg-[var(--panel)] shadow-[var(--shadow-lg)] backdrop-blur-[14px]">
          <div className="h-[5px] bg-brand-gradient" />
          <div className="p-[18px]">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-blue-glow">
              {active?.category}
            </div>
            <div className="mt-2 font-display text-2xl font-bold leading-[1.1] text-white">
              {active?.title}
            </div>
            <div className="mt-3 font-mono text-[11px] leading-[1.6] tracking-[0.06em] text-white/55">
              {active?.tech.join(" · ")}
            </div>
            <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
              Click to read more →
            </div>
          </div>
        </div>
      </div>

      {/* detail panel — portaled to <body> so it sits above all overlays */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {selected && (
              <ProjectModal project={selected} onClose={closeModal} />
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
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
