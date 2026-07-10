"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/types";
import Editor from "@/components/Editor";

const KEY_STORAGE = "studio-key";

type Phase = "checking" | "login" | "ready";

export default function Page() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [keyInput, setKeyInput] = useState("");
  const [key, setKey] = useState<string | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [sha, setSha] = useState<string>("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  // Load current content from GitHub using the given key.
  const load = async (k: string): Promise<boolean> => {
    setError("");
    try {
      const res = await fetch("/api/content", {
        headers: { "x-studio-key": k },
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Failed (${res.status}).`);
        return false;
      }
      setContent(data.content as SiteContent);
      setSha(data.sha as string);
      setKey(k);
      sessionStorage.setItem(KEY_STORAGE, k);
      setPhase("ready");
      return true;
    } catch {
      setError("Network error — check your connection and try again.");
      return false;
    }
  };

  // Try a stored key on first load so a reload doesn't force re-entry.
  useEffect(() => {
    const stored = sessionStorage.getItem(KEY_STORAGE);
    if (stored) {
      load(stored).then((ok) => {
        if (!ok) {
          sessionStorage.removeItem(KEY_STORAGE);
          setPhase("login");
        }
      });
    } else {
      setPhase("login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(""), 6000);
    return () => clearTimeout(t);
  }, [status]);

  const logout = () => {
    sessionStorage.removeItem(KEY_STORAGE);
    setKey(null);
    setContent(null);
    setSha("");
    setKeyInput("");
    setPhase("login");
  };

  const save = async (draft: SiteContent) => {
    if (!key) throw new Error("no key");
    setSaving(true);
    setStatus("");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "content-type": "application/json", "x-studio-key": key },
        body: JSON.stringify({ content: draft, sha }),
      });
      const data = await res.json();
      if (res.status === 401) {
        logout();
        throw new Error("Session expired.");
      }
      if (!res.ok) {
        setStatus(data.error || `Save failed (${res.status}).`);
        throw new Error(data.error || "save failed");
      }
      setSha(data.sha as string);
      setStatus("Saved ✓ — portfolio is redeploying (~30–60s)");
    } finally {
      setSaving(false);
    }
  };

  if (phase === "checking") {
    return (
      <main className="grid min-h-screen place-items-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
          Loading…
        </span>
      </main>
    );
  }

  if (phase === "login") {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (keyInput.trim()) load(keyInput.trim());
          }}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-7"
        >
          <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-blue-glow">
            Content Studio
          </div>
          <h1 className="mb-1.5 font-display text-xl font-bold text-white">
            Enter your password
          </h1>
          <p className="mb-5 text-sm leading-[1.6] text-white/50">
            Private editor. Unlocks the forms and commits changes to your GitHub
            repo.
          </p>
          <input
            type="password"
            value={keyInput}
            autoFocus
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Password"
            className="mb-3 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 font-body text-sm text-white outline-none transition focus:border-blue-glow/50 focus:bg-white/[0.05] placeholder:text-white/25"
          />
          {error && (
            <p className="mb-3 rounded-lg border border-red-glow/25 bg-red-glow/10 px-3 py-2 font-mono text-[11px] leading-[1.5] text-red-glow">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-brand-gradient px-4 py-2.5 font-display text-sm font-bold text-ink transition hover:opacity-90"
          >
            Unlock →
          </button>
        </form>
      </main>
    );
  }

  return (
    <Editor
      initial={content as SiteContent}
      onSave={save}
      onLogout={logout}
      saving={saving}
      status={status}
    />
  );
}
