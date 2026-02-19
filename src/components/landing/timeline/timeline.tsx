"use client";

import { motion, useScroll, useTransform, useMotionTemplate, useMotionValueEvent } from "framer-motion";
import { timelineData } from "./data";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";

export default function Timeline() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    // Horizontal scroll logic
    // We want to scroll through all items.
    // Total width approx = (items.length - 1) * spacing + windowWidth
    // But simplistic approach: map 0-1 vertical scroll to 0-(totalWidth) horizontal.
    // Let's assume a fixed spacing.
    // Let's assume a fixed spacing.
    const itemSpacing = 150; // px - Reduced closer
    const totalWidth = (timelineData.length - 1) * itemSpacing;
    const x = useTransform(scrollYProgress, [0, 1], [0, -totalWidth]);

    // Active Index Logic
    const [activeIndex, setActiveIndex] = useState(0);

    useMotionValueEvent(x, "change", (latest) => {
        // latest is negative.
        const positiveX = -latest;
        const index = Math.round(positiveX / itemSpacing);
        if (index !== activeIndex && index >= 0 && index < timelineData.length) {
            setActiveIndex(index);
        }
    });

    // Wave Path Logic
    // We need to generate a path that connects points (i * spacing, item.top)
    // item.top is a string like "10vh", need to approximate or parse.
    // Let's verify data.ts to see the format. It is "10vh", "22vh", etc.
    // We can assume a base height and parse integer.
    const generatePath = () => {
        const points = timelineData.map((item, i) => {
            const xVal = i * itemSpacing;
            // Parse "10vh" -> 10.
            const topStr = item.position.top || "50vh";
            const topPx = parseInt(topStr.replace(/[^0-9.]/g, ""), 10);

            // Since container is h-full (100vh) and viewBox height is 100, 
            // yVal is just the vh number.
            const yVal = topPx;

            return { x: xVal, y: yVal };
        });

        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];
            const cp1x = (curr.x + next.x) / 2;
            const cp1y = curr.y;
            const cp2x = (curr.x + next.x) / 2;
            const cp2y = next.y;
            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
        }
        return d;
    };

    // Use a memoized path
    const [pathD, setPathD] = useState("");
    useEffect(() => {
        setPathD(generatePath());
    }, []);

    // Active Item for Description Box
    const activeItem = timelineData[activeIndex];

    return (
        <section ref={targetRef} className="relative h-[500vh] text-foreground z-20" style={{ backgroundColor: "#FFF8F0" }}>
            {/* STICKY CONTAINER - Unifies everything fixed on screen */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* 1. Background Image */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="relative w-full h-full">
                        <Image
                            src="/images/bg1.png"
                            alt="Timeline background"
                            fill
                            className="object-cover opacity-30"
                        />
                    </div>
                </div>

                {/* 2. Header */}
                <div className="absolute top-10 left-0 w-full z-20 text-center px-4">
                    <h3 className="text-lg md:text-xl text-[#8B2635] tracking-wide mb-2 font-medium uppercase font-[family-name:var(--font-roboto-slab)]">
                        Historical Journey
                    </h3>
                    <h2 className="text-4xl md:text-6xl text-[#2C1810] leading-[1.1] font-[family-name:var(--font-medieval-sharp)] drop-shadow-sm">
                        Evolution of <span className="text-[#B7410E]">Bengali Culture</span>
                    </h2>
                </div>

                {/* 3. Horizontal Moving Container - Set to h-full to align with vh positions */}
                <motion.div
                    style={{ x }}
                    className="relative flex items-center h-full left-[50vw]"
                >
                    {/* SVG Connecting Line */}
                    {/* We overlay it. Width needs to be huge. */}
                    <svg
                        className="absolute top-0 left-0 h-full overflow-visible pointer-events-none"
                        style={{ width: `${(timelineData.length) * itemSpacing}px` }}
                        viewBox={`0 0 ${(timelineData.length) * itemSpacing} 100`}
                        preserveAspectRatio="none"
                    >
                        {/* We need to define viewBox properly.
                             If y is 0-100 (vh), then viewBox y is 0 100.
                         */}
                        <path
                            d={pathD}
                            fill="none"
                            stroke="#e5e7eb" // Neutral gray base
                            strokeWidth="4"
                            vectorEffect="non-scaling-stroke"
                        />
                        {pathD && (
                            <motion.path
                                d={pathD}
                                fill="none"
                                stroke="#B7410E" // Active Red
                                strokeWidth="4"
                                vectorEffect="non-scaling-stroke"
                                initial={{ pathLength: 0 }}
                                style={{ pathLength: scrollYProgress }}
                            />
                        )}
                    </svg>

                    {/* Timeline Items */}
                    {timelineData.map((item, index) => {
                        // Calculate offset for y-position (parse "10vh" etc or default)
                        // This "container" is flex, but we want absolute-like positioning relative to the horizontal strip
                        // Actually, let's keep it simple: absolute positioning inside the moving container is easier for the "wave".
                        const topVal = item.position.top || "50vh"; // This matches SVG y logic

                        // We check active state for color/bw
                        const isActive = index === activeIndex;
                        const distanceFromActive = Math.abs(index - activeIndex);
                        const zIndex = 50 - distanceFromActive; // Center item on top

                        return (
                            <div
                                key={item.id}
                                className="absolute flex items-center justify-center transition-all duration-700"
                                style={{
                                    left: index * itemSpacing,
                                    top: topVal, // defined in vh
                                    width: "300px",
                                    height: "200px", // define height for centering
                                    transform: "translate(-50%, -50%)", // Center on the point
                                    zIndex: zIndex
                                }}
                            >
                                {/* Circle/Dot - Absolute Center */}
                                <div
                                    className={`absolute w-6 h-6 rounded-full border-4 transition-colors duration-500 z-30 ${isActive ? "bg-[#B7410E] border-white shadow-md" : "bg-white border-muted-foreground"}`}
                                />

                                {/* Image Card - Absolute Center */}
                                <div className={`absolute inset-0 flex items-center justify-center`}>
                                    <div className={`relative w-[320px] md:w-[450px] aspect-video transition-all duration-700 ${isActive ? "scale-110" : "scale-85 border-transparent grayscale opacity-100"}`}>
                                        <img
                                            src={item.img}
                                            alt={item.title}
                                            className="w-full h-full object-contain scale-310"
                                        />
                                    </div>
                                </div>
                                {/* Description Card - Below Image, Scrolls with it */}
                                <div className={`absolute top-[120%] left-1/2 -translate-x-1/2 w-64 md:w-80 bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-gray-100 transition-all duration-700 text-left font-[family-name:var(--font-medieval-sharp)] ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                                    <p className="text-[#B7410E] text-[10px] uppercase tracking-[0.2em] font-bold mb-2">
                                        {item.era}
                                    </p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-xs leading-relaxed line-clamp-4">
                                        {item.body}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
}
