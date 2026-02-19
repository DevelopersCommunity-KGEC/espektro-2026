"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function FirstBack() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted)
        return (
            <section className="h-screen bg-[#FFF8F0]" aria-hidden="true" />
        );

    return (
        <section className="relative w-full min-h-[50vh]  md:min-h-[70vh] overflow-hidden z-10" style={{ backgroundColor: "#FFF8F0" }}>
            {/* Background Image - Fits without cropping */}
            <div className="absolute inset-0  flex items-center justify-center opacity-[0.4] pointer-events-none ">
                <Image
                    src="/images/1stback.webp"
                    alt="Decorative lotus mandala"
                    fill
                    priority
                    className="object-contain hidden md:block"
                />
                <Image
                    src="/images/1stback.webp"
                    alt="Decorative lotus mandala"
                    fill
                    priority
                    className="object-contain w-fit md:hidden bottom-50"
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
        </section>
    );
}
