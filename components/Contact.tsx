"use client";

import { profile, contact } from "@/lib/data";
import Reveal from "./ui/Reveal";
import { useClock } from "./ui/useClock";

// Strip protocol / trailing slash for a cleaner display value.
const pretty = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

type Row = { label: string; value: string; href: string; external?: boolean };

export default function Contact() {
  const clock = useClock();
  const year = new Date().getFullYear();

  // Prominent, clickable contact rows — the fix for "no one can find my links".
  const rows: Row[] = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    {
      label: "GitHub",
      value: pretty(profile.socials.github),
      href: profile.socials.github,
      external: true,
    },
    {
      label: "LinkedIn",
      value: pretty(profile.socials.linkedin),
      href: profile.socials.linkedin,
      external: true,
    },
    ...(profile.phone
      ? [
          {
            label: "Phone",
            value: profile.phone,
            href: `tel:${profile.phone.replace(/\s+/g, "")}`,
          },
        ]
      : []),
  ];

  return (
    <section
      id="contact"
      className="relative z-[5] mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(70px,14vh,160px)]"
    >
      <Reveal>
        <div className="mb-[clamp(20px,4vh,38px)] font-mono text-xs tracking-[0.2em] text-white/50">
          ( 06 — LET&apos;S CONNECT )
        </div>

        <a
          href={`mailto:${profile.email}`}
          data-cursor="hover"
          className="block no-underline"
        >
          <h2 className="m-0 break-words font-display text-[clamp(2rem,10vw,9.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-white">
            {contact.heading}
            <br />
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              {contact.headingAccent}
            </span>
          </h2>
        </a>

        <p className="mt-[clamp(22px,4vh,40px)] max-w-[52ch] text-pretty text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.7] text-white/[0.62]">
          {contact.blurb}
        </p>
      </Reveal>

      {/* Prominent contacts block — every link is a big, obvious tap target. */}
      <Reveal
        delay={0.1}
        className="mt-[clamp(30px,6vh,60px)] border-t border-white/10"
      >
        {rows.map((row) => (
          <a
            key={row.label}
            href={row.href}
            {...(row.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            data-cursor="hover"
            className="group flex items-center justify-between gap-4 border-b border-white/10 py-[clamp(16px,2.6vh,26px)] no-underline transition-[padding,background] duration-300 hover:bg-white/[0.03] hover:px-3.5"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45 transition-colors group-hover:text-white/70">
              {row.label}
            </span>
            <span className="flex min-w-0 items-center gap-2.5 font-display text-[clamp(1.05rem,2.6vw,1.7rem)] font-medium text-white/85 transition-colors group-hover:text-white">
              <span className="truncate">{row.value}</span>
              <span
                aria-hidden
                className="shrink-0 text-blue-glow transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                ↗
              </span>
            </span>
          </a>
        ))}
      </Reveal>

      <footer className="mt-[clamp(50px,10vh,110px)] flex flex-wrap justify-between gap-3.5 border-t border-white/10 py-6 font-mono text-[11px] tracking-[0.1em] text-white/50">
        <span>© {year} SUKESH SURASE</span>
        <span className="flex gap-5">
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="text-white/50 no-underline transition-colors hover:text-white"
          >
            GITHUB
          </a>
          <a
            href={profile.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="text-white/50 no-underline transition-colors hover:text-white"
          >
            LINKEDIN
          </a>
        </span>
        <span>
          <span className="tabular-nums">{clock}</span> — REMOTE
        </span>
      </footer>
    </section>
  );
}
