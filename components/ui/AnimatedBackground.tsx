"use client";

import { useEffect, useRef } from "react";

// Seamless looping background video.
//
// A single <video loop> shows a hard cut at the loop point. To hide it we run
// two stacked copies of the same clip and crossfade between them: while clip A
// plays out its final second, clip B (reset to 0) fades in underneath, then we
// swap roles. The seam dissolves into a soft dissolve so the space footage
// feels continuous.
const FADE = 1.1; // seconds of crossfade before the clip ends

export default function AnimatedBackground() {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    const videos = [a, b];
    let active = 0;          // index currently fading IN / playing
    let armed = false;       // has the crossfade for this cycle started?

    // start with A visible, B hidden & paused at 0
    a.style.opacity = "1";
    b.style.opacity = "0";
    b.pause();

    const onTime = () => {
      const cur = videos[active];
      const nxt = videos[active ^ 1];
      if (!cur.duration || Number.isNaN(cur.duration)) return;

      const remaining = cur.duration - cur.currentTime;

      if (remaining <= FADE && !armed) {
        armed = true;
        nxt.currentTime = 0;
        nxt.play().catch(() => {});
      }

      if (armed) {
        // 0 → 1 across the fade window
        const p = Math.min(1, Math.max(0, (FADE - remaining) / FADE));
        cur.style.opacity = String(1 - p);
        nxt.style.opacity = String(p);
      }
    };

    // when the fading-out clip ends, hand control to the other one
    const onEnded = () => {
      const cur = videos[active];
      cur.style.opacity = "0";
      cur.pause();
      active ^= 1;
      videos[active].style.opacity = "1";
      armed = false;
    };

    a.addEventListener("timeupdate", onTime);
    b.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnded);
    b.addEventListener("ended", onEnded);

    a.play().catch(() => {});

    return () => {
      a.removeEventListener("timeupdate", onTime);
      b.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnded);
      b.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <video
        ref={aRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover transition-none"
        style={{ opacity: 1 }}
      >
        <source src="/space.mp4" type="video/mp4" />
      </video>
      <video
        ref={bRef}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover transition-none"
        style={{ opacity: 0 }}
      >
        <source src="/space.mp4" type="video/mp4" />
      </video>
      {/* dark overlay so text stays legible over bright nebula regions */}
      <div className="absolute inset-0 bg-[#020510]/52" />
    </div>
  );
}
