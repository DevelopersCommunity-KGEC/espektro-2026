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
import Timeline from "@/components/landing/timeline/timeline";
export const dynamic = "force-dynamic";

export default async function LandingPage() {
    const timelineData = await getTimelineData();


    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
            <LogoPreloader />
            <Header />
            <Hero />
            <About />
            <Timeline />
            {/* <ThemeEvolution /> */}
            {/* <CulturalIllustrations /> */}
            <EventsTimeline scheduleData={timelineData} />
            
            <FeaturedArtists />
            {/* <Gallery /> */}
            <Sponsors />
            <ClubsSection />
            <Contact />
            <Footer />
        </main>
    );
}
