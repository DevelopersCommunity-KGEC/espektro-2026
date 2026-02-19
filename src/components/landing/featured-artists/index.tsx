"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { artists } from "@/data/landing-content";
import { ArtistGallery } from "../artist-gallery";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./artist.module.css";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

gsap.registerPlugin(ScrollTrigger);

export function FeaturedArtists() {
    const sectionRef = useRef<HTMLElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imageListRef = useRef<HTMLUListElement>(null);
    const [isVisible, setIsVisible] = useState(false);

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

    useGSAP(() => {
        if (!wrapperRef.current || !containerRef.current || !imageListRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: wrapperRef.current,
                start: "top top",
                end: "+=5000",
                pin: true,
                scrub: 0.5,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                fastScrollEnd: true,
            }
        });

        tl.to(containerRef.current, {
            height: "120vh",
            duration: 2,
            ease: "power2.inOut"
        })
            .to(imageListRef.current, {
                y: "-85%",
                duration: 4,
                ease: "none"
            })
            .to(containerRef.current, {
                height: "0rem",
                duration: 1.5,
                ease: "power2.inOut"
            });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars.trigger === wrapperRef.current) {
                    trigger.kill();
                }
            });
        };
    }, { scope: sectionRef, dependencies: [] });

    return (
        <section
            ref={sectionRef}
            id="artists"
            className="relative z-10 overflow-hidden scroll-mt-0"
            style={{ backgroundColor: "#FFF8F0" }}
        >
            {/* Left Decorative Vertical Pattern */}
            <div
                className="absolute top-0 left-0 bottom-0 w-16 md:w-24 overflow-hidden hidden sm:block z-[60] pointer-events-none"
                style={{
                    backgroundImage: 'url(/images/43a0b75b3caae95caa70550adda8ed60.webp)',
                    backgroundRepeat: 'repeat-y',
                    backgroundSize: '100% auto',
                    backgroundPosition: 'top center'
                }}
            />

            <div className="container mx-auto px-6 lg:px-8 relative pt-24 invisible">
                {/* Spacing alignment */}
            </div>

            <div ref={wrapperRef} className={styles.mainWrapper} style={{ backgroundColor: "transparent" }}>
                <div ref={containerRef} className={styles.mainContainer} style={{ background: 'transparent', border: 'none', width: '100vw', maxWidth: 'none', left: '0' }}>

                    {/* Top Tribal Border & Heading Block */}
                    <div className={`${styles.topHeadingContainer} !relative !translate-y-0 w-full z-[70]`}>
                        <div className="relative h-24 md:h-40 overflow-visible mb-2">
                            <div className="absolute inset-0 top-0 flex justify-center h-full w-full opacity-100 overflow-hidden">
                                {[...Array(25)].map((_, i) => (
                                    <div key={i} className="relative h-full aspect-[4/1] flex-shrink-0 -mx-12">
                                        <Image src="/images/shapartist.webp" alt="" fill className="object-contain" />
                                    </div>
                                ))}
                            </div>
                            {/* Header Box on Top of Border */}
                            <div className="absolute top-1/2 left-100 w-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-sm py-4 shadow-md border-y border-gray-100 flex flex-col items-center">
                                <p className="text-[#8B2635] text-[10px] md:text-xs uppercase tracking-[0.5em] font-bold text-center mb-1 font-[family-name:var(--font-roboto-slab)]">
                                    Cultural Stars
                                </p>
                                <h1 className="text-3xl md:text-5xl lg:text-7xl text-[#2C1810] font-[family-name:var(--font-medieval-sharp)] leading-none text-center">
                                    Renowned <span className="text-[#B7410E]">Artists!</span>
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className={styles.imageContentContainer}>
                        <ul ref={imageListRef} className="flex flex-col items-center gap-4 h-[150rem] sm:h-630">
                            {artists.map((artist) => (
                                <li key={artist.name} className="h-[35rem] sm:h-160">
                                    <CardContainer className="inter-var">
                                        <CardBody className="relative group/card bg-white dark:hover:shadow-2xl dark:hover:shadow-emerald-500/10 w-[85vw] sm:w-[24rem] h-[30rem] sm:h-[36rem] rounded-xl p-4 flex flex-col border shadow-lg overflow-hidden">
                                            {/* Pattern & Image Area */}
                                            <div className="relative w-full h-[70%] sm:h-[82%] overflow-hidden rounded-lg mb-6 mt-4">
                                                <CardItem
                                                    translateZ="30"
                                                    className="absolute inset-0 w-full h-full"
                                                >
                                                    <img
                                                        src={artist.bg}
                                                        alt="background"
                                                        className="w-full h-full object-fill opacity-100"
                                                    />
                                                </CardItem>

                                                <CardItem
                                                    translateZ="80"
                                                    className="absolute inset-0 z-20 flex items-center justify-center pt-8"
                                                >
                                                    <img
                                                        src={artist.image}
                                                        alt={artist.name}
                                                        className="h-full w-auto object-contain"
                                                    />
                                                </CardItem>
                                            </div>

                                            {/* Info Area below the pattern */}
                                            <div className="flex flex-col items-center justify-center flex-1">
                                                <CardItem
                                                    translateZ="50"
                                                    className="text-center"
                                                >
                                                    <h2 className="text-2xl sm:text-4xl font-[family-name:var(--font-medieval-sharp)] text-[#2C1810] uppercase tracking-wider mb-2">
                                                        {artist.name}
                                                    </h2>
                                                    <div className="w-10 h-1 bg-[#B7410E] mx-auto rounded-full opacity-60" />
                                                </CardItem>
                                            </div>
                                        </CardBody>
                                    </CardContainer>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Bottom Tribal Border & Heading Block */}
                    <div className={`${styles.bottomHeadingContainer} !relative !translate-y-0 w-full z-[70]`}>
                        <div className="relative w-full h-16 md:h-40 overflow-visible mt-2">
                            <div className="absolute inset-0 -top-[100%] md:-top-[120%] flex justify-center h-full w-full opacity-100 overflow-hidden">
                                {[...Array(25)].map((_, i) => (
                                    <div key={i} className="relative h-full aspect-[4/1] flex-shrink-0 -mx-12">
                                        <Image src="/images/shapartist.webp" alt="" fill className="object-contain" />
                                    </div>
                                ))}
                            </div>
                            {/* Spotlight Box on Top of Border */}
                            {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white px-8 md:px-16 py-3 shadow-md rounded-sm border border-gray-100 flex flex-col items-center">
                                <h2 className="text-2xl md:text-4xl lg:text-6xl text-[#2C1810] font-[family-name:var(--font-medieval-sharp)] leading-none text-center whitespace-nowrap">
                                    Artist <span className="text-[#B7410E]">Spotlight!</span>
                                </h2>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>


        </section>
    );
}
