"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { sponsors } from "@/data/landing-content";

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

    return (
        <section ref={ref} id="sponsors" className="py-24 lg:py-36 bg-muted/40">
            <div className="container mx-auto px-6 lg:px-8">
                <div className={`text-center mb-16 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <p className="text-[#B7410E] text-xs uppercase tracking-[0.3em] mb-5 font-semibold">Our Partners</p>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Proudly Supported By
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        We are grateful to our sponsors and partners who make Espektro possible.
                    </p>
                </div>

                <div className="space-y-12 max-w-4xl mx-auto">
                    {sponsors.map((tier, ti) => (
                        <div
                            key={tier.label}
                            className={`transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                            style={{ transitionDelay: `${ti * 100}ms` }}
                        >
                            <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-5">
                                {tier.label}
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                {tier.items.map((name) => (
                                    <div
                                        key={name}
                                        className="bg-card border border-border rounded-xl px-6 py-4 lg:px-8 lg:py-5 hover:border-[#B7410E]/30 hover:shadow-md transition-all"
                                    >
                                        <span className={`font-bold text-foreground/80 hover:text-foreground transition-colors ${tier.size}`}>
                                            {name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sponsor CTA */}
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
