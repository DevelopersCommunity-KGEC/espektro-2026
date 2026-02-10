"use client";

import { useRef, useState, useEffect } from "react";

export function Gallery() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // YouTube Video ID
    const videoId = "gy9v5iKmV-I";
    // YouTube Embed URL with parameters:
    // autoplay=1 (auto start)
    // mute=1 (required for autoplay in most browsers)
    // loop=1 & playlist=VIDEO_ID (required for looping)
    // controls=0 (hide player controls)
    // modestbranding=1 (hide youtube logo)
    // playsinline=1 (play within the page on mobile)
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1&rel=0`;

    return (
        <section
            ref={sectionRef}
            id="aftermovie"
            className="py-24 lg:py-36 bg-muted/20 overflow-hidden"
        >
            <div className="container mx-auto px-6 lg:px-8 text-center">
                {/* Header */}
                <div
                    className={`mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    <p className="text-[#B7410E] text-xs uppercase tracking-[0.3em] mb-5 font-semibold">
                        Highlights
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
                        Espektro <span className="text-[#B7410E]">Aftermovie</span>
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Relive the magic and energy of the most anticipated cultural fest of the year.
                    </p>
                </div>

                {/* Video Player Container */}
                <div
                    className={`max-w-5xl mx-auto transition-all duration-700 delay-200 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                >
                    <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border-4 border-white/10 shadow-2xl">
                        <iframe
                            src={embedUrl}
                            title="Espektro Aftermovie"
                            className="absolute top-0 left-0 w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}
