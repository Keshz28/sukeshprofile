import type { Config } from "tailwindcss";

// Mirrors the portfolio's brand tokens so the Studio feels like the same product.
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#05060A",
          soft: "#0A0C14",
          card: "#0E1019",
        },
        blue: { brand: "#2563EB", glow: "#60A5FA" },
        azure: { brand: "#6366F1", glow: "#818CF8" },
        red: { brand: "#EF4444", glow: "#F87171" },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(120deg, #3B82F6 0%, #7C3AED 50%, #EC4899 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
