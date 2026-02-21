"use client";

import { useEffect, useRef, useState } from "react";
import "./logo-preloader.css";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "./logo/Logo";
import { motion } from "framer-motion";

const TEXT_GROUP_ID = "text";
const TEXT_SPLIT_Y = 860;

function classifyElement(el: SVGGraphicsElement): number {
  if (el.closest(`#${TEXT_GROUP_ID}`)) {
    try {
      const bbox = el.getBBox();
      const cy = bbox.y + bbox.height / 2;
      return cy < TEXT_SPLIT_Y ? 5 : 6;
    } catch {
      return 5;
    }
  }

  try {
    const bbox = el.getBBox();
    if (bbox.width === 0 && bbox.height === 0) return 1;

    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;

    if (cx > 460 && cy > 260 && cy < 500) return 4;
    if (cx > 520 && cy > 150 && cy < 650) return 4;

    if (el.closest("#pen")) return 3;
    const className = el.getAttribute("class") || "";
    if (className.includes("st25")) return 3;

    if (cy < 340) return 2;
    if (cx < 300) return 2;

    return 1;
  } catch {
    return 1;
  }
}

const FADE_TIMING: Record<number, { delay: number; dur: number }> = {
  1: { delay: 0, dur: 0.5 },
  3: { delay: 1.8, dur: 0.5 },
};

const STROKE_TIMING: Record<
  number,
  {
    strokeStart: number;
    strokeDur: number;
    fillDelay: number;
    fillDur: number;
  }
> = {
  2: { strokeStart: 0.5, strokeDur: 1.2, fillDelay: 1.3, fillDur: 0.5 },
  4: { strokeStart: 2.3, strokeDur: 1.0, fillDelay: 2.8, fillDur: 0.5 },
};

const TEXT_ARRIVAL_TIMING: Record<number, { delay: number; dur: number }> = {
  5: { delay: 2.3, dur: 0.6 },
  6: { delay: 3.0, dur: 0.6 },
};

/** Total animation duration before the preloader auto-dismisses */
const TOTAL_DURATION_MS = 7000;

