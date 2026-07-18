import type { Config } from "tailwindcss";

// ─── Dual-theme token system ────────────────────────────────────────────────
// Every color below resolves to a CSS variable defined in app/globals.css:
//   :root                → "space"  (deep-space dark — default)
//   [data-theme="sun"]   → "sun"    (near-the-sun light)
// `white` is remapped to var(--fg): in space it IS white, near the sun it
// becomes deep bronze — so every text-white/60, border-white/10 and
// bg-white/[0.04] in the codebase re-themes automatically.
const v = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: v("--fg"),
        ink: { DEFAULT: "#05060A", soft: "#0A0C14", card: "#0E1019" },
        blue: { brand: v("--acc1"), glow: v("--acc1-glow") },
        azure: { brand: v("--acc2"), glow: v("--acc2-glow") },
        red: { brand: v("--acc3"), glow: v("--acc3-glow") },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        grotesk: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "brand-gradient": "var(--brand)",
        "radial-glow":
          "radial-gradient(circle at center, rgb(var(--acc1) / 0.25), transparent 60%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
        marquee: "marquee 28s linear infinite",
        shimmer: "shimmer 2s infinite",
        "spin-slow": "spin-slow 60s linear infinite",
        "spin-slower": "spin-slow 120s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
