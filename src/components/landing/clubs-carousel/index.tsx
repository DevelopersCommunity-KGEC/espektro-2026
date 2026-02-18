"use client";

import { clubs } from "@/data/landing-content";

const row1 = [...clubs, ...clubs, ...clubs];
const row2 = [...[...clubs].reverse(), ...[...clubs].reverse(), ...[...clubs].reverse()];

export function ClubsCarousel() {
    return (
        <section className="py-16 bg-muted/30 overflow-hidden">
            <div className="container mx-auto px-6 lg:px-8 mb-8">
                <p className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Powered by our clubs
                </p>
            </div>

            {/* Row 1 */}
            <div className="relative mb-4">
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                <div className="flex gap-4 animate-marquee-left">
                    {row1.map((name, i) => (
                        <div
                            key={`r1-${i}`}
                            className="flex-shrink-0 bg-card border border-border theatrical-shape px-6 py-2.5 shadow-sm"
                        >
                            <span className="text-sm font-medium text-foreground/70 whitespace-nowrap">
                                {name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Row 2 */}
            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                <div className="flex gap-4 animate-marquee-right">
                    {row2.map((name, i) => (
                        <div
                            key={`r2-${i}`}
                            className="flex-shrink-0 bg-card border border-border rounded-full px-5 py-2.5 shadow-sm"
                        >
                            <span className="text-sm font-medium text-foreground/70 whitespace-nowrap">
                                {name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
