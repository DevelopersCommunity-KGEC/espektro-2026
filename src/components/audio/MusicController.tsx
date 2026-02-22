"use client";

import { useEffect, useRef, useState } from "react";
import {
  LogOut,
  User,
  Ticket,
  ScanLine,
  LayoutDashboard,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react";

// --- Configuration ---
// Define your music tracks here.
// You can map multiple section IDs to the same track.
// --- Configuration ---
// Define your music tracks here.
// You can map multiple section IDs to the same track.
const TRACKS = {
  STARTING: "/music/STARTING SITE1.mp3",
  LOADING: "/music/loading-effect.mp3",
  ARTIST: "/music/ARTISTSECTION1.mp3",
  ARTIST2: "/music/ARTISTSECTION2.mp3",
  ARTIST_PREV: "/music/PREVIOUS ARTIST.mp3",
  THUNDER: "/music/THUNDER.mp3",
  BENGALI: "/music/BENGALICULTURE.mp3",
};

interface SectionAudioConfig {
  track: string;
  volume: number;
  fadeMs: number;
  delayMs?: number;
  startTime?: number;
  isSharp?: boolean;
  scrollSpeedMs?: number;
  hasThunder?: boolean;
}

const DEFAULT_SCROLL_SPEED = 1000;
const DEFAULT_FADE = 1800;
const DEFAULT_VOLUME = 0.4;
const THUNDER_INTRO_MS = 2500;

const AUDIO_CONFIG: Record<string, SectionAudioConfig> = {
  hero: {
    track: TRACKS.STARTING, volume: 0.6, fadeMs: 200, delayMs: 500, startTime: 0, isSharp: false, scrollSpeedMs: 0, hasThunder: false
  },
  "espektro-about": {
    track: TRACKS.STARTING, volume: 0.6, fadeMs: 1800, delayMs: 500, startTime: 0, isSharp: false, scrollSpeedMs: 800, hasThunder: false
  },
  techtix: {
    track: TRACKS.STARTING, volume: 0.6, fadeMs: 1800, delayMs: 500, startTime: 0, isSharp: false, scrollSpeedMs: 800, hasThunder: false
  },
  quizine: {
    track: TRACKS.STARTING, volume: 0.6, fadeMs: 1800, delayMs: 500, startTime: 0, isSharp: false, scrollSpeedMs: 800, hasThunder: false
  },
  exotica: {
    track: TRACKS.STARTING, volume: 0.6, fadeMs: 1800, delayMs: 500, startTime: 0, isSharp: false, scrollSpeedMs: 800, hasThunder: false
  },
  "1stback": {
    track: TRACKS.BENGALI, volume: 0.3, fadeMs: 500, delayMs: 500, startTime: 0, isSharp: false, scrollSpeedMs: 100, hasThunder: false
  },
  "timeline": {
    track: TRACKS.ARTIST, volume: 0.3, fadeMs: 100, delayMs: 0, isSharp: true, scrollSpeedMs: 1000, hasThunder: false
  },
  "events-timeline": {
    track: TRACKS.ARTIST, volume: 0.3, fadeMs: 100, delayMs: 0, isSharp: true, scrollSpeedMs: 1000, hasThunder: true
  },
  "events-page": {
    track: TRACKS.STARTING, volume: 0.3, fadeMs: 100, delayMs: 0, isSharp: true, scrollSpeedMs: 1000, hasThunder: false
  },
  "featured-artists": {
    track: TRACKS.ARTIST, volume: 0.3, fadeMs: 200, delayMs: 0, startTime: 0, isSharp: false, scrollSpeedMs: 2000, hasThunder: false
  },
  "artist-gallery": {
    track: TRACKS.ARTIST_PREV, volume: 0.5, fadeMs: 500, delayMs: 0, startTime: 0, isSharp: false, scrollSpeedMs: 2000, hasThunder: false
  },
  "2ndback": {
    track: TRACKS.ARTIST, volume: 0.3, fadeMs: 500, delayMs: 0, startTime: 0, isSharp: false, scrollSpeedMs: 800, hasThunder: false
  },
  sponsors: {
    track: TRACKS.ARTIST_PREV, volume: 0.5, fadeMs: 500, delayMs: 0, startTime: 0, isSharp: false, scrollSpeedMs: 1000, hasThunder: false
  },
  clubs: {
    track: TRACKS.ARTIST_PREV, volume: 0.5, fadeMs: 500, delayMs: 0, startTime: 0, isSharp: false, scrollSpeedMs: 1000, hasThunder: false
  },
  contact: {
    track: TRACKS.ARTIST_PREV, volume: 0.5, fadeMs: 500, delayMs: 0, startTime: 0, isSharp: false, scrollSpeedMs: 1000, hasThunder: false
  },
};

export function MusicController({
  autoStart = false,
  initialSection = "hero"
}: {
  autoStart?: boolean;
  initialSection?: string;
}) {
  const [activeSection, setActiveSection] = useState<string>(initialSection);
  const [debouncedSection, setDebouncedSection] = useState<string>(initialSection);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [currentTrack, setCurrentTrack] = useState<string>("");
  const [isMuted, setIsMuted] = useState(false);

  const audioRefA = useRef<HTMLAudioElement | null>(null);
  const audioRefB = useRef<HTMLAudioElement | null>(null);
  const thunderRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioRef = useRef<"A" | "B">("A");
  const fadeIntervals = useRef<Record<string, NodeJS.Timeout>>({});
  const introTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper: Smooth volume fade
  const fadeAudio = (audio: HTMLAudioElement, targetVol: number, duration: number, id: string) => {
    if (fadeIntervals.current[id]) clearInterval(fadeIntervals.current[id]);
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
        if (targetVol === 0) audio.pause();
      }
    }, stepTime);
  };

  // 1. Listen for Start Signal
  useEffect(() => {
    const handleStart = () => {
      console.log(`[MusicController] Experience Starting at: ${activeSection}`);
      // Sync immediately to trigger the main effect
      setDebouncedSection(activeSection);
      setIsPlaying(true);
    };
    window.addEventListener("ESPEKTRO_START_EXPERIENCE", handleStart);
    return () => {
      window.removeEventListener("ESPEKTRO_START_EXPERIENCE", handleStart);
      if (introTimerRef.current) clearTimeout(introTimerRef.current);
    };
  }, [activeSection]);

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
        if (bestCandidate) setActiveSection(bestCandidate);
      },
      { threshold: [0.05, 0.2, 0.5], rootMargin: "-10% 0px -10% 0px" }
    );
    document.querySelectorAll("[data-section-id]").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // 2b. Debounce Active Section (Scroll Speed)
  useEffect(() => {
    const config = AUDIO_CONFIG[activeSection];
    const delay = config?.scrollSpeedMs ?? DEFAULT_SCROLL_SPEED;
    console.log(`[MusicController] Entering ${activeSection}, scheduled in ${delay}ms`);
    const timer = setTimeout(() => {
      console.log(`[MusicController] Section Committing: ${activeSection}`);
      setDebouncedSection(activeSection);
    }, delay);
    return () => clearTimeout(timer);
  }, [activeSection]);

  // 3. Handle Main Track Change
  useEffect(() => {
    if (!isPlaying) return;
    const config = AUDIO_CONFIG[debouncedSection];
    if (!config) return;

    const isSameTrack = config.track === currentTrack;
    const activeAudio = activeAudioRef.current === "A" ? audioRefA.current : audioRefB.current;
    if (!activeAudio) return;

    // Clear any existing intro timer
    if (introTimerRef.current) {
      clearTimeout(introTimerRef.current);
      introTimerRef.current = null;
    }

    const startTrackWithParams = (audio: HTMLAudioElement, id: "A" | "B") => {
      console.log(`[MusicController] Committing Track Params: ${config.track} on ${id}`);
      if (audio.src !== config.track) {
        audio.src = config.track;
        audio.volume = 0;
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (config.startTime !== undefined && !isSameTrack) {
              audio.currentTime = config.startTime;
            }
            fadeAudio(audio, config.volume, config.fadeMs, id);
            activeAudioRef.current = id;
            setCurrentTrack(config.track);
          })
          .catch(e => console.error(`[MusicController] Play failed:`, e));
      }
    };

    const performTransition = () => {
      if (isSameTrack) {
        console.log(`[MusicController] Smooth Transition: Same track (${debouncedSection})`);
        fadeAudio(activeAudio, config.volume, config.fadeMs, activeAudioRef.current);
      } else {
        console.log(`[MusicController] Crossfade Transition: ${currentTrack} -> ${config.track}`);
        const nextId = activeAudioRef.current === "A" ? "B" : "A";
        const nextAudio = nextId === "A" ? audioRefA.current : audioRefB.current;
        if (nextAudio) {
          startTrackWithParams(nextAudio, nextId);
          // Fade out previous
          const bleedDelay = config.isSharp ? 0 : (config.delayMs ?? 500);
          setTimeout(() => fadeAudio(activeAudio, 0, config.fadeMs, activeAudioRef.current), bleedDelay);
        }
      }
    };

    if (config.hasThunder && !isSameTrack) {
      console.log(`[MusicController] Dramatic Entry (${debouncedSection}): Pre-syncing track for Thunder Mix`);
      // Start the music slightly delayed to let the thunder "crack" first, but don't silence existing music if it's the same track
      introTimerRef.current = setTimeout(performTransition, 1000);
    } else {
      performTransition();
    }

    return () => {
      if (introTimerRef.current) clearTimeout(introTimerRef.current);
    };
  }, [debouncedSection, isPlaying, currentTrack]);

  // 4. Handle Thunder Layer
  useEffect(() => {
    if (!isPlaying || !thunderRef.current) return;
    const config = AUDIO_CONFIG[debouncedSection];
    const shouldPlayThunder = config?.hasThunder && config.track !== TRACKS.THUNDER;

    if (shouldPlayThunder) {
      if (thunderRef.current.paused) {
        thunderRef.current.volume = 0;
        thunderRef.current.play()
          .then(() => fadeAudio(thunderRef.current!, 0.4, 1800, "thunder"))
          .catch(e => console.error("[MusicController] Thunder failed:", e));
      }
    } else if (!thunderRef.current.paused) {
      fadeAudio(thunderRef.current, 0, 1800, "thunder");
    }
  }, [debouncedSection, isPlaying]);

  // 5. Sync Mute State
  useEffect(() => {
    if (audioRefA.current) audioRefA.current.muted = isMuted;
    if (audioRefB.current) audioRefB.current.muted = isMuted;
    if (thunderRef.current) thunderRef.current.muted = isMuted;
  }, [isMuted]);

  return (
    <>
      <div className="hidden">
        <audio ref={audioRefA} loop preload="auto" crossOrigin="anonymous" />
        <audio ref={audioRefB} loop preload="auto" crossOrigin="anonymous" />
        <audio ref={thunderRef} src={TRACKS.THUNDER} loop preload="auto" crossOrigin="anonymous" />
      </div>

      {/* Debug Info Overlay */}
      <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-2 text-[9px] rounded-lg backdrop-blur-xl border border-white/20 pointer-events-none font-mono flex flex-col gap-1 min-w-[200px] opacity-0 hover:opacity-100 transition-opacity duration-500">
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

      {/* Discreet Mute Button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="fixed bottom-4 right-4 z-[9999] p-1.5 rounded-full bg-black/20 text-[#2C1810]/40 hover:text-[#B7410E] hover:bg-black/10 transition-all duration-300 backdrop-blur-sm shadow-sm"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>
    </>
  );
}
