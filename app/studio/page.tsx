"use client";

import { useEffect, useMemo, useState } from "react";
import rawContent from "@/lib/content.json";
import type {
  SiteContent,
  Accent,
  Project,
  SkillCategory,
  AiTool,
  Certification,
  Education,
} from "@/lib/data";
import {
  Field,
  Text,
  Area,
  Num,
  Select,
  Tags,
  StringList,
  ArrayEditor,
} from "@/components/studio/fields";
import {
  serialize,
  supportsFileSystem,
  saveToDisk,
  openFromDisk,
  downloadJson,
  copyJson,
  idbGet,
  type FileHandle,
} from "@/components/studio/storage";

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
const ACCENTS = ["blue", "azure", "red"];
const initial = rawContent as unknown as SiteContent;

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "ai", label: "AI Workflow" },
  { id: "projects", label: "Projects" },
  { id: "certs", label: "Credentials" },
  { id: "education", label: "Education" },
] as const;
type TabId = (typeof TABS)[number]["id"];

/* blank factories for the "+ Add" buttons */
const blankProject = (): Project => ({
  title: "",
  category: "",
  year: String(new Date().getFullYear()),
  description: "",
  longDescription: "",
  tech: [],
  accent: "blue",
});
const blankSkillCat = (): SkillCategory => ({
  title: "",
  accent: "blue",
  skills: [],
});
const blankTool = (): AiTool => ({
  name: "",
  org: "",
  role: "",
  accent: "blue",
  points: [],
});
const blankCert = (): Certification => ({
  title: "",
  issuer: "",
  year: "",
  skills: [],
});
const blankEdu = (): Education => ({
  degree: "",
  institution: "",
  kind: "",
  status: "Completed",
  accent: "azure",
  highlights: [],
});

