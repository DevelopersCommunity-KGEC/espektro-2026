import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuiXine",
  description: "Cultural culinary showcase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Navigation
          isAdmin={!!isAdmin}
          userRole={session?.user?.role}
          clubRoles={clubRoles} />
        {/* <HomeScreen /> */}

        {/* 👇 THIS is what makes it Next.js */}
        {children}
        {/* <AdminSync /> */}
        {/* <OnboardingCheck /> */}
        {/* <Navbar isAdmin={!!isAdmin} userRole={session?.user?.role} clubRoles={clubRoles} /> */}
        {/* {children} */}
        {/* <Toaster /> */}
      </body>
    </html>
  );
}
