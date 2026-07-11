"use client";

import { useEffect, useState } from "react";

export type Theme = "space" | "sun";

export const THEME_KEY = "kesh-theme";

export function getTheme(): Theme {
  if (typeof document === "undefined") return "space";
  return document.documentElement.dataset.theme === "sun" ? "sun" : "space";
}

/** Swap themes with a View-Transition cross-dissolve when the browser has it. */
export function setTheme(theme: Theme) {
  const apply = () => {
    if (theme === "sun") {
      document.documentElement.dataset.theme = "sun";
    } else {
      delete document.documentElement.dataset.theme;
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* private mode — theme just won't persist */
    }
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => void;
  };
  if (!reduce && typeof doc.startViewTransition === "function") {
    doc.startViewTransition(apply);
  } else {
    apply();
  }
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
