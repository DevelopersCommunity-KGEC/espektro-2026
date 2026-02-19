"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function SecondBack() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted)
        return (
            <section className="h-screen bg-[#FFF8F0]" aria-hidden="true" />
        );

    return (
        <section className="relative w-full min-h-[80vh] py-20 overflow-hidden z-10" style={{ backgroundColor: "#FFF8F0" }}>
            {/* Background Image - Fits without cropping */}
            <div className="absolute inset-0 opacity-50 pointer-events-none -w-1/2 ">
                <Image
                    src="/images/back2.png"
                    alt="Background Illustration"
                    fill
                    priority
                    className="object-contain"
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
