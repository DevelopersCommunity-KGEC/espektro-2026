"use client";

import { useEffect, useRef, useState } from "react";

// --- Configuration ---
// Define your music tracks here.
// You can map multiple section IDs to the same track.
// --- Configuration ---
// Define your music tracks here.
// You can map multiple section IDs to the same track.
const TRACKS = {
  STARTING: "/music/STARTING SITE1.wav",
  LOADING: "/music/loading-effect.wav",
  ARTIST: "/music/ARTISTSECTION1.wav",
  ARTIST2: "/music/PREVIOUS ARTIST.wav",
  THUNDER: "/music/THUNDER.wav",
};

const SECTION_MUSIC_MAP: Record<string, string> = {
  hero: TRACKS.STARTING,
  "espektro-about": TRACKS.STARTING,
  techtix: TRACKS.STARTING,
  quizine: TRACKS.STARTING,
  exotica: TRACKS.STARTING,
  timeline: TRACKS.STARTING,
  "events-timeline": TRACKS.THUNDER,
  "featured-artists": TRACKS.ARTIST,
  "artist-gallery": TRACKS.ARTIST2,
  sponsors: "",
  clubs: "",
  contact: "",
};

const FADE_DURATION = 2000; // ms
const MAX_VOLUME = 1;
const THUNDER_VOLUME = 1;

export function MusicController() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string>(
    SECTION_MUSIC_MAP["hero"],
  );

  // We use two audio elements to crossfade
  const audioRefA = useRef<HTMLAudioElement | null>(null);
  const audioRefB = useRef<HTMLAudioElement | null>(null);
  const thunderRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioRef = useRef<"A" | "B">("A"); // Tracks which element is currently "Main"

  // 1. Listen for Start Signal (from Preloader)
  useEffect(() => {
    const handleStart = () => {
      console.log("[MusicController] Received start signal");
      setIsPlaying(true);
      // Try to play the initial track immediately
      const audio = audioRefA.current;
      if (audio) {
        audio.volume = 0;
        audio.src = currentTrack || "";
        audio
          .play()
          .then(() => fadeAudio(audio, 0, MAX_VOLUME, FADE_DURATION))
          .catch((e) => console.error("[MusicController] Play failed:", e));
      }
    };

    window.addEventListener("ESPEKTRO_START_EXPERIENCE", handleStart);
    return () =>
      window.removeEventListener("ESPEKTRO_START_EXPERIENCE", handleStart);
  }, [currentTrack]);

  // 2. Observer: Update Active Section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // We find the entry with the largest intersection ratio
        let bestCandidate = null;
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            bestCandidate = entry.target.id;
          }
        });

        if (bestCandidate) {
          // Only update if it's significantly visible to avoid jitter
          setActiveSection(bestCandidate);
        }
      },
      {
        threshold: [0.1, 0.3, 0.5, 0.7], // Multiple thresholds for granularity
        rootMargin: "-20% 0px -20% 0px", // Focus on center of screen
      },
    );

    const sections = document.querySelectorAll("[data-section-id]");
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  // 3. Handle Track Change (Crossfade)
  useEffect(() => {
    if (!isPlaying) return;

    const nextTrack = SECTION_MUSIC_MAP[activeSection];
    if (nextTrack === undefined || nextTrack === currentTrack) return;

    console.log(
      `[MusicController] Switching from ${currentTrack} to ${nextTrack || "Silence"
      }`,
    );
    setCurrentTrack(nextTrack);

    const prevAudio =
      activeAudioRef.current === "A" ? audioRefA.current : audioRefB.current;
    const nextAudio =
      activeAudioRef.current === "A" ? audioRefB.current : audioRefA.current;
    const nextRefStr = activeAudioRef.current === "A" ? "B" : "A";

    if (!prevAudio || !nextAudio) return;

    // 1. Fade out current track
    fadeAudio(prevAudio, prevAudio.volume, 0, FADE_DURATION);

    // 2. Play next track if it exists
    if (nextTrack) {
      nextAudio.src = nextTrack;
      nextAudio.volume = 0;
      nextAudio
        .play()
        .then(() => {
          fadeAudio(nextAudio, 0, MAX_VOLUME, FADE_DURATION);
          activeAudioRef.current = nextRefStr; // Swap active ref
        })
        .catch((e) => console.error("[MusicController] Crossfade failed:", e));
    }
  }, [activeSection, isPlaying, currentTrack]);

  // 4. Handle Ambient Thunder Layer
  useEffect(() => {
    if (!isPlaying || !thunderRef.current) return;

    const isThunderSection =
      activeSection === "events-timeline" ||
      activeSection === "featured-artists" ||
      activeSection === "artist-gallery";

    if (isThunderSection) {
      if (thunderRef.current.paused) {
        thunderRef.current.volume = 0;
        thunderRef.current.play()
          .then(() => fadeAudio(thunderRef.current!, 0, THUNDER_VOLUME, FADE_DURATION))
          .catch(e => console.error("[MusicController] Thunder play failed:", e));
      }
    } else {
      if (!thunderRef.current.paused) {
        fadeAudio(thunderRef.current, thunderRef.current.volume, 0, FADE_DURATION);
      }
    }
  }, [activeSection, isPlaying]);

  return (
    <div className="hidden">
      <audio ref={audioRefA} loop preload="auto" />
      <audio ref={audioRefB} loop preload="auto" />
      <audio ref={thunderRef} src={TRACKS.THUNDER} loop preload="auto" />
      <div className="fixed bottom-4 left-4 z-50 bg-black/50 text-white p-2 text-xs rounded pointer-events-none">
        Debug: {activeSection} | Music: {currentTrack}
      </div>
    </div>
  );
}

// Helper: Smooth volume fade
function fadeAudio(
  audio: HTMLAudioElement,
  startVol: number,
  endVol: number,
  duration: number,
) {
  const steps = 20;
  const stepTime = duration / steps;
  const volStep = (endVol - startVol) / steps;
  let currentStep = 0;

  const timer = setInterval(() => {
    currentStep++;
    const newVol = startVol + volStep * currentStep;
    audio.volume = Math.max(0, Math.min(1, newVol)); // Clamp 0-1

    if (currentStep >= steps) {
      clearInterval(timer);
      if (endVol === 0) audio.pause(); // Stop if faded out completely
    }
  }, stepTime);
}