export default function StudioPage() {
  const isProd = process.env.NODE_ENV === "production";

  const [draft, setDraft] = useState<SiteContent>(() => clone(initial));
  const [savedJson, setSavedJson] = useState<string>(() => serialize(initial));
  const [handle, setHandle] = useState<FileHandle | null>(null);
  const [tab, setTab] = useState<TabId>("profile");
  const [status, setStatus] = useState<string>("");
  const [showJson, setShowJson] = useState(false);
  const [fsReady, setFsReady] = useState(false);

  const json = useMemo(() => serialize(draft), [draft]);
  const dirty = json !== savedJson;

  useEffect(() => {
    setFsReady(supportsFileSystem());
    idbGet("contentHandle").then((h) => h && setHandle(h));
  }, []);

  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(""), 4000);
    return () => clearTimeout(t);
  }, [status]);

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  if (isProd) return <ProdNotice />;

  /* section setters */
  const patchProfile = (p: Partial<SiteContent["profile"]>) =>
    setDraft((d) => ({ ...d, profile: { ...d.profile, ...p } }));
  const patchSocials = (p: Partial<SiteContent["profile"]["socials"]>) =>
    setDraft((d) => ({
      ...d,
      profile: { ...d.profile, socials: { ...d.profile.socials, ...p } },
    }));
  const patchAbout = (p: Partial<SiteContent["about"]>) =>
    setDraft((d) => ({ ...d, about: { ...d.about, ...p } }));
  const patchAi = (p: Partial<SiteContent["aiWorkflow"]>) =>
    setDraft((d) => ({ ...d, aiWorkflow: { ...d.aiWorkflow, ...p } }));
  const patchContact = (p: Partial<SiteContent["contact"]>) =>
    setDraft((d) => ({ ...d, contact: { ...d.contact, ...p } }));

  /* save actions */
  const onSave = async () => {
    try {
      const h = await saveToDisk(json, handle);
      setHandle(h);
      setSavedJson(json);
      setStatus(`Saved to ${h.name ?? "content.json"} ✓`);
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      setStatus(`Save failed: ${(err as Error).message}`);
    }
  };
  const onDownload = () => {
    downloadJson(json);
    setSavedJson(json);
    setStatus("Downloaded content.json — move it into lib/ and commit ✓");
  };
  const onCopy = async () => {
    try {
      await copyJson(json);
      setStatus("JSON copied to clipboard ✓");
    } catch {
      setStatus("Couldn't copy — use Download instead.");
    }
  };
  const onLoad = async () => {
    try {
      const { data, handle: h } = await openFromDisk();
      setDraft(clone(data as SiteContent));
      setSavedJson(serialize(data));
      setHandle(h);
      setStatus(`Loaded ${h.name ?? "content.json"} ✓`);
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      setStatus(`Load failed: ${(err as Error).message}`);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-[1000px] px-[clamp(16px,4vw,48px)] py-10">
      {/* header */}
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-bold text-white">
            Content Studio
          </h1>
          <span className="rounded-full border border-blue-glow/30 bg-blue-brand/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-blue-glow">
            Local only
          </span>
          <span
            className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
              dirty
                ? "border border-red-glow/30 bg-red-glow/10 text-red-glow"
                : "border border-white/12 text-white/45"
            }`}
          >
            {dirty ? "Unsaved changes" : "All saved"}
          </span>
        </div>
        <p className="mt-2 max-w-[70ch] text-sm leading-[1.6] text-white/55">
          Edit your portfolio content, then save it to{" "}
          <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-blue-glow">
            lib/content.json
          </code>{" "}
          and commit. This editor runs only on your machine — it never appears
          on your live site.
        </p>
      </header>

      {/* action bar */}
      <div className="sticky top-3 z-10 mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-ink/80 p-2.5 backdrop-blur-xl">
        {fsReady && (
          <button
            onClick={onSave}
            className="rounded-lg bg-brand-gradient px-4 py-2 font-display text-sm font-bold text-ink transition hover:opacity-90"
          >
            Save → content.json
          </button>
        )}
        <button
          onClick={onDownload}
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 font-display text-sm font-semibold text-white transition hover:bg-white/10"
        >
          ↓ Download
        </button>
        <button
          onClick={onCopy}
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 font-display text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Copy JSON
        </button>
        {fsReady && (
          <button
            onClick={onLoad}
            className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 font-display text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Load file…
          </button>
        )}
        <div className="ml-auto flex items-center gap-3">
          {status && (
            <span className="font-mono text-[11px] text-blue-glow">
              {status}
            </span>
          )}
          <button
            onClick={() => setShowJson((s) => !s)}
            className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/50 transition hover:text-white"
          >
            {showJson ? "Hide JSON" : "View JSON"}
          </button>
        </div>
      </div>

      {!fsReady && (
        <p className="mb-5 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 font-mono text-[11px] leading-[1.6] text-white/50">
          Tip: your browser doesn&apos;t support direct file saving. Use{" "}
          <b className="text-white/70">Download</b> (or <b>Copy JSON</b>) and
          replace <code>lib/content.json</code>. For one-click saving, open this
          page in Chrome or Edge.
        </p>
      )}

      {showJson && (
        <pre className="mb-6 max-h-[340px] overflow-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-[11px] leading-[1.55] text-white/70">
          {json}
        </pre>
      )}

      {/* tabs */}
      <nav className="mb-6 flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3.5 py-2 font-mono text-xs tracking-[0.06em] transition ${
              tab === t.id
                ? "bg-white/10 text-white"
                : "text-white/50 hover:bg-white/5 hover:text-white/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* active editor */}
      <div className="space-y-5 pb-24">
        {tab === "profile" && (
          <Section title="Profile & links">
            <Grid2>
              <Field label="Name">
                <Text value={draft.profile.name} onChange={(v) => patchProfile({ name: v })} />
              </Field>
              <Field label="Short name">
                <Text value={draft.profile.shortName} onChange={(v) => patchProfile({ shortName: v })} />
              </Field>
              <Field label="Initials" hint="nav badge">
                <Text value={draft.profile.initials} onChange={(v) => patchProfile({ initials: v })} />
              </Field>
              <Field label="Location">
                <Text value={draft.profile.location} onChange={(v) => patchProfile({ location: v })} />
              </Field>
            </Grid2>
            <Field label="Roles" hint="rotate in the hero">
              <Tags value={draft.profile.roles} onChange={(v) => patchProfile({ roles: v })} />
            </Field>
            <Field label="Tagline">
              <Area value={draft.profile.tagline} onChange={(v) => patchProfile({ tagline: v })} />
            </Field>
            <Field label="Summary" hint="used for SEO">
              <Area value={draft.profile.summary} onChange={(v) => patchProfile({ summary: v })} />
            </Field>
            <Grid2>
              <Field label="Email">
                <Text value={draft.profile.email} onChange={(v) => patchProfile({ email: v })} />
              </Field>
              <Field label="Phone" hint="optional — adds a Phone row">
                <Text value={draft.profile.phone ?? ""} onChange={(v) => patchProfile({ phone: v })} placeholder="+60 11 …" />
              </Field>
              <Field label="GitHub URL">
                <Text value={draft.profile.socials.github} onChange={(v) => patchSocials({ github: v })} />
              </Field>
              <Field label="LinkedIn URL">
                <Text value={draft.profile.socials.linkedin} onChange={(v) => patchSocials({ linkedin: v })} />
              </Field>
              <Field label="Resume URL">
                <Text value={draft.profile.resumeUrl} onChange={(v) => patchProfile({ resumeUrl: v })} />
              </Field>
            </Grid2>
          </Section>
        )}

        {tab === "about" && (
          <Section title="About section">
            <Field label="Heading">
              <Text value={draft.about.heading} onChange={(v) => patchAbout({ heading: v })} />
            </Field>
            <Field label="Paragraphs">
              <StringList
                multiline
                value={draft.about.paragraphs}
                onChange={(v) => patchAbout({ paragraphs: v })}
                addLabel="Add paragraph"
              />
            </Field>
            <Field label="Interests" hint="chips">
              <Tags value={draft.about.interests} onChange={(v) => patchAbout({ interests: v })} />
            </Field>
            <Field label="Stats">
              <ArrayEditor
                items={draft.about.stats}
                onChange={(v) => patchAbout({ stats: v })}
                makeBlank={() => ({ value: "", label: "" })}
                itemLabel={(s) => `${s.value} ${s.label}`.trim()}
                addLabel="Add stat"
                renderItem={(s, update) => (
                  <Grid2>
                    <Field label="Value" hint="e.g. 4+ or 100%">
                      <Text value={s.value} onChange={(v) => update({ value: v })} />
                    </Field>
                    <Field label="Label">
                      <Text value={s.label} onChange={(v) => update({ label: v })} />
                    </Field>
                  </Grid2>
                )}
              />
            </Field>
          </Section>
        )}

        {tab === "skills" && (
          <Section title="Skill categories">
            <ArrayEditor
              items={draft.skillCategories}
              onChange={(v) => setDraft((d) => ({ ...d, skillCategories: v }))}
              makeBlank={blankSkillCat}
              itemLabel={(c) => c.title}
              addLabel="Add category"
              renderItem={(cat, update) => (
                <>
                  <Grid2>
                    <Field label="Title">
                      <Text value={cat.title} onChange={(v) => update({ title: v })} />
                    </Field>
                    <Field label="Accent">
                      <Select value={cat.accent} options={ACCENTS} onChange={(v) => update({ accent: v as Accent })} />
                    </Field>
                  </Grid2>
                  <Field label="Skills" hint="name + level 0–100">
                    <ArrayEditor
                      items={cat.skills}
                      onChange={(v) => update({ skills: v })}
                      makeBlank={() => ({ name: "", level: 80 })}
                      itemLabel={(s) => s.name}
                      addLabel="Add skill"
                      renderItem={(sk, u) => (
                        <Grid2>
                          <Field label="Name">
                            <Text value={sk.name} onChange={(v) => u({ name: v })} />
                          </Field>
                          <Field label="Level">
                            <Num value={sk.level} onChange={(v) => u({ level: v })} />
                          </Field>
                        </Grid2>
                      )}
                    />
                  </Field>
                </>
              )}
            />
          </Section>
        )}

        {tab === "ai" && (
          <Section title="AI Workflow section">
            <Field label="Heading">
              <Text value={draft.aiWorkflow.heading} onChange={(v) => patchAi({ heading: v })} />
            </Field>
            <Field label="Intro">
              <Area value={draft.aiWorkflow.intro} onChange={(v) => patchAi({ intro: v })} />
            </Field>
            <Field label="Tools">
              <ArrayEditor
                items={draft.aiWorkflow.tools}
                onChange={(v) => patchAi({ tools: v })}
                makeBlank={blankTool}
                itemLabel={(t) => t.name}
                addLabel="Add tool"
                renderItem={(tool, update) => (
                  <>
                    <Grid2>
                      <Field label="Name">
                        <Text value={tool.name} onChange={(v) => update({ name: v })} />
                      </Field>
                      <Field label="Vendor / lab">
                        <Text value={tool.org} onChange={(v) => update({ org: v })} />
                      </Field>
                      <Field label="Role" hint="shown as // comment">
                        <Text value={tool.role} onChange={(v) => update({ role: v })} />
                      </Field>
                      <Field label="Accent">
                        <Select value={tool.accent} options={ACCENTS} onChange={(v) => update({ accent: v as Accent })} />
                      </Field>
                    </Grid2>
                    <Field label="Points">
                      <StringList
                        value={tool.points}
                        onChange={(v) => update({ points: v })}
                        placeholder="What you use it for…"
                        addLabel="Add point"
                      />
                    </Field>
                  </>
                )}
              />
            </Field>
          </Section>
        )}

        {tab === "projects" && (
          <Section title="Projects">
            <ArrayEditor
              items={draft.projects}
              onChange={(v) => setDraft((d) => ({ ...d, projects: v }))}
              makeBlank={blankProject}
              itemLabel={(p) => p.title}
              addLabel="Add project"
              renderItem={(p, update) => (
                <>
                  <Grid2>
                    <Field label="Title">
                      <Text value={p.title} onChange={(v) => update({ title: v })} />
                    </Field>
                    <Field label="Category" hint="e.g. Business · CRM">
                      <Text value={p.category} onChange={(v) => update({ category: v })} />
                    </Field>
                    <Field label="Year">
                      <Text value={p.year} onChange={(v) => update({ year: v })} />
                    </Field>
                    <Field label="Accent">
                      <Select value={p.accent} options={ACCENTS} onChange={(v) => update({ accent: v as Accent })} />
                    </Field>
                  </Grid2>
                  <Field label="Short description">
                    <Area value={p.description} onChange={(v) => update({ description: v })} />
                  </Field>
                  <Field label="Long description">
                    <Area rows={4} value={p.longDescription} onChange={(v) => update({ longDescription: v })} />
                  </Field>
                  <Field label="Tech stack">
                    <Tags value={p.tech} onChange={(v) => update({ tech: v })} />
                  </Field>
                  <Grid2>
                    <Field label="Live URL" hint="optional">
                      <Text value={p.liveUrl ?? ""} onChange={(v) => update({ liveUrl: v })} placeholder="https://…" />
                    </Field>
                    <Field label="Repo URL" hint="optional">
                      <Text value={p.repoUrl ?? ""} onChange={(v) => update({ repoUrl: v })} placeholder="https://github.com/…" />
                    </Field>
                  </Grid2>
                </>
              )}
            />
          </Section>
        )}

        {tab === "certs" && (
          <Section title="Certifications">
            <ArrayEditor
              items={draft.certifications}
              onChange={(v) => setDraft((d) => ({ ...d, certifications: v }))}
              makeBlank={blankCert}
              itemLabel={(c) => c.title}
              addLabel="Add certification"
              renderItem={(c, update) => (
                <>
                  <Grid2>
                    <Field label="Title">
                      <Text value={c.title} onChange={(v) => update({ title: v })} />
                    </Field>
                    <Field label="Issuer">
                      <Text value={c.issuer} onChange={(v) => update({ issuer: v })} />
                    </Field>
                    <Field label="Year" hint="optional">
                      <Text value={c.year ?? ""} onChange={(v) => update({ year: v })} />
                    </Field>
                    <Field label="Credential URL" hint="optional">
                      <Text value={c.credentialUrl ?? ""} onChange={(v) => update({ credentialUrl: v })} placeholder="https://…" />
                    </Field>
                  </Grid2>
                  <Field label="Skills">
                    <Tags value={c.skills} onChange={(v) => update({ skills: v })} />
                  </Field>
                </>
              )}
            />
          </Section>
        )}

        {tab === "education" && (
          <Section title="Education">
            <ArrayEditor
              items={draft.education}
              onChange={(v) => setDraft((d) => ({ ...d, education: v }))}
              makeBlank={blankEdu}
              itemLabel={(e) => e.degree}
              addLabel="Add education"
              renderItem={(e, update) => (
                <>
                  <Grid2>
                    <Field label="Degree / qualification">
                      <Text value={e.degree} onChange={(v) => update({ degree: v })} />
                    </Field>
                    <Field label="Institution">
                      <Text value={e.institution} onChange={(v) => update({ institution: v })} />
                    </Field>
                    <Field label="Kind" hint="e.g. Degree">
                      <Text value={e.kind} onChange={(v) => update({ kind: v })} />
                    </Field>
                    <Field label="Year" hint="optional">
                      <Text value={e.year ?? ""} onChange={(v) => update({ year: v })} />
                    </Field>
                    <Field label="Status">
                      <Select value={e.status} options={["Completed", "In Progress"]} onChange={(v) => update({ status: v as Education["status"] })} />
                    </Field>
                    <Field label="Accent">
                      <Select value={e.accent} options={ACCENTS} onChange={(v) => update({ accent: v as Accent })} />
                    </Field>
                  </Grid2>
                  <Field label="Highlights">
                    <Tags value={e.highlights} onChange={(v) => update({ highlights: v })} />
                  </Field>
                </>
              )}
            />
          </Section>
        )}

        {/* contact block lives with profile conceptually; edit it under Profile too */}
        {tab === "profile" && (
          <Section title="Contact section copy">
            <Grid2>
              <Field label="Headline">
                <Text value={draft.contact.heading} onChange={(v) => patchContact({ heading: v })} />
              </Field>
              <Field label="Headline accent" hint="gradient word">
                <Text value={draft.contact.headingAccent} onChange={(v) => patchContact({ headingAccent: v })} />
              </Field>
            </Grid2>
            <Field label="Blurb">
              <Area value={draft.contact.blurb} onChange={(v) => patchContact({ blurb: v })} />
            </Field>
          </Section>
        )}
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-[clamp(16px,3vw,28px)]">
      <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-blue-glow">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">{children}</div>
  );
}

function ProdNotice() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div className="max-w-md">
        <div className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-blue-glow">
          Content Studio
        </div>
        <h1 className="mb-3 font-display text-2xl font-bold text-white">
          This is a local editing tool
        </h1>
        <p className="text-sm leading-[1.7] text-white/60">
          The Content Studio only runs on the developer&apos;s machine during{" "}
          <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-blue-glow">
            npm run dev
          </code>
          . There is nothing to edit here on the live site. Head back to the{" "}
          <a href="/" className="text-blue-glow underline-offset-2 hover:underline">
            portfolio
          </a>
          .
        </p>
      </div>
    </main>
  );
}
