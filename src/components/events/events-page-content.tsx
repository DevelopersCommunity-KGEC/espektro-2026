"use client";

import React, { Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { EventsGridSkeleton } from "@/components/skeletons";
import { EventsList } from "@/components/events/events-list";
import { MusicController } from "@/components/audio/MusicController";

interface EventsPageContentProps {
    events: any[];
}

export function EventsPageContent({ events }: EventsPageContentProps) {
    return (
        <main
            className="relative min-h-screen overflow-hidden z-10"
            style={{ backgroundColor: "#FFF8F0" }}
            id="events-page"
            data-section-id="events-page"
        >
            <MusicController autoStart={true} initialSection="events-page" />

            {/* Lotus Mandala Background */}
            <div className="fixed inset-0 top-[30%] flex items-center justify-center opacity-[0.9] pointer-events-none z-0">
                <Image
                    src="/images/background_web.webp"
                    alt="Decorative lotus mandala"
                    fill
                    priority
                    className="object-contain hidden md:block"
                />
                <Image
                    src="/images/background_web_mobile.webp"
                    alt="Decorative lotus mandala"
                    fill
                    priority
                    className="object-contain w-fit md:hidden"
                />
            </div>

            {/* Left tribal border pattern */}
            <div
                className="absolute top-0 left-0 bottom-0 w-16 md:w-24 overflow-hidden hidden sm:block z-10"
                style={{
                    backgroundImage: "url(/images/43a0b75b3caae95caa70550adda8ed60.webp)",
                    backgroundRepeat: "repeat-y",
                    backgroundSize: "100% auto",
                    backgroundPosition: "top center",
                }}
            />

            {/* Main Content */}
            <motion.div
                className="relative z-20 container mx-auto px-6 pt-24 pb-12 sm:pl-24 md:pl-32 lg:pl-40"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.2,
                            delayChildren: 0.1
                        }
                    }
                }}
            >
                <div className="mb-12 flex flex-col items-center">
                    <motion.h3
                        className="text-lg md:text-xl text-[#8B2635] tracking-wide mb-3 font-medium uppercase font-[family-name:var(--font-roboto-slab)] text-center"
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                        }}
                    >
                        Exciting Lineup
                    </motion.h3>
                    <motion.h1
                        className="text-5xl md:text-6xl lg:text-7xl text-[#2C1810] mb-6 leading-[1.1] font-[family-name:var(--font-medieval-sharp)] text-center flex flex-wrap justify-center overflow-hidden"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.04 }
                            }
                        }}
                    >
                        {"All ".split("").map((char, i) => (
                            <motion.span
                                key={`events-h-${i}`}
                                variants={{
                                    hidden: { opacity: 0, y: 40 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
                                }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                        <span className="text-[#B7410E] flex">
                            {"Events".split("").map((char, i) => (
                                <motion.span
                                    key={`events-t-${i}`}
                                    variants={{
                                        hidden: { opacity: 0, y: 40 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
                                    }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </span>
                    </motion.h1>
                    <motion.p
                        className="text-[#4A3428]/80 max-w-2xl mx-auto text-center font-[family-name:var(--font-open-sans)] text-sm md:text-lg"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                        }}
                    >
                        Discover the diverse range of competitive and non-competitive events at Espektro 2026. Join us for a journey of skill, passion, and victory.
                    </motion.p>
                </div>

                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                    }}
                >
                    <Suspense fallback={<EventsGridSkeleton />}>
                        <EventsList initialEvents={events || []} />
                    </Suspense>
                </motion.div>
            </motion.div>
        </main>
    );
}
