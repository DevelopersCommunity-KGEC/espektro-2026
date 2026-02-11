"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { sponsorLogos as SPONSORS } from "@/data/landing-content";

export function Sponsors() {
    const ref = useRef<HTMLElement>(null);
    const [vis, setVis] = useState(false);

    useEffect(() => {
        const o = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) setVis(true);
        }, { threshold: 0.1 });
        if (ref.current) o.observe(ref.current);
        return () => o.disconnect();
    }, []);

    const midIndex = Math.floor(SPONSORS.length / 2);
    const row1 = SPONSORS.slice(0, midIndex);
    const row2 = SPONSORS.slice(midIndex);

    return (
        <section ref={ref} id="sponsors" className="py-24 lg:py-36 bg-muted/20 overflow-hidden">
            <div className="container mx-auto px-6 lg:px-8">
                <div className={`text-center mb-16 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <p className="text-[#B7410E] text-xs uppercase tracking-[0.3em] mb-5 font-semibold">Our Partners</p>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Proudly Supported By
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        We appreciate the efforts and generosity of our sponsors in supporting Espektro.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                    {SPONSORS.map((s) => (
                        <SponsorCard key={s.id} sponsor={s} />
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-8">
                <div className={`mt-20 text-center bg-card border border-border rounded-2xl p-8 lg:p-12 max-w-2xl mx-auto transition-all duration-700 delay-500 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                        Want to Partner with Us?
                    </h3>
                    <p className="text-muted-foreground mb-6 text-sm">
                        Get unprecedented exposure to 15,000+ engaged students across four days.
                    </p>
                    <Button
                        asChild
                        className="bg-[#B7410E] hover:bg-[#9a370c] text-white font-medium rounded-full"
                    >
                        <a href="mailto:sponsorship.espektro@gmail.com">
                            <Mail className="w-4 h-4 mr-2" />
                            Become a Sponsor
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
}

function SponsorCard({ sponsor }: { sponsor: { id: number; sponsor: string; url: string } }) {
    return (
        <div className="w-full h-40 group/card relative p-4 bg-white/5 rounded-2xl backdrop-blur-sm transition-all hover:bg-white/10">
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
                <div className="flex-[2] flex items-center justify-center max-h-[60%] w-full relative">
                    <Image
                        src={sponsor.url}
                        alt={sponsor.sponsor}
                        fill
                        className="object-contain grayscale brightness-125 transition-all group-hover/card:grayscale-0 group-hover/card:brightness-100"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                </div>
                <div className="flex-1 flex items-center justify-center w-full px-2">
                    <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight transition-all group-hover/card:font-bold group-hover/card:text-foreground">
                        {sponsor.sponsor}
                    </p>
                </div>
            </div>
        </div>
    );
}
