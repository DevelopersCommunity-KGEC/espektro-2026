"use client";

import { useRef, useState, useEffect } from "react";
import { eras } from "@/data/landing-content";

export function ThemeEvolution() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [activeIdx, setActiveIdx] = useState(-1);

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

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const top = sectionRef.current.offsetTop;
            const height = sectionRef.current.offsetHeight;
            const scrollY = window.scrollY;
            const vh = window.innerHeight;
            const progress = (scrollY - top + vh * 0.6) / height;
            const idx = Math.floor(progress * eras.length);
            setActiveIdx(Math.min(Math.max(idx, -1), eras.length - 1));
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section
            ref={sectionRef}
            id="theme"
            className="py-24 lg:py-36 bg-background relative overflow-hidden"
        >
            {/* Faint background image */}
            <div className="absolute inset-0 pointer-events-none">
                <img
                    src="/images/kolkata-city.jpeg"
                    alt=""
                    className="w-full h-full object-cover opacity-[0.04]"
                />
            </div>

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div
                    className={`max-w-2xl mb-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    <p className="text-[#B7410E] text-xs uppercase tracking-[0.3em] mb-5 font-semibold">
                        This Year&apos;s Theme
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6 text-balance">
                        Evolution of{" "}
                        <span className="text-[#B7410E]">Bengali Culture</span>
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        A journey through time &mdash; celebrating the rich tapestry of
                        Bengal&apos;s cultural heritage and its continuous evolution.
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative max-w-3xl mx-auto">
                    {/* Vertical line */}
                    <div className="absolute left-4 lg:left-0 top-0 bottom-0 w-px bg-border">
                        <div
                            className="absolute top-0 w-full bg-[#B7410E] transition-all duration-300"
                            style={{
                                height: `${Math.max(0, (activeIdx + 1) / eras.length * 100)}%`,
                            }}
                        />
                    </div>

                    <div className="space-y-16">
                        {eras.map((item, i) => (
                            <div
                                key={i}
                                className={`relative pl-12 lg:pl-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                                style={{ transitionDelay: `${i * 200}ms` }}
                            >
                                {/* Dot */}
                                <div
                                    className={`absolute left-[13px] lg:left-[-3px] top-2 w-2.5 h-2.5 rounded-full border-2 transition-colors duration-500 z-10 ${i <= activeIdx
                                            ? "bg-[#B7410E] border-[#B7410E]"
                                            : "bg-background border-muted-foreground"
                                        }`}
                                />

                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 mb-2">
                                    <span className="text-[#B7410E] font-medium text-sm tracking-widest uppercase">
                                        {item.era}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-mono">
                                        {item.period}
                                    </span>
                                </div>
                                <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed max-w-lg">
                                    {item.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