export function LogoPreloader() {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false); // Start false to prevent flash before check
  const [showStartButton, setShowStartButton] = useState(true);
  const [startTrigger, setStartTrigger] = useState(false);

  // Check cookies on mount
  useEffect(() => {
    const hasSeenPreloader = document.cookie.includes("espektro_preloader_seen=true");
    if (hasSeenPreloader) {
      setVisible(false);
      // We don't need to dispatch the event here anymore because MusicController 
      // is now initialized with autoStart=true from the server-side cookie check
    } else {
      setVisible(true);
    }
  }, []);

  const handleStart = () => {
    console.log("[Preloader] Start button clicked");
    setShowStartButton(false);
    setStartTrigger(true);
    // Set cookie to expire when the browser session ends (no max-age/expires)
    document.cookie = "espektro_preloader_seen=true; path=/; SameSite=Strict";
  };

  useEffect(() => {
    console.log("[Preloader] Effect run. StartTrigger:", startTrigger);
    if (!startTrigger || showStartButton) return;

    // Audio effect
    const audio = new Audio("/music/loading-effect.mp3");
    audio.volume = 0.6;

    const playAudio = async () => {
      try {
        console.log("[Preloader] Attempting audio play");
        await audio.play();
      } catch (err) {
        console.warn("[Preloader] Autoplay blocked or failed:", err);
        // Interaction fallback
        const enableAudio = () => {
          audio
            .play()
            .catch((e) => console.error("Interaction play failed", e));
          cleanupListeners();
        };
        const cleanupListeners = () => {
          window.removeEventListener("click", enableAudio);
          window.removeEventListener("keydown", enableAudio);
          window.removeEventListener("touchstart", enableAudio);
        };
        window.addEventListener("click", enableAudio);
        window.addEventListener("keydown", enableAudio);
        window.addEventListener("touchstart", enableAudio);
      }
    };

    playAudio();

    async function loadAndAnimateSVG() {
      try {
        console.log("[Preloader] Fetching SVG...");
        const res = await fetch("/espektro-logo.svg");
        if (!res.ok) throw new Error(`SVG fetch failed: ${res.status}`);
        const svgText = await res.text();

        const container = svgContainerRef.current;
        if (!container) {
          console.error("[Preloader] Container ref is null");
          return;
        }

        container.innerHTML = svgText;
        const svg = container.querySelector("svg");
        if (!svg) {
          console.error("[Preloader] No SVG found in response");
          return;
        }

        svg.classList.add("logo-animate");
        svg.removeAttribute("width");
        svg.removeAttribute("height");

        const contentBBox = svg.getBBox();
        const pad = 10;
        svg.setAttribute(
          "viewBox",
          `${contentBBox.x - pad} ${contentBBox.y - pad} ${contentBBox.width + pad * 2} ${contentBBox.height + pad * 2}`,
        );

        const elements = svg.querySelectorAll(
          "path, polygon, polyline, circle, ellipse, rect, line",
        );

        const phaseCounters: Record<number, number> = {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
        };

        elements.forEach((el) => {
          const gEl = el as SVGGraphicsElement;
          const phase = classifyElement(gEl);
          const htmlEl = el as HTMLElement;
          const idx = phaseCounters[phase]++;

          htmlEl.setAttribute("data-phase", String(phase));

          if (phase === 1 || phase === 3) {
            const timing = FADE_TIMING[phase];
            const microStagger = Math.min(idx * 0.006, 0.3);
            htmlEl.style.setProperty(
              "--anim-delay",
              `${timing.delay + microStagger}s`,
            );
            htmlEl.style.setProperty("--anim-dur", `${timing.dur}s`);
          } else if (phase === 5 || phase === 6) {
            const timing = TEXT_ARRIVAL_TIMING[phase];
            const microStagger = Math.min(idx * 0.03, 0.3);
            htmlEl.style.setProperty(
              "--arrival-delay",
              `${timing.delay + microStagger}s`,
            );
            htmlEl.style.setProperty("--arrival-dur", `${timing.dur}s`);
          } else {
            const timing = STROKE_TIMING[phase];
            if (!timing) return;

            let len = 2000;
            try {
              if (
                typeof (el as SVGGeometryElement).getTotalLength === "function"
              ) {
                len = (el as SVGGeometryElement).getTotalLength();
              }
            } catch {
              /* ignore */
            }

            const microStagger = Math.min(idx * 0.008, 0.4);
            htmlEl.style.setProperty("--path-length", String(len));
            htmlEl.style.setProperty(
              "--stroke-start",
              `${timing.strokeStart + microStagger}s`,
            );
            htmlEl.style.setProperty("--stroke-dur", `${timing.strokeDur}s`);
            htmlEl.style.setProperty(
              "--fill-delay",
              `${timing.fillDelay + microStagger}s`,
            );
            htmlEl.style.setProperty("--fill-dur", `${timing.fillDur}s`);
            htmlEl.style.strokeDasharray = String(len);
            htmlEl.style.strokeDashoffset = String(len);
          }
        });
        console.log("[Preloader] SVG setup complete");
      } catch (e) {
        console.error("[Preloader] Animation error:", e);
      }
    }

    loadAndAnimateSVG();

    const timer = setTimeout(() => {
      console.log("[Preloader] Timer finished. Dismissing.");
      setVisible(false);
      // Notify MusicController to start BGM after preloader is done
      window.dispatchEvent(new Event("ESPEKTRO_START_EXPERIENCE"));
    }, TOTAL_DURATION_MS);

    return () => clearTimeout(timer);
  }, [startTrigger, showStartButton]);

  // Force scroll to top on refresh and disable scrolling while preloader is active
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (visible) {
        // Prevent browser from trying to restore scroll position
        if (window.history.scrollRestoration) {
          window.history.scrollRestoration = "manual";
        }

        // Initial scroll to top
        window.scrollTo(0, 0);

        // Disable scrolling on body while preloader is visible
        document.body.style.overflow = "hidden";
      } else {
        // Allow browser to restore scroll position if preloader is skipped
        if (window.history.scrollRestoration) {
          window.history.scrollRestoration = "auto";
        }
        document.body.style.overflow = "";
      }
    }

    return () => {
      // Cleanup: ensure scrolling is restored if component unmounts
      if (typeof window !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={`preloader-overlay ${startTrigger ? "active-exit" : ""}`} style={{ backgroundColor: "#FFF8F0" }}>
      {/* Lotus Mandala Background - Centered and Subtle */}
      <div className="absolute inset-0 -bottom-[50%] flex items-center justify-center opacity-[0.9] pointer-events-none">
        <Image
          src="/images/background_web.webp"
          alt="Decorative lotus mandala"
          fill
          priority
          className="object-contain hidden md:block"
        />
        <Image
          src="/images/background_web_mobile.webp"
          alt="Decorative lotus mandala"
          fill
          priority
          className="object-contain w-fit md:hidden bottom-50"
        />
      </div>

      {/* Left tribal border pattern */}
      {/* <div
        className="absolute top-0 left-0 bottom-0 w-16 md:w-24 overflow-hidden hidden sm:block z-10"
        style={{
          backgroundImage: 'url(/images/43a0b75b3caae95caa70550adda8ed60.webp)',
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center'
        }}
      /> */}

      {showStartButton ? (
        <motion.div
          className="relative flex flex-col items-center gap-6 z-50"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
              }
            }
          }}
        >
          <motion.div
            className="lg:w-[300px] h-[300px] aspect-[463/417]"
            variants={{
              hidden: { opacity: 0, scale: 0.8, rotate: -5 },
              visible: {
                opacity: 1,
                scale: 1,
                rotate: 0,
                transition: { duration: 1, ease: "easeOut" }
              }
            }}
          >
            <Logo />
          </motion.div>

          <div className="text-center mb-8 overflow-hidden">
            <motion.h1
              className="text-5xl sm:text-7xl md:text-8xl font-bold text-[#2C1810] uppercase tracking-tighter font-[family-name:var(--font-medieval-sharp)] drop-shadow-sm leading-none flex"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
            >
              {"ESPEKTRO 26".split("").map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] }
                    }
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" }
              }
            }}
          >
            <Button
              variant="theatrical"
              onClick={handleStart}
              className="bg-[#B7410E] hover:bg-[#8B2635] text-white h-12 px-10 text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 font-[family-name:var(--font-roboto-slab)] rounded-sm"
            >
              EXPLORE
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <div className="preloader-logo-container relative z-20" ref={svgContainerRef} />
      )}
    </div>
  );
}
