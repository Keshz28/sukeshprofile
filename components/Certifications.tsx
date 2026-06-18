"use client";

import { motion } from "framer-motion";
import { certifications, education, type Certification, type Education } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import { Award, CheckBadge, Database, GraduationCap } from "./ui/Icons";

const eduAccent = {
  blue: { glow: "bg-blue-brand/20", icon: "bg-brand-gradient", badge: "text-blue-glow" },
  azure: {
    glow: "bg-azure-brand/20",
    icon: "bg-gradient-to-br from-indigo-500 to-purple-600",
    badge: "text-azure-glow",
  },
  red: { glow: "bg-red-brand/20", icon: "bg-gradient-to-br from-red-500 to-pink-600", badge: "text-red-glow" },
};

function CertCard({ cert, delay }: { cert: Certification; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay }}
      className="gradient-border glass group relative min-w-[300px] w-[300px] shrink-0 snap-start overflow-hidden rounded-3xl p-7"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-brand/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-ink">
          <Database className="h-7 w-7" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-blue-glow" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-white/45">
              {cert.issuer}
              {cert.year ? ` · ${cert.year}` : ""}
            </span>
          </div>

          <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-white">
            {cert.title}
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {cert.skills.map((s) => (
              <span
                key={s}
                className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/65"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-5">
            {cert.credentialUrl ? (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-blue-glow transition-colors hover:text-white"
              >
                <CheckBadge className="h-4 w-4" /> Verify credential
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/55">
                <CheckBadge className="h-4 w-4 text-blue-glow" /> Certified
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EduCard({ edu, delay }: { edu: Education; delay: number }) {
  const a = eduAccent[edu.accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay }}
      className="gradient-border glass group relative min-w-[300px] w-[300px] shrink-0 snap-start overflow-hidden rounded-3xl p-7"
    >
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${a.glow}`}
      />

      <div className="relative flex items-start gap-4">
        <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white ${a.icon}`}>
          <GraduationCap className="h-7 w-7" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <GraduationCap className={`h-4 w-4 ${a.badge}`} />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-white/45">
              {edu.institution}
              {edu.year ? ` · ${edu.year}` : ""}
            </span>
          </div>

          <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-white">
            {edu.degree}
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {edu.highlights.map((h) => (
              <span
                key={h}
                className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/65"
              >
                {h}
              </span>
            ))}
          </div>

          <div className="mt-5">
            {edu.status === "In Progress" ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-400/80">
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                In Progress
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/55">
                <CheckBadge className={`h-4 w-4 ${a.badge}`} /> Completed
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Certifications() {
  return (
    <section id="certifications" className="relative py-28">
      <div className="container-px">
        <SectionHeading
          eyebrow="Certifications"
          title="Credentials & education"
          subtitle="Academic milestones and industry certifications that shape my practice."
        />

        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-5 px-5 sm:-mx-8 sm:px-8">
          {certifications.map((cert, i) => (
            <CertCard key={cert.title} cert={cert} delay={i * 0.1} />
          ))}
          {education.map((edu, i) => (
            <EduCard key={edu.degree} edu={edu} delay={(certifications.length + i) * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
