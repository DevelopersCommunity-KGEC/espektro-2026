"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { sponsorLogos as SPONSORS } from "@/data/landing-content";
import ComingSoon from "../coming-soon";

export function Sponsors() {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVis(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    // Track if section has been fully exited and scroll direction
    let hasFullyExitedDown = false;
    let lastScrollY = window.scrollY;

    // Detect scroll direction on every scroll
    const handleScroll = () => {
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Observer for the entire section to detect full exit
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > lastScrollY;

        if (!entry.isIntersecting) {
          // Only mark as exited if scrolling DOWN past the section
          if (isScrollingDown) {
            hasFullyExitedDown = true;
          } else {
            // If scrolling up past section, reset cards immediately
            setVisibleCards(new Set());
            hasFullyExitedDown = false;
          }
        }
      },
      { threshold: 0 },
    );

    if (ref.current) {
      sectionObserver.observe(ref.current);
    }

    const observers = cardRefs.current.map((cardRef, index) => {
      if (!cardRef) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          const currentScrollY = window.scrollY;
          const isScrollingDown = currentScrollY > lastScrollY;

          if (entry.isIntersecting && isScrollingDown) {
            // Only animate if section was fully exited before AND scrolling down
            if (hasFullyExitedDown || visibleCards.size === 0) {
              setTimeout(() => {
                setVisibleCards((prev) => new Set(prev).add(index));
              }, index * 100);
              // Reset exit flag after animation starts
              if (index === 0) hasFullyExitedDown = false;
            } else {
              // If still in section, add immediately without animation delay
              setVisibleCards((prev) => new Set(prev).add(index));
            }
          } else if (entry.isIntersecting && !isScrollingDown) {
            // Scrolling up - just show immediately without animation
            setVisibleCards((prev) => new Set(prev).add(index));
          } else if (
            !entry.isIntersecting &&
            isScrollingDown &&
            hasFullyExitedDown
          ) {
            // Only remove from visible set if scrolling down past section
            setVisibleCards((prev) => {
              const newSet = new Set(prev);
              newSet.delete(index);
              return newSet;
            });
          }
        },
        { threshold: 0.2 },
      );

      observer.observe(cardRef);
      return observer;
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      sectionObserver.disconnect();
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <section
      ref={ref}
      id="sponsors"
      className="relative z-10 py-24 lg:py-36 overflow-hidden"
      style={{ backgroundColor: "#FFF8F0" }}
    >
      {/* Lotus Mandala Background - Centered and Subtle */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
        <Image
          src="/images/360_F_1706070199_WZV67PDH1xx2nGjbDWR2M7U3bc4CsQi8.webp"
          alt="Decorative lotus mandala"
          width={800}
          height={600}
          className="object-contain"
        />
      </div>

      {/* Left Tribal Border Pattern */}
      <div
        className="absolute top-0 left-0 bottom-0 w-16 md:w-24 overflow-hidden hidden sm:block"
        style={{
          backgroundImage: "url(/images/43a0b75b3caae95caa70550adda8ed60.webp)",
          backgroundRepeat: "repeat-y",
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
        }}
      />
      <motion.div
        className="container mx-auto px-6 lg:px-24 relative z-10 pl-4 sm:pl-20 md:pl-28 lg:pl-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.1
            }
          }
        }}
      >
        <div className="flex flex-col items-center ">
          <motion.p
            className="text-lg md:text-xl text-[#8B2635] tracking-wide mb-3 font-medium uppercase font-[family-name:var(--font-roboto-slab)] text-center"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            Our Partners
          </motion.p>
          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl text-[#2C1810] mb-6 leading-[1.1] font-[family-name:var(--font-medieval-sharp)] text-center flex flex-wrap justify-center overflow-hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.04 }
              }
            }}
          >
            {"Proudly ".split("").map((char, i) => (
              <motion.span
                key={`proudly-${i}`}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
            <span className="text-[#B7410E] flex">
              {"Supported By".split("").map((char, i) => (
                <motion.span
                  key={`supported-${i}`}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
          </motion.h2>
          <motion.p
            className="text-[#4A3428] max-w-xl mx-auto text-center font-[family-name:var(--font-open-sans)] text-sm md:text-base opacity-80"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
            }}
          >
            We appreciate the efforts and generosity of our sponsors in
            supporting Espektro 2026.
          </motion.p>
        </div>
        <motion.div
          className="flex flex-row justify-center align-center w-full mt-12"
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } }
          }}
        >
          <ComingSoon />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sponsor grid logic here if ever re-enabled */}
        </div>
      </motion.div>

      <div className="container mx-auto px-6 lg:px-24 pl-4 sm:pl-20 md:pl-28 lg:pl-32">
        <motion.div
          className="mt-24 text-center bg-white/50 backdrop-blur-md border border-[#4A3428]/10 rounded-3xl p-8 lg:p-12 max-w-2xl mx-auto shadow-sm"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="font-[family-name:var(--font-medieval-sharp)] text-2xl md:text-3xl text-[#2C1810] mb-4">
            Want to Partner with Us?
          </h3>
          <p className="text-[#4A3428]/80 mb-8 text-sm md:text-base font-[family-name:var(--font-open-sans)] px-4">
            Get unprecedented exposure to 15,000+ engaged students across four
            days of non-stop cultural and technical celebration.
          </p>
          <Button
            variant="theatrical"
            asChild
            className="bg-[#B7410E] hover:bg-[#8B2635] text-white font-bold h-10 uppercase text-[10px] tracking-[0.2em] font-[family-name:var(--font-roboto-slab)] transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1"
          >
            <a href="mailto:sponsorship.espektro@gmail.com">
              <Mail className="w-5 h-4 mr-2" />
              Become a Sponsor
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function SponsorCard({
  sponsor,
}: {
  sponsor: { id: number; sponsor: string; url: string };
}) {
  return (
    <div className="w-full h-44 group/card relative p-6 bg-white border border-[#4A3428]/5 rounded-2xl shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-[#B7410E]/20 hover:-translate-y-2">
      <div className="w-full h-full flex flex-col justify-between items-center text-center">
        <div className="flex-[3] flex items-center justify-center max-h-[70%] w-full relative">
          <Image
            src={sponsor.url}
            alt={sponsor.sponsor}
            fill
            className="object-contain grayscale opacity-70 group-hover/card:grayscale-0 group-hover/card:opacity-100 transition-all duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        <div className="flex-1 flex items-center justify-center w-full pt-4">
          <p className="text-[11px] font-bold text-[#2C1810]/60 uppercase tracking-wider line-clamp-2 leading-tight transition-all group-hover/card:text-[#B7410E]">
            {sponsor.sponsor}
          </p>
        </div>
      </div>
    </div>
  );
}
