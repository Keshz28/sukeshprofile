"use client";

import { useEffect, useRef } from "react";

// Custom cursor + cursor-following spotlight, fine-pointer only.
// A small blend-difference dot replaces the system cursor and swells when
// hovering interactive elements; a soft radial spotlight trails behind the
// content. Touch / coarse-pointer users keep their native cursor and see
// neither layer.
export default function PointerFX() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = !!window.matchMedia && window.matchMedia("(pointer:fine)").matches;
    if (!fine) return;

    document.body.classList.add("cursor-none");

    let mx = 0;
    let my = 0;
    let raf = 0;

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
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      if (raf) cancelAnimationFrame(raf);
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
            "radial-gradient(460px circle at var(--x, 50vw) var(--y, 25vh), rgba(96,165,250,0.10), transparent 70%)",
        }}
      />
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none fixed left-[-100px] top-0 z-[100] h-[13px] w-[13px] rounded-full"
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
