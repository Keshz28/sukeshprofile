"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import ThemeToggle from "./theme/ThemeToggle";
import { useClock } from "./ui/useClock";

const LINKS = [
  { n: "01", label: "About", href: "#about" },
  { n: "02", label: "Skills", href: "#skills" },
  { n: "03", label: "AI", href: "#ai-workflow" },
  { n: "04", label: "Work", href: "#projects" },
  { n: "05", label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);
  const clock = useClock();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy — brighten the link whose section owns the viewport.
  useEffect(() => {
    const ids = ["home", ...LINKS.map((l) => l.href.slice(1))];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-white/10 bg-[var(--band)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[64px] max-w-[1400px] items-center justify-between gap-4 px-[clamp(16px,3.5vw,48px)]">
        {/* brand */}
        <a
          href="#home"
          data-cursor="hover"
          className="flex shrink-0 items-center gap-2.5"
          aria-label={`${profile.name} — home`}
        >
          <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-brand-gradient font-display text-[13px] font-bold text-ink">
            {profile.initials}
          </span>
          <span className="hidden flex-col leading-none md:flex">
            <span className="font-display text-[13.5px] font-bold tracking-[0.02em] text-white">
              {profile.name.toUpperCase()}
            </span>
            <span className="mt-1 font-mono text-[9px] tracking-[0.24em] text-white/45">
              PORTFOLIO / 2026
            </span>
          </span>
        </a>

        {/* numbered links */}
        <div className="flex items-center gap-[clamp(10px,2vw,26px)]">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-cursor="hover"
              className={`group relative whitespace-nowrap font-mono text-[11px] tracking-[0.08em] transition-colors duration-200 sm:text-xs ${
                active === link.href
                  ? "text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <sup className="mr-0.5 hidden text-[8px] text-blue-glow lg:inline">
                {link.n}
              </sup>
              {link.label.toUpperCase()}
              <span
                className={`absolute -bottom-1.5 left-0 h-px bg-brand-gradient transition-all duration-300 ${
                  active === link.href ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </a>
          ))}
        </div>

        {/* clock + theme */}
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden font-mono text-[11px] tracking-[0.1em] text-white/50 tabular-nums lg:inline">
            {clock}
          </span>
          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  );
}
