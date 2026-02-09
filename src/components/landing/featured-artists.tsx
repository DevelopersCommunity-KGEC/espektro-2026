"use client";

import { useRef, useEffect, useState } from "react";
import { artists } from "@/data/landing-content";
import { ArtistGallery } from "./artist-gallery";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./artist-v3.module.css";

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
                end: "+=2000",
                pin: true,
                scrub: 1,
                anticipatePin: 1,
            }
        });

        tl.to(containerRef.current, {
            height: "40rem",
            duration: 1.5,
            ease: "power2.out"
        })
        .to(imageListRef.current, {
            y: "-75%",
            duration: 3,
            ease: "none"
        })
        .to(containerRef.current, {
            height: "0rem",
            duration: 1,
            ease: "power2.in"
        });
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            id="artists"
            className="relative bg-white text-black overflow-hidden"
        >
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
                                <li key={artist.name} className="h-[40rem]">
                                    <img src={artist.image} alt={artist.name} />
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
