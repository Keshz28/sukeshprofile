/**
 * SITE CONTENT — single source of truth.
 *
 * The actual content now lives in `lib/content.json`. This file gives that
 * JSON strong TypeScript types and re-exports it, so every component keeps
 * importing from "@/lib/data" exactly as before.
 *
 * ✏️  TWO WAYS TO EDIT CONTENT:
 *   1. Visually — run `npm run dev` and open http://localhost:3000/studio
 *      (a private, local-only editor). Add/edit projects, skills, etc., then
 *      save the file it produces back to `lib/content.json` and commit.
 *   2. By hand — edit `lib/content.json` directly.
 *
 * The `/studio` editor is a LOCAL tool only: it never runs on your live site
 * (your site is a static export with no server), so there is nothing for
 * visitors to log into or tamper with.
 */

import content from "./content.json";

export type Accent = "blue" | "azure" | "red";

export type Profile = {
  name: string;
  shortName: string;
  initials: string;
  roles: string[];
  tagline: string;
  summary: string;
  location: string;
  email: string;
  /** Optional — shown as a contact row only when set. */
  phone?: string;
  resumeUrl: string;
  socials: {
    linkedin: string;
    github: string;
  };
};

export type About = {
  heading: string;
  paragraphs: string[];
  interests: string[];
  stats: { value: string; label: string }[];
};

export type SkillCategory = {
  title: string;
  accent: Accent;
  skills: { name: string; level: number }[];
};

/** A single AI tool card in the "AI Workflow" section. */
export type AiTool = {
  name: string;
  /** Vendor / lab, shown in muted mono next to the name. */
  org: string;
  /** Short role, rendered as a `// comment`. */
  role: string;
  accent: Accent;
  points: string[];
};

export type AiWorkflow = {
  heading: string;
  intro: string;
  tools: AiTool[];
};

export type Certification = {
  title: string;
  issuer: string;
  year?: string;
  credentialUrl?: string;
  skills: string[];
};

export type Education = {
  degree: string;
  institution: string;
  /** Short tier label shown on the credential card (e.g. "Degree"). */
  kind: string;
  year?: string;
  status: "Completed" | "In Progress";
  highlights: string[];
  accent: Accent;
};

export type Project = {
  title: string;
  category: string;
  description: string;
  longDescription: string;
  tech: string[];
  accent: Accent;
  liveUrl?: string;
  repoUrl?: string;
  year: string;
};

export type Contact = {
  heading: string;
  headingAccent: string;
  blurb: string;
};

export type SiteContent = {
  profile: Profile;
  about: About;
  skillCategories: SkillCategory[];
  aiWorkflow: AiWorkflow;
  projects: Project[];
  certifications: Certification[];
  education: Education[];
  contact: Contact;
};

const site = content as unknown as SiteContent;

export const profile = site.profile;
export const about = site.about;
export const skillCategories = site.skillCategories;
export const aiWorkflow = site.aiWorkflow;
export const projects = site.projects;
export const certifications = site.certifications;
export const education = site.education;
export const contact = site.contact;

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "AI", href: "#ai-workflow" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];
