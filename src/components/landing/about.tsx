"use client";

import { useRef, useEffect, useState } from "react";
import { stats } from "@/data/landing-content";

import EspektroAbout from "./about-sections/Espektro";
import Techtix from "./about-sections/Techtix";
import Exotica from "./about-sections/Exotica";
import Quizine from "./about-sections/Quizine";

export function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [imageColor, setImageColor] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.15 }
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

                        <img
                            src="/images/espektro-crowd.jpeg"
                            alt="Espektro Crowd"
                            className="w-full h-full object-cover"
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
}
