"use client";

import { motion } from "framer-motion";
import { certifications } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import { Award, CheckBadge, Database } from "./ui/Icons";

export default function Certifications() {
  return (
    <section id="certifications" className="relative py-28">
      <div className="container-px">
        <SectionHeading
          eyebrow="Certifications"
          title="Credentials & training"
          subtitle="Verified, industry-recognised certifications that back up the skills."
        />

        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="gradient-border glass group relative overflow-hidden rounded-3xl p-7"
            >
              {/* glow */}
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
          ))}
        </div>
      </div>
    </section>
  );
}
