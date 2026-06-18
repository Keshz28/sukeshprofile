"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import { ArrowDown, ArrowUpRight, Download, GitHub, LinkedIn } from "./ui/Icons";
import Magnetic from "./ui/Magnetic";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.5, 0.3, 1] } },
};

function RoleRotator() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % profile.roles.length),
      2400
    );
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-grid h-[1.3em] overflow-hidden align-bottom">
      {profile.roles.map((role, i) => (
        <motion.span
          key={role}
          className="col-start-1 row-start-1 text-gradient"
          initial={false}
          animate={
            i === index
              ? { y: "0%", opacity: 1 }
              : { y: i < index ? "-110%" : "110%", opacity: 0 }
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {role}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center pt-28"
    >
      {/* cosmic hero glow — pure CSS, zero JS cost */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div
          className="h-[680px] w-[680px] rounded-full animate-pulse-slow"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.10) 0%, rgba(79,25,200,0.05) 45%, transparent 70%)",
          }}
        />
      </div>

      <div className="container-px">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-4xl text-center"
        >
          {/* availability pill */}
          <motion.div variants={item} className="mb-7 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-950/30 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-glow opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-brand" />
              </span>
              Open to opportunities · {profile.location}
            </span>
          </motion.div>

          {/* name */}
          <motion.h1
            variants={item}
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
            style={{ textShadow: "0 0 80px rgba(139,92,246,0.30), 0 0 160px rgba(109,40,217,0.15)" }}
          >
            Hi, I&apos;m {profile.name}
          </motion.h1>

          {/* role rotator */}
          <motion.p
            variants={item}
            className="mt-4 font-display text-2xl font-semibold sm:text-3xl md:text-4xl"
          >
            <RoleRotator />
          </motion.p>

          {/* tagline */}
          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/60 sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Magnetic>
              <a
                href="#projects"
                className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-ink transition-transform duration-200 hover:scale-[1.03]"
              >
                View Projects
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>

            <Magnetic>
              <a
                href={profile.resumeUrl}
                download
                className="group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/10"
              >
                <Download className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                Download Resume
              </a>
            </Magnetic>
          </motion.div>

          {/* socials */}
          <motion.div
            variants={item}
            className="mt-10 flex items-center justify-center gap-3"
          >
            <SocialIcon href={profile.socials.github} label="GitHub">
              <GitHub className="h-5 w-5" />
            </SocialIcon>
            <SocialIcon href={profile.socials.linkedin} label="LinkedIn">
              <LinkedIn className="h-5 w-5" />
            </SocialIcon>
            <SocialIcon href={`mailto:${profile.email}`} label="Email">
              <span className="text-xs font-medium">{profile.email}</span>
            </SocialIcon>
          </motion.div>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.a
        href="#about"
        aria-label="Scroll to about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 cursor-pointer flex-col items-center gap-2 text-white/40 transition-colors hover:text-white/80 sm:flex"
      >
        <span className="text-[11px] uppercase tracking-[0.25em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}

function SocialIcon({
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
      className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-white/70 transition-colors duration-200 hover:border-white/20 hover:text-white"
    >
      {children}
    </a>
  );
}
