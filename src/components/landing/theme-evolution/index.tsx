"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { eras } from "@/data/landing-content";

const eraImages = [
    "/images/bengali-culture.jpeg",
    "/images/india-culture.jpeg",
    "/images/kolkata-monochrome.jpeg",
    "/images/kolkata-city.jpeg",
];

/**
 * Positions of each era card center as percentages of the container.
 * The curve will pass through these points.
 */
const eraPositions = [
    { xPct: 12.5, yPct: 28 },
    { xPct: 37.5, yPct: 68 },
    { xPct: 62.5, yPct: 30 },
    { xPct: 87.5, yPct: 72 },
];

/**
 * Build a dramatically curvy cubic bezier path.
 * Control points overshoot vertically to create tight S-bends.
 */
function buildCurvePath(): string {
    const pts = eraPositions.map(p => ({
        x: p.xPct * 10,
        y: p.yPct * 5,
    }));

    // Start at first point
    let d = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
        const curr = pts[i];
        const next = pts[i + 1];

        const isFirst = i === 0;
        const isLast = i === pts.length - 2;

        const overshoot = 80;

        // Default control points with vertical overshoot (S-curve)
        let cp1y = curr.y + (next.y > curr.y ? overshoot : -overshoot);
        let cp2y = next.y + (next.y > curr.y ? -overshoot : overshoot);

        let cp1x = (curr.x + next.x) / 2;
        let cp2x = (curr.x + next.x) / 2;

        // Force horizontal tangents at the very start and very end
        if (isFirst) {
            cp1y = curr.y; // Horizontal departure
            // Extend smoothly
            cp1x = curr.x + (next.x - curr.x) * 0.5;
            cp2x = (curr.x + next.x) * 0.5;
        }

        if (isLast) {
            cp2y = next.y; // Horizontal arrival
            // Extend smoothly
            cp1x = (curr.x + next.x) * 0.5;
            cp2x = next.x - (next.x - curr.x) * 0.5;
        }

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }

    return d;
}

const curvePath = buildCurvePath();

