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
import Timeline from "@/components/landing/timeline";
import Techtix from "@/components/landing/about-sections/Techtix";
import EspektroAbout from "@/components/landing/about-sections/Espektro";
import Quizine from "@/components/landing/about-sections/Quizine";
import Exotica from "@/components/landing/about-sections/Exotica";
import { ArtistGallery } from "@/components/landing/artist-gallery";
import { FeaturedArtists } from "@/components/landing/featured-artists";
import { MusicController } from "@/components/audio/MusicController";
import ComingSoon from "@/components/landing/coming-soon";
import { FirstBack } from "@/components/landing/1stback";
import { SecondBack } from "@/components/landing/2ndback";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const timelineData = await getTimelineData();

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground overflow-x-hidden max-w-full">
      <LogoPreloader />
      <MusicController />

      <div id="hero" data-section-id="hero">
        <Hero />
      </div>

      <div id="espektro-about" data-section-id="espektro-about">
        <EspektroAbout />
      </div>

      <div id="techtix" data-section-id="techtix">
        <Techtix />
      </div>

      <div id="quizine" data-section-id="quizine">
        <Quizine />
      </div>

      <div id="exotica" data-section-id="exotica">
        <Exotica />
      </div>
      <div id="1stback" data-section-id="1stback">
        <FirstBack />
      </div>
      <div id="timeline" data-section-id="timeline">
        <Timeline />
      </div>

      <div id="events-timeline" data-section-id="events-timeline">
        <EventsTimeline scheduleData={timelineData} />
      </div>
      {/* <div id="2ndback" data-section-id="2ndback">
        <SecondBack />
      </div> */}
      <div id="featured-artists" data-section-id="featured-artists">
        <FeaturedArtists />
      </div>

      <div id="artist-gallery" data-section-id="artist-gallery">
        <ArtistGallery />
      </div>

      <div id="sponsors" data-section-id="sponsors">
        <Sponsors />
        {/* <ComingSoon /> */}
      </div>

      <div id="clubs" data-section-id="clubs">
        <ClubsSection />
      </div>

      <div id="contact" data-section-id="contact">
        <Contact />
      </div>

      <Footer />
    </main>
  );
}
