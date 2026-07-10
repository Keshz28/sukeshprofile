"use client";

import { aiWorkflow, type AiTool, type Accent } from "@/lib/data";
import Reveal from "./ui/Reveal";

// Full literal class strings per accent so Tailwind's scanner keeps them.
const ACCENT: Record<Accent, { text: string; bar: string; dot: string }> = {
  blue: {
    text: "text-blue-glow",
    bar: "from-blue-brand to-blue-glow",
    dot: "bg-blue-glow",
  },
  azure: {
    text: "text-azure-glow",
    bar: "from-azure-brand to-azure-glow",
    dot: "bg-azure-glow",
  },
  red: {
    text: "text-red-glow",
    bar: "from-red-brand to-red-glow",
    dot: "bg-red-glow",
  },
};

function ToolCard({ tool, delay }: { tool: AiTool; delay: number }) {
  const a = ACCENT[tool.accent] ?? ACCENT.blue;

  return (
    <Reveal delay={delay}>
      <div className="group relative h-full overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.035] p-[clamp(20px,3vw,30px)] backdrop-blur-[10px] transition-colors duration-300 hover:border-white/20">
        {/* accent top bar */}
        <div
          className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${a.bar}`}
        />

        {/* header: name + vendor */}
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <h3 className="font-display text-[clamp(1.25rem,2.4vw,1.55rem)] font-bold leading-none text-white">
            {tool.name}
          </h3>
          <span className="font-mono text-[11px] tracking-[0.04em] text-white/40">
            {tool.org}
          </span>
        </div>

        {/* role, rendered as a code comment */}
        <div className={`mt-2.5 font-mono text-[13px] ${a.text}`}>
          <span className="opacity-70">// </span>
          {tool.role}
        </div>

        {/* bullet points */}
        <ul className="mt-[clamp(18px,2.6vh,24px)] space-y-[clamp(10px,1.6vh,14px)]">
          {tool.points.map((pt) => (
            <li
              key={pt}
              className="flex gap-3 font-mono text-[clamp(12.5px,1.4vw,13.5px)] leading-[1.5] text-white/[0.72]"
            >
              <span className={`shrink-0 ${a.text}`} aria-hidden>
                →
              </span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export default function AiWorkflow() {
  return (
    <section
      id="ai-workflow"
      className="relative z-[5] mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] py-[clamp(60px,10vh,120px)]"
    >
      <Reveal className="mb-[clamp(20px,4vh,44px)]">
        <div className="mb-4 font-mono text-xs tracking-[0.2em] text-blue-glow">
          ( 03 — AI WORKFLOW )
        </div>
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
