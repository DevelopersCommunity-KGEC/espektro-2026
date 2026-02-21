import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Roboto_Slab, MedievalSharp, Open_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Header from "@/components/layout/header/Index";
import { OnboardingCheck } from "@/components/layout/onboarding-check";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
});

const medievalSharp = MedievalSharp({
  weight: "400",
  variable: "--font-medieval-sharp",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Espektro 2026 | Annual Cultural cum Technical Fest of KGEC",
  description:
    "Espektro 2026 is the annual cultural cum technical fest of Kalyani Government Engineering College (KGEC). Hackathons, competitions, workshops, cultural nights, and more. Register now.",
  keywords: [
    "Espektro 2026",
    "KGEC fest",
    "Kalyani Government Engineering College fest",
    "tech fest",
    "cultural fest",
    "hackathon",
    "college fest 2026",
    "Espektro KGEC",
  ],
  authors: [{ name: "Espektro Team, KGEC" }],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://espektro.in/",
  },
  openGraph: {
    type: "website",
    siteName: "Espektro 2026",
    url: "https://espektro.in/",
    title: "Espektro 2026 | Annual Cultural cum Technical Fest of KGEC",
    description:
      "Join Espektro 2026 at KGEC – hackathons, tech events, competitions, workshops, and cultural nights. Register now.",
    images: [
      {
        url: "https://espektro.in/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Espektro 2026 – Annual Cultural cum Technical Fest of KGEC",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Espektro 2026 | Annual Cultural cum Technical Fest of KGEC",
    description:
      "Espektro 2026 at KGEC. Hackathons, competitions, workshops, and cultural nights. Register now.",
    images: ["https://espektro.in/images/og-image.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  applicationName: "Espektro 2026",
  appleWebApp: {
    title: "Espektro 2026",
  },
  other: {
    "theme-color": "#0f172a",
  },
};

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
import { AdminSync } from "@/components/admin/admin-sync";
import { getUserClubRoles } from "@/lib/rbac";
import RouteAudioTrigger from "@/components/audio/RouteAudioTrigger";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const adminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "").split(",").map(e => e.trim());
  const isAdmin = session?.user?.role === "super-admin" || (session?.user?.email && adminEmails.includes(session.user.email));

  let clubRoles: any[] = [];
  if (session?.user) {
    clubRoles = await getUserClubRoles(session.user.id);
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${robotoSlab.variable} ${medievalSharp.variable} ${openSans.variable} antialiased`}
      >
        <AdminSync />
        <OnboardingCheck />
        <RouteAudioTrigger />
        <Header clubRoles={clubRoles} userRole={session?.user?.role} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
