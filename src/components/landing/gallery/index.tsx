"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

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
            className="relative z-10 py-24 lg:py-36 overflow-hidden"
            style={{ backgroundColor: "#FFF8F0" }}
        >
            {/* Lotus Mandala Background - Centered and Subtle */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
                <Image
                    src="/images/360_F_1706070199_WZV67PDH1xx2nGjbDWR2M7U3bc4CsQi8.png"
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
                    backgroundImage: 'url(/images/43a0b75b3caae95caa70550adda8ed60.png)',
                    backgroundRepeat: 'repeat-y',
                    backgroundSize: '100% auto',
                    backgroundPosition: 'top center'
                }}
            />
            <div className="container mx-auto px-6 lg:px-8 pl-16 sm:pl-20 md:pl-28 lg:pl-32 text-center flex flex-col items-center">
                <div
                    className={`mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    <h3 className="text-lg md:text-xl text-[#8B2635] tracking-wide mb-3 font-medium uppercase font-[family-name:var(--font-roboto-slab)]">
                        Visual Memories
                    </h3>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl text-[#2C1810] mb-6 leading-[1.1] font-[family-name:var(--font-medieval-sharp)]">
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
                    <div className="relative z-10 aspect-video rounded-3xl overflow-hidden bg-black border-4 border-white/10 shadow-2xl">
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
