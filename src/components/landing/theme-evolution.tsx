"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { eras } from "@/data/landing-content";

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
        <div ref={containerRef} className="relative h-[400vh]">
            <section className="sticky top-0 h-screen w-full overflow-hidden">
                
                <div className="absolute inset-0">
                    <img 
                        src="/images/timeline.jpg" 
                        className="w-full h-full object-cover grayscale opacity-40" 
                        alt="Bengali Culture Timeline"
                    />
                    
                    <motion.div 
                        className="absolute inset-0"
                        style={{ clipPath }}
                    >
                        <img 
                            src="/images/timeline.jpg" 
                            className="w-full h-full object-cover" 
                            alt="Bengali Culture Timeline Color"
                        />
                    </motion.div>
                </div>

                <div className="relative z-20 h-full flex flex-col justify-between p-8 lg:p-16">
                    
                    <div className="max-w-2xl pt-4">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground">
                            Evolution of <span className="text-[#B7410E]">Bengali Culture</span>
                        </h2>
                    </div>

                    <div className="w-full max-w-7xl mx-auto">
                        <div className="w-full h-[1px] bg-border mb-8 relative">
                            <motion.div 
                                className="absolute h-full bg-[#B7410E] left-0 top-0"
                                style={{ width: progressWidth }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
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
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function EraItem({ item, index, total, scrollYProgress, isActive }: any) {
    // Each item appears sequentially across the scroll range
    // Spread from 0.1 to 0.7 (before the color animation completes at 0.95)
    const startBase = 0.1; // Don't start at 0 to avoid initial visibility
    const endRange = 0.7;
    const duration = 0.15; // Each item fades in over 15% of scroll
    
    const start = startBase + (index / total) * (endRange - startBase);
    const end = start + duration;

    const opacity = useTransform(
        scrollYProgress, 
        [start, end], 
        [0, 1]
    );

    return (
        <motion.div style={{ opacity }} className="relative z-10">
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