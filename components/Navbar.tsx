"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "AI", href: "#ai-workflow" },
  { label: "Work", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("#home");

  // Scroll spy — subtly brighten the link for the section in view.
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
    // Full-width fixed header that flex-centers the pill — reliable centering
    // that can't drift like left-1/2 + translate once the content gets wide.
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-[18px] z-50 flex justify-center px-3"
    >
      <nav className="glass flex max-w-full items-center gap-2 overflow-hidden rounded-full py-2 pl-3 pr-3 sm:gap-[clamp(10px,2vw,22px)] sm:py-2.5 sm:pl-4 sm:pr-3.5">
        {/* brand */}
        <a
          href="#home"
          data-cursor="hover"
          className="flex shrink-0 items-center gap-2 sm:gap-2.5"
          aria-label={`${profile.name} — home`}
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-gradient font-display text-[13px] font-bold text-ink">
            {profile.initials}
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-[0.01em] text-white sm:inline">
            {profile.name}
          </span>
        </a>

        <span className="h-[18px] w-px shrink-0 bg-white/15" />

        {/* links */}
        <div className="flex gap-2.5 font-mono text-[11px] tracking-[0.03em] sm:gap-[clamp(8px,1.4vw,18px)] sm:text-xs sm:tracking-[0.08em]">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-cursor="hover"
              className={`whitespace-nowrap transition-colors duration-200 ${
                active === link.href
                  ? "text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </motion.header>
  );
}
