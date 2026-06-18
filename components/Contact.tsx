"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import { GitHub, LinkedIn, Mail, MapPin } from "./ui/Icons";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      return;
    }
    setStatus("sending");

    // Opens the user's email client pre-filled. Swap for an API route
    // (e.g. /api/contact with Resend/Nodemailer) for direct sending.
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`);

    setTimeout(() => {
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
    }, 600);
  };

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (status === "error") setStatus("idle");
    };

  return (
    <section id="contact" className="relative py-28">
      <div className="container-px">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something bold"
          subtitle="Have a project, role, or idea in mind? My inbox is always open."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="glass flex flex-col justify-between gap-8 rounded-3xl p-7 sm:p-9"
          >
            <div className="space-y-5">
              <ContactRow
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value={profile.email}
                href={`mailto:${profile.email}`}
              />
              <ContactRow
                icon={<LinkedIn className="h-5 w-5" />}
                label="LinkedIn"
                value="in/sukesh-surase"
                href={profile.socials.linkedin}
              />
              <ContactRow
                icon={<GitHub className="h-5 w-5" />}
                label="GitHub"
                value="Keshz28"
                href={profile.socials.github}
              />
              <ContactRow
                icon={<MapPin className="h-5 w-5" />}
                label="Location"
                value={profile.location}
              />
            </div>

            <div className="gradient-border rounded-2xl p-5">
              <p className="text-sm leading-relaxed text-white/65">
                Prefer a quick chat? Connect on LinkedIn or drop a line — I
                typically reply within a day.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass rounded-3xl p-7 sm:p-9"
            noValidate
          >
            <div className="grid gap-5">
              <Field
                id="name"
                label="Name"
                placeholder="Your name"
                value={form.name}
                onChange={update("name")}
              />
              <Field
                id="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={update("email")}
              />
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-white/70"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell me about your project or opportunity…"
                  value={form.message}
                  onChange={update("message")}
                  suppressHydrationWarning
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-blue-glow/60 focus:outline-none focus:ring-2 focus:ring-blue-brand/30"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-rose-400">
                  Please fill in every field before sending.
                </p>
              )}
              {status === "sent" && (
                <p className="text-sm text-blue-glow">
                  Thanks! Your email client should now be open — just hit send.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                suppressHydrationWarning
                className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-ink transition-transform duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "sending" ? "Opening…" : "Send message"}
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        suppressHydrationWarning
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-blue-glow/60 focus:outline-none focus:ring-2 focus:ring-blue-brand/30"
      />
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-colors group-hover:text-white">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs uppercase tracking-[0.15em] text-white/40">
          {label}
        </span>
        <span className="block truncate text-sm font-medium text-white/85">
          {value}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="group flex cursor-pointer items-center gap-4"
      >
        {content}
      </a>
    );
  }
  return <div className="group flex items-center gap-4">{content}</div>;
}
