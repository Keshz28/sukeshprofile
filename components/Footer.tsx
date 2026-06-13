"use client";

import { profile, navLinks } from "@/lib/data";
import { GitHub, LinkedIn, Mail } from "./ui/Icons";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12">
      <div className="container-px">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
          {/* brand */}
          <div className="text-center sm:text-left">
            <a href="#home" className="inline-flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient font-display text-sm font-bold text-ink">
                {profile.initials}
              </span>
              <span className="font-display text-sm font-semibold text-white">
                {profile.name}
              </span>
            </a>
            <p className="mt-3 max-w-xs text-sm text-white/45">
              {profile.roles.join(" · ")}
            </p>
          </div>

          {/* links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-white/55 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* socials */}
          <div className="flex gap-3">
            <FooterIcon href={profile.socials.github} label="GitHub">
              <GitHub className="h-4 w-4" />
            </FooterIcon>
            <FooterIcon href={profile.socials.linkedin} label="LinkedIn">
              <LinkedIn className="h-4 w-4" />
            </FooterIcon>
            <FooterIcon href={`mailto:${profile.email}`} label="Email">
              <Mail className="h-4 w-4" />
            </FooterIcon>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-center text-xs text-white/35">
          © {new Date().getFullYear()} {profile.name}. Designed & built with
          Next.js, Tailwind CSS & Framer Motion.
        </div>
      </div>
    </footer>
  );
}

function FooterIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-white/20 hover:text-white"
    >
      {children}
    </a>
  );
}
