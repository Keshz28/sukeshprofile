/**
 * Content types — kept in sync with the portfolio's `lib/data.ts`.
 * The editor produces objects of this shape and the API commits them to
 * the portfolio repo's `lib/content.json`.
 */

export type Accent = "blue" | "azure" | "red";

export type Profile = {
  name: string;
  shortName: string;
  initials: string;
  roles: string[];
  tagline: string;
  summary: string;
  location: string;
  phone?: string;
  email: string;
  resumeUrl: string;
  socials: { linkedin: string; github: string };
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

export type AiTool = {
  name: string;
  org: string;
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
