"use client";

import { useRef, useState, useEffect } from "react";
import { Play, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { galleryImages } from "@/data/landing-content";

export function Gallery() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

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

    const openLightbox = (index: number) => setSelectedImage(index);
    const closeLightbox = () => setSelectedImage(null);
    const nextImage = () =>
        setSelectedImage((prev) =>
            prev !== null ? (prev + 1) % galleryImages.length : null
        );
    const prevImage = () =>
        setSelectedImage((prev) =>
            prev !== null
                ? (prev - 1 + galleryImages.length) % galleryImages.length
                : null
        );

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (selectedImage === null) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    });

    return (
        <section
            ref={sectionRef}
            id="gallery"
            className="py-24 lg:py-36 bg-muted/20 overflow-hidden"
        >
            <div className="container mx-auto px-6 lg:px-8">
                {/* Header */}
                <div
                    className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    <p className="text-[#B7410E] text-xs uppercase tracking-[0.3em] mb-5 font-semibold">
                        Memories
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                        Glimpses of <span className="text-[#B7410E]">Espektro</span>
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Hover to bring colours to life &mdash; relive the magic of previous editions.
                    </p>
                </div>

                {/* Aftermovie */}
                <div
                    className={`mb-14 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden bg-card border border-border group">
                        <img
                            src="/images/bengali-culture.jpeg"
                            alt="Espektro 25 Aftermovie"
                            className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/20 transition-all duration-500 flex items-center justify-center">
                            <Button
                                size="lg"
                                className="bg-[#B7410E] hover:bg-[#9a370c] text-white rounded-full w-20 h-20 p-0 shadow-2xl transition-transform hover:scale-110"
                            >
                                <Play className="w-8 h-8 fill-current ml-1" />
                            </Button>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                            <div className="bg-background/90 backdrop-blur-sm rounded-xl px-5 py-3">
                                <p className="font-serif text-lg font-bold text-foreground">
                                    Espektro 25 Aftermovie
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Watch the highlights
                                </p>
                            </div>
                            <a
                                href="https://youtube.com/@espektro_kgec"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-background/90 backdrop-blur-sm rounded-xl p-3 hover:bg-background transition-colors"
                                aria-label="Open YouTube channel"
                            >
                                <ExternalLink className="w-5 h-5 text-foreground" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Masonry Gallery */}
                <div
                    className={`grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[200px] transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    {galleryImages.map((image, index) => (
                        <div
                            key={index}
                            className={`${image.span} relative rounded-2xl overflow-hidden cursor-pointer group`}
                            onClick={() => openLightbox(index)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && openLightbox(index)}
                            aria-label={`View ${image.alt}`}
                        >
                            {/* B&W Layer (default) */}
                            <img
                                src={image.src || "/placeholder.svg"}
                                alt={image.alt}
                                className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:opacity-0"
                            />
                            {/* Color Layer (on hover) */}
                            <img
                                src={image.src || "/placeholder.svg"}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-background text-sm font-medium">
                                        {image.alt}
                                    </p>
                                </div>
                            </div>
                            {/* Corner Decoration */}
                            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-background/50 transition-all duration-500" />
                            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-transparent group-hover:border-background/50 transition-all duration-500" />
                        </div>
                    ))}
                </div>

                {/* Social Links */}
                <div
                    className={`text-center mt-12 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    <p className="text-muted-foreground mb-4 text-sm">
                        Follow us for more updates and behind-the-scenes content
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <a
                            href="https://instagram.com/espektro_kgec"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-6 py-3 hover:border-[#B7410E]/30 hover:shadow-md transition-all group"
                        >
                            <svg
                                className="w-5 h-5 text-foreground group-hover:text-[#B7410E] transition-colors"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            <span className="font-medium text-foreground group-hover:text-[#B7410E] transition-colors text-sm">
                                @espektro_kgec
                            </span>
                        </a>
                        <a
                            href="https://youtube.com/@espektro_kgec"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-6 py-3 hover:border-[#B7410E]/30 hover:shadow-md transition-all group"
                        >
                            <svg
                                className="w-5 h-5 text-foreground group-hover:text-[#B7410E] transition-colors"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            <span className="font-medium text-foreground group-hover:text-[#B7410E] transition-colors text-sm">
                                YouTube
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {selectedImage !== null && (
                <div
                    className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image lightbox"
                >
                    <button
                        className="absolute top-4 right-4 text-background/80 hover:text-background transition-colors z-10"
                        onClick={closeLightbox}
                        aria-label="Close lightbox"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-background/80 hover:text-background transition-colors z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                        }}
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </button>
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-background/80 hover:text-background transition-colors z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                        }}
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-10 h-10" />
                    </button>

                    <img
                        src={galleryImages[selectedImage].src || "/placeholder.svg"}
                        alt={galleryImages[selectedImage].alt}
                        className="max-w-full max-h-[85vh] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                        <p className="text-background/80 font-medium">
                            {galleryImages[selectedImage].alt}
                        </p>
                        <p className="text-background/50 text-sm mt-1">
                            {selectedImage + 1} / {galleryImages.length}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}
