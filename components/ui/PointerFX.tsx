"use client";

import { useEffect, useRef } from "react";

// Custom cursor + comet trail + cursor-following spotlight, fine-pointer only.
//  · a small blend-difference dot replaces the system cursor and swells on
//    interactive elements
//  · a comet tail of fading particles streams behind it (C2)
//  · a soft radial spotlight trails the content
// Touch / coarse-pointer users keep their native cursor and see none of it.

type P = { x: number; y: number; life: number; r: number };

export default function PointerFX() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = !!window.matchMedia && window.matchMedia("(pointer:fine)").matches;
    if (!fine) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.body.classList.add("cursor-none");

    let mx = 0;
    let my = 0;
    let raf = 0;
    let trailRaf = 0;

    const frame = () => {
      raf = 0;
      if (cursorRef.current) {
        cursorRef.current.style.left = mx + "px";
        cursorRef.current.style.top = my + "px";
      }
      if (spotRef.current) {
        spotRef.current.style.setProperty("--x", mx + "px");
        spotRef.current.style.setProperty("--y", my + "px");
      }
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onOver = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      const t = e.target as Element | null;
      const hover = !!(
        t &&
        t.closest &&
        t.closest('a, button, input, textarea, [data-cursor="hover"]')
      );
      cursorRef.current.style.transform = `translate(-50%,-50%) scale(${
        hover ? 2.8 : 1
      })`;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);

    // ── comet trail ────────────────────────────────────────────────────────
    let cleanupTrail = () => {};
    const canvas = canvasRef.current;
    if (canvas && !reduce) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        const size = () => {
          dpr = Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = Math.floor(window.innerWidth * dpr);
          canvas.height = Math.floor(window.innerHeight * dpr);
          canvas.style.width = window.innerWidth + "px";
          canvas.style.height = window.innerHeight + "px";
        };
        size();
        window.addEventListener("resize", size, { passive: true });

        const parts: P[] = [];
        let lastX = 0;
        let lastY = 0;

        const loop = () => {
          trailRaf = requestAnimationFrame(loop);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // emit along the movement vector so fast flicks leave longer tails
          const dx = mx - lastX;
          const dy = my - lastY;
          const dist = Math.hypot(dx, dy);
          if (dist > 1.2) {
            const n = Math.min(4, Math.ceil(dist / 9));
            for (let i = 0; i < n; i++) {
              const t = i / n;
              parts.push({
                x: mx - dx * t,
                y: my - dy * t,
                life: 1,
                r: 1.6 + Math.random() * 2.2,
              });
            }
          }
          lastX = mx;
          lastY = my;

          for (let i = parts.length - 1; i >= 0; i--) {
            const p = parts[i];
            p.life -= 0.035;
            if (p.life <= 0) {
              parts.splice(i, 1);
              continue;
            }
            // drift upward slightly like embers
            p.y -= 0.15;
            const a = p.life * p.life;
            const g = ctx.createRadialGradient(
              p.x * dpr,
              p.y * dpr,
              0,
              p.x * dpr,
              p.y * dpr,
              p.r * 3 * dpr
            );
            g.addColorStop(0, `rgba(190,215,255,${0.5 * a})`);
            g.addColorStop(1, "rgba(140,120,255,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x * dpr, p.y * dpr, p.r * 3 * dpr, 0, 6.283);
            ctx.fill();
          }
          if (parts.length > 240) parts.splice(0, parts.length - 240);
        };
        trailRaf = requestAnimationFrame(loop);
        cleanupTrail = () => {
          cancelAnimationFrame(trailRaf);
          window.removeEventListener("resize", size);
        };
      }
    }

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      if (raf) cancelAnimationFrame(raf);
      cleanupTrail();
      document.body.classList.remove("cursor-none");
    };
  }, []);

  return (
    <>
      <div
        ref={spotRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-[4]"
        style={{
          background:
            "radial-gradient(460px circle at var(--x, 50vw) var(--y, 25vh), rgb(var(--spot) / 0.10), transparent 70%)",
        }}
      />
      {/* Cursor layers must outrank every overlay (takeover 140, menu 150,
          konami 160, boot 200) — we hide the native cursor globally, so if
          these sit underneath a panel the user is left with no pointer. */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[290]"
        style={{ mixBlendMode: "screen" }}
      />
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none fixed left-[-100px] top-0 z-[300] h-[13px] w-[13px] rounded-full"
        style={{
          background: "#e7e9f0",
          transform: "translate(-50%,-50%)",
          transition: "transform .25s cubic-bezier(.16,1,.3,1)",
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}
