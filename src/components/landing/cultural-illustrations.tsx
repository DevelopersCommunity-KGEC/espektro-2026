"use client";

import { useRef, useState, useEffect } from "react";
import { heritage } from "@/data/landing-content";

export function CulturalIllustrations() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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

    return (
        <section
            ref={sectionRef}
            className="py-24 lg:py-36 bg-[#1A1A1A] text-white relative overflow-hidden"
        >
            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div
                    className={`max-w-2xl mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    <p className="text-[#F4A900] text-xs uppercase tracking-[0.3em] mb-5 font-semibold">
                        The Spirit of Bengal
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-balance">
                        A Culture That{" "}
                        <span className="text-[#B7410E]">Breathes Art</span>
                    </h2>
                    <p className="text-white/50 leading-relaxed">
                        From the grandeur of Durga Puja to the everyday poetry of Kolkata&apos;s
                        streets, Bengali culture is a living, evolving tapestry.
                    </p>
                </div>

                {/* Heritage cards - editorial layout */}
                <div className="grid md:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
                    {heritage.map((item, i) => (
                        <div
                            key={item.title}
                            className={`relative group cursor-pointer transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                            style={{ transitionDelay: `${i * 150}ms` }}
                            onMouseEnter={() => setHoveredIdx(i)}
                            onMouseLeave={() => setHoveredIdx(null)}
                        >
                            <div className="relative aspect-[3/4] overflow-hidden">
                                {/* B&W layer */}
                                <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700"
                                    style={{
                                        opacity: hoveredIdx === i ? 0 : 1,
                                        transform: hoveredIdx === i ? "scale(1.08)" : "scale(1)",
                                    }}
                                />
                                {/* Color layer */}
                                <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                                    style={{
                                        opacity: hoveredIdx === i ? 1 : 0,
                                        transform: hoveredIdx === i ? "scale(1.08)" : "scale(1)",
                                    }}
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/30 to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <p className="text-[#F4A900] text-[10px] uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        {item.subtitle}
                                    </p>
                                    <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-[#F4A900] transition-colors duration-300">
                                        {item.title}
                                    </h3>
                                    <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                                        <p className="text-sm text-white/70 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
