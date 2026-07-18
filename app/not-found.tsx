import Link from "next/link";

export const metadata = {
  title: "404 — Lost in space",
};

// E6 — a page that drifted out of the shipping lanes. Deliberately static and
// dependency-free so it loads instantly even when the main bundle doesn't.
export default function NotFound() {
  return (
    <main
      className="relative grid min-h-screen place-items-center overflow-hidden px-6"
      style={{
        background:
          "radial-gradient(120% 90% at 78% 12%, rgba(124,58,237,0.28), transparent 52%)," +
          "radial-gradient(90% 80% at 12% 88%, rgba(236,72,153,0.18), transparent 55%)," +
          "#05060A",
      }}
    >
      {/* drifting debris */}
      <div className="pointer-events-none absolute inset-0">
        {DOTS.map((d, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/70"
            style={{
              left: d.x,
              top: d.y,
              width: d.r,
              height: d.r,
              animation: `float ${d.dur}s ease-in-out ${d.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative text-center">
        <div className="font-mono text-[11px] tracking-[0.3em] text-blue-glow">
          SIGNAL LOST
        </div>

        <h1 className="mt-5 font-display text-[clamp(5rem,22vw,14rem)] font-bold leading-none tracking-[-0.04em] text-white">
          <span className="bg-brand-gradient bg-clip-text text-transparent">
            404
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-[46ch] text-pretty text-[clamp(0.95rem,1.5vw,1.1rem)] leading-relaxed text-white/60">
          This page drifted past the event horizon. Nothing escapes from there —
          not even light, and evidently not this URL.
        </p>

        <Link
          href="/"
          className="mt-9 inline-flex items-center gap-2 rounded-[14px] bg-brand-gradient px-6 py-3.5 font-display text-[15px] font-bold text-ink transition-transform duration-200 hover:scale-[1.03]"
        >
          ← Return to orbit
        </Link>
      </div>
    </main>
  );
}

const DOTS = [
  { x: "12%", y: "22%", r: 3, dur: 7, delay: 0 },
  { x: "82%", y: "18%", r: 2, dur: 9, delay: 1.1 },
  { x: "68%", y: "74%", r: 4, dur: 8, delay: 0.5 },
  { x: "24%", y: "68%", r: 2, dur: 6, delay: 2.2 },
  { x: "45%", y: "12%", r: 2, dur: 10, delay: 1.6 },
  { x: "90%", y: "52%", r: 3, dur: 7.5, delay: 0.8 },
];
