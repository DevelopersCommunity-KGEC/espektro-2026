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
        <section ref={ref} id="sponsors" className="relative z-10 py-24 lg:py-36 overflow-hidden" style={{ backgroundColor: "#FFF8F0" }}>
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
            <div className="container mx-auto px-6 lg:px-24 relative z-10 pl-4 sm:pl-20 md:pl-28 lg:pl-32">
                <div className="flex flex-col items-center mb-16">
                    <p className="text-lg md:text-xl text-[#8B2635] tracking-wide mb-3 font-medium uppercase font-[family-name:var(--font-roboto-slab)] text-center">
                        Our Partners
                    </p>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl text-[#2C1810] mb-6 leading-[1.1] font-[family-name:var(--font-medieval-sharp)] text-center">
                        Proudly <span className="text-[#B7410E]">Supported By</span>
                    </h2>
                    <p className="text-[#4A3428] max-w-xl mx-auto text-center font-[family-name:var(--font-open-sans)] text-sm md:text-base opacity-80">
                        We appreciate the efforts and generosity of our sponsors in supporting Espektro 2026.
                    </p>
                </div>

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

            <div className="container mx-auto px-6 lg:px-24 pl-4 sm:pl-20 md:pl-28 lg:pl-32">
                <div className={`mt-24 text-center bg-white/50 backdrop-blur-md border border-[#4A3428]/10 rounded-3xl p-8 lg:p-12 max-w-2xl mx-auto transition-all duration-700 shadow-sm ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <h3 className="font-[family-name:var(--font-medieval-sharp)] text-2xl md:text-3xl text-[#2C1810] mb-4">
                        Want to Partner with Us?
                    </h3>
                    <p className="text-[#4A3428]/80 mb-8 text-sm md:text-base font-[family-name:var(--font-open-sans)] px-4">
                        Get unprecedented exposure to 15,000+ engaged students across four days of non-stop cultural and technical celebration.
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
                </div>
            </div>
        </section>
    );
}

function SponsorCard({ sponsor }: { sponsor: { id: number; sponsor: string; url: string } }) {
    return (
        <div className="w-full h-44 group/card relative p-6 bg-white border border-[#4A3428]/5 rounded-2xl shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-[#B7410E]/20 hover:-translate-y-2">
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
                <div className="flex-[3] flex items-center justify-center max-h-[70%] w-full relative">
                    <Image
                        src={sponsor.url}
                        alt={sponsor.sponsor}
                        fill
                        className="object-contain opacity-10₹0 group-hover/card:opacity-100 transition-all duration-500"
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
