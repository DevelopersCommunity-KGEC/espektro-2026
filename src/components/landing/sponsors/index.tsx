"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { sponsorLogos as SPONSORS } from "@/data/landing-content";

export function Sponsors() {
    const ref = useRef<HTMLElement>(null);
    const [vis, setVis] = useState(false);
    const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const o = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) setVis(true);
        }, { threshold: 0.1 });
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
        window.addEventListener('scroll', handleScroll, { passive: true });

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
            { threshold: 0 }
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
                                setVisibleCards(prev => new Set(prev).add(index));
                            }, index * 100);
                            // Reset exit flag after animation starts
                            if (index === 0) hasFullyExitedDown = false;
                        } else {
                            // If still in section, add immediately without animation delay
                            setVisibleCards(prev => new Set(prev).add(index));
                        }
                    } else if (entry.isIntersecting && !isScrollingDown) {
                        // Scrolling up - just show immediately without animation
                        setVisibleCards(prev => new Set(prev).add(index));
                    } else if (!entry.isIntersecting && isScrollingDown && hasFullyExitedDown) {
                        // Only remove from visible set if scrolling down past section
                        setVisibleCards(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(index);
                            return newSet;
                        });
                    }
                },
                { threshold: 0.2 }
            );

            observer.observe(cardRef);
            return observer;
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            sectionObserver.disconnect();
            observers.forEach(observer => observer?.disconnect());
        };
    }, []);

    return (
        <section ref={ref} id="sponsors" className="relative z-10 py-24 lg:py-36 bg-muted overflow-hidden">
            {/* Decorative side borders */}
            <img
                src="/border.svg"
                alt=""
                aria-hidden="true"
                className="absolute top-0 left-0 bottom-0 h-full w-[60px] md:w-[80px] object-cover pointer-events-none z-[5] opacity-60 hidden lg:block"
            />
            <img
                src="/border.svg"
                alt=""
                aria-hidden="true"
                className="absolute top-0 right-0 bottom-0 h-full w-[60px] md:w-[80px] object-cover pointer-events-none z-[5] opacity-60 hidden lg:block scale-x-[-1]"
            />
            <div className="container mx-auto px-6 lg:px-24">
                <div className={`text-center mb-16 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <p className="text-[#B7410E] text-xs uppercase tracking-[0.3em] mb-5 font-semibold">Our Partners</p>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Proudly Supported By
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        We appreciate the efforts and generosity of our sponsors in supporting Espektro.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-24">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                    {SPONSORS.map((s, index) => (
                        <div
                            key={s.id}
                            ref={(el) => { cardRefs.current[index] = el; }}
                            className={`transition-all duration-700 ease-out ${visibleCards.has(index)
                                ? 'opacity-100 translate-y-0 blur-0'
                                : 'opacity-0 translate-y-[10px] blur-[10px]'
                                }`}
                        >
                            <SponsorCard sponsor={s} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-24">
                <div className={`mt-20 text-center bg-card border border-border rounded-2xl p-8 lg:p-12 max-w-2xl mx-auto transition-all duration-700 delay-500 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                        Want to Partner with Us?
                    </h3>
                    <p className="text-muted-foreground mb-6 text-sm">
                        Get unprecedented exposure to 15,000+ engaged students across four days.
                    </p>
                    <Button
                        asChild
                        className="bg-[#B7410E] hover:bg-[#9a370c] text-white font-medium rounded-full"
                    >
                        <a href="mailto:sponsorship.espektro@gmail.com">
                            <Mail className="w-4 h-4 mr-2" />
                            Become a Sponsor
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
}

function SponsorCard({ sponsor }: { sponsor: { id: number; sponsor: string; url: string } }) {
    return (
        <div className="w-full h-40 group/card relative p-4 bg-white/5 rounded-2xl backdrop-blur-sm transition-all hover:bg-white/10">
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
                <div className="flex-[2] flex items-center justify-center max-h-[60%] w-full relative">
                    <Image
                        src={sponsor.url}
                        alt={sponsor.sponsor}
                        fill
                        className="object-contain grayscale brightness-125 transition-all group-hover/card:grayscale-0 group-hover/card:brightness-100"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                </div>
                <div className="flex-1 flex items-center justify-center w-full px-2">
                    <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight transition-all group-hover/card:font-bold group-hover/card:text-foreground">
                        {sponsor.sponsor}
                    </p>
                </div>
            </div>
        </div>
    );
}