import nextDynamic from "next/dynamic";
import { Hero } from "@/components/landing/hero";
import { LogoPreloader } from "@/components/landing/logo-preloader";
import { getTimelineData } from "@/actions/landing-data";
import { MusicController } from "@/components/audio/MusicController";
import { Footer } from "@/components/landing/footer";
import { LazySection } from "@/components/landing/LazySection";

// Dynamic imports for below-the-fold sections
const EspektroAbout = nextDynamic(() => import("@/components/landing/about-sections/Espektro"));
const Techtix = nextDynamic(() => import("@/components/landing/about-sections/Techtix"));
const Quizine = nextDynamic(() => import("@/components/landing/about-sections/Quizine"));
const Exotica = nextDynamic(() => import("@/components/landing/about-sections/Exotica"));
const FirstBack = nextDynamic(() => import("@/components/landing/1stback").then(mod => mod.FirstBack));
const Timeline = nextDynamic(() => import("@/components/landing/timeline"));
const EventsTimeline = nextDynamic(() => import("@/components/landing/events-timeline").then(mod => mod.EventsTimeline));
const FeaturedArtists = nextDynamic(() => import("@/components/landing/featured-artists").then(mod => mod.FeaturedArtists));
const ArtistGallery = nextDynamic(() => import("@/components/landing/artist-gallery").then(mod => mod.ArtistGallery));
const Sponsors = nextDynamic(() => import("@/components/landing/sponsors").then(mod => mod.Sponsors));
const ClubsSection = nextDynamic(() => import("@/components/landing/about-sections/clubs"));
const Contact = nextDynamic(() => import("@/components/landing/contact").then(mod => mod.Contact));

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const timelineData = await getTimelineData();

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      <LogoPreloader />
      <MusicController />

      <div id="hero" data-section-id="hero">
        <Hero />
      </div>

      <LazySection id="espektro-about" data-section-id="espektro-about">
        <EspektroAbout />
      </LazySection>

      <LazySection id="techtix" data-section-id="techtix">
        <Techtix />
      </LazySection>

      <LazySection id="quizine" data-section-id="quizine">
        <Quizine />
      </LazySection>

      <LazySection id="exotica" data-section-id="exotica">
        <Exotica />
      </LazySection>

      <LazySection id="1stback" data-section-id="1stback">
        <FirstBack />
      </LazySection>

      <LazySection id="timeline" data-section-id="timeline">
        <Timeline />
      </LazySection>

      <LazySection id="events-timeline" data-section-id="events-timeline">
        <EventsTimeline scheduleData={timelineData} />
      </LazySection>

      <LazySection id="featured-artists" data-section-id="featured-artists">
        <FeaturedArtists />
      </LazySection>

      <LazySection id="artist-gallery" data-section-id="artist-gallery">
        <ArtistGallery />
      </LazySection>

      <LazySection id="sponsors" data-section-id="sponsors">
        <Sponsors />
      </LazySection>

      <LazySection id="clubs" data-section-id="clubs">
        <ClubsSection />
      </LazySection>

      <LazySection id="contact" data-section-id="contact">
        <Contact />
      </LazySection>

      <Footer />
    </main>
  );
}
