"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Music, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { artists } from "@/data/landing-content";

export function FeaturedArtists() {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.05 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Auto-advance carousel
    const startAutoPlay = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % artists.length);
        }, 5000);
    }, []);

    useEffect(() => {
        if (isVisible) startAutoPlay();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isVisible, startAutoPlay]);

    const goTo = (index: number) => {
        setActiveIndex(index);
        startAutoPlay(); // Reset timer on manual navigation
    };

    const handlePrev = () =>
        goTo((activeIndex - 1 + artists.length) % artists.length);
    const handleNext = () => goTo((activeIndex + 1) % artists.length);

    const artist = artists[activeIndex];
    if (!artist) return null;

    return (
        <section
            ref={sectionRef}
            id="artists"
            className="relative py-24 lg:py-32 bg-gradient-to-b from-[#1A1A1A] via-[#0F0F0F] to-[#1A1A1A] text-white overflow-hidden"
        >
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-[#B7410E]/10 blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#F4A900]/10 blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 lg:px-8 relative">
                {/* Header */}
                <div
                    className={`text-center mb-12 lg:mb-16 transition-all duration-700 ${isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-8"
                        }`}
                >
                    <p className="text-[#F4A900] text-xs uppercase tracking-[0.3em] mb-4 font-semibold">
                        Star-Studded Lineup
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
                        Featured <span className="text-[#F4A900]">Artists</span>
                    </h2>
                    <p className="text-white/40 max-w-lg mx-auto">
                        Experience electrifying performances from India&apos;s
                        biggest names in music.
                    </p>
                </div>

                {/* Carousel Card */}
                <div
                    className={`max-w-4xl mx-auto transition-all duration-700 delay-100 ${isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-8"
                        }`}
                >
                    <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="grid md:grid-cols-[1fr,1.2fr]">
                            {/* Image */}
                            <div className="relative aspect-[3/4] md:aspect-auto md:min-h-[400px]">
                                <img
                                    src={artist.image || "/placeholder.svg"}
                                    alt={artist.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/40" />

                                {/* Badge */}
                                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
                                    <Music className="w-3 h-3 text-[#F4A900]" />
                                    <span className="text-[10px] text-[#F4A900] uppercase tracking-wider font-semibold">
                                        {artist.genre}
                                    </span>
                                </div>

                                {/* Mobile name overlay */}
                                <div className="absolute bottom-4 left-4 md:hidden">
                                    <h3 className="font-serif text-2xl font-bold">
                                        {artist.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-6 lg:p-8 flex flex-col justify-center">
                                <h3 className="hidden md:block font-serif text-3xl lg:text-4xl font-bold mb-3">
                                    {artist.name}
                                </h3>
                                <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {artist.description}
                                </p>

                                {/* Details grid */}
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <p className="text-[9px] uppercase tracking-wider text-white/30 mb-1">
                                            Date
                                        </p>
                                        <p className="text-xs font-semibold">
                                            {artist.date}
                                        </p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <p className="text-[9px] uppercase tracking-wider text-white/30 mb-1">
                                            Time
                                        </p>
                                        <p className="text-xs font-semibold">
                                            {artist.time}
                                        </p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <p className="text-[9px] uppercase tracking-wider text-white/30 mb-1">
                                            Venue
                                        </p>
                                        <p className="text-xs font-semibold">
                                            {artist.venue}
                                        </p>
                                    </div>
                                </div>

                                {/* Social */}
                                <div className="flex items-center gap-4 mb-6 text-white/40">
                                    <a
                                        href="#"
                                        className="flex items-center gap-1.5 text-xs hover:text-white transition-colors"
                                    >
                                        <Instagram className="w-3.5 h-3.5" />
                                        {artist.social.instagram}
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center gap-1.5 text-xs hover:text-white transition-colors"
                                    >
                                        <Twitter className="w-3.5 h-3.5" />
                                        {artist.social.twitter}
                                    </a>
                                </div>

                                {/* Navigation controls */}
                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={handlePrev}
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9 rounded-full border-white/20 hover:border-[#F4A900] hover:bg-[#F4A900]/10 bg-transparent"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        onClick={handleNext}
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9 rounded-full border-white/20 hover:border-[#F4A900] hover:bg-[#F4A900]/10 bg-transparent"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>

                                    {/* Dots */}
                                    <div className="flex items-center gap-1.5 ml-auto">
                                        {artists.map((_, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => goTo(i)}
                                                className={`rounded-full transition-all duration-300 ${i === activeIndex
                                                        ? "w-6 h-2 bg-[#F4A900]"
                                                        : "w-2 h-2 bg-white/20 hover:bg-white/40"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
