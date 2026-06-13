"use client";

import { motion } from "framer-motion";
import { skillCategories, type SkillCategory } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import { Code, Megaphone, Palette } from "./ui/Icons";

const accentMap = {
  blue: {
    bar: "from-blue-brand to-blue-glow",
    text: "text-blue-glow",
    ring: "bg-blue-brand/15 text-blue-glow",
  },
  azure: {
    bar: "from-azure-brand to-azure-glow",
    text: "text-azure-glow",
    ring: "bg-azure-brand/15 text-azure-glow",
  },
  red: {
    bar: "from-red-brand to-red-glow",
    text: "text-red-glow",
    ring: "bg-red-brand/15 text-red-glow",
  },
};

const catIcon = {
  blue: Code,
  azure: Palette,
  red: Megaphone,
};

function CategoryCard({ cat, delay }: { cat: SkillCategory; delay: number }) {
  const a = accentMap[cat.accent];
  const Icon = catIcon[cat.accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay }}
      className="glass group rounded-3xl p-7 transition-colors duration-300 hover:bg-white/[0.06]"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-xl ${a.ring}`}>
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="font-display text-lg font-semibold text-white">
          {cat.title}
        </h3>
      </div>

      <div className="space-y-4">
        {cat.skills.map((skill, i) => (
          <div key={skill.name}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-white/75">{skill.name}</span>
              <span className={`font-medium ${a.text}`}>{skill.level}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${a.bar}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  delay: delay + 0.2 + i * 0.08,
                  ease: "easeOut",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative py-28">
      <div className="container-px">
        <SectionHeading
          eyebrow="Skills"
          title="A versatile toolkit"
          subtitle="Three disciplines, one cohesive craft — engineering, design, and communication."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat, i) => (
            <CategoryCard key={cat.title} cat={cat} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}
