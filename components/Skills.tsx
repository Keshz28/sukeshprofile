"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { skillCategories } from "@/lib/data";
import Reveal from "./ui/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Skills() {
  const [tab, setTab] = useState(0);
  const cat = skillCategories[tab];

  return (
    <section
      id="skills"
      className="relative z-[5] mx-auto max-w-[1400px] px-[clamp(20px,4.5vw,64px)] py-[clamp(60px,10vh,120px)]"
    >
      <Reveal className="mb-[clamp(28px,5vh,52px)] flex flex-wrap items-end justify-between gap-3.5">
        <div>
          <div className="mb-4 font-mono text-xs tracking-[0.2em] text-blue-glow">
            ( 02 — SKILLS )
          </div>
          <h2 className="m-0 font-display text-[clamp(2rem,5.5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em]">
            What I bring
          </h2>
        </div>
        <span className="font-mono text-xs tracking-[0.12em] text-white/50">
          [ {String(tab + 1).padStart(2, "0")} / {String(skillCategories.length).padStart(2, "0")} ]
        </span>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.03] backdrop-blur-[10px]">
          {/* category tabs */}
          <div
            className="flex flex-wrap border-b border-white/10"
            role="tablist"
            aria-label="Skill categories"
          >
            {skillCategories.map((c, i) => (
              <button
                key={c.title}
                type="button"
                role="tab"
                aria-selected={i === tab}
                data-cursor="hover"
                onClick={() => setTab(i)}
                className={`relative flex-1 whitespace-nowrap px-4 py-4 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-200 sm:text-xs ${
                  i === tab ? "text-white" : "text-white/45 hover:text-white/80"
                }`}
              >
                <span className="mr-1.5 text-blue-glow">{String(i + 1).padStart(2, "0")}</span>
                {c.title}
                {i === tab && (
                  <motion.span
                    layoutId="skills-tab"
                    className="absolute inset-x-0 bottom-0 h-[2.5px] bg-brand-gradient"
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* active panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={cat.title}
              role="tabpanel"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="grid gap-x-[clamp(24px,4vw,64px)] gap-y-6 p-[clamp(22px,3.5vw,44px)] sm:grid-cols-2"
            >
              {cat.skills.map((sk, i) => (
                <div key={sk.name}>
                  <div className="mb-[8px] flex items-baseline justify-between font-mono text-[13px] text-white/75">
                    <span>{sk.name}</span>
                    <span className="text-[11px] text-blue-glow tabular-nums">
                      {sk.level}%
                    </span>
                  </div>
                  <div className="h-[7px] overflow-hidden rounded-full bg-white/[0.08]">
                    <motion.div
                      className="h-full rounded-full bg-brand-gradient"
                      initial={{ width: 0 }}
                      animate={{ width: `${sk.level}%` }}
                      transition={{ duration: 0.9, delay: 0.1 + i * 0.07, ease: EASE }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
