"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { stats } from "@/data/landing-content";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  Variants,
} from "framer-motion";

import EspektroAbout from "@/components/landing/about-sections/Espektro";
import Techtix from "@/components/landing/about-sections/Techtix";
import Exotica from "@/components/landing/about-sections/Exotica";
import Quizine from "@/components/landing/about-sections/Quizine";

// Counter Component
function Counter({ value }: { value: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const numericValue = parseInt(value.replace(/\D/g, "")) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    const controls = animate(count, numericValue, {
      duration: 2,
      ease: "easeOut" as const,
    });
    return controls.stop;
  }, [numericValue]);

<<<<<<< HEAD:src/components/landing/about.tsx
  return (
    <span className="flex">
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imageColor, setImageColor] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, 1 - rect.top / vh));
      setImageColor(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;
    // We need to keep track of previous positions for the continuous stroke,
    // but resetting them on re-entry (re-mount of effect) is fine.
    let prevX: number | null = null;
    let prevY: number | null = null;

    const initCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // precise sizing
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        // Scale context logic
        ctx.resetTransform(); // clear any previous transform
        ctx.scale(dpr, dpr);

        // Fill with solid color matching the section background
        // Check computed style of body or html to find the actual bg color
        const computedBody = window.getComputedStyle(document.body);
        const computedHtml = window.getComputedStyle(document.documentElement);

        let bgColor = computedBody.backgroundColor;
        // If body bg is transparent, try html or default to white
        if (
          !bgColor ||
          bgColor === "rgba(0, 0, 0, 0)" ||
          bgColor === "transparent"
        ) {
          bgColor = computedHtml.backgroundColor;
        }
        if (
          !bgColor ||
          bgColor === "rgba(0, 0, 0, 0)" ||
          bgColor === "transparent"
        ) {
          bgColor = "#ffffff";
        }

        ctx.fillStyle = bgColor;

        // Fill slightly larger than the container to prevent sub-pixel gaps
        ctx.fillRect(-1, -1, rect.width + 2, rect.height + 2);

        // Set erase mode
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    };

    const animate = () => {
      if (!ctx) return;

      t += 0.05; // Speed

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Lissajous-like chaotic path
      const x =
        w / 2 + Math.sin(t * 1.7) * (w * 0.45) + Math.cos(t * 3.1) * (w * 0.1);
      const y =
        h / 2 + Math.cos(t * 1.3) * (h * 0.45) + Math.sin(t * 2.7) * (h * 0.1);

      if (prevX !== null && prevY !== null) {
        ctx.beginPath();
        // Brush size
        ctx.lineWidth = 150 + Math.sin(t * 5) * 50;
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      prevX = x;
      prevY = y;

      animationFrameId = requestAnimationFrame(animate);
    };

    // Always initialize (fill) the canvas to ensure image is hidden initially
    initCanvas();

    // Only start the reveal animation if the component is visible
    if (isVisible) {
      animate();
    }

    const handleResize = () => {
      // Re-init (refill) on resize to prevent distortion,
      // but this also resets the reveal. Acceptable for now.
      initCanvas();
      prevX = null;
      prevY = null;
      if (isVisible) {
        // Restart animation if visible
        cancelAnimationFrame(animationFrameId);
        t = 0;
        animate();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const maskVariants: Variants = {
    hidden: { y: "110%" },
    visible: {
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-24 lg:py-36 bg-background relative"
    >
      <div className="container mx-auto px-6 lg:px-8 mb-24">
        {/* Two column layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <div
            ref={imageRef}
            className={`relative aspect-[4/5] lg:aspect-square overflow-hidden border-none transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            style={{ borderRadius: "46% 54% 39% 61% / 54% 36% 64% 46%" }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 z-30 pointer-events-none"
            />

            {/* Dynamic grayscale filter */}
            <div
              className="absolute inset-0 z-10 mix-blend-saturation bg-background pointer-events-none transition-opacity duration-100"
              style={{ opacity: 1 - imageColor }}
            />

            <img
              src="/images/artist-1.jpg"
              alt="Espektro Artist"
              className="w-full h-full object-cover border-none"
            />
          </div>

          {/* Content */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
            className="flex flex-col items-start"
          >
            <motion.p
              variants={fadeIn}
              className="text-[#B7410E] text-xs uppercase tracking-[0.3em] mb-6 font-semibold"
            >
              Prepare for Impact
            </motion.p>

            <h2 className="font-serif text-4xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-8">
              <div className="overflow-hidden">
                <motion.div variants={maskVariants}>The Legend</motion.div>
              </div>
              <div className="overflow-hidden">
                <motion.div
                  variants={maskVariants}
                  className="text-muted-foreground italic font-normal"
                >
                  Returns
                </motion.div>
              </div>
            </h2>

            <div className="overflow-hidden mb-6">
              <motion.p
                variants={maskVariants}
                className="text-muted-foreground text-lg leading-relaxed"
              >
                Espektro is not just a fest; it&apos;s an emotion interwoven
                with the spirit of Kalyani Government Engineering College. For
                three days, our campus transforms into a pulsating hub of art,
                technology, and culture.
              </motion.p>
            </div>

            <div className="overflow-hidden mb-12">
              <motion.p
                variants={maskVariants}
                className="text-foreground text-lg font-medium leading-relaxed"
              >
                In 2026, we pay homage to the soil we stand on. We trace the arc
                of Bengali culture—from the clay of Kumartuli to the silicon of
                Salt Lake.
              </motion.p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-border w-full">
              {stats.map((stat) => (
                <div key={stat.label} className="overflow-hidden">
                  <motion.div variants={maskVariants}>
                    <p className="text-3xl font-bold text-[#F4A900] mb-1 font-serif flex items-center">
                      {isVisible ? <Counter value={stat.value} /> : "0"}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Detailed Facets */}
      <div className="space-y-12">
        <EspektroAbout />
        <Techtix />
        <Exotica />
        <Quizine />
      </div>
    </section>
  );
=======
    useEffect(() => {
        const handleScroll = () => {
            if (!imageRef.current) return;
            const rect = imageRef.current.getBoundingClientRect();
            const vh = window.innerHeight;
            const progress = Math.min(1, Math.max(0, 1 - rect.top / vh));
            setImageColor(progress);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section
            ref={sectionRef}
            id="about"
            className="py-24 lg:py-36 bg-background relative"
        >
            <div className="container mx-auto px-6 lg:px-8 mb-24">
                {/* Two column layout */}
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Image */}
                    <div
                        ref={imageRef}
                        className={`relative aspect-[4/5] lg:aspect-square bg-muted overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    >
                        <div className="absolute inset-4 border border-[#B7410E]/30 z-20 pointer-events-none" />

                        {/* Dynamic grayscale filter */}
                        <div
                            className="absolute inset-0 z-10 mix-blend-saturation bg-background pointer-events-none transition-opacity duration-100"
                            style={{ opacity: 1 - imageColor }}
                        />

                        <Image
                            src="/images/espektro-crowd.jpeg"
                            alt="Espektro Crowd"
                            fill
                            className="w-full h-full object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>

                    {/* Content */}
                    <div
                        className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                    >
                        <p className="text-[#B7410E] text-xs uppercase tracking-[0.3em] mb-6 font-semibold">
                            Prepare for Impact
                        </p>
                        <h2 className="font-serif text-4xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-8">
                            The Legend <br />
                            <span className="text-muted-foreground italic font-normal">Returns</span>
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                            Espektro is not just a fest; it&apos;s an emotion interwoven with the
                            spirit of Kalyani Government Engineering College. For three days,
                            our campus transforms into a pulsating hub of art, technology, and
                            culture.
                        </p>
                        <p className="text-foreground text-lg font-medium leading-relaxed mb-12">
                            In 2026, we pay homage to the soil we stand on. We trace the arc of
                            Bengali culture—from the clay of Kumartuli to the silicon of Salt
                            Lake.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-border">
                            {stats.map((stat) => (
                                <div key={stat.label}>
                                    <p className="text-3xl font-bold text-[#F4A900] mb-1 font-serif">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Facets */}
            <div className="space-y-12">
                <EspektroAbout />
                <Techtix />
                <Exotica />
                <Quizine />
            </div>
        </section>
    );
>>>>>>> f2f36d9af843736a51f032571d9f8285c57d306e:src/components/landing/about/index.tsx
}