export function ThemeEvolution() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeCount, setActiveCount] = useState(1);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        const progress = Math.min(v / 0.75, 1);
        if (progress < 0.3) {
            setActiveCount(1);
        } else if (progress < 0.6) {
            setActiveCount(2);
        } else if (progress < 0.9) {
            setActiveCount(3);
        } else {
            setActiveCount(4);
        }
    });

    // Curve starts drawing as soon as the section is entered
    // Ensure we reach 0 (full length) definitely by the end
    const dashOffset = useTransform(
        scrollYProgress,
        [0, 0.05, 0.25, 0.5, 0.75, 1],
        [100, 100, 66, 33, 0, -5]
    );

    return (
        <div ref={containerRef} className="relative h-[300vh]">
            <section className="sticky top-0 h-screen w-full overflow-hidden bg-background">
                {/* Left Border */}
                <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-150 z-10 pointer-events-none opacity-40">
                    <Image
                        src="/border.svg"
                        alt="Border"
                        fill
                        className="object-fill"
                    />
                </div>

                {/* Right Border */}
                <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-150 z-10 pointer-events-none opacity-40 rotate-180">
                    <Image
                        src="/border.svg"
                        alt="Border"
                        fill
                        className="object-fill"
                    />
                </div>

                {/* Heading */}
                <div className="absolute top-0 left-0 right-0 z-20 pt-10 lg:pt-14 text-center">
                    <p className="text-primary text-xs uppercase tracking-[0.3em] mb-3 font-semibold">
                        Through the Ages
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                        Evolution of <span className="text-primary">Bengali Culture</span>
                    </h2>
                </div>

                {/* Timeline container */}
                <div className="absolute inset-x-0 top-[18%] bottom-[8%] px-4 lg:px-12">
                    <div className="relative w-full h-full max-w-6xl mx-auto">

                        {/* ─── SVG CURVE ─── */}
                        <svg
                            viewBox="0 0 1000 500"
                            className="absolute inset-0 w-full h-full"
                            preserveAspectRatio="none"
                            style={{ zIndex: 3 }}
                        >
                            {/* Background track */}
                            <path
                                d={curvePath}
                                stroke="#d4d4d4"
                                strokeWidth="4"
                                fill="none"
                                vectorEffect="non-scaling-stroke"
                                strokeLinecap="round"
                                pathLength={100}
                            />
                            {/* Animated fill */}
                            <motion.path
                                d={curvePath}
                                stroke="#B7410E"
                                strokeWidth="5"
                                fill="none"
                                vectorEffect="non-scaling-stroke"
                                strokeLinecap="round"
                                pathLength={100}
                                style={{
                                    strokeDasharray: 100,
                                    strokeDashoffset: dashOffset,
                                }}
                            />
                        </svg>

                        {/* ─── RED DOTS — at exact SVG path endpoints ─── */}
                        {eraPositions.map((pos, i) => {
                            const isActive = i < activeCount;
                            return (
                                <div
                                    key={`dot-${i}`}
                                    className={`absolute rounded-full transition-all duration-500 ${isActive
                                        ? "w-5 h-5 bg-[#B7410E]"
                                        : "w-3 h-3 bg-gray-300 border-2 border-gray-400"
                                        }`}
                                    style={{
                                        left: `${pos.xPct}%`,
                                        top: `${pos.yPct}%`,
                                        transform: "translate(-50%, -50%)",
                                        zIndex: 6,
                                        boxShadow: isActive
                                            ? "0 0 12px rgba(183,65,14,0.7), 0 0 24px rgba(183,65,14,0.3)"
                                            : "none",
                                    }}
                                />
                            );
                        })}

                        {/* ─── ERA CARDS — centered on the dot positions ─── */}
                        {eras.map((era, i) => {
                            const isActive = i < activeCount;
                            const pos = eraPositions[i];

                            return (
                                <div
                                    key={`card-${i}`}
                                    className="absolute flex flex-col items-center"
                                    style={{
                                        left: `${pos.xPct}%`,
                                        top: `${pos.yPct}%`,
                                        transform: "translate(-50%, -50%)",
                                        zIndex: 4,
                                    }}
                                >
                                    {/* Image box */}
                                    <div
                                        className={`relative w-28 h-36 sm:w-32 sm:h-40 md:w-36 md:h-44 lg:w-40 lg:h-48 rounded-xl overflow-hidden shadow-lg transition-all duration-700 ease-out
                                            ${isActive
                                                ? "grayscale-0 scale-100 opacity-100 shadow-xl"
                                                : "grayscale scale-90 opacity-30"
                                            }`}
                                    >
                                        <Image
                                            src={eraImages[i]}
                                            alt={era.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 28vw, 16vw"
                                        />
                                        <div
                                            className={`absolute inset-0 transition-opacity duration-700 ${isActive ? "opacity-0" : "opacity-50"}`}
                                            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.5))" }}
                                        />
                                    </div>

                                    {/* Era text */}
                                    <div
                                        className={`mt-2 text-center transition-all duration-700 max-w-[160px]
                                            ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
                                    >
                                        <span className="text-[9px] lg:text-[10px] uppercase tracking-[0.15em] text-primary font-bold block mb-0.5">
                                            {era.era}
                                        </span>
                                        <h3 className="font-serif text-[11px] lg:text-xs font-bold text-foreground mb-0.5">
                                            {era.title}
                                        </h3>
                                        <p className="text-[8px] lg:text-[9px] text-muted-foreground leading-snug line-clamp-2 hidden md:block">
                                            {era.body}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Period labels */}
                <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-6 lg:gap-12">
                    {eras.map((era, i) => (
                        <span
                            key={i}
                            className={`text-[10px] lg:text-xs font-mono transition-all duration-500 ${i < activeCount ? "text-primary opacity-100" : "text-muted-foreground opacity-30"
                                }`}
                        >
                            {era.period}
                        </span>
                    ))}
                </div>

                {/* Scroll hint */}
                <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${activeCount >= eras.length ? "opacity-0" : "opacity-50"}`}>
                    <div className="w-5 h-8 border-2 border-muted-foreground/40 rounded-full flex items-start justify-center p-1">
                        <motion.div
                            className="w-1 h-2 bg-primary rounded-full"
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}