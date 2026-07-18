"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

// N1 — cinematic fullscreen navigation. Opens over the universe with a heavy
// blur so the black hole still bleeds through, then staggers giant numbered
// links up from behind a mask.
//
// Like the boot sequence, enter/exit are CSS transitions with wall-clock
// unmounting — never gated on animation callbacks, so a throttled rAF can't
// strand the overlay open with scroll locked.
const LINKS = [
  { n: "01", label: "About", href: "#about", hint: "The story" },
  { n: "02", label: "Skills", href: "#skills", hint: "What I bring" },
  { n: "03", label: "AI", href: "#ai-workflow", hint: "How I build" },
  { n: "04", label: "Work", href: "#projects", hint: "Selected projects" },
  { n: "05", label: "Contact", href: "#contact", hint: "Say hello" },
];

const FADE = 420;

export default function MenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [render, setRender] = useState(false);
  const [shown, setShown] = useState(false);

  // mount → next tick → play in; close → play out → unmount on a timer
  useEffect(() => {
    if (open) {
      setRender(true);
      const t = setTimeout(() => setShown(true), 20);
      return () => clearTimeout(t);
    }
    setShown(false);
    const t = setTimeout(() => setRender(false), FADE);
    return () => clearTimeout(t);
  }, [open]);

  // scroll lock + escape, only while actually open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lenis = (window as unknown as { __lenis?: { stop?: () => void; start?: () => void } })
      .__lenis;
    lenis?.stop?.();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      lenis?.start?.();
    };
  }, [open, onClose]);

  if (!render) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className={`fixed inset-0 z-[150] transition-opacity ease-out ${
        shown ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{ transitionDuration: `${FADE}ms` }}
    >
      {/* backdrop — blurred so the universe still shows through */}
      <div
        className="absolute inset-0 bg-ink/80 backdrop-blur-2xl"
        onClick={onClose}
      />

      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-center px-[clamp(20px,4.5vw,64px)] py-24">
        {/* links */}
        <nav className="flex flex-col">
          {LINKS.map((l, i) => (
            <span key={l.href} className="overflow-hidden">
              <a
                href={l.href}
                data-cursor="hover"
                onClick={onClose}
                className="group flex items-baseline gap-[clamp(12px,2vw,28px)] border-b border-white/10 py-[clamp(10px,1.8vh,20px)] no-underline transition-[padding] duration-300 hover:pl-3"
                style={{
                  transform: shown ? "translateY(0)" : "translateY(110%)",
                  opacity: shown ? 1 : 0,
                  transition: `transform 700ms cubic-bezier(.16,1,.3,1) ${
                    80 + i * 70
                  }ms, opacity 500ms ease ${80 + i * 70}ms`,
                }}
              >
                <span className="font-mono text-[11px] text-blue-glow">{l.n}</span>
                <span className="font-display text-[clamp(2.2rem,7vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white/85 transition-colors duration-300 group-hover:text-white">
                  {l.label}
                </span>
                <span className="ml-auto hidden font-mono text-[11px] tracking-[0.14em] text-white/35 transition-colors duration-300 group-hover:text-white/70 sm:block">
                  {l.hint}
                </span>
                <span
                  aria-hidden
                  className="font-display text-2xl text-white opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                >
                  ↗
                </span>
              </a>
            </span>
          ))}
        </nav>

        {/* footer row */}
        <div
          className="mt-[clamp(24px,5vh,56px)] flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] tracking-[0.12em] text-white/50"
          style={{
            opacity: shown ? 1 : 0,
            transition: `opacity 500ms ease ${80 + LINKS.length * 70}ms`,
          }}
        >
          <a
            href={`mailto:${profile.email}`}
            data-cursor="hover"
            className="transition-colors hover:text-white"
          >
            {profile.email}
          </a>
          <span className="flex gap-5">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="transition-colors hover:text-white"
            >
              GITHUB
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="transition-colors hover:text-white"
            >
              LINKEDIN
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
