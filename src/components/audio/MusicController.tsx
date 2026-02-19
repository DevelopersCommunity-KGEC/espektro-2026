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
  ARTIST2: "/music/ARTISTSECTION2.wav",
  ARTIST_PREV: "/music/PREVIOUS ARTIST.wav",
  THUNDER: "/music/THUNDER.wav",
  BENGALI: "/music/BENGALICULTURE.wav",
};

// Main Music Mapping
const SECTION_MUSIC_MAP: Record<string, string> = {
  hero: TRACKS.STARTING,
  "espektro-about": TRACKS.STARTING,
  techtix: TRACKS.STARTING,
  quizine: TRACKS.STARTING,
  exotica: TRACKS.STARTING,
  timeline: TRACKS.BENGALI,
  "events-timeline": TRACKS.ARTIST,
  "featured-artists": TRACKS.ARTIST,
  "artist-gallery": TRACKS.ARTIST_PREV,
  sponsors: TRACKS.ARTIST_PREV,
  clubs: TRACKS.ARTIST_PREV,
  contact: TRACKS.ARTIST_PREV,
};

const FADE_DURATION = 1800; // ms
const SHARP_FADE = 200; // Almost a cut for Starting/Bengali transition
const MAX_VOLUME = 0.4;
const THUNDER_VOLUME = 0.4; // Balanced

