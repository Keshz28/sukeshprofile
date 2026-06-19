"use client";

import { useRef, type ReactNode } from "react";

// Pointer-reactive 3D tilt for cards (fine-pointer only). The card leans toward
// the cursor and lifts slightly, then eases back on leave. Coarse-pointer users
// get a plain static card.
export default function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer:fine)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = "transform .08s linear";
    el.style.transform = `perspective(900px) rotateX(${-py * 7}deg) rotateY(${
      px * 7
    }deg) translateY(-5px)`;
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform .5s cubic-bezier(.16,1,.3,1)";
    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      className={className}
    >
      {children}
    </div>
  );
}
