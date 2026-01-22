import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Espektro 2026 | Event & Ticketing",
  description: "Official ticketing platform for Espektro 2026, the annual fest of Kalyani Government Engineering College.",
  keywords: ["Espektro", "KGEC", "Kalyani Government Engineering College", "College Fest", "Tech Fest", "Cultural Fest", "Ticketing", "Events", "2026"],
  authors: [{ name: "Espektro Tech Team" }],
  openGraph: {
    title: "Espektro 2026 | KGEC Annual Fest",
    description: "Official ticketing platform for Espektro 2026, the annual fest of Kalyani Government Engineering College.",
    url: "https://espektro.kgec.edu.in",
    siteName: "Espektro 2026",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Espektro 2026 | KGEC Annual Fest",
    description: "Official ticketing platform for Espektro 2026.",
  },
};

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
import { AdminSync } from "@/components/admin/admin-sync";
import { getUserClubRoles } from "@/lib/rbac";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <AdminSync />
        <Navbar isAdmin={!!isAdmin} userRole={session?.user?.role} clubRoles={clubRoles} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
