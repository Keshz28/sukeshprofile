"use client";

import { useTheme } from "../theme/useTheme";
import AnimatedBackground from "./AnimatedBackground";
import SunScene from "./SunScene";
import Starfield from "./Starfield";

/**
 * Mounts the backdrop that matches the active theme:
 *   space → looping nebula video + cool starfield with meteors
 *   sun   → molten sun scene + golden dust motes
 * Unmounting the inactive scene fully stops the space video's decode work
 * while basking in the sun.
 */
export default function SceneManager() {
  const theme = useTheme();

  return (
    <>
      {theme === "sun" ? <SunScene /> : <AnimatedBackground />}
      <Starfield theme={theme} />
    </>
  );
}
