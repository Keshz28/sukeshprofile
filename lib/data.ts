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
    "Front-End Developer",
    "UI/UX Designer",
    "Web Designer",
    "Creative Media Producer",
  ],
  tagline:
    "I design and build bold, high-energy digital experiences — where clean code meets creative storytelling.",
  summary:
    "Front-end developer and creative technologist crafting interfaces that feel alive. I blend design thinking, smooth motion, and solid engineering to ship products people love to use.",
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
    "I'm Sukesh Surase — a front-end developer and designer who treats the browser as a canvas. My focus is building interfaces that are not only functional and fast, but memorable: micro-interactions, fluid motion, and layouts that guide the eye.",
    "My work spans front-end development, UI/UX and web design, creative media production, copywriting, and public speaking & event hosting. That mix lets me move fluidly between the technical and the creative — shaping both how a product works and how it makes people feel.",
    "I'm driven by craft and curiosity. Whether it's an immersive VR campus tour or a polished business platform, I aim to ship experiences that are bold, accessible, and genuinely useful.",
  ],
  interests: [
    "Front-End Development",
    "UI/UX Design",
    "Web Design",
    "Public Speaking & Event Hosting",
    "Creative Media Production",
    "Copywriting",
  ],
  stats: [
    { value: "3+", label: "Flagship projects" },
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
    title: "Front-End Engineering",
    accent: "blue",
    skills: [
      { name: "HTML5 & CSS3", level: 95 },
      { name: "JavaScript (ES6+)", level: 88 },
      { name: "React / Next.js", level: 85 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Framer Motion", level: 82 },
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
    // Add the verification link from Oracle CertView if you have one:
    // credentialUrl: "https://catalog-education.oracle.com/...",
    skills: ["SQL", "Oracle Database", "Relational Databases", "Data Querying"],
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
    category: "Immersive · WebXR",
    year: "2024",
    description:
      "An interactive virtual reality campus tour that lets prospective students explore facilities in immersive 3D.",
    longDescription:
      "A WebXR experience guiding users through a virtual campus with 360° environments, interactive hotspots, and spatial navigation. Designed to boost engagement for remote visitors and showcase facilities without a physical visit.",
    tech: ["WebXR", "Three.js", "JavaScript", "3D Modeling"],
    accent: "blue",
  },
  {
    title: "KL The Guide Web",
    category: "Web Platform · Travel",
    year: "2024",
    description:
      "A polished travel-guide web platform helping visitors discover the best of Kuala Lumpur.",
    longDescription:
      "A content-rich travel guide with curated destinations, dynamic filtering, and a responsive editorial layout. Focused on fast load times, intuitive navigation, and a vibrant visual identity that captures the energy of the city.",
    tech: ["React", "Next.js", "Tailwind CSS", "Responsive Design"],
    accent: "azure",
  },
  {
    title: "SJSS Web",
    category: "Business · Front-End",
    year: "2025",
    description:
      "A modern business website / system front-end built for clarity, speed, and a strong brand presence.",
    longDescription:
      "A front-end build for the SJSS platform emphasizing a clean component architecture, accessible forms, and a cohesive design system. Built to scale with reusable UI patterns and a smooth, professional user experience.",
    tech: ["Next.js", "React", "Tailwind CSS", "UI/UX Design"],
    accent: "red",
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
