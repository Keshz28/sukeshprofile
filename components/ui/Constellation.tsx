"use client";

import { useMemo, useState } from "react";
import { useTheme } from "../theme/useTheme";

/**
 * The active skill category rendered as a star map.
 *
 *   space → each skill is a star, sized by proficiency, joined into a
 *           constellation by faint lines; hovering a star lights it and the
 *           lines fanning out from it.
 *   sun   → each skill is a warm bloom that brightens and swells on hover.
 *
 * Deterministic layout (seeded from the category title) so a category always
 * draws the same figure. Decorative — mirrors the bars beside it, so nothing
 * is lost if a viewer never touches it or reduced-motion is on.
 */

type Skill = { name: string; level: number };

// tiny seeded RNG so layouts are stable per category
function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
function seedFrom(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const W = 300;
const H = 300;

export default function Constellation({
  title,
  skills,
}: {
  title: string;
  skills: Skill[];
}) {
  const theme = useTheme();
  const sun = theme === "sun";
  const [hot, setHot] = useState<number | null>(null);

  // Poisson-ish scatter: reject points that land too close to earlier ones.
  const nodes = useMemo(() => {
    const rand = rng(seedFrom(title) + skills.length);
    const pts: { x: number; y: number; r: number; name: string; level: number }[] = [];
    const pad = 42;
    for (const sk of skills) {
      let best = { x: 0, y: 0 };
      let bestD = -1;
      for (let tries = 0; tries < 24; tries++) {
        const c = {
          x: pad + rand() * (W - pad * 2),
          y: pad + rand() * (H - pad * 2),
        };
        let d = Infinity;
        for (const p of pts) d = Math.min(d, Math.hypot(p.x - c.x, p.y - c.y));
        if (pts.length === 0) d = Infinity;
        if (d > bestD) {
          bestD = d;
          best = c;
        }
      }
      pts.push({ ...best, r: 3 + (sk.level / 100) * 6, name: sk.name, level: sk.level });
    }
    return pts;
  }, [title, skills]);

  // Connect each node to its 2 nearest neighbours → an organic web.
  const edges = useMemo(() => {
    const es: { a: number; b: number }[] = [];
    const seen = new Set<string>();
    nodes.forEach((n, i) => {
      const near = nodes
        .map((m, j) => ({ j, d: Math.hypot(m.x - n.x, m.y - n.y) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      for (const o of near) {
        const key = i < o.j ? `${i}-${o.j}` : `${o.j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          es.push({ a: i, b: o.j });
        }
      }
    });
    return es;
  }, [nodes]);

  const stroke = sun ? "234,140,20" : "150,190,255";
  const core = sun ? "255,244,214" : "255,255,255";

  return (
    <div className="relative aspect-square w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full overflow-visible"
        role="img"
        aria-label={`${title} skills, visualised as a constellation`}
      >
        {/* connecting lines */}
        {edges.map(({ a, b }, i) => {
          const lit = hot === a || hot === b;
          return (
            <line
              key={i}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              stroke={`rgba(${stroke},${lit ? 0.85 : 0.16})`}
              strokeWidth={lit ? 1.4 : 0.7}
              style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
            />
          );
        })}

        {/* nodes */}
        {nodes.map((n, i) => {
          const lit = hot === i;
          return (
            <g
              key={n.name}
              onMouseEnter={() => setHot(i)}
              onMouseLeave={() => setHot((h) => (h === i ? null : h))}
              style={{ cursor: "pointer" }}
            >
              {/* glow halo */}
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r * (lit ? 3.4 : 2.2)}
                fill={`rgba(${stroke},${lit ? 0.3 : 0.12})`}
                style={{
                  transition: "r 0.35s cubic-bezier(.22,1,.36,1), fill 0.3s",
                  filter: "blur(2px)",
                }}
              />
              {/* core */}
              <circle
                cx={n.x}
                cy={n.y}
                r={lit ? n.r * 1.35 : n.r}
                fill={`rgb(${lit ? core : stroke})`}
                style={{ transition: "r 0.3s cubic-bezier(.22,1,.36,1), fill 0.3s" }}
              />
              {/* hit target (invisible, generous) */}
              <circle cx={n.x} cy={n.y} r={16} fill="transparent" />
              {/* label on hover */}
              <text
                x={n.x}
                y={n.y - n.r - 9}
                textAnchor="middle"
                className="font-mono"
                fontSize="10"
                fill={`rgb(${core})`}
                style={{
                  opacity: lit ? 1 : 0,
                  transition: "opacity 0.25s",
                  pointerEvents: "none",
                }}
              >
                {n.name} · {n.level}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
