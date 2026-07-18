"use client";

import { useEffect, useRef } from "react";
import type { Theme } from "../theme/useTheme";

// Continuous parallax particle field, themed two ways:
//  · "space" — depth-sorted stars drift upward and twinkle; scroll velocity
//    stretches them into warp streaks, and every few seconds a meteor tears a
//    diagonal across the sky. Blended "screen" so stars read as light.
//  · "sun"   — motes of golden dust hang in the light, sinking slowly with a
//    lazy sideways sway; a few white-hot sparkles glint through. Normal blend
//    (dark-warm specks over the bright sky) so they read as backlit dust.

const SPACE_COLORS = ["150,190,255", "205,170,255", "255,255,255", "236,140,210"];
const SUN_COLORS = ["180,83,9", "194,65,12", "217,119,6", "146,64,14"];
const SUN_SPARKLE = "255,255,255";

type Star = {
  x: number;
  y: number;
  z: number;
  r: number;
  base: number;
  tw: number;
  ph: number;
  col: string;
  sparkle?: boolean;
};

type Meteor = { x: number; y: number; vx: number; vy: number; life: number };

export default function Starfield({ theme = "space" }: { theme?: Theme }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sun = theme === "sun";
    const reduce =
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let nextMeteor = Date.now() + 12000 + Math.random() * 12000;
    let scrollVel = 0;
    let lastY = window.scrollY;
    let raf = 0;
    // Pointer parallax — deeper layers shift more, eased so it feels weighty.
    let ptx = 0;
    let pty = 0;
    let px = 0;
    let py = 0;
    // Cursor gravity well (C1) — stars inside this radius fall toward the pointer.
    let pmx = -9999;
    let pmy = -9999;
    const GRAV_R = 190;

    const build = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      const count = reduce ? 60 : Math.min(220, Math.round((w * h) / 9000));
      stars = [];
      for (let i = 0; i < count; i++) {
        const z = 0.2 + Math.random() * 0.8;
        const sparkle = sun && Math.random() < 0.12;
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: sun ? 0.5 + z * 1.6 : 0.4 + z * 1.3,
          base: sun ? 0.12 + Math.random() * 0.2 : 0.35 + Math.random() * 0.6,
          tw: 0.5 + Math.random() * 1.6,
          ph: Math.random() * 6.28,
          col: sparkle
            ? SUN_SPARKLE
            : (sun ? SUN_COLORS : SPACE_COLORS)[
                (Math.random() * 4) | 0
              ],
          sparkle,
        });
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      scrollVel += y - lastY;
      lastY = y;
    };

    const onPointer = (e: PointerEvent) => {
      // -1..1 from viewport centre → a gentle max drift for the deepest layer.
      ptx = (e.clientX / w - 0.5) * 2;
      pty = (e.clientY / h - 0.5) * 2;
      // raw px, used for the cursor's local gravity well
      pmx = e.clientX;
      pmy = e.clientY;
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = Date.now() * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const vel = scrollVel;
      // Ease the parallax offset toward the pointer (space drifts opposite
      // the cursor for depth; sun dust leans with the light, same direction).
      const drift = sun ? 10 : -16;
      px += (ptx * drift - px) * 0.04;
      py += (pty * drift - py) * 0.04;

      for (const s of stars) {
        // space: stars rise (warp up). sun: dust sinks with a lazy sway.
        const drift = sun ? -(s.z * 0.1) : s.z * 0.22;
        const dy = drift + vel * s.z * 0.14;
        s.y -= dy;
        if (sun) s.x += Math.sin(now * 0.4 + s.ph) * 0.08 * s.z;

        // cursor gravity — nearer + nearer-to-camera stars are pulled harder
        if (!reduce) {
          const gx = pmx - s.x;
          const gy = pmy - s.y;
          const gd = Math.hypot(gx, gy);
          if (gd < GRAV_R && gd > 0.5) {
            const pull = (1 - gd / GRAV_R) ** 2 * 0.9 * s.z;
            s.x += (gx / gd) * pull;
            s.y += (gy / gd) * pull;
          }
        }

        if (s.y < 0) s.y += h;
        if (s.y > h) s.y -= h;
        if (s.x < 0) s.x += w;
        if (s.x > w) s.x -= w;

        const twinkle = s.sparkle
          ? Math.max(0, Math.sin(now * s.tw * 2 + s.ph)) ** 3 // rare hard glints
          : 0.6 + 0.4 * Math.sin(now * s.tw + s.ph);
        const a = Math.max(0, Math.min(1, s.base * twinkle));
        const sx = (s.x + px * s.z) * dpr;
        const sy = (s.y + py * s.z) * dpr;
        const streak = reduce ? 0 : Math.min(Math.abs(vel) * s.z * 0.9, 90);
        if (streak > 2) {
          ctx.strokeStyle = `rgba(${s.col},${a})`;
          ctx.lineWidth = Math.max(0.6, s.r * 0.9) * dpr;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx, sy + (dy >= 0 ? 1 : -1) * streak * dpr);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${s.col},${a})`;
          ctx.beginPath();
          ctx.arc(sx, sy, s.r * dpr, 0, 6.283);
          ctx.fill();
        }
      }

      // ── meteors (space only) ──────────────────────────────────────────
      if (!sun && !reduce) {
        if (Date.now() > nextMeteor && meteors.length < 1) {
          const fromLeft = Math.random() < 0.5;
          meteors.push({
            x: fromLeft ? -40 : Math.random() * w * 0.7,
            y: fromLeft ? Math.random() * h * 0.4 : -40,
            vx: 7 + Math.random() * 5,
            vy: 4 + Math.random() * 3,
            life: 1,
          });
          nextMeteor = Date.now() + 18000 + Math.random() * 20000;
        }
        meteors = meteors.filter((m) => m.life > 0);
        for (const m of meteors) {
          m.x += m.vx;
          m.y += m.vy;
          if (m.x > w * 0.75) m.life -= 0.045; // burn out past mid-sky
          const tail = 90;
          const g = ctx.createLinearGradient(
            (m.x - m.vx * tail * 0.12) * dpr,
            (m.y - m.vy * tail * 0.12) * dpr,
            m.x * dpr,
            m.y * dpr
          );
          g.addColorStop(0, "rgba(150,190,255,0)");
          g.addColorStop(1, `rgba(210,225,255,${0.3 * m.life})`);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1 * dpr;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo((m.x - m.vx * tail * 0.12) * dpr, (m.y - m.vy * tail * 0.12) * dpr);
          ctx.lineTo(m.x * dpr, m.y * dpr);
          ctx.stroke();
          if (m.x > w + 60 || m.y > h + 60) m.life = 0;
        }
      }

      // friction so streaks settle when scrolling stops
      scrollVel = vel * 0.9;
      if (Math.abs(scrollVel) < 0.05) scrollVel = 0;
    };

    build();
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", build, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    if (!reduce) window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [theme]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[5]"
      style={{ mixBlendMode: theme === "sun" ? "normal" : "screen" }}
    />
  );
}
