import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { ThemeEvolution } from "@/components/landing/theme-evolution";
import { EventsTimeline } from "@/components/landing/events-timeline";
import { FeaturedArtists } from "@/components/landing/featured-artists";
import { CulturalIllustrations } from "@/components/landing/dazzle-card.module/cultural-illustrations";
import { Gallery } from "@/components/landing/gallery";
import { Sponsors } from "@/components/landing/sponsors";
import ClubsSection from "@/components/landing/about-sections/clubs";
import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";
import { LogoPreloader } from "@/components/landing/logo-preloader";
import Header from "@/components/layout/header/Index";
import { getTimelineData } from "@/actions/landing-data";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ClubRole from "@/models/ClubRole";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
    const timelineData = await getTimelineData();
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    let clubRoles: any[] = [];
    if (session?.user) {
        try {
            const rawRoles = await ClubRole.find({ userId: session.user.id }).lean();
            clubRoles = JSON.parse(JSON.stringify(rawRoles));
        } catch (error) {
            console.error("Error fetching club roles:", error);
        }
    }


    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
            <LogoPreloader />
            <Header clubRoles={clubRoles} userRole={session?.user?.role} />
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
