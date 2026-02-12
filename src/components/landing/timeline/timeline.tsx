"use client";

import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { timelineData } from "./data";
import { useRef, useState, useEffect } from "react";
import clsx from "clsx";

export default function Timeline() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });
    const dashOffset = useTransform(
        scrollYProgress,
        [0, 0.05, 0.25, 0.5, 0.75, 1],
        [100, 100, 66, 33, 0, -5]
    );

    const bgClipProgress = useTransform(scrollYProgress, [0, 1], [100, 0]);
    const bgClipPath = useMotionTemplate`inset(0 ${bgClipProgress}% 0 0)`;

    return (
        <section ref={targetRef} className="relative z-10 h-[400vh] bg-black text-white">
            <div className="sticky top-0 h-screen w-full overflow-hidden">

                {/* Fixed Background Context */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="max-w-2xl pt-4 relative z-20 pl-8">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white shadow-black drop-shadow-lg">
                            Evolution of <span className="text-[#B7410E]">Bengali Culture</span>
                        </h2>
                    </div>
                    {/* B&W Base Layer */}
                    {/* B&W Base Layer */}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: "url('/images/timelinebg.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />

                    {/* Color Reveal Layer - Removed */}
                    <svg
                        viewBox="0 0 1000 500"
                        className="absolute inset-0 w-full h-full"
                        preserveAspectRatio="none"
                        style={{ zIndex: 50 }}
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
                            pathLength={300}
                            style={{
                                strokeDasharray: 300,
                                strokeDashoffset: dashOffset,
                            }}
                        />
                        {/* Red Dots at Breakpoints */}
                        {eraPositions.map((pos, i) => (
                            <TimelineDot
                                key={i}
                                pos={pos}
                                index={i}
                                total={eraPositions.length}
                                dashOffset={dashOffset}
                            />
                        ))}
                    </svg>
                </div>

                {/* Items */}
                {timelineData.map((item, index) => (
                    <TimelineItemCard
                        key={item.id}
                        item={item}
                        index={index}
                        scrollYProgress={scrollYProgress}
                        totalItems={timelineData.length}
                    />
                ))}
            </div>
        </section>
    );
}
const eraPositions = [
    { xPct: 15.5, yPct: 48 },

    { xPct: 35.5, yPct: 50 },

    { xPct: 65.5, yPct: 60 },

    { xPct: 87.5, yPct: 63 },

];

function TimelineDot({
    pos,
    index,
    total,
    dashOffset
}: {
    pos: { xPct: number; yPct: number };
    index: number;
    total: number;
    dashOffset: any;
}) {
    // Calculate percent based on physical X position, not just index.
    // This ensures the dot turns red exactly when the line reaches it visually.
    const startX = eraPositions[0].xPct;
    const endX = eraPositions[eraPositions.length - 1].xPct;
    const span = endX - startX;

    // Protect against 0 span
    const percent = span > 0 ? ((pos.xPct - startX) / span) * 100 : 0;

    // dashOffset goes 100 -> 0.
    // Trigger when dashOffset reaches (100 - percent).
    const trigger = 100 - percent;

    // Map grey -> red
    const fill = useTransform(
        dashOffset,
        [trigger + 1, trigger],
        ["#d4d4d4", "#B7410E"]
    );

    // Force first dot to be always red
    const visibleFill = index === 0 ? "#B7410E" : fill;

    return (
        <motion.circle
            cx={pos.xPct * 10}
            cy={pos.yPct * 5}
            r={5}
            fill={visibleFill}
        />
    );
}

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

function TimelineItemCard({
    item,
    index,
    scrollYProgress,
    totalItems
}: {
    item: any;
    index: number;
    scrollYProgress: any;
    totalItems: number;
}) {
    // Group items: 0&1 -> Group 0, 2&3 -> Group 1, etc.
    const groupIndex = Math.floor(index / 2);

    // Define triggers slightly AFTER the dots (0.25, 0.5, 0.75)
    // so "dot coloured then two corresponding img will coloured"
    let triggerStart = 0;
    if (groupIndex === 1) triggerStart = 0.28;
    else if (groupIndex === 2) triggerStart = 0.53;
    else if (groupIndex === 3) triggerStart = 0.78;

    // Latch state: once activated, stays activated.
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // Group 0 always active
        if (groupIndex === 0) {
            setIsActive(true);
            return;
        }

        const unsubscribe = scrollYProgress.on("change", (latest: number) => {
            if (latest >= triggerStart) {
                setIsActive(true);
            } else {
                // Optional: valid to un-activate if scrolling back up?
                // User said "once it become colored it will colourefull" -> implies latch.
                // But "previous two become again bnw" complaint suggests they notice it turning off.
                // If we strict latch, they won't turn off.
                // If we want them to turn off when scrolling WAY back, we could.
                // But for now, let's strict latch to satisfy the "once" requirement.
                // actually, strict latch might be annoying if they scroll top to start over.
                // balancing:
                if (latest < triggerStart - 0.05) {
                    // Allow reversing if they scroll back up significantly
                    setIsActive(false);
                }
            }
        });
        return unsubscribe;
    }, [scrollYProgress, triggerStart, groupIndex]);

    // Derived styles based on isActive
    const opacity = isActive ? 1 : 0;
    const scale = isActive ? 1 : 0.85;

    return (
        <motion.div
            className="absolute"
            // No initial prop to ensure style takes precedence for SSR/hydration mismatch
            style={{
                top: item.position.top,
                left: item.position.left,
                right: item.position.right,
                bottom: item.position.bottom,
                width: item.position.width || "300px",
                height: item.position.height || "auto",
                zIndex: 40 - Math.abs(index - 3),
            }}
        >
            <div className={clsx(
                "w-full h-full relative overflow-hidden rounded-lg transition-all duration-500",
                "hover:scale-105 transition-transform duration-500"
            )}>
                {/* Black and White Image (Base Layer) */}
                <img
                    src={item.imgBW}
                    alt={`${item.description} (B&W)`}
                    className="relative w-full h-auto object-contain"
                />

                {/* Color Image (Overlay Layer) */}
                <motion.img
                    src={item.img}
                    alt={item.description}
                    className="absolute inset-0 w-full h-full object-contain transition-all duration-500 ease-out"
                    style={{
                        opacity: opacity,
                        scale: scale
                    }}
                />

                <motion.div
                    className="absolute z-20"
                    style={{
                        top: item.textPosition?.top,
                        left: item.textPosition?.left,
                        right: item.textPosition?.right,
                        bottom: item.textPosition?.bottom ?? "0",
                        width: item.textPosition?.width ?? "100%",
                        height: item.textPosition?.height,
                        display: "flex",
                        justifyContent: (item.textPosition?.textAlign as any) === "right" ? "flex-end" :
                            (item.textPosition?.textAlign as any) === "left" ? "flex-start" : "center",
                        alignItems: "center", // Center vertically if needed, or flex-start
                        pointerEvents: "none", // Allow clicking through if needed
                    }}
                >

                    <div
                        className={`mt-2 text-center transition-all duration-700 max-w-[160px] bg-black/20 backdrop-blur-sm p-3 rounded-xl border border-white/10
                            ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
                    >
                        <span className="text-[9px] lg:text-[10px] uppercase tracking-[0.15em] text-[#B7410E] font-bold block mb-0.5">
                            {item.era}
                        </span>
                        <h3 className="font-serif text-[11px] lg:text-xs font-bold text-white mb-0.5">
                            {item.title}
                        </h3>
                        <p className="text-[8px] lg:text-[9px] text-gray-300 leading-snug line-clamp-2 hidden md:block">
                            {item.body}
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
