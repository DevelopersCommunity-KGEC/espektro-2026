"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
    const heroRef = useRef<HTMLElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                const progress = Math.min(
                    1,
                    Math.max(0, -rect.top / (window.innerHeight * 0.6))
                );
                setScrollProgress(progress);
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!mounted)
        return (
            <section className="h-screen bg-[#1A1A1A]" aria-hidden="true" />
        );

    return (
        <section ref={heroRef} className="relative h-[150vh]">
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                {/* Background layers */}
                <div className="absolute inset-0">
                    {/* B&W layer */}
                    <div
                        className="absolute inset-0 transition-opacity duration-500"
                        style={{ opacity: 1 - scrollProgress }}
                    >
                        <img
                            src="/images/kolkata-monochrome.jpeg"
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover grayscale"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/70 via-[#1A1A1A]/40 to-[#1A1A1A]/80" />
                    </div>

                    {/* Color layer */}
                    <div
                        className="absolute inset-0 transition-opacity duration-500"
                        style={{ opacity: scrollProgress }}
                    >
                        <img
                            src="/images/bengali-culture.jpeg"
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/50 via-[#1A1A1A]/30 to-[#1A1A1A]/70" />
                    </div>

                    {/* Corner accents */}
                    <div
                        className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 opacity-20 transition-colors duration-500 hidden md:block"
                        style={{
                            borderColor: scrollProgress > 0.5 ? "#F4A900" : "#fff",
                        }}
                    />
                    <div
                        className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 opacity-20 transition-colors duration-500 hidden md:block"
                        style={{
                            borderColor: scrollProgress > 0.5 ? "#F4A900" : "#fff",
                        }}
                    />
                    <div
                        className="absolute bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 opacity-20 transition-colors duration-500 hidden md:block"
                        style={{
                            borderColor: scrollProgress > 0.5 ? "#B7410E" : "#fff",
                        }}
                    />
                    <div
                        className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 opacity-20 transition-colors duration-500 hidden md:block"
                        style={{
                            borderColor: scrollProgress > 0.5 ? "#B7410E" : "#fff",
                        }}
                    />
                </div>

                {/* Main content */}
                <div
                    className="relative z-10 container mx-auto px-6 text-center"
                    style={{
                        opacity: Math.max(0, 1 - scrollProgress * 2),
                        transform: `translateY(${scrollProgress * 30}px)`,
                    }}
                >
                    <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium mb-6">
                        Kalyani Government Engineering College presents
                    </p>

                    <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] font-bold text-white mb-4 tracking-tight">
                        ESPEKTRO
                    </h1>
                    <p className="text-[#B7410E] text-3xl sm:text-4xl md:text-5xl font-serif italic font-light mb-8">
                        2026
                    </p>

                    <p className="max-w-md mx-auto text-base sm:text-lg text-white/60 mb-10 font-light leading-relaxed">
                        A journey through the{" "}
                        <span className="text-[#F4A900] font-medium">
                            Evolution of Bengali Culture
                        </span>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Button
                            size="lg"
                            className="bg-[#B7410E] hover:bg-[#9A3008] text-white border-0 rounded-sm px-8 h-11 text-xs tracking-widest uppercase"
                            asChild
                        >
                            <Link href="/events">Explore Events</Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white rounded-sm px-8 h-11 text-xs tracking-widest uppercase"
                            asChild
                        >
                            <Link href="#about">Learn More</Link>
                        </Button>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    style={{ opacity: Math.max(0, 1 - scrollProgress * 3) }}
                >
                    <span className="text-white/30 text-[9px] uppercase tracking-[0.3em]">
                        Scroll
                    </span>
                    <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
                </div>
            </div>
        </section>
    );
}
