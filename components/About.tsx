"use client";

import { motion } from "framer-motion";
import { about, profile } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import { Code, Megaphone, Palette } from "./ui/Icons";

const interestIcon = (i: number) => {
  const icons = [Code, Palette, Code, Megaphone, Palette, Code];
  const Icon = icons[i % icons.length];
  return <Icon className="h-4 w-4" />;
};

export default function About() {
  return (
    <section id="about" className="relative py-28">
      <div className="container-px">
        <SectionHeading
          eyebrow="About"
          title="Where code meets creativity"
          subtitle="A developer's precision with a designer's eye and a storyteller's instinct."
        />

        <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-7 sm:p-9"
          >
            <div className="space-y-5">
              {about.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-[15px] leading-relaxed text-white/70"
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Interests */}
            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                What I do
              </p>
              <div className="flex flex-wrap gap-2.5">
                {about.interests.map((interest, i) => (
                  <motion.span
                    key={interest}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-white/75 transition-colors duration-200 hover:border-white/25 hover:text-white"
                  >
                    <span className="text-blue-glow">{interestIcon(i)}</span>
                    {interest}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats + portrait card */}
          <div className="grid gap-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="gradient-border glass-strong relative overflow-hidden rounded-3xl p-7"
            >
              {/* monogram */}
              <div className="mb-5 flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-gradient font-display text-xl font-bold text-ink">
                  {profile.initials}
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-white">
                    {profile.name}
                  </p>
                  <p className="text-sm text-white/50">{profile.roles[0]}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                {profile.summary}
              </p>
            </motion.div>

            <div className="grid grid-cols-3 gap-4">
              {about.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                  className="glass rounded-2xl p-4 text-center"
                >
                  <p className="text-gradient font-display text-2xl font-bold">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] leading-tight text-white/50">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