export function MusicController() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [debouncedSection, setDebouncedSection] = useState<string>("hero");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string>("");

  const audioRefA = useRef<HTMLAudioElement | null>(null);
  const audioRefB = useRef<HTMLAudioElement | null>(null);
  const thunderRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioRef = useRef<"A" | "B">("A");
  const fadeIntervals = useRef<Record<string, NodeJS.Timeout>>({});

  // Helper: Smooth volume fade with interval clearing
  const fadeAudio = (
    audio: HTMLAudioElement,
    targetVol: number,
    duration: number,
    id: string
  ) => {
    if (fadeIntervals.current[id]) {
      clearInterval(fadeIntervals.current[id]);
    }

    if (duration <= 0) {
      audio.volume = targetVol;
      if (targetVol === 0) audio.pause();
      return;
    }

    const steps = 30;
    const stepTime = duration / steps;
    const startVol = audio.volume;
    const volStep = (targetVol - startVol) / steps;
    let currentStep = 0;

    fadeIntervals.current[id] = setInterval(() => {
      currentStep++;
      const newVol = startVol + volStep * currentStep;
      audio.volume = Math.max(0, Math.min(1, newVol));

      if (currentStep >= steps) {
        clearInterval(fadeIntervals.current[id]);
        delete fadeIntervals.current[id];
        if (targetVol === 0) {
          audio.pause();
        }
      }
    }, stepTime);
  };

  // 1. Listen for Start Signal
  useEffect(() => {
    const handleStart = () => {
      console.log("[MusicController] Experience started");
      setIsPlaying(true);
      const initialTrack = SECTION_MUSIC_MAP["hero"];

      if (audioRefA.current && initialTrack) {
        audioRefA.current.src = initialTrack;
        audioRefA.current.volume = 0;
        audioRefA.current.play()
          .then(() => {
            fadeAudio(audioRefA.current!, MAX_VOLUME, FADE_DURATION, "A");
            setCurrentTrack(initialTrack);
          })
          .catch(e => console.error("[MusicController] Initial play failed:", e));
      }
    };

    window.addEventListener("ESPEKTRO_START_EXPERIENCE", handleStart);
    return () => window.removeEventListener("ESPEKTRO_START_EXPERIENCE", handleStart);
  }, []);

  // 2. Observer: Update Active Section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let bestCandidate = null;
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            bestCandidate = entry.target.id;
          }
        });

        if (bestCandidate) {
          setActiveSection(bestCandidate);
        }
      },
      {
        threshold: [0.05, 0.2, 0.5], // Lower threshold for better sensitivity
        rootMargin: "-10% 0px -10% 0px", // Standard window
      },
    );

    const sections = document.querySelectorAll("[data-section-id]");
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // 2b. Debounce Active Section (2s delay for fast scrolling)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSection(activeSection);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeSection]);

  // 3. Handle Main Track Change
  useEffect(() => {
    if (!isPlaying) return;

    const nextTrack = SECTION_MUSIC_MAP[debouncedSection];
    if (nextTrack === undefined || nextTrack === currentTrack) return;

    console.log(`[MusicController] Switch (Debounced): ${debouncedSection} -> ${nextTrack}`);

    const prevAudio = activeAudioRef.current === "A" ? audioRefA.current : audioRefB.current;
    const nextAudio = activeAudioRef.current === "A" ? audioRefB.current : audioRefA.current;
    const prevId = activeAudioRef.current;
    const nextId = activeAudioRef.current === "A" ? "B" : "A";

    if (!prevAudio || !nextAudio) return;

    // Detect if we need a sharp transition (Starting <-> Bengali)
    const isSharpTransition =
      (currentTrack === TRACKS.STARTING && nextTrack === TRACKS.BENGALI) ||
      (currentTrack === TRACKS.BENGALI && nextTrack === TRACKS.STARTING);

    const fadeTime = isSharpTransition ? SHARP_FADE : FADE_DURATION;

    // 1. Prepare and start Next Track immediately
    if (nextTrack) {
      nextAudio.src = nextTrack;
      nextAudio.volume = 0;
      nextAudio.play()
        .then(() => {
          console.log(`[MusicController] Blending in: ${nextTrack}`);
          fadeAudio(nextAudio, MAX_VOLUME, fadeTime, nextId);
          activeAudioRef.current = nextId;
          setCurrentTrack(nextTrack);

          // 2. Handle Previous Track with "Bleed" overlap
          if (isSharpTransition) {
            fadeAudio(prevAudio, 0, fadeTime, prevId);
          } else {
            // Wait 500ms before starting fade-out for a richer "bleed" effect
            setTimeout(() => {
              fadeAudio(prevAudio, 0, fadeTime, prevId);
            }, 500);
          }
        })
        .catch(e => console.error("[MusicController] Play failed:", e));
    } else {
      fadeAudio(prevAudio, 0, fadeTime, prevId);
      setCurrentTrack("");
    }
  }, [debouncedSection, isPlaying, currentTrack]);

  // 4. Handle Thunder Layer
  useEffect(() => {
    if (!isPlaying || !thunderRef.current) return;

    // Thunder ambient channel runs if section is flagged AND its NOT the main track
    const nextMainTrack = SECTION_MUSIC_MAP[debouncedSection];
    const isThunderSection =
      debouncedSection === "timeline" ||
      debouncedSection === "events-timeline" ||
      debouncedSection === "featured-artists" ||
      debouncedSection === "artist-gallery";

    const shouldPlayAmbientThunder = isThunderSection && nextMainTrack !== TRACKS.THUNDER;

    if (shouldPlayAmbientThunder) {
      if (thunderRef.current.paused) {
        thunderRef.current.volume = 0;
        thunderRef.current.play()
          .then(() => fadeAudio(thunderRef.current!, THUNDER_VOLUME, FADE_DURATION, "thunder"))
          .catch(e => console.error("[MusicController] Thunder failed:", e));
      }
    } else if (!thunderRef.current.paused) {
      fadeAudio(thunderRef.current, 0, FADE_DURATION, "thunder");
    }
  }, [debouncedSection, isPlaying]);

  return (
    <div className="hidden">
      <audio ref={audioRefA} loop preload="auto" />
      <audio ref={audioRefB} loop preload="auto" />
      <audio ref={thunderRef} src={TRACKS.THUNDER} loop preload="auto" />
      <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-2 text-[9px] rounded-lg backdrop-blur-xl border border-white/20 pointer-events-none font-mono flex flex-col gap-1 min-w-[200px]">
        <div className="flex justify-between items-center opacity-70 border-b border-white/10 pb-1 mb-1">
          <span>ESPEKTRO AUDIO ENGINE</span>
          <span className="animate-pulse text-green-400">● LIVE</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-50">SECTION:</span>
          <span className="text-primary font-bold">{activeSection.toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-50">CHANNEL:</span>
          <span>{activeAudioRef.current}</span>
        </div>
        <div className="flex flex-col">
          <span className="opacity-50">ACTIVE_TRACK:</span>
          <span className="truncate text-green-200">{currentTrack.split('/').pop() || "SILENCE"}</span>
        </div>
      </div>
    </div>
  );
}
