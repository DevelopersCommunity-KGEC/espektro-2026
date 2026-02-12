"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pastArtists } from "@/data/landing-content";
import styles from "./artist-gallery.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ArtistGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = containerRef.current?.children;
      if (!items) return;

      gsap.from(items, {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="gallery" className="mt-20">
      <div className="text-center mb-12">
        <h3 className="font-serif text-2xl lg:text-3xl font-bold text-black mb-2">
          Glimpses of <span className="text-[#F4A900]">Past Artists</span>
        </h3>
        <p className="text-white/40 text-sm max-w-lg mx-auto">
          A legacy of unforgettable performances that have graced our stages over the years.
        </p>
      </div>

      <div className={styles.main_gallery} ref={containerRef}>
        {pastArtists.map((item) => (
          <div key={item.id} className="relative group cursor-pointer">
            <Image
              src={item.url}
              alt="Artist"
              fill
              className="object-cover transition-transform duration-700"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-[#B7410E]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
