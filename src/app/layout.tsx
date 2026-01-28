import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
// import { Navbar } from "@/components/layout/navbar";
// import { OnboardingCheck } from "@/components/layout/onboarding-check";

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
// import { Toaster } from "@/components/ui/sonner";
// import { AdminSync } from "@/components/admin/admin-sync";
import { getUserClubRoles } from "@/lib/rbac";
import Navigation from "@/components/layout/navbar/navbar";
import HomeScreen from "@/components/layout";
// import { Navbar } from "@/components/layout/navbar";

export default async function RootLayout(
  {
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
        <Navigation />
        <HomeScreen />
        {/* <AdminSync /> */}
        {/* <OnboardingCheck /> */}
        {/* <Navbar isAdmin={!!isAdmin} userRole={session?.user?.role} clubRoles={clubRoles} /> */}
        {/* {children} */}
        {/* <Toaster /> */}
      </body>
    </html>
  );
}





// "use client"

// import "./Hero.css";
// // import "./styles/cloudBackground.css";
// import React, { useEffect, useState } from "react";
// // import { Route, Routes } from "react-router-dom";
// // import Navbar from "./components-global/navbar/navbar";
// import HomeScreen from "@/components/layout";
// import { Navbar } from "@/components/layout/navbar";
// // import ErrorPage from "./pages/landing/Error404";
// // import {EventsV2} from './pages/eventsV2/index';
// // import HomeScreen from './pages/landing';
// // import ArtistsPage from './pages/landing/components/artist-v5';
// // import AccomodationScreen from "./pages/accomodation";
// // Import correctly using the named export
// // import  AudioProvider from './services/AudioService';
// // import AudioControl from './components/AudioControl/AudioControl';

// const App: React.FC = () => {
//   const [_loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Apply old paper effect to the document body
//     document.body.classList.add('old-paper-theme');
    
//     // Simulate loading complete after resources are loaded
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 1000);
    
//     return () => {
//       clearTimeout(timer);
//       document.body.classList.remove('old-paper-theme');
//     };
//   }, []);

//   return (
//     <><div className="font-medieval">
//       <Navbar />
//       <HomeScreen />
//       {/* <AudioControl showDelay={1000} /> */}
//       {/* <Routes>
//         <Route path="/" element={<HomeScreen />} />
//         <Route path="/events" element={<EventsV2 />} />
//         <Route path="/artists" element={<ArtistsPage />} />
//         <Route path="/accomodation" element={<AccomodationScreen/>} /> 
//         {/* <Route path="/espektro-merchandise" element={<MerchandiseScreen />} /> */}
//         {/* <Route path="*" element={<ErrorPage />} />
//       </Routes> */} 
//       </div></>
    
//   );
// };