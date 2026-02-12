"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { artists } from "@/data/landing-content";
import { ArtistGallery } from "../artist-gallery";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "../artist-gallery/artist-v3.module.css";

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
                end: "+=1500",
                pin: true,
                scrub: 0.5,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                fastScrollEnd: true,
            }
        });

        tl.to(containerRef.current, {
            height: "40rem",
            duration: 1,
            ease: "power1.out"
        })
            .to(imageListRef.current, {
                y: "-75%",
                duration: 2,
                ease: "none"
            })
            .to(containerRef.current, {
                height: "0rem",
                duration: 0.8,
                ease: "power1.in"
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
            className="relative bg-white text-black overflow-hidden scroll-mt-0"
        >
            {/* Decorative side borders */}
            <img
                src="https://res.cloudinary.com/dlxpcyiin/image/upload/v1770840857/acceeec5cca8bcd386d1ccf3692c9947-removebg-preview_ja16p2.png"
                alt=""
                aria-hidden="true"
                className="absolute top-0 left-0 bottom-0 h-full w-auto max-w-[60px] md:max-w-[80px] object-cover pointer-events-none z-[5] opacity-60 hidden lg:block"
            />
            <img
                src="https://res.cloudinary.com/dlxpcyiin/image/upload/v1770840857/acceeec5cca8bcd386d1ccf3692c9947-removebg-preview_ja16p2.png"
                alt=""
                aria-hidden="true"
                className="absolute top-0 right-0 bottom-0 h-full w-auto max-w-[60px] md:max-w-[80px] object-cover pointer-events-none z-[5] opacity-60 hidden lg:block scale-x-[-1]"
            />
            <div className="container mx-auto px-6 lg:px-8 relative pt-24">
                <div
                    className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    <p className="text-[#F4A900] text-xs uppercase tracking-[0.3em] mb-4 font-semibold">
                        Legacy & Future
                    </p>
                    <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        Artist <span className="text-[#F4A900]">Showcase</span>
                    </h2>
                </div>
            </div>

            <div ref={wrapperRef} className={styles.mainWrapper}>
                <div ref={containerRef} className={styles.mainContainer}>
                    <div className={styles.topHeadingContainer}>
                        <h1 className={styles.heading}>Renowned <span>Artists!</span></h1>
                    </div>

                    <div className={styles.imageContentContainer}>
                        <ul ref={imageListRef}>
                            {artists.map((artist) => (
                                <li key={artist.name} className="h-[40rem] relative">
                                    <Image src={artist.image} alt={artist.name} fill className="object-cover" sizes="100vw" />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.bottomHeadingContainer}>
                        <h1 className={styles.heading}><span>Renowned </span>Artists!</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-8 relative pb-24">
                <ArtistGallery />
            </div>
        </section>
    );
}
