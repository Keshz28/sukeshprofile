"use client";

import { profile, contact } from "@/lib/data";
import Reveal from "./ui/Reveal";
import Magnetic from "./ui/Magnetic";
import { useClock } from "./ui/useClock";

// Strip protocol / trailing slash for a cleaner display value.
const pretty = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

type Row = { label: string; value: string; href: string; external?: boolean };

export default function Contact() {
  const clock = useClock();
  const year = new Date().getFullYear();

  // "Say hello" opens WhatsApp with a ready-to-send opener when a number is
  // configured in content.json; otherwise it falls back to email.
  const whatsappMsg = encodeURIComponent(
    `Hi Sukesh! 👋 I just explored your portfolio and I'd love to connect.`
  );
  const helloHref = profile.whatsapp
    ? `https://wa.me/${profile.whatsapp}?text=${whatsappMsg}`
    : `mailto:${profile.email}`;

  // Prominent, clickable contact rows — every link a big obvious tap target.
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
      className="relative z-[5] mx-auto max-w-[1400px] px-[clamp(20px,4.5vw,64px)] pt-[clamp(70px,14vh,160px)]"
    >
      <Reveal>
        <div className="mb-[clamp(20px,4vh,38px)] font-mono text-xs tracking-[0.2em] text-blue-glow">
          ( 06 — LET&apos;S CONNECT )
        </div>

        <div className="flex flex-wrap items-center gap-[clamp(24px,5vw,72px)]">
          <a
            href={`mailto:${profile.email}`}
            data-cursor="hover"
            className="block min-w-0 no-underline"
          >
            <h2 className="m-0 break-words font-display text-[clamp(2rem,9.5vw,9rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-white">
              {contact.heading}
              <br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                {contact.headingAccent}
              </span>
            </h2>
          </a>

          {/* magnetic launch button — WhatsApp chat with a prefilled opener */}
          <Magnetic strength={0.45}>
            <a
              href={helloHref}
              target={profile.whatsapp ? "_blank" : undefined}
              rel={profile.whatsapp ? "noopener noreferrer" : undefined}
              data-cursor="hover"
              aria-label={
                profile.whatsapp
                  ? `Chat with ${profile.name} on WhatsApp`
                  : `Email ${profile.name}`
              }
              className="group relative grid h-[clamp(110px,14vw,170px)] w-[clamp(110px,14vw,170px)] shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md transition-colors duration-300 hover:border-white/35"
            >
              <span
                aria-hidden
                className="absolute inset-[-1px] rounded-full bg-brand-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-20"
              />
              <span className="text-center font-mono text-[clamp(10px,1.1vw,12px)] uppercase tracking-[0.22em] text-white/80">
                Say
                <br />
                hello
                <span className="mt-1 block font-display text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </span>
            </a>
          </Magnetic>
        </div>

        <p className="mt-[clamp(22px,4vh,40px)] max-w-[52ch] text-pretty text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.7] text-white/[0.62]">
          {contact.blurb}
        </p>
      </Reveal>

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
