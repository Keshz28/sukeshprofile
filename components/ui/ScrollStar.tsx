"use client";

import { useEffect, useRef } from "react";

// ── Wavy edge-to-edge path ───────────────────────────────────────────────────
// Instead of straight diagonal hops, the star follows a smooth cosine wave that
// sweeps full-width left ↔ right as the user scrolls 0 → 100 %. SWINGS controls
// how many times it crosses the screen (≈ one swing per section). The horizontal
// reach spills slightly past the edges so it enters from off-screen and exits
// off-screen — a real shooting star — while gently bobbing up and down.
const SWINGS    = 5;     // full-width crossings over the whole page
const X_CENTER  = 0.5;
const X_AMP     = 0.56;  // 0.5 ± 0.56  →  -0.06 … 1.06  (off both edges)
const Y_CENTER  = 0.42;
const Y_AMP     = 0.13;

interface Trail { x: number; y: number; }

// ── Component ─────────────────────────────────────────────────────────────────
export default function ScrollStar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;

    // Spring state — start at the wave's origin (off-screen left)
    let sx = (X_CENTER + X_AMP) * w;
    let sy = Y_CENTER * h;
    let vx = 0, vy = 0;

    let scrollY = 0;
    const trail: Trail[] = [];
    let raf = 0, lastT = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("resize", resize,   { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (t - lastT < 16) return;
      lastT = t;

      const time = t * 0.001;
      ctx.clearRect(0, 0, w, h);

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - h);
      const frac      = Math.min(1, scrollY / maxScroll);            // 0 → 1

      // Smooth cosine wave sweeps the star edge-to-edge, while a slower sine
      // bobs it vertically — the two combine into a flowing wavy path.
      const phase = frac * SWINGS * Math.PI;
      const tx = (X_CENTER + X_AMP * Math.cos(phase)) * w;
      const ty = (Y_CENTER + Y_AMP * Math.sin(phase * 0.5 + Math.PI / 4)) * h;

      // Spring chase
      const TENSION = 0.052, DAMPING = 0.82;
      vx = (vx + (tx - sx) * TENSION) * DAMPING;
      vy = (vy + (ty - sy) * TENSION) * DAMPING;
      sx += vx; sy += vy;

      // Speed drives brightness — the faster it streaks, the more it blazes.
      const speed = Math.hypot(vx, vy);
      const heat  = Math.min(1, speed / 14);          // 0 (parked) → 1 (racing)
      const heading = Math.atan2(vy, vx);

      // ── Luminous comet trail ──────────────────────────────────────────
      trail.push({ x: sx, y: sy });
      if (trail.length > 60) trail.shift();

      ctx.save();
      ctx.globalCompositeOperation = "lighter";   // additive = shiny
      for (let k = 1; k < trail.length; k++) {
        const p = k / trail.length;                // 0 tail → 1 head
        const a = Math.pow(p, 1.6) * (0.30 + heat * 0.65);
        ctx.beginPath();
        ctx.moveTo(trail[k - 1].x, trail[k - 1].y);
        ctx.lineTo(trail[k].x,     trail[k].y);
        ctx.strokeStyle = `rgba(214,236,255,${a.toFixed(3)})`;
        ctx.lineWidth   = p * (2.6 + heat * 2.4);
        ctx.lineCap     = "round";
        ctx.stroke();
      }
      // bright inner thread along the trail
      for (let k = 1; k < trail.length; k++) {
        const p = k / trail.length;
        const a = Math.pow(p, 2.4) * (0.4 + heat * 0.55);
        ctx.beginPath();
        ctx.moveTo(trail[k - 1].x, trail[k - 1].y);
        ctx.lineTo(trail[k].x,     trail[k].y);
        ctx.strokeStyle = `rgba(255,255,255,${a.toFixed(3)})`;
        ctx.lineWidth   = p * (0.9 + heat * 1.0);
        ctx.lineCap     = "round";
        ctx.stroke();
      }
      ctx.restore();

      // ── The star head — small, but blazing bright ─────────────────────
      const pulse = 0.9 + 0.1 * Math.sin(time * 4);
      // brightness blends so it stays subtly "hidden in the video" at rest
      // and flares up brilliantly while travelling.
      const glow = 0.45 + heat * 0.55;

      ctx.save();
      ctx.translate(sx, sy);
      ctx.globalCompositeOperation = "lighter";

      // soft outer halo (small radius — keeps the star compact)
      const haloR = (14 + heat * 16) * pulse;
      const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, haloR);
      halo.addColorStop(0,    `rgba(170,212,255,${(0.30 * glow).toFixed(3)})`);
      halo.addColorStop(0.5,  `rgba(110,170,255,${(0.10 * glow).toFixed(3)})`);
      halo.addColorStop(1,    "rgba(80,140,240,0)");
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(0, 0, haloR, 0, Math.PI * 2); ctx.fill();

      // thin streak spikes aligned to travel direction (the "shooting" look)
      const drawSpike = (ang: number, len: number, hw: number, alpha: number) => {
        ctx.save();
        ctx.rotate(ang);
        const g = ctx.createLinearGradient(0, 0, len, 0);
        g.addColorStop(0, `rgba(255,255,255,${alpha.toFixed(3)})`);
        g.addColorStop(1, "rgba(150,200,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(0, -hw); ctx.lineTo(len, 0); ctx.lineTo(0, hw);
        ctx.closePath(); ctx.fill();
        ctx.restore();
      };
      const spikeLen = (10 + heat * 26) * pulse;
      drawSpike(heading,            spikeLen,        1.4, glow);
      drawSpike(heading + Math.PI,  spikeLen * 0.7,  1.4, glow);
      drawSpike(heading + Math.PI/2, spikeLen * 0.45, 0.9, glow * 0.7);
      drawSpike(heading - Math.PI/2, spikeLen * 0.45, 0.9, glow * 0.7);

      // intense little core
      const coreR = 3.4 * pulse;
      const core = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR);
      core.addColorStop(0,   `rgba(255,255,255,${(0.55 + glow * 0.45).toFixed(3)})`);
      core.addColorStop(0.6, `rgba(225,242,255,${(0.4 * glow + 0.2).toFixed(3)})`);
      core.addColorStop(1,   "rgba(190,222,255,0)");
      ctx.fillStyle = core;
      ctx.beginPath(); ctx.arc(0, 0, coreR, 0, Math.PI * 2); ctx.fill();

      ctx.restore();
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      // sits above the video but behind page text
      className="pointer-events-none fixed inset-0 -z-[5]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
