import crypto from "node:crypto";
import type { SiteContent } from "@/lib/types";

// Needs Node (Buffer + crypto) and must never be cached — it talks to GitHub.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GH_API = "https://api.github.com";

type Env = {
  password: string;
  token: string;
  repo: string; // "owner/name"
  branch: string;
  path: string;
  authorName: string;
  authorEmail: string;
};

function readEnv(): Env | null {
  const password = process.env.STUDIO_PASSWORD;
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!password || !token || !repo) return null;
  return {
    password,
    token,
    repo,
    branch: process.env.GITHUB_BRANCH || "main",
    path: process.env.CONTENT_PATH || "lib/content.json",
    authorName: process.env.GIT_AUTHOR_NAME || "Content Studio",
    authorEmail: process.env.GIT_AUTHOR_EMAIL || "studio@users.noreply.github.com",
  };
}

/** Constant-time password comparison. */
function keyOk(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function ghHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "kesh-studio",
  };
}

/** GET — return the current content.json + its git blob sha. */
export async function GET(req: Request): Promise<Response> {
  const env = readEnv();
  if (!env) return json({ error: "Server not configured." }, 500);
  if (!keyOk(req.headers.get("x-studio-key"), env.password))
    return json({ error: "Unauthorized." }, 401);

  const url = `${GH_API}/repos/${env.repo}/contents/${env.path}?ref=${env.branch}`;
  const res = await fetch(url, { headers: ghHeaders(env.token), cache: "no-store" });

  if (res.status === 404)
    return json({ error: `File not found: ${env.path} on ${env.branch}.` }, 404);
  if (!res.ok)
    return json({ error: `GitHub read failed (${res.status}).` }, 502);

  const data = (await res.json()) as { content: string; sha: string };
  const text = Buffer.from(data.content, "base64").toString("utf8");
  let content: SiteContent;
  try {
    content = JSON.parse(text) as SiteContent;
  } catch {
    return json({ error: "content.json in the repo is not valid JSON." }, 500);
  }
  return json({ content, sha: data.sha });
}

/** POST — commit updated content.json back to the repo. */
export async function POST(req: Request): Promise<Response> {
  const env = readEnv();
  if (!env) return json({ error: "Server not configured." }, 500);
  if (!keyOk(req.headers.get("x-studio-key"), env.password))
    return json({ error: "Unauthorized." }, 401);

  let body: { content?: unknown; sha?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const { content, sha } = body;
  if (!content || typeof content !== "object" || Array.isArray(content))
    return json({ error: "Content must be an object." }, 400);
  if (!sha) return json({ error: "Missing file sha — reload and try again." }, 400);

  // Basic shape guard so we never commit obviously-broken content.
  const required = ["profile", "about", "projects"];
  for (const k of required) {
    if (!(k in (content as Record<string, unknown>)))
      return json({ error: `Content is missing "${k}".` }, 400);
  }

  const text = JSON.stringify(content, null, 2) + "\n";
  const res = await fetch(`${GH_API}/repos/${env.repo}/contents/${env.path}`, {
    method: "PUT",
    headers: ghHeaders(env.token),
    body: JSON.stringify({
      message: body.message || "content: update via Studio",
      content: Buffer.from(text, "utf8").toString("base64"),
      sha,
      branch: env.branch,
      committer: { name: env.authorName, email: env.authorEmail },
    }),
  });

  if (res.status === 409)
    return json(
      { error: "The file changed on GitHub since you loaded it. Reload to get the latest, then re-apply your edits." },
      409
    );
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return json({ error: `GitHub write failed (${res.status}). ${detail.slice(0, 200)}` }, 502);
  }

  const data = (await res.json()) as { content: { sha: string } };
  return json({ ok: true, sha: data.content.sha });
}
