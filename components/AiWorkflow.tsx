"use client";

import { aiWorkflow, type AiTool, type Accent } from "@/lib/data";
import Reveal from "./ui/Reveal";
import TiltCard from "./ui/TiltCard";
import Scramble from "./ui/Scramble";

// Full literal class strings per accent so Tailwind's scanner keeps them.
const ACCENT: Record<Accent, { text: string; dot: string }> = {
  blue: { text: "text-blue-glow", dot: "bg-blue-glow" },
  azure: { text: "text-azure-glow", dot: "bg-azure-glow" },
  red: { text: "text-red-glow", dot: "bg-red-glow" },
};

function ToolCard({ tool, delay }: { tool: AiTool; delay: number }) {
  const a = ACCENT[tool.accent] ?? ACCENT.blue;

  return (
    <Reveal delay={delay}>
      <TiltCard className="group h-full overflow-hidden rounded-[16px] border border-white/12 bg-white/[0.035] backdrop-blur-[10px] transition-colors duration-300 hover:border-white/25">
        {/* terminal title bar */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
          <span className="h-[9px] w-[9px] rounded-full bg-red-glow/70" />
          <span className="h-[9px] w-[9px] rounded-full bg-blue-glow/70" />
          <span className="h-[9px] w-[9px] rounded-full bg-azure-glow/70" />
          <span className="ml-2 truncate font-mono text-[10.5px] tracking-[0.08em] text-white/45">
            ~/{tool.name.toLowerCase().replace(/\s+/g, "-")} — {tool.org.toLowerCase()}
          </span>
        </div>

        {/* terminal body */}
        <div className="p-[clamp(18px,2.6vw,26px)]">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className={`font-mono text-sm ${a.text}`}>$</span>
            <h3 className="font-display text-[clamp(1.2rem,2.2vw,1.5rem)] font-bold leading-none text-white">
              {tool.name}
            </h3>
          </div>

          <div className={`mt-2.5 font-mono text-[12.5px] ${a.text}`}>
            <span className="opacity-70">{"// "}</span>
            {tool.role}
          </div>

          <ul className="mt-[clamp(16px,2.4vh,22px)] space-y-[clamp(9px,1.4vh,12px)]">
            {tool.points.map((pt) => (
              <li
                key={pt}
                className="flex gap-3 font-mono text-[clamp(12px,1.3vw,13px)] leading-[1.55] text-white/[0.72]"
              >
                <span className={`shrink-0 ${a.text}`} aria-hidden>
                  →
                </span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>

          {/* blinking prompt */}
          <div className="mt-5 flex items-center gap-1.5 font-mono text-[12px] text-white/35">
            <span className={`${a.text}`}>$</span>
            <span
              className={`inline-block h-[13px] w-[7px] ${a.dot}`}
              style={{ animation: "pulse-slow 1.2s steps(2) infinite" }}
            />
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

export default function AiWorkflow() {
  return (
    <section
      id="ai-workflow"
      className="relative z-[5] mx-auto max-w-[1400px] px-[clamp(20px,4.5vw,64px)] py-[clamp(60px,10vh,120px)]"
    >
      <Reveal className="mb-[clamp(20px,4vh,44px)]">
        <Scramble
          text="( 03 — AI WORKFLOW )"
          className="mb-4 block font-mono text-xs tracking-[0.2em] text-blue-glow"
        />
        <h2 className="m-0 max-w-[16ch] font-display text-[clamp(2rem,5.5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em]">
          {aiWorkflow.heading}
        </h2>
        <p className="mt-5 max-w-[62ch] text-pretty text-[clamp(1rem,1.4vw,1.12rem)] leading-[1.7] text-white/[0.62]">
          {aiWorkflow.intro}
        </p>
      </Reveal>

      <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
        {aiWorkflow.tools.map((tool, i) => (
          <ToolCard key={tool.name} tool={tool} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}
