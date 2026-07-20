"use client";

import { useEffect, useRef } from "react";
import { applyTheme, FLIP_EVENT, type Theme } from "./useTheme";

/**
 * Hyperspace theme swap. Toggling jumps the site to lightspeed: star-streaks
 * accelerate radially out of the centre, whiting out the screen — and under
 * that white-out applyTheme() runs (so the whole Three.js scene tears down and
 * rebuilds unseen) — then the streaks decelerate and the new universe resolves.
 *
 * Cheap and snapshot-free (the View Transitions API snapshotting the live
 * canvas was the old lag). The streak visual runs on rAF, but the theme apply
 * and the teardown are wall-clock timers, so a throttled frame loop can slow
 * the animation yet never strand the swap.
 */
const COVER = 380; // accelerate to the white-out
const REVEAL = 620; // decelerate + fade into the new scene
const TOTAL = COVER + REVEAL;

type Streak = { ang: number; r: number; len: number; speed: number; w: number };

export default function ThemeTransition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      cancelAnimationFrame(raf.current);
      canvas.style.opacity = "0";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const run = (theme: Theme) => {
      clear();
      const sun = theme === "sun";
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.opacity = "1";
      const cx = (w / 2) * dpr;
      const cy = (h / 2) * dpr;
      const maxR = Math.hypot(w, h) * dpr;

      // warm-gold streaks igniting the sun; cool blue-white collapsing to space
      const tint = sun ? "255,225,150" : "190,215,255";

      const N = Math.min(320, Math.round((w * h) / 5200));
      const streaks: Streak[] = Array.from({ length: N }, () => ({
        ang: Math.random() * Math.PI * 2,
        r: Math.random() * 0.25,
        len: 0,
        speed: 0.6 + Math.random() * 0.9,
        w: (0.6 + Math.random() * 1.8) * dpr,
      }));

      const start = performance.now();
      const frame = () => {
        const t = performance.now() - start;
        const p = Math.min(1, t / TOTAL);
        // acceleration curve: slow → fast at the white-out → slow again
        const accel = t < COVER ? (t / COVER) ** 2 : 1 - ((t - COVER) / REVEAL) * 0.7;
        // white-out coverage: ramps to 1 by COVER, fades after
        const cover =
          t < COVER ? (t / COVER) ** 1.6 : Math.max(0, 1 - (t - COVER) / REVEAL);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // streaks
        ctx.lineCap = "round";
        for (const s of streaks) {
          s.r += s.speed * accel * 0.05;
          if (s.r > 1.4) s.r -= 1.4;
          const rr = s.r * s.r * maxR; // depth-warped: fast near the edge
          s.len = 40 * dpr * accel * (0.4 + s.r);
          const dx = Math.cos(s.ang);
          const dy = Math.sin(s.ang);
          const x0 = cx + dx * (rr - s.len);
          const y0 = cy + dy * (rr - s.len);
          const x1 = cx + dx * rr;
          const y1 = cy + dy * rr;
          const a = Math.min(1, s.r * 1.4) * (0.5 + 0.5 * accel);
          ctx.strokeStyle = `rgba(${tint},${a})`;
          ctx.lineWidth = s.w;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }

        // central white-out that hides the scene swap — opaque enough across
        // the whole frame at the peak (normal blend, not screen)
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.62);
        const core = sun ? "255,252,244" : "236,241,255";
        g.addColorStop(0, `rgba(${core},${cover})`);
        g.addColorStop(0.72, `rgba(${core},${cover})`);
        g.addColorStop(1, `rgba(${core},${cover * 0.55})`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (p < 1) raf.current = requestAnimationFrame(frame);
        else {
          canvas.style.opacity = "0";
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      };
      raf.current = requestAnimationFrame(frame);

      // give the scene a matching FOV kick, swap under the white-out, end
      window.dispatchEvent(new CustomEvent("kesh:warp"));
      timers.current.push(window.setTimeout(() => applyTheme(theme), COVER));
      timers.current.push(
        window.setTimeout(() => {
          canvas.style.opacity = "0";
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          cancelAnimationFrame(raf.current);
        }, TOTAL + 80)
      );
    };

    const onFlip = (e: Event) => {
      run((e as CustomEvent<{ theme: Theme }>).detail.theme);
    };
    window.addEventListener(FLIP_EVENT, onFlip);
    return () => {
      window.removeEventListener(FLIP_EVENT, onFlip);
      clear();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[250]"
      style={{ opacity: 0 }}
    />
  );
}
