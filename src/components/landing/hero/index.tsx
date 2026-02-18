"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted)
        return (
            <section className="h-screen bg-[#FFF8F0]" aria-hidden="true" />
        );

    return (
        <section className="relative flex justify-center items-center w-full min-h-screen py-20 pr-7 md:pr-0 md:px-4  overflow-hidden z-10" style={{ backgroundColor: "#FFF8F0" }}>
            {/* Lotus Mandala Background - Centered and Subtle */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.9] pointer-events-none -bottom-60">
                <Image
                    src="/images/background_web.webp"
                    alt="Decorative lotus mandala"
                    width={1000}
                    height={800}
                    className="object-contain w-full "
                />
            </div>

            {/* Left tribal border pattern */}
            <div
                className="absolute top-0 left-0 bottom-0 w-16 md:w-24 overflow-hidden hidden sm:block z-10"
                style={{
                    backgroundImage: 'url(/images/43a0b75b3caae95caa70550adda8ed60.webp)',
                    backgroundRepeat: 'repeat-y',
                    backgroundSize: '100% auto',
                    backgroundPosition: 'top center'
                }}
            />

            {/* Decorative Circular Patterns (Matches EspektroAbout section) */}
            {/* <motion.div
                className="absolute right-[-10rem] top-[-10rem] w-80 h-80 md:w-100 md:h-100 lg:w-120 lg:h-120 z-0 opacity-20 hidden lg:block"
                initial={{ opacity: 0, rotate: 20 }}
                animate={{ opacity: 0.2, rotate: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
            >
                <Image
                    src="/images/992241cef4a2175dfd465b2ebbe92e8e.webp"
                    alt=""
                    fill
                    className="object-contain"
                />
            </motion.div> */}

            <motion.div
                className="absolute left-[-5rem] bottom-[-5rem] w-64 h-64 md:w-80 md:h-80 z-0 opacity-10 hidden lg:block"
                initial={{ opacity: 0, rotate: -20 }}
                animate={{ opacity: 0.1, rotate: 360 }}
                transition={{
                    rotate: { duration: 185, repeat: Infinity, ease: "linear" },
                    opacity: { duration: 2.2 },
                    scale: { duration: 2.2 }
                }}
            >
                <Image
                    src="/images/1c633fa82eab0887a01b2ba2b4c75bdc.webp"
                    alt=""
                    fill
                    className="object-contain"
                />
            </motion.div>

            {/* Main Content */}
            <div className="relative z-20 container mx-auto px-6 text-center mt-10">
                <motion.p
                    className="text-[#8B2635] text-[10px] sm:text-xs uppercase tracking-[0.5em] font-bold mb-8 font-[family-name:var(--font-roboto-slab)]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Kalyani Government Engineering College presents
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h1 className="text-5xl sm:text-8xl md:text-7xl lg:text-[8rem] leading-[0.85] font-bold text-[#2C1810] mb-4 uppercase tracking-tighter font-[family-name:var(--font-medieval-sharp)] drop-shadow-sm">
                        ESPEKTRO
                    </h1>
                    <p className="text-[#B7410E] text-4xl sm:text-6xl md:text-7xl lg:text-6xl italic font-bold mb-12 font-[family-name:var(--font-medieval-sharp)]">
                        2026
                    </p>
                </motion.div>

                <motion.p
                    className="max-w-2xl mx-auto text-lg sm:text-xl text-[#4A3428] mb-14 font-medium leading-relaxed font-[family-name:var(--font-open-sans)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    A journey through the{" "}
                    <span className="text-[#B7410E] underline underline-offset-8 decoration-[#B7410E]/20 font-bold">
                        Evolution of Bengali Culture
                    </span>
                </motion.p>

                <div className="flex justify-center mt-8">
                    <Button
                        variant="theatrical"
                        className="bg-[#B7410E] hover:bg-[#8B2635] text-white h-11 px-8 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 font-[family-name:var(--font-roboto-slab)]"
                        asChild
                    >
                        <Link href="/events">Explore Events</Link>
                    </Button>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 1, delay: 1.5 }}
            >
                <span className="text-[#2C1810] text-[10px] uppercase tracking-[0.4em] font-bold">
                    Scroll
                </span>
                <div className="w-px h-12 bg-gradient-to-b from-[#2C1810] to-transparent" />
            </motion.div>
        </section>
    );
}
