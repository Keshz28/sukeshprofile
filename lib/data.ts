/**
 * SITE CONTENT — single source of truth.
 * Edit this file to update text, skills, projects, and certifications
 * across the whole site.
 * (Later, this can be swapped for a Sanity.io CMS fetch — see README.)
 */

export const profile = {
  name: "Sukesh Surase",
  shortName: "Sukesh",
  initials: "SS",
  roles: [
    "Full-Stack Developer",
    "UI/UX Designer",
    "XR Developer",
    "Creative Media Producer",
  ],
  tagline:
    "I design and build bold digital experiences end-to-end — from pixel-perfect UIs and full-stack systems to immersive VR environments.",
  summary:
    "Full-stack developer and creative technologist who builds across the entire stack — web apps, business systems, and XR experiences. I blend design thinking, solid engineering, and creative storytelling to ship products people love to use.",
  location: "Available worldwide · Remote",
  email: "surasesukesh@gmail.com",
  resumeUrl: "/resume.pdf",
  socials: {
    linkedin: "https://www.linkedin.com/in/sukesh-surase",
    github: "https://github.com/Keshz28",
  },
};

export const about = {
  heading: "About Me",
  paragraphs: [
    "I'm Sukesh Surase — a full-stack developer and designer who builds across the entire stack. From crafting pixel-perfect UIs and smooth animations to architecting APIs, databases, and CRM systems, I'm comfortable wherever the work takes me.",
    "My work spans full-stack web development, business systems, XR / VR experiences, UI/UX design, creative media production, copywriting, and public speaking & event hosting. That mix lets me move fluidly between the technical and the creative — shaping both how a product works and how it makes people feel.",
    "I'm driven by craft and curiosity. Whether it's an immersive VR campus tour on Meta Quest 3, a full-featured CRM platform, or a polished travel-guide web app, I aim to ship experiences that are bold, accessible, and genuinely useful.",
  ],
  interests: [
    "Full-Stack Development",
    "UI/UX Design",
    "Web Design",
    "Public Speaking & Event Hosting",
    "Creative Media Production",
    "Copywriting",
  ],
  stats: [
    { value: "4+", label: "Ongoing projects" },
    { value: "6", label: "Creative disciplines" },
    { value: "100%", label: "Passion for craft" },
  ],
};

export type SkillCategory = {
  title: string;
  accent: "blue" | "azure" | "red";
  skills: { name: string; level: number }[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Full-Stack Engineering",
    accent: "blue",
    skills: [
      { name: "HTML5 & CSS3", level: 95 },
      { name: "JavaScript (ES6+)", level: 88 },
      { name: "React / Next.js", level: 85 },
      { name: "Tailwind CSS", level: 90 },
      { name: "SQL & Databases", level: 82 },
    ],
  },
  {
    title: "Design & UX",
    accent: "azure",
    skills: [
      { name: "UI/UX Design", level: 90 },
      { name: "Web Design", level: 92 },
      { name: "Figma", level: 88 },
      { name: "Responsive Design", level: 93 },
      { name: "Prototyping", level: 85 },
    ],
  },
  {
    title: "Creative & Communication",
    accent: "red",
    skills: [
      { name: "Creative Media Production", level: 87 },
      { name: "Copywriting", level: 84 },
      { name: "Public Speaking & Hosting", level: 90 },
      { name: "Brand Storytelling", level: 83 },
      { name: "Video Editing", level: 80 },
    ],
  },
];

export type Certification = {
  title: string;
  issuer: string;
  year?: string;
  credentialUrl?: string;
  skills: string[];
};

export const certifications: Certification[] = [
  {
    title: "Oracle Database SQL Certified Associate",
    issuer: "Oracle",
    year: "2024",
    // credentialUrl: "https://catalog-education.oracle.com/...",
    skills: ["SQL", "Oracle Database", "Relational Databases", "Data Querying"],
  },
];

export type Education = {
  degree: string;
  institution: string;
  /** Short tier label shown on the credential card (e.g. "Degree"). */
  kind: string;
  year?: string;
  status: "Completed" | "In Progress";
  highlights: string[];
  accent: "blue" | "azure" | "red";
};

export const education: Education[] = [
  {
    degree: "Bachelor of Information Technology (Hons.)",
    institution: "HELP University",
    kind: "Degree",
    year: "2026",
    status: "In Progress",
    highlights: ["Information Technology", "Software Development", "UI/UX Design"],
    accent: "blue",
  },
  {
    degree: "Sijil Tinggi Persekolahan Malaysia (STPM)",
    institution: "SMK Sungai Choh",
    kind: "Pre-University",
    status: "Completed",
    highlights: ["Malaysian A-Level Equivalent", "Form 6"],
    accent: "azure",
  },
  {
    degree: "Sijil Pelajaran Malaysia (SPM)",
    institution: "SMK Bukit Sentosa",
    kind: "Secondary",
    status: "Completed",
    highlights: ["Malaysian O-Level Equivalent", "National Examination"],
    accent: "azure",
  },
];

export type Project = {
  title: string;
  category: string;
  description: string;
  longDescription: string;
  tech: string[];
  accent: "blue" | "azure" | "red";
  liveUrl?: string;
  repoUrl?: string;
  year: string;
};

export const projects: Project[] = [
  {
    title: "VR Campus Tour",
    category: "Immersive · XR",
    year: "2026",
    description:
      "An interactive virtual reality campus tour that lets prospective students explore facilities in immersive 3D.",
    longDescription:
      "A fully immersive XR campus tour built in Unity, scripted in C#, and deployed on Meta Quest 3. Real-world spaces were captured using Polycam for 3D scanning and Insta360 for 360° photography, then assembled into an interactive walkthrough with spatial navigation and hotspots.",
    tech: ["Unity", "C#", "Meta Quest 3", "Polycam", "Insta360"],
    accent: "blue",
  },
  {
    title: "KL The Guide Web",
    category: "Web Platform · Travel",
    year: "2026",
    description:
      "A polished travel-guide web platform helping visitors discover the best of Kuala Lumpur.",
    longDescription:
      "A content-rich travel guide with curated destinations, dynamic filtering, and a responsive editorial layout. Built with JavaScript on the front-end, SQL powering the database layer, and Figma driving the visual design — focused on fast load times, intuitive navigation, and a vibrant identity that captures the energy of the city.",
    tech: ["JavaScript", "SQL", "Figma", "Responsive Design"],
    accent: "azure",
  },
  {
    title: "SJSS Web",
    category: "Business · Full-Stack",
    year: "2026",
    description:
      "A modern business website and system built end-to-end for clarity, speed, and a strong brand presence.",
    longDescription:
      "A full-stack build for the SJSS platform covering a polished marketing website and internal system UI. Emphasises a clean component architecture, accessible forms, and a cohesive design system — built to scale with reusable UI patterns and a smooth, professional user experience.",
    tech: ["Next.js", "React", "Tailwind CSS", "UI/UX Design"],
    accent: "red",
  },
  {
    title: "SJRenovation CRM",
    category: "Business · CRM",
    year: "2026",
    description:
      "A full-featured CRM system for a renovation company — managing customers, quotations, and project pipelines.",
    longDescription:
      "An end-to-end CRM platform built for SJ Renovation, featuring customer management, quotation generation, project tracking, and file uploads. Designed with a clean dashboard UI and a RESTful API backend for streamlined day-to-day business operations. Currently in active development.",
    tech: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    accent: "blue",
  },
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Certs", href: "#certifications" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];
