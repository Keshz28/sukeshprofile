# Kesh Profile — Sukesh Surase Portfolio

localhost: http://localhost:3000 (run in terminal - npm run dev )

A bold, high-energy personal portfolio built with **Next.js 16**, **Tailwind CSS**, and **Framer Motion**. Features glassmorphism UI, an animated aurora background, scroll-driven reveals, an interactive project showcase with shared-layout modals, and a fully responsive layout.

![Stack](https://img.shields.io/badge/Next.js-16-black) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-EC4899)

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build
npm run start
```

---

## Project structure

```
KeshProfile/
├── app/
│   ├── globals.css        # Tailwind layers + glass / gradient utilities
│   ├── layout.tsx         # Fonts (Space Grotesk + Inter), SEO metadata
│   └── page.tsx           # Assembles all sections
├── components/
│   ├── Navbar.tsx         # Floating glass nav, scroll spy, mobile menu
│   ├── Hero.tsx           # Animated intro + role rotator + CTAs
│   ├── About.tsx          # Bio, interests, stats
│   ├── Skills.tsx         # Animated skill bars (3 categories)
│   ├── Projects.tsx       # Tilt cards + shared-layout detail modal
│   ├── Contact.tsx        # Contact form + info
│   ├── Footer.tsx
│   ├── ScrollProgress.tsx # Top gradient progress bar
│   └── ui/                # SectionHeading, Magnetic, AnimatedBackground, Icons
├── lib/
│   └── data.ts            # ⭐ ALL site content lives here
└── public/
    └── resume.pdf         # ⭐ Replace with the real resume
```

---

## ✏️ How to update content (no code knowledge needed)

Everything you'd want to change — name, summary, skills, projects, links — is in **`lib/data.ts`**. Open it, edit the text between the quotes, save, and the site updates instantly while `npm run dev` is running.

| To change… | Edit in `lib/data.ts` |
|---|---|
| Name / tagline / email / socials | `profile` object |
| Bio paragraphs, interests, stats | `about` object |
| Skill categories & percentages | `skillCategories` array |
| Projects (title, description, tech, links) | `projects` array |

**Add a new project** — copy an existing block in the `projects` array and change the fields. Set `liveUrl` / `repoUrl` to show "Live demo" / "Source" buttons in the modal. `accent` can be `"violet"`, `"cyan"`, or `"lime"`.

**Replace the resume** — drop your PDF in `public/` named `resume.pdf` (or change `resumeUrl` in `data.ts`).

---

## 🎨 Design system

- **Style:** Motion-Driven glassmorphism on near-black (`#05060A`)
- **Brand gradient:** violet `#7C3AED` → cyan `#06B6D4` → lime `#A3E635`
- **Type:** Space Grotesk (display) + Inter (body)
- **Motion:** entrance reveals, magnetic buttons, tilt cards, shared-layout modal, animated aurora blobs. All motion respects `prefers-reduced-motion`.

Tokens live in `tailwind.config.ts` and the utility classes (`.glass`, `.glass-strong`, `.text-gradient`, `.gradient-border`) in `app/globals.css`.

---

## 🚀 Deploy to Vercel (recommended)

1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Framework preset auto-detects **Next.js**. Click **Deploy**. Done.

No environment variables are required for the base site.

---

## 🛠 Optional: add a Sanity.io admin dashboard

The site ships with content in `lib/data.ts` so it works immediately with zero setup. If Sukesh later wants a visual admin dashboard to edit projects/skills without touching code, integrate **Sanity.io**:

```bash
npm create sanity@latest -- --template clean --dataset production
```

Suggested schemas (`/sanity/schemas`):

```ts
// project.ts
export default {
  name: "project", type: "document", title: "Project",
  fields: [
    { name: "title", type: "string" },
    { name: "category", type: "string" },
    { name: "year", type: "string" },
    { name: "description", type: "text" },
    { name: "longDescription", type: "text" },
    { name: "tech", type: "array", of: [{ type: "string" }] },
    { name: "accent", type: "string", options: { list: ["violet", "cyan", "lime"] } },
    { name: "liveUrl", type: "url" },
    { name: "repoUrl", type: "url" },
    { name: "cover", type: "image" },
    { name: "order", type: "number" },
  ],
};

// skillCategory.ts
export default {
  name: "skillCategory", type: "document", title: "Skill Category",
  fields: [
    { name: "title", type: "string" },
    { name: "accent", type: "string", options: { list: ["violet", "cyan", "lime"] } },
    { name: "skills", type: "array", of: [{
        type: "object",
        fields: [{ name: "name", type: "string" }, { name: "level", type: "number" }],
    }]},
  ],
};

// siteSettings.ts  → name, roles[], tagline, summary, email, resume (file), socials
```

Then replace the imports in each section with a `client.fetch(groqQuery)` call (use `next-sanity`). The component props are already shaped to match these schemas, so the swap is mostly mechanical. The Sanity Studio (`/studio` route or standalone) becomes the admin dashboard.

---

## ♿ Accessibility & performance

- Semantic landmarks, labelled form inputs, `aria-label`s on icon buttons
- Visible focus states, keyboard-navigable, scroll-spy nav
- `prefers-reduced-motion` honoured globally
- Next.js font optimization, static prerendering, transform/opacity-only animations

---

Built for **Sukesh Surase** — Front-End Developer & Creative Technologist.
[GitHub](https://github.com/Keshz28) · [LinkedIn](https://www.linkedin.com/in/sukesh-surase)
