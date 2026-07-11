"use client";

// Decorative orbital system floating behind the hero: two concentric dashed
// rings wheeling at different speeds, each carrying a small "planet". Uses
// theme accent tokens, so in space mode the planets glow nebula-blue/pink and
// near the sun they read as Mercury & Venus circling the light.
export default function OrbitRings() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 -z-[1] -translate-x-1/2 -translate-y-1/2"
    >
      {/* outer ring */}
      <div
        className="grid place-items-center rounded-full border border-dashed border-white/[0.08]"
        style={{
          width: "min(78vmin, 640px)",
          height: "min(78vmin, 640px)",
          animation: "orbit 80s linear infinite",
        }}
      >
        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-glow/80 shadow-[0_0_12px_2px_rgb(var(--acc1)/0.55)]" />
      </div>

      {/* inner ring — counter-rotating */}
      <div
        className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-dashed border-white/[0.1]"
        style={{
          width: "min(52vmin, 430px)",
          height: "min(52vmin, 430px)",
          animation: "orbit 50s linear infinite reverse",
        }}
      >
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-glow/80 shadow-[0_0_10px_2px_rgb(var(--acc3)/0.5)]" />
      </div>
    </div>
  );
}
