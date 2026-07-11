import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Space_Mono, Inter } from "next/font/google";
import { profile } from "@/lib/data";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.roles[0]}`,
  description: profile.summary,
  keywords: [
    profile.name,
    "Full-Stack Developer",
    "UI/UX Designer",
    "Web Designer",
    "XR Developer",
    "Portfolio",
    "React",
    "Next.js",
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.name} — ${profile.roles[0]}`,
    description: profile.summary,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.roles[0]}`,
    description: profile.summary,
  },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
};

// Runs before paint so a saved "sun" theme never flashes deep-space first.
const themeInit = `try{if(localStorage.getItem("kesh-theme")==="sun")document.documentElement.dataset.theme="sun"}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${spaceMono.variable} ${inter.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
