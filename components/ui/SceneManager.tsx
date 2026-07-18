"use client";

import { useTheme } from "../theme/useTheme";
import SunScene from "./SunScene";
import Starfield from "./Starfield";
import SpaceScene from "../webgl/SpaceScene";

/**
 * Mounts the backdrop that matches the active theme:
 *   space → live WebGL universe (nebula + GPU stars + black hole) on desktop,
 *           a static nebula gradient on mobile / reduced-motion
 *   sun   → molten sun video scene + golden dust motes
 * The DOM starfield layers foreground twinkle/meteors (space) or dust (sun)
 * on top of whichever backdrop is active.
 */
export default function SceneManager() {
  const theme = useTheme();

  return (
    <>
      {theme === "sun" ? <SunScene /> : <SpaceScene />}
      <Starfield theme={theme} />
    </>
  );
}
