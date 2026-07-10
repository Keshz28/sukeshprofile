import type { Metadata } from "next";

// Keep the studio out of search engines — it's a private, local-only tool.
export const metadata: Metadata = {
  title: "Content Studio — local editor",
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
