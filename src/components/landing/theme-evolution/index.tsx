"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { eras } from "@/data/landing-content";
import Image from "next/image";

const arr = [
    {
        "name" : "div1",
        "color" : "blue",
        "position" : "top-85 left-30"
    },
    {
        "name" : "div2",
        "color" : "yellow",
        "position" : "top-95 left-60"
    },
    {
        "name" : "div3",
        "color" : "blue",
        "position" : "top-110 left-90"
    },
    {
        "name" : "div4",
        "color" : "yellow",
        "position" : "top-105 left-120"
    },
    {
        "name" : "div5",
        "color" : "blue",
        "position" : "top-95 left-150"
    },
    {
        "name" : "div6",
        "color" : "yellow",
        "position" : "top-85 left-180"
    },
    {
        "name" : "div7",
        "color" : "blue",
        "position" : "top-100 left-210"
    },
    {
        "name" : "div8",
        "color" : "yellow",
        "position" : "top-105 left-240"
    },
    {
        "name" : "div9",
        "color" : "blue",
        "position" : "top-110 left-270"
    }
]

export function ThemeEvolution() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const clipPercent = useTransform(scrollYProgress, [0, 0.95], [100, 0]);
    const clipPath = useMotionTemplate`inset(0 ${clipPercent}% 0 0)`;
    const progressWidth = useTransform(scrollYProgress, [0, 0.95], ["0%", "100%"]);

    const [activeIdx, setActiveIdx] = useState(0);
    useEffect(() => {
        return scrollYProgress.on("change", (v) => {
            const val = Math.min(v / 0.95, 1);
            const idx = Math.floor(val * eras.length);
            setActiveIdx(Math.max(0, Math.min(idx, eras.length - 1)));
        });
    }, [scrollYProgress]);

    return (
        <div ref={containerRef} className="relative z-10 h-[400vh] bg-white">
            <section className="sticky top-0 h-screen w-full overflow-hidden">

                <div className="absolute inset-0">
                    <Image
                        src="/images/timeline.webp"
                        fill
                        className="object-cover grayscale opacity-40"
                        alt="Bengali Culture Timeline"
                    />
                    
                    <motion.div 
                        className="absolute inset-0"
                        style={{ clipPath }}
                    >
                        <img 
                            src="/images/timeline.webp" 
                            className="w-full h-full object-cover" 
                            alt="Bengali Culture Timeline Color"
                        />
                    </motion.div>
                </div>

                <div className="relative z-20 h-full flex flex-col justify-between p-8 lg:p-16">

                    <div className="w-full h-full">
                        {arr.map((item, i) => (
                            <div key={i} className={`absolute ${item.position} w-30 h-30 bg-${item.color}-500 ml-5`}>
                                {item.name}
                            </div>
                        ))}
                    </div>
                    
                    {/* Background 1 above */}
                    <div className="pt-4 bg-red-500 w-full h-200">
                        {/* <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground">
                            Evolution of <span className="text-[#B7410E]">Bengali Culture</span>
                        </h2> */}
                    </div>

                    {/* Background 2 below */}  
                    <div className="w-full h-200 bg-blue-500">
                        {/* <div className="w-full h-[1px] bg-border mb-8 relative">
                            <motion.div
                                className="absolute h-full bg-[#B7410E] left-0 top-0"
                                style={{ width: progressWidth }}
                            />
                        </div> */}

                        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
                            {eras.map((era, i) => (
                                <EraItem 
                                    key={i}
                                    item={era}
                                    index={i}
                                    total={eras.length}
                                    scrollYProgress={scrollYProgress}
                                    isActive={i === activeIdx}
                                />
                            ))}
                        </div> */}
                    </div>
                </div>
            </section>
        </div>
    );
}

function EraItem({ item, index, total, scrollYProgress, isActive }: any) {
    // Each item appears sequentially across the scroll range
    const startBase = 0.1;
    const endRange = 0.8;

    // Calculate the exact trigger point for this item
    const trigger = startBase + (index / total) * (endRange - startBase);

    // "Abrupt" appearance: Opacity jumps from 0 to 1 instantly at the trigger point
    const opacity = useTransform(
        scrollYProgress,
        [trigger - 0.001, trigger],
        [0, 1]
    );

    // "Dropdown" effect: Slides down slightly as it appears
    const y = useTransform(
        scrollYProgress,
        [trigger, trigger + 0.05],
        [-20, 0]
    );

    return (
        <motion.div
            style={{ opacity, y }}
            className="relative z-10"
        >
            <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isActive ? 'bg-[#B7410E] scale-125' : 'bg-muted-foreground/30'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-[#B7410E]' : 'text-muted-foreground'}`}>
                    {item.era}
                </span>
            </div>
            <h3 className={`text-xl lg:text-2xl font-serif font-bold mb-3 transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {item.title}
            </h3>
            <p className={`text-xs lg:text-sm leading-relaxed transition-colors duration-500 ${isActive ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>
                {item.body}
            </p>
        </motion.div>
    );
}