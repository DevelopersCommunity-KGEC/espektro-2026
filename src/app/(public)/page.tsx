import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { ThemeEvolution } from "@/components/landing/theme-evolution";
import { EventsTimeline } from "@/components/landing/events-timeline";
import { FeaturedArtists } from "@/components/landing/featured-artists";
import { CulturalIllustrations } from "@/components/landing/cultural-illustrations";
import { Gallery } from "@/components/landing/gallery";
import { Sponsors } from "@/components/landing/sponsors";
import ClubsSection from "@/components/landing/about-sections/clubs";
import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";
import { Navigation } from "@/components/landing/navigation";
import { getTimelineData } from "@/actions/landing-data";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserClubRoles } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
    const [timelineData, session] = await Promise.all([
        getTimelineData(),
        auth.api.getSession({ headers: await headers() }),
    ]);

    const adminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "").split(",").map(e => e.trim());
    const isAdmin = session?.user?.role === "super-admin" || (session?.user?.email && adminEmails.includes(session.user.email));

    let clubRoles: { clubId: string; role: string }[] = [];
    if (session?.user) {
        clubRoles = await getUserClubRoles(session.user.id);
    }

    return (
        <main className="min-h-screen bg-background selection:bg-[#B7410E] selection:text-white">
            <Navigation isAdmin={!!isAdmin} userRole={session?.user?.role} clubRoles={clubRoles} />
            <Hero />
            <About />
            <ThemeEvolution />
            {/* <CulturalIllustrations /> */}
            <EventsTimeline scheduleData={timelineData} />
            <FeaturedArtists />
            <Gallery />
            <Sponsors />
            <ClubsSection />
            <Contact />
            <Footer />
        </main>
    );
}
