"use client";

import VideoLoop from "./VideoLoop";

// NEAR THE SUN — the light-mode backdrop. Looping solar footage under an ivory
// wash (so bronze text stays readable), with live animation layered on top:
// wheeling god-rays, a breathing corona bloom, heat shimmer off the horizon
// and a diagonal lens-flare trail. Golden dust motes come from <Starfield/>.
export default function SunScene() {
  return (
    <VideoLoop
      src="/sun.mp4"
      fallback="radial-gradient(130% 110% at 82% -8%, #FFE9BE 0%, #FFEFD2 32%, #FFF6E8 62%, #FDF1DE 100%)"
    >
      {/* light warm wash — lets the solar footage shine through while a soft
         text-glow (see globals.css) keeps bronze text legible over it */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,239,214,0.30) 0%, rgba(252,231,197,0.44) 100%)",
        }}
      />

      {/* wheeling god-rays centred on the footage's hot corner */}
      <div
        className="absolute right-[-30vmax] top-[-30vmax] h-[60vmax] w-[60vmax] rounded-full"
        style={{
          background:
            "repeating-conic-gradient(from 0deg, rgba(234,140,20,0.12) 0deg 7deg, transparent 7deg 24deg)",
          maskImage:
            "radial-gradient(circle, rgba(0,0,0,0.9) 15%, transparent 68%)",
          WebkitMaskImage:
            "radial-gradient(circle, rgba(0,0,0,0.9) 15%, transparent 68%)",
          animation: "raysSpin 90s linear infinite",
        }}
      />

      {/* breathing corona bloom over the video's sun */}
      <div
        className="absolute right-[-14vmax] top-[-14vmax] h-[38vmax] w-[38vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,200,90,0.5) 0%, rgba(251,146,60,0.24) 40%, transparent 70%)",
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
            "linear-gradient(0deg, rgba(253,186,116,0.25), rgba(254,215,170,0.08) 55%, transparent)",
          animation: "heatShimmer 7s ease-in-out infinite",
        }}
      />

      {/* gentle vignette keeps edges calm */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(120,53,15,0.08) 100%)",
        }}
      />
    </VideoLoop>
  );
}

const FLARES = [
  { left: "62%", top: "18%", size: "9vmax", color: "rgba(251,191,36,0.18)", opacity: 0.9 },
  { left: "48%", top: "34%", size: "5vmax", color: "rgba(249,115,22,0.15)", opacity: 0.8 },
  { left: "36%", top: "48%", size: "3vmax", color: "rgba(220,38,38,0.12)", opacity: 0.7 },
  { left: "27%", top: "60%", size: "1.6vmax", color: "rgba(234,88,12,0.2)", opacity: 0.7 },
];
