"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, type Project } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import { ArrowUpRight, Close, Code, GitHub } from "./ui/Icons";

const accent = {
  blue: { glow: "rgba(37,99,235,0.35)", chip: "bg-blue-brand/15 text-blue-glow", dot: "bg-blue-glow" },
  azure: { glow: "rgba(99,102,241,0.32)", chip: "bg-azure-brand/15 text-azure-glow", dot: "bg-azure-glow" },
  red: { glow: "rgba(239,68,68,0.32)", chip: "bg-red-brand/15 text-red-glow", dot: "bg-red-glow" },
};

function ProjectCard({
  project,
  onOpen,
  delay,
}: {
  project: Project;
  onOpen: () => void;
  delay: number;
}) {
  const a = accent[project.accent];

  const handleTilt = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-4px)`;
  };
  const resetTilt = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform =
      "perspective(900px) rotateY(0) rotateX(0) translateY(0)";
  };

  return (
    <motion.button
      layoutId={`card-${project.title}`}
      onClick={onOpen}
      onMouseMove={handleTilt}
      onMouseLeave={resetTilt}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay }}
      className="group relative min-w-[320px] w-[320px] cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-ink-card/80 p-7 text-left transition-[transform,border-color] duration-200 will-change-transform hover:border-white/20 snap-start"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: a.glow }}
      />

      <motion.div layoutId={`content-${project.title}`} className="relative">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${a.chip}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
            {project.category}
          </span>
          <span className="text-xs font-medium text-white/35">
            {project.year}
          </span>
        </div>

        <h3 className="mt-5 font-display text-2xl font-bold text-white">
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors group-hover:text-white">
          View case study
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </motion.div>
    </motion.button>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const a = accent[project.accent];
  return (
    <motion.div
      className="fixed inset-0 z-[60] grid place-items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        layoutId={`card-${project.title}`}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-ink-card p-8"
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl"
          style={{ background: a.glow }}
        />
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-colors hover:text-white"
        >
          <Close className="h-4 w-4" />
        </button>

        <motion.div layoutId={`content-${project.title}`} className="relative">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${a.chip}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
            {project.category} · {project.year}
          </span>
          <h3 className="mt-4 font-display text-3xl font-bold text-white">
            {project.title}
          </h3>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative mt-4 text-sm leading-relaxed text-white/70"
        >
          {project.longDescription}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="relative mt-6"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Tech stack
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="relative mt-7 flex flex-wrap gap-3"
        >
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-ink"
            >
              Live demo <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <GitHub className="h-4 w-4" /> Source
            </a>
          )}
          {!project.liveUrl && !project.repoUrl && (
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/50">
              <Code className="h-4 w-4" /> Case study available on request
            </span>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative py-28">
      <div className="container-px">
        <SectionHeading
          eyebrow="Projects"
          title="Current ongoing projects"
          subtitle="Projects I'm actively building and shipping in 2026. Click any card for the full story."
        />

        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-5 px-5 sm:-mx-8 sm:px-8">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.title}
              project={p}
              onOpen={() => setSelected(p)}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
