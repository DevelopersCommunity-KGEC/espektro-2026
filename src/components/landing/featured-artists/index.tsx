"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { artists } from "@/data/landing-content";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";


gsap.registerPlugin(ScrollTrigger);

export function FeaturedArtists() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const imageListRef = useRef<HTMLUListElement>(null);

    useGSAP(() => {
        if (!sectionRef.current || !headerRef.current || !footerRef.current || !windowRef.current || !cardsRef.current || !buttonRef.current || !imageListRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=8000",
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

        const artistCards = Array.from(imageListRef.current.children);
        gsap.set(artistCards, { opacity: 0, scale: 0.9 });

        // 2. Interaction Timeline
        tl.to({}, { duration: 1.5 })

            // Phase B: The Split — header and footer move apart, window fades in
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

        // Phase C: First artist card fades in
        tl.to(artistCards[0], {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out"
        });

        // Phase D: Smooth vertical scroll through all artist cards
        // Calculate how far to scroll: each card is 100% of the container height,
        // so we need to scroll (numCards - 1) * 100% of the list
        const scrollPercent = ((artists.length - 1) / artists.length) * 100;

        // Fade in remaining cards as we scroll past them
        artistCards.forEach((card, i) => {
            if (i === 0) return; // first card already visible
            tl.to(card, {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            }, `>-0.1`);
        });

        // Scroll the image list upward
        tl.to(imageListRef.current, {
            yPercent: -scrollPercent,
            duration: artists.length * 2,
            ease: "none"
        }, "<-0.5");

        // Hold on last card
        tl.to({}, { duration: 1.5 });

        // Phase E: Button Reveal
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
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[85%] lg:w-[75%] h-[55vh] md:h-[80vh] bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col items-center z-30 border-[12px] md:border-[20px] border-white"
                >
                    <div className="absolute inset-0 bg-[#FFF8F0]/30 z-0" />

                    {/* Scrollable Artist Cards Container */}
                    <div
                        ref={cardsRef}
                        className="relative z-10 w-full flex-1 overflow-hidden"
                    >
                        <ul
                            ref={imageListRef}
                            className="flex flex-col w-full"
                        >
                            {artists.map((artist) => (
                                <li
                                    key={artist.name}
                                    className="w-full flex-shrink-0 flex items-center justify-center mt-20 mb-20"
                                    style={{ height: "calc(55vh - 24px)", minHeight: "calc(55vh - 24px)" }}
                                >
                                    <CardContainer className="inter-var">
                                        <CardBody className="relative group/card w-[280px] h-[360px] sm:w-[340px] sm:h-[440px] md:w-[400px] md:h-[520px]">
                                            <CardItem
                                                translateZ="50"
                                                className="absolute inset-0"
                                            >
                                                <img
                                                    src={artist.bg}
                                                    alt="background"
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            </CardItem>
                                            <CardItem
                                                translateZ="80"
                                                className="absolute inset-0"
                                            >
                                                <div className="leading-none absolute left-5 top-4">
                                                    <h2 className="font-extrabold text-yellow-400 tracking-tight text-4xl md:text-5xl lg:text-6xl">
                                                        {artist.name.split(" ")[0]}
                                                    </h2>
                                                    <h2 className="text-4xl md:text-5xl lg:text-6xl text-yellow-400 font-semibold">
                                                        {artist.name.split(" ")[1]}
                                                    </h2>
                                                </div>
                                            </CardItem>
                                            <CardItem
                                                translateZ="100"
                                                className="relative z-10 w-full h-full flex items-end justify-center pt-16"
                                            >
                                                <img
                                                    src={artist.image}
                                                    alt={artist.name}
                                                    className="w-full max-h-full object-contain"
                                                />
                                            </CardItem>
                                        </CardBody>
                                    </CardContainer>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Full Lineup Button Overlay */}
                    <div ref={buttonRef} className="relative z-20 py-3">
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
                    <div className="absolute top-[100%] left-0 w-full h-12 md:h-40 translate-y-[75%] overflow-hidden pointer-events-none ">
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
