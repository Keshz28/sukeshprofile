# Content Studio (cloud)

A private, **password-protected** editor for the portfolio's content. It's a
separate Next.js app that you deploy as its **own Vercel project**. When you
hit **Save**, it commits `lib/content.json` to your portfolio's GitHub repo,
which auto-redeploys the live site.

```
You → studio.vercel.app → [password] → edit → Save
   → commits content.json to GitHub → portfolio redeploys (~30–60s)
```

Your portfolio stays a fast static export — nothing about it changes. This app
is the only piece that runs a server (one API route), and it's locked behind
your password. The password and GitHub token live **only** as server-side env
vars; they never reach the browser.

---

## What you need

1. **A GitHub token** (so the Studio can commit for you)
   - Go to **GitHub → Settings → Developer settings → Fine-grained tokens → Generate**.
   - **Repository access:** only your portfolio repo (`Keshz28/sukeshprofile`).
   - **Permissions → Contents:** *Read and write*.
   - Copy the token (starts with `github_pat_…`).

2. **A password** you'll type to unlock the editor — make it long and unique.

---

## Deploy it (one time)

1. Push this repo to GitHub (the `studio/` folder rides along in your portfolio repo).
2. On **vercel.com → Add New → Project**, import the **same repo**.
3. In the project settings, set **Root Directory = `studio`**. ⬅️ important
4. Add these **Environment Variables** (from `.env.example`):

   | Name | Value |
   |---|---|
   | `STUDIO_PASSWORD` | your chosen password |
   | `GITHUB_TOKEN` | the `github_pat_…` token |
   | `GITHUB_REPO` | `Keshz28/sukeshprofile` *(the repo your portfolio deploys from)* |
   | `GITHUB_BRANCH` | `main` |
   | `CONTENT_PATH` | `lib/content.json` |

5. **Deploy.** You'll get a URL like `kesh-studio.vercel.app` — that's your editor.

> Tip: keep the URL private. Even if someone finds it, they hit the password
> wall and can't read or change anything without it.

---

## Use it

1. Open your Studio URL → enter the password.
2. Edit any section (Projects, Skills, AI Workflow, …).
3. Click **Save & publish**. It commits to GitHub; your portfolio redeploys and
   the change is live in under a minute.

---

## Run locally (optional)

```bash
cd studio
npm install
cp .env.example .env.local   # fill in real values
npm run dev                  # http://localhost:3001
```

---

## How saving works (and why it's safe)

- The browser only ever sends your **password** (as a header) to this app's
  `/api/content` route. It never sees the GitHub token.
- The API verifies the password (constant-time compare), then uses the token
  **server-side** to read/commit `content.json` via the GitHub API.
- Concurrency is handled with the file's git `sha`: if the file changed since
  you loaded it, Save is rejected with a "reload" message instead of clobbering.
- No database. Your content stays versioned in git, exactly like before.

## Rotating credentials

Change `STUDIO_PASSWORD` or regenerate `GITHUB_TOKEN` any time in the Vercel
project's Environment Variables, then redeploy. Old values stop working
immediately.
