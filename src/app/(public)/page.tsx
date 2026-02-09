import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { ThemeEvolution } from "@/components/landing/theme-evolution";
import { EventsTimeline } from "@/components/landing/events-timeline";
import { FeaturedArtists } from "@/components/landing/featured-artists";
import { CulturalIllustrations } from "@/components/landing/cultural-illustrations";
import { Gallery } from "@/components/landing/gallery";
import { Sponsors } from "@/components/landing/sponsors";
import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";
import { Navigation } from "@/components/landing/navigation";
import { getTimelineData } from "@/actions/landing-data";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
    const timelineData = await getTimelineData();

    return (
        <main className="min-h-screen bg-background selection:bg-[#B7410E] selection:text-white">
            <Navigation />
            <Hero />
            <About />
            <ThemeEvolution />
            <CulturalIllustrations />
            <EventsTimeline scheduleData={timelineData} />
            <FeaturedArtists />
            <Gallery />
            <Sponsors />
            <Contact />
            <Footer />
        </main>
    );
}
