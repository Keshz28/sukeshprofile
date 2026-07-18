"use client";

import { setTheme, useTheme } from "./useTheme";

/**
 * Space ↔ Sun switch. One SVG morphs between a sun (rays scale in, core grows)
 * and a crescent-ish starfield moon (rays collapse, mask slides) — all CSS
 * transitions, no extra deps.
 */
export default function ThemeToggle() {
  const theme = useTheme();
  const isSun = theme === "sun";

  return (
    <button
      type="button"
      data-cursor="hover"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTheme(isSun ? "space" : "sun", {
          x: r.left + r.width / 2,
          y: r.top + r.height / 2,
        });
      }}
      aria-label={isSun ? "Switch to deep-space mode" : "Switch to near-the-sun mode"}
      title={isSun ? "Back to deep space" : "Fly near the sun"}
      className="group relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full border border-white/15 bg-white/[0.05] transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.1]"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[15px] w-[15px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden
      >
        {/* core: small disc in space (a distant star), full sun when near it */}
        <circle
          cx="12"
          cy="12"
          fill="currentColor"
          stroke="none"
          className="text-white transition-all duration-500 ease-out"
          r={isSun ? 4.4 : 2.6}
        />
        {/* rays — collapse to nothing in space mode */}
        <g
          className="origin-center text-white transition-all duration-500 ease-out"
          style={{
            transform: isSun ? "scale(1) rotate(0deg)" : "scale(0) rotate(-90deg)",
            opacity: isSun ? 1 : 0,
            transformOrigin: "12px 12px",
          }}
        >
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4 19 19M19 5l-1.6 1.6M6.6 17.4 5 19" />
        </g>
        {/* tiny stars — only visible in space mode */}
        <g
          fill="currentColor"
          stroke="none"
          className="text-white transition-opacity duration-500"
          style={{ opacity: isSun ? 0 : 1 }}
        >
          <circle cx="5.5" cy="6.5" r="0.9" />
          <circle cx="18.5" cy="5.5" r="0.7" />
          <circle cx="17.5" cy="18" r="0.9" />
          <circle cx="5" cy="17" r="0.6" />
        </g>
      </svg>
    </button>
  );
}
