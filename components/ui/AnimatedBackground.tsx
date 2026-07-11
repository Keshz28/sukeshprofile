"use client";

import VideoLoop from "./VideoLoop";

// DEEP SPACE — the dark-mode backdrop. Looping nebula footage with a dark
// legibility gradient so text floats cleanly over bright nebula regions.
export default function AnimatedBackground() {
  return (
    <VideoLoop
      src="/space.mp4"
      fallback="radial-gradient(120% 90% at 70% 10%, rgba(99,102,241,0.22), transparent 55%), radial-gradient(90% 80% at 15% 90%, rgba(236,72,153,0.16), transparent 55%), #05060A"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,5,16,0.55), rgba(2,5,16,0.72))",
        }}
      />
    </VideoLoop>
  );
}
