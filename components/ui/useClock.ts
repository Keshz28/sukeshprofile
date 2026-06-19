"use client";

import { useEffect, useState } from "react";

/**
 * Live HH:MM:SS clock. Renders a stable "00:00:00" on the server and first
 * client paint (so there's no hydration mismatch), then ticks every second.
 */
export function useClock() {
  const [time, setTime] = useState("00:00:00");

  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const tick = () => {
      const d = new Date();
      setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}
