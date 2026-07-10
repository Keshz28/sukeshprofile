import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const rootDir = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
// NOTE: unlike the portfolio, this app is NOT a static export — it runs as a
// normal Next.js server app on Vercel so its API route (auth + GitHub commit)
// works. Deploy it as a SEPARATE Vercel project with Root Directory = "studio".
const nextConfig = {
  reactStrictMode: true,
  // This app lives inside the portfolio repo; pin the workspace root to this
  // folder so Next doesn't infer the parent (avoids the multi-lockfile warning).
  turbopack: { root: rootDir },
};

export default nextConfig;
