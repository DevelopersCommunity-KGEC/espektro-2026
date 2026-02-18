"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { artists } from "@/data/landing-content";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function FeaturedArtists() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current || !headerRef.current || !footerRef.current || !windowRef.current || !cardsRef.current || !buttonRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=5000",
                pin: true,
                scrub: 1,
                anticipatePin: 1
            }
        });

        // 1. Initial State
        gsap.set(headerRef.current, { yPercent: 0, opacity: 1 });
        gsap.set(footerRef.current, { yPercent: 0, opacity: 1 });
        gsap.set(windowRef.current, { opacity: 0, scale: 0.9 });
        gsap.set(buttonRef.current, { opacity: 0, y: 50 });

        const artistCards = Array.from(cardsRef.current.children);
        gsap.set(artistCards, { opacity: 0, y: 100, scale: 0.8 });

        // 2. Interaction Timeline
        tl.to({}, { duration: 1.5 })

            // Phase B: The Split
            .to(headerRef.current, {
                y: "-28vh",
                duration: 2.5,
                ease: "power2.inOut"
            }, ">")
            .to(footerRef.current, {
                y: "28vh",
                duration: 2.5,
                ease: "power2.inOut"
            }, "<")
            .to(windowRef.current, {
                opacity: 1,
                scale: 1,
                duration: 2,
                ease: "power2.inOut"
            }, "<0.5");

        // Phase C: Artist Reveal
        tl.to(artistCards, {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.8,
            duration: 1.5,
            ease: "back.out(1.2)"
        });

        // Phase D: Button Reveal
        tl.to(buttonRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        }, ">-0.5");

        // Final hold
        tl.to({}, { duration: 1.5 });

    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            id="artists"
            className="relative z-10 overflow-hidden min-h-screen"
            style={{ backgroundColor: "#FFF8F0" }}
        >
            {/* Left Decorative Pattern */}
            <div
                className="absolute top-0 left-0 bottom-0 w-16 md:w-24 overflow-hidden hidden sm:block z-50"
                style={{
                    backgroundImage: 'url(/images/43a0b75b3caae95caa70550adda8ed60.png)',
                    backgroundRepeat: 'repeat-y',
                    backgroundSize: '100% auto',
                    backgroundPosition: 'top center'
                }}
            />

            {/* Pinned Content Wrapper */}
            <div ref={contentRef} className="w-full h-screen flex flex-col items-center justify-start pt-20 md:pt-40 relative overflow-hidden">

                {/* Header Half of the Split Block */}
                <div ref={headerRef} className="relative w-full z-40">
                    <div className="absolute top-[60%] left-0 w-full h-12 md:h-40 -translate-y-[50%] overflow-hidden pointer-events-none opacity-90">
                        <div className="flex justify-center h-full w-max mx-auto flex-nowrap">
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className="relative h-full aspect-[4/1] flex-shrink-0 -mx-14">
                                    <Image
                                        src="/images/shapartist.png"
                                        alt=""
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative z-10 flex justify-center mt-6">
                        <div className="bg-white px-10 md:px-20 py-4 md:py-1 shadow-sm rounded-sm">
                            <p className="text-[#8B2635] text-[10px] md:text-sm uppercase tracking-[0.5em] font-bold text-center mb-1 font-[family-name:var(--font-roboto-slab)]">
                                Cultural Stars
                            </p>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl text-[#2C1810] font-[family-name:var(--font-medieval-sharp)] leading-none text-center">
                                Renowned <span className="text-[#B7410E]">Artists</span>
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Animated Central Window for Artist Display */}
                <div
                    ref={windowRef}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[85%] lg:w-[75%] h-[55vh] md:h-[65vh] bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col items-center justify-center z-30 border-[12px] md:border-[20px] border-white"
                >
                    <div className="absolute inset-0 bg-[#FFF8F0]/30 z-0" />

                    {/* Interior Container for Artist Cards */}
                    <div
                        ref={cardsRef}
                        className="relative z-10 w-full px-6 flex flex-wrap justify-center gap-6 md:gap-12 mb-10"
                    >
                        {artists.slice(0, 3).map((artist) => (
                            <div
                                key={artist.name}
                                className="bg-white p-4 md:p-5 shadow-xl border border-gray-100 w-44 md:w-56 lg:w-64 flex-shrink-0"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden mb-5 bg-gray-50 border-4 border-[#FFF8F0]">
                                    <Image
                                        src={artist.image}
                                        alt={artist.name}
                                        fill
                                        className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl md:text-2xl lg:text-3xl font-[family-name:var(--font-medieval-sharp)] text-[#2C1810] mb-2 uppercase tracking-tight">
                                        {artist.name}
                                    </h3>
                                    <div className="w-10 h-1 bg-[#B7410E] mx-auto opacity-50" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Full Lineup Button Overlay */}
                    <div ref={buttonRef} className="relative z-20">
                        <Button
                            variant="theatrical"
                            className="bg-[#B7410E] hover:bg-[#8B2635] text-white h-11 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 font-[family-name:var(--font-roboto-slab)]"
                            asChild
                        >
                            <Link href="/events#lineup">View Full Lineup</Link>
                        </Button>
                    </div>
                </div>

                {/* Footer Half of the Split Block */}
                <div ref={footerRef} className="relative w-full z-40">
                    <div className="absolute top-[80%] left-0 w-full h-12 md:h-40 translate-y-[25%] overflow-hidden pointer-events-none ">
                        <div className="flex justify-center h-full w-max mx-auto flex-nowrap">
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className="relative h-full aspect-[4/1] flex-shrink-0 -mx-14">
                                    <Image
                                        src="/images/shapartist.png"
                                        alt=""
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
