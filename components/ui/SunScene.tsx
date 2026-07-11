"use client";

// "NEAR THE SUN" — the light-mode backdrop.
// A molten sun hangs just off the top-right corner: pulsing core, breathing
// corona, slowly-wheeling god rays, heat shimmer near the horizon and a faint
// diagonal lens-flare trail. Pure CSS animation — zero per-frame JS.
export default function SunScene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* warm sky wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 110% at 82% -8%, #FFE9BE 0%, #FFEFD2 32%, #FFF6E8 62%, #FDF1DE 100%)",
        }}
      />

      {/* wheeling god-rays (conic spokes centred on the sun) */}
      <div
        className="absolute right-[-30vmax] top-[-30vmax] h-[60vmax] w-[60vmax] rounded-full"
        style={{
          background:
            "repeating-conic-gradient(from 0deg, rgba(234,140,20,0.10) 0deg 7deg, transparent 7deg 24deg)",
          maskImage:
            "radial-gradient(circle, rgba(0,0,0,0.9) 15%, transparent 68%)",
          WebkitMaskImage:
            "radial-gradient(circle, rgba(0,0,0,0.9) 15%, transparent 68%)",
          animation: "raysSpin 90s linear infinite",
        }}
      />

      {/* corona — breathing outer glow */}
      <div
        className="absolute right-[-16vmax] top-[-16vmax] h-[42vmax] w-[42vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,200,90,0.55) 0%, rgba(251,146,60,0.28) 38%, rgba(249,115,22,0.10) 58%, transparent 72%)",
          animation: "sunPulse 9s ease-in-out infinite",
        }}
      />

      {/* the sun's core */}
      <div
        className="absolute right-[-9vmax] top-[-9vmax] h-[24vmax] w-[24vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle, #FFFDF4 0%, #FFE9A8 34%, #FDBA5C 62%, rgba(251,146,60,0.55) 82%, transparent 100%)",
          filter: "blur(2px)",
          animation: "sunPulse 9s ease-in-out infinite",
        }}
      />

      {/* diagonal lens-flare trail falling away from the sun */}
      {FLARES.map((f) => (
        <div
          key={f.left}
          className="absolute rounded-full"
          style={{
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
            background: `radial-gradient(circle, ${f.color} 0%, transparent 70%)`,
            opacity: f.opacity,
          }}
        />
      ))}

      {/* heat shimmer rising off the lower horizon */}
      <div
        className="absolute inset-x-0 bottom-0 h-[38vh]"
        style={{
          background:
            "linear-gradient(0deg, rgba(253,186,116,0.22), rgba(254,215,170,0.08) 55%, transparent)",
          animation: "heatShimmer 7s ease-in-out infinite",
        }}
      />

      {/* gentle vignette keeps edges calm and text readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(120,53,15,0.07) 100%)",
        }}
      />
    </div>
  );
}

const FLARES = [
  { left: "62%", top: "18%", size: "9vmax", color: "rgba(251,191,36,0.16)", opacity: 0.9 },
  { left: "48%", top: "34%", size: "5vmax", color: "rgba(249,115,22,0.14)", opacity: 0.8 },
  { left: "36%", top: "48%", size: "3vmax", color: "rgba(220,38,38,0.12)", opacity: 0.7 },
  { left: "27%", top: "60%", size: "1.6vmax", color: "rgba(234,88,12,0.18)", opacity: 0.7 },
];
