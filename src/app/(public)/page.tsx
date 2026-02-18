import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { ThemeEvolution } from "@/components/landing/theme-evolution";
import { EventsTimeline } from "@/components/landing/events-timeline";
import { CulturalIllustrations } from "@/components/landing/dazzle-card.module/cultural-illustrations";
import { Gallery } from "@/components/landing/gallery";
import { Sponsors } from "@/components/landing/sponsors";
import ClubsSection from "@/components/landing/about-sections/clubs";
import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";
import { LogoPreloader } from "@/components/landing/logo-preloader";
import { getTimelineData } from "@/actions/landing-data";
import Timeline from "@/components/landing/timeline/timeline";
import Techtix from "@/components/landing/about-sections/Techtix";
import EspektroAbout from "@/components/landing/about-sections/Espektro";
import Quizine from "@/components/landing/about-sections/Quizine";
import Exotica from "@/components/landing/about-sections/Exotica";
import { ArtistGallery } from "@/components/landing/artist-gallery";
import { FeaturedArtists } from "@/components/landing/featured-artists";
export const dynamic = "force-dynamic";

export default async function LandingPage() {
    const timelineData = await getTimelineData();

    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
            <LogoPreloader />
            <Hero />
            {/* <About /> */}
            <EspektroAbout />
            <Techtix />
            <Quizine />
            <Exotica />
            <Timeline />
            {/* <ThemeEvolution /> */}
            {/* <CulturalIllustrations /> */}
            <EventsTimeline scheduleData={timelineData} />

            <FeaturedArtists />

            {/* <Gallery /> */}
            <ArtistGallery />
            <Sponsors />
            <ClubsSection />
            <Contact />
            <Footer />
        </main>
    );
}
