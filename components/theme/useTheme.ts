"use client";

import { useEffect, useState } from "react";

export type Theme = "space" | "sun";

export const THEME_KEY = "kesh-theme";

export function getTheme(): Theme {
  if (typeof document === "undefined") return "space";
  return document.documentElement.dataset.theme === "sun" ? "sun" : "space";
}

/**
 * Swap themes with a themed View-Transition when the browser has it:
 *   space → sun : a sunburst — light expands from the click point and floods
 *                 the page (the sun igniting).
 *   sun → space : an eclipse — the bright page collapses into the click point,
 *                 revealing space behind it (light pulled past the horizon).
 * Pass the click origin (viewport px) for the burst to emanate from the
 * toggle; omitted, it radiates from the top-right where the toggle lives.
 * Falls back to an instant swap for reduced-motion or older browsers.
 */
export function setTheme(theme: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement;

  const apply = () => {
    if (theme === "sun") {
      root.dataset.theme = "sun";
    } else {
      delete root.dataset.theme;
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* private mode — theme just won't persist */
    }
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  };
  if (reduce || typeof doc.startViewTransition !== "function") {
    apply();
    return;
  }

  const x = origin?.x ?? window.innerWidth - 48;
  const y = origin?.y ?? 32;
  // Radius that covers the farthest viewport corner from the origin.
  const r = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );
  root.style.setProperty("--vt-x", `${x}px`);
  root.style.setProperty("--vt-y", `${y}px`);
  root.style.setProperty("--vt-r", `${r}px`);
  root.dataset.vt = theme === "sun" ? "to-sun" : "to-space";

  const vt = doc.startViewTransition(apply);
  vt.finished.finally(() => {
    delete root.dataset.vt;
  });
}

/**
 * Reactive theme value for client components (scene manager, toggle…).
 * Watches the <html data-theme> attribute so every consumer stays in sync
 * no matter which component triggered the switch.
 */
export function useTheme(): Theme {
  const [theme, set] = useState<Theme>("space");

  useEffect(() => {
    set(getTheme());
    const mo = new MutationObserver(() => set(getTheme()));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => mo.disconnect();
  }, []);

  return theme;
}
