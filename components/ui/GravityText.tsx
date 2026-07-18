"use client";

import { useEffect, useRef } from "react";

/**
 * H1 — display type that behaves like matter near a mass.
 *
 * On mount each glyph arrives as debris (random offset / rotation / scale) and
 * snaps into place with a staggered ease. After settling, glyphs are displaced
 * by the cursor: near letters are shoved aside and drift back, so the headline
 * feels like it's sitting in a gravity field.
 *
 * `gradient` colours the word by sampling a linear ramp per character — this
 * reads as a gradient across the word while keeping every glyph a solid colour,
 * which `background-clip: text` can't survive once glyphs are transformed.
 */
const EASE = "cubic-bezier(.16,1,.3,1)";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** Sample a multi-stop ramp at t (0..1) → "rgb(r,g,b)". */
function sampleRamp(stops: string[], t: number) {
  if (stops.length === 1) return stops[0];
  const seg = 1 / (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(t / seg));
  const local = (t - i * seg) / seg;
  const a = hexToRgb(stops[i]);
  const b = hexToRgb(stops[i + 1]);
  const c = a.map((v, k) => Math.round(v + (b[k] - v) * local));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

export default function GravityText({
  text,
  className,
  delay = 0,
  gradient,
  style,
}: {
  text: string;
  className?: string;
  delay?: number;
  gradient?: string[];
  style?: React.CSSProperties;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const glyphs = Array.from(
      wrap.querySelectorAll<HTMLElement>("[data-glyph]")
    );

    // ── entrance: debris → snap ──────────────────────────────────────────
    // Driven by a CSS keyframe (not rAF) so a throttled/paused frame loop can
    // never strand a glyph at opacity 0. The settle timer below is the
    // belt-and-braces guarantee that the name always ends up visible.
    glyphs.forEach((g, i) => {
      const rx = (Math.random() - 0.5) * 260;
      const ry = (Math.random() - 0.5) * 200 - 40;
      const rr = (Math.random() - 0.5) * 90;
      g.style.setProperty("--gx", `${rx}px`);
      g.style.setProperty("--gy", `${ry}px`);
      g.style.setProperty("--gr", `${rr}deg`);
      g.style.animation = `glyphIn 1.1s ${EASE} ${delay + i * 0.035}s both`;
    });

    // ── settled: cursor gravity ──────────────────────────────────────────
    const settleAt = (delay + glyphs.length * 0.035 + 1.2) * 1000;
    let raf = 0;
    let live = false;
    const mouse = { x: -9999, y: -9999 };
    const cur = glyphs.map(() => ({ x: 0, y: 0 }));
    const R = 130;

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      for (let i = 0; i < glyphs.length; i++) {
        const g = glyphs[i];
        const r = g.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - mouse.x;
        const dy = cy - mouse.y;
        const d = Math.hypot(dx, dy);
        let tx = 0;
        let ty = 0;
        if (d < R && d > 0.01) {
          const force = (1 - d / R) ** 2 * 26;
          tx = (dx / d) * force;
          ty = (dy / d) * force;
        }
        cur[i].x += (tx - cur[i].x) * 0.12;
        cur[i].y += (ty - cur[i].y) * 0.12;
        if (Math.abs(cur[i].x) > 0.05 || Math.abs(cur[i].y) > 0.05) {
          g.style.transform = `translate(${cur[i].x.toFixed(2)}px, ${cur[i].y.toFixed(2)}px)`;
        } else if (live) {
          g.style.transform = "translate(0,0)";
        }
      }
    };

    const start = window.setTimeout(() => {
      live = true;
      // hard-commit the settled state, then hand control to the cursor field
      glyphs.forEach((g) => {
        g.style.animation = "none";
        g.style.transition = "none";
        g.style.opacity = "1";
        g.style.transform = "translate(0,0)";
      });
      window.addEventListener("pointermove", onMove, { passive: true });
      raf = requestAnimationFrame(loop);
    }, settleAt);

    return () => {
      clearTimeout(start);
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [text, delay]);

  const chars = [...text];

  return (
    <span ref={wrapRef} className={className} style={style} aria-label={text}>
      {chars.map((ch, i) => (
        <span
          key={i}
          data-glyph
          aria-hidden
          className="inline-block will-change-transform"
          style={
            gradient
              ? {
                  color: sampleRamp(
                    gradient,
                    chars.length > 1 ? i / (chars.length - 1) : 0
                  ),
                }
              : undefined
          }
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
