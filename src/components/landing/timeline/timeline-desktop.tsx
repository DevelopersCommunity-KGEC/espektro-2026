"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { timelineData } from "./data";
import { useRef, useState } from "react";
import Image from "next/image";

export default function TimelineDesktop() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    const [activeIndex, setActiveIndex] = useState(0);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const index = Math.min(
            Math.floor(latest * timelineData.length),
            timelineData.length - 1
        );
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    });

    // Generate a zigzag path through the dots — alternating above/below center
    const pathD = (() => {
        if (timelineData.length === 0) return "";
        let d = "";
        timelineData.forEach((item, i) => {
            const x = parseFloat(item.position.left ?? '0');
            const y = i % 2 === 0 ? 45 : 55; // zigzag: up/down around center

            if (i === 0) {
                d += `M ${x} ${y}`;
            } else {
                const prev = timelineData[i - 1];
                const prevX = parseFloat(prev.position.left ?? '0');
                const prevY = (i - 1) % 2 === 0 ? 45 : 55;
                const cpX = (prevX + x) / 2;
                d += ` C ${cpX} ${prevY}, ${cpX} ${y}, ${x} ${y}`;
            }
        });
        return d;
    })();

    return (
        <section ref={targetRef} className="relative h-[2500vh] bg-[#FFF8F0] text-foreground z-20 font-[family-name:var(--font-medieval-sharp)]">
            {/* Left fixed tribal border */}
            <div
                className="absolute top-0 left-0 bottom-0 w-16 md:w-24 overflow-hidden z-50 pointer-events-none"
                style={{
                    backgroundImage: 'url(/images/43a0b75b3caae95caa70550adda8ed60.webp)',
                    backgroundRepeat: 'repeat-y',
                    backgroundSize: '100% auto',
                    backgroundPosition: 'top center',
                }}
            />

            {/* STICKY CONTAINER */}
            <div className="sticky top-0 h-screen w-full ">

                {/* Background Image */}
                <div className="absolute inset-0 pointer-events-none">
                    <Image
                        src="/images/bg1.png"
                        alt="Timeline background"
                        fill
                        className="object-cover opacity-30"
                    />
                </div>

                {/* Header */}
                <div className="absolute top-4 left-0 w-full z-20 text-center px-4">
                    <h3 className="text-lg md:text-xl text-[#8B2635] tracking-wide mb-2 font-medium uppercase font-[family-name:var(--font-roboto-slab)]">
                        Historical Journey
                    </h3>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl text-[#2C1810] leading-[1.1] font-[family-name:var(--font-medieval-sharp)] drop-shadow-sm">
                        Evolution of <span className="text-[#B7410E]">Bengali Culture</span>
                    </h2>
                </div>

                {/* SVG PATH — horizontal line at vertical center */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-[25]" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path
                        d={pathD}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="0.5"
                        strokeDasharray="1.5 1"
                    />
                    <motion.path
                        d={pathD}
                        fill="none"
                        stroke="#B7410E"
                        strokeWidth="0.6"
                        initial={{ pathLength: 0 }}
                        style={{ pathLength: scrollYProgress }}
                    />
                </svg>

                {/* DOTS — always at vertical center (top: 50%), horizontal from data */}
                <div className="absolute inset-0 w-full h-full z-30 pointer-events-none">
                    {timelineData.map((item, index) => {
                        const isActive = index === activeIndex;
                        const isPast = index < activeIndex;
                        return (
                            <div
                                key={`dot-${item.id}`}
                                className="absolute -translate-x-1/2 -translate-y-1/2"
                                style={{ top: index % 2 === 0 ? '45%' : '55%', left: item.position.left }}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${isActive ? "bg-[#B7410E] border-white scale-150" : isPast ? "bg-[#B7410E] border-white" : "bg-white border-gray-300"}`} />
                            </div>
                        );
                    })}
                </div>

                {/* IMAGES LAYER — positioned using data top/left */}
                <div className="absolute inset-0 w-full h-full z-20">
                    {timelineData.map((item, index) => {
                        const isActive = index === activeIndex;
                        const isPast = index < activeIndex;

                        return (
                            <div
                                key={item.id}
                                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
                                style={{
                                    top: item.position.top,
                                    left: item.position.left,
                                    zIndex: isActive ? 50 : 20,
                                }}
                            >
                                {/* The Image Container */}
                                <div
                                    className={`relative transition-all duration-700 flex items-center justify-center
                                    ${isActive ? "scale-110 opacity-100 grayscale-0" : isPast ? "scale-100 opacity-100 grayscale-0" : "scale-90 opacity-100 grayscale"}
                                    `}
                                    style={{
                                        width: '350px',
                                        height: '350px'
                                    }}
                                >
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className={`w-full h-full object-contain drop-shadow-xl ${isActive ? "drop-shadow-[0_10px_15px_rgba(183,65,14,0.3)]" : ""}`}
                                    />
                                </div>

                                {/* Description Card - appears below the image when active */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            className="absolute left-1/2 -translate-x-1/2 w-[280px] md:w-[320px] z-50 font-[family-name:var(--font-medieval-sharp)]"
                                            style={{ top: '80%' }}
                                        >
                                            <div className="bg-[#FFF0E6] backdrop-blur-md p-5 rounded-2xl shadow-2xl">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="px-2 py-1 bg-[#FFF0E6] text-[#B7410E] text-[10px] font-bold uppercase tracking-widest rounded">
                                                        {item.era}
                                                    </span>
                                                    {/* <div className="h-px bg-gray-200 flex-grow" /> */}
                                                </div>
                                                <h3 className="text-xl font-bold text-[#2C1810] mb-1">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-600 text-xs leading-relaxed">
                                                    {item.body}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}