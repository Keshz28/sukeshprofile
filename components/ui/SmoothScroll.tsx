"use client";

import { useEffect } from "react";

/**
 * Momentum smooth-scroll (Lenis) wired into the GSAP ticker so ScrollTrigger
 * effects (Phase 2+) scrub against the eased scroll position. Also upgrades
 * in-page anchor links to eased scrolls. Everything is dynamically imported so
 * the static export never touches these libs during SSR, and the whole thing
 * no-ops under prefers-reduced-motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let destroy = () => {};

    (async () => {
      const [{ default: Lenis }, gsapMod, stMod] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      const gsap = gsapMod.gsap ?? gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger ?? stMod.default;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      });

      // expose so other components (e.g. nav, project deck) can scrollTo
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;

      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // eased in-page anchor navigation (skips the theme toggle etc.)
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement)?.closest?.(
          'a[href^="#"]'
        ) as HTMLAnchorElement | null;
        if (!a) return;
        const hash = a.getAttribute("href");
        if (!hash || hash === "#") return;
        const target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -72 });
      };
      document.addEventListener("click", onClick);

      destroy = () => {
        document.removeEventListener("click", onClick);
        gsap.ticker.remove(tick);
        lenis.destroy();
        delete (window as unknown as { __lenis?: unknown }).__lenis;
      };
    })();

    return () => destroy();
  }, []);

  return null;
}
