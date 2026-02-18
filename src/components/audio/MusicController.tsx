"use client";

import { useEffect, useRef, useState } from "react";

// --- Configuration ---
// Define your music tracks here.
// You can map multiple section IDs to the same track.
const TRACKS = {
  THEME_A: "/music/loading-effect.wav",
  THEME_B: "/music/loading-effect.wav",
  THEME_C: "/music/loading-effect.wav",
  THEME_D: "/music/loading-effect.wav",
};

// Map Section IDs to Music Tracks
const SECTION_MUSIC_MAP: Record<string, string> = {
  hero: TRACKS.THEME_A,
  "espektro-about": TRACKS.THEME_A,
  techtix: TRACKS.THEME_B,
  quizine: TRACKS.THEME_B,
  exotica: TRACKS.THEME_B,
  timeline: TRACKS.THEME_C,
  "events-timeline": TRACKS.THEME_D,
  "featured-artists": TRACKS.THEME_D,
  "artist-gallery": TRACKS.THEME_A, // Fallback/Cycle
  sponsors: TRACKS.THEME_A,
  clubs: TRACKS.THEME_A,
  contact: TRACKS.THEME_A,
};

const FADE_DURATION = 2000; // ms

export function MusicController() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string>(
    SECTION_MUSIC_MAP["hero"],
  );

  // We use two audio elements to crossfade
  const audioRefA = useRef<HTMLAudioElement | null>(null);
  const audioRefB = useRef<HTMLAudioElement | null>(null);
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
          .then(() => fadeAudio(audio, 0, 0.5, FADE_DURATION))
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
    if (!nextTrack || nextTrack === currentTrack) return;

    console.log(
      `[MusicController] Switching from ${currentTrack} to ${nextTrack}`,
    );
    setCurrentTrack(nextTrack);

    const prevAudio =
      activeAudioRef.current === "A" ? audioRefA.current : audioRefB.current;
    const nextAudio =
      activeAudioRef.current === "A" ? audioRefB.current : audioRefA.current;
    const nextRefStr = activeAudioRef.current === "A" ? "B" : "A";

    if (!prevAudio || !nextAudio) return;

    // A. Setup Next Audio
    nextAudio.src = nextTrack;
    nextAudio.volume = 0;
    nextAudio
      .play()
      .then(() => {
        // B. Crossfade
        fadeAudio(prevAudio, prevAudio.volume, 0, FADE_DURATION); // Fade OUT prev
        fadeAudio(nextAudio, 0, 0.5, FADE_DURATION); // Fade IN next
        activeAudioRef.current = nextRefStr; // Swap active ref
      })
      .catch((e) => console.error("[MusicController] Crossfade failed:", e));
  }, [activeSection, isPlaying, currentTrack]);

  return (
    <div className="hidden">
      <audio ref={audioRefA} loop preload="auto" />
      <audio ref={audioRefB} loop preload="auto" />
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
