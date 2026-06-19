"use client";

import { useEffect, useRef } from "react";

// Continuous parallax starfield (ported from the Portfolio.dc design).
// A field of depth-sorted stars drifts upward and twinkles; scroll velocity
// stretches them into motion streaks for a warp-speed feel. Sits above the
// space video but behind the page content, blended with "screen" so the stars
// read as light over the nebula footage.

// "Nebula" accent palette — rgb triplets.
const COLORS = ["150,190,255", "205,170,255", "255,255,255", "236,140,210"];

type Star = {
  x: number;
  y: number;
  z: number;
  r: number;
  base: number;
  tw: number;
  ph: number;
  col: string;
};

export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce =
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let scrollVel = 0;
    let lastY = window.scrollY;
    let raf = 0;

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
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 0.4 + z * 1.3,
          base: 0.35 + Math.random() * 0.6,
          tw: 0.5 + Math.random() * 1.6,
          ph: Math.random() * 6.28,
          col: COLORS[(Math.random() * COLORS.length) | 0],
        });
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      scrollVel += y - lastY;
      lastY = y;
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = Date.now() * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const vel = scrollVel;
      for (const s of stars) {
        const dy = s.z * 0.22 + vel * s.z * 0.14;
        s.y -= dy;
        if (s.y < 0) s.y += h;
        if (s.y > h) s.y -= h;
        const a = Math.max(
          0,
          Math.min(1, s.base * (0.6 + 0.4 * Math.sin(now * s.tw + s.ph)))
        );
        const sx = s.x * dpr;
        const sy = s.y * dpr;
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
      // friction so streaks settle when scrolling stops
      scrollVel = vel * 0.9;
      if (Math.abs(scrollVel) < 0.05) scrollVel = 0;
    };

    build();
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", build, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[5]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
