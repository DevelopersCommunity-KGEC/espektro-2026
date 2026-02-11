"use client";

import Link from "next/link";
import { navLinks } from "@/data/landing-content";
import Magnetic from "../../ui/magnetic";
import { Instagram, Youtube, Facebook, Linkedin } from "lucide-react";

const footerLinks = {
    explore: navLinks,
    participate: [
        { label: "Buy Tickets", href: "/events" },
        { label: "Register Team", href: "/events" },
        { label: "Become a Sponsor", href: "mailto:sponsorship.espektro@gmail.com" },
    ],
    connect: [
        { label: "Instagram", href: "https://instagram.com/espektro_kgec", icon: Instagram },
        { label: "YouTube", href: "https://youtube.com/@espektro_kgec", icon: Youtube },
        { label: "Facebook", href: "https://facebook.com/espektrokgec", icon: Facebook },
        { label: "LinkedIn", href: "https://linkedin.com/company/espektro-kgec", icon: Linkedin },
    ],
};

export function Footer() {
    return (
        <footer className="bg-foreground text-background relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="footer-pattern" patternUnits="userSpaceOnUse" width="30" height="30">
                        <circle cx="15" cy="15" r="1" fill="currentColor" />
                    </pattern>
                    <rect fill="url(#footer-pattern)" width="100%" height="100%" />
                </svg>
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="py-12 lg:py-16 grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    <div className="lg:col-span-2">
                        <Magnetic>
                            <Link href="/" className="inline-block mb-4">
                                <span className="font-serif text-3xl font-bold text-primary">
                                    Espektro
                                </span>
                                <span className="text-xs font-medium text-background/50 bg-background/10 px-2 py-0.5 rounded ml-2">
                                    2K26
                                </span>
                            </Link>
                        </Magnetic>
                        <p className="text-background/60 leading-relaxed max-w-sm">
                            The annual techno-management cultural fest of Kalyani Government Engineering College.
                            Evolution of Bengali Culture.
                        </p>
                        <div className="mt-8 pt-8 border-t border-white/10">
                            <p className="text-xs text-background/40">
                                © 2026 Espektro KGEC. All rights reserved.
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-primary font-bold mb-6 text-sm uppercase tracking-widest">
                            Explore
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.explore.map((link) => (
                                <li key={link.label}>
                                    <Magnetic>
                                        <a href={link.href} className="text-sm text-background/70 hover:text-primary transition-colors inline-block">
                                            {link.label}
                                        </a>
                                    </Magnetic>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-primary font-bold mb-6 text-sm uppercase tracking-widest">
                            Participate
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.participate.map((link) => (
                                <li key={link.label}>
                                    <Magnetic>
                                        <Link href={link.href} className="text-sm text-background/70 hover:text-primary transition-colors inline-block">
                                            {link.label}
                                        </Link>
                                    </Magnetic>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-primary font-bold mb-6 text-sm uppercase tracking-widest">
                            Connect
                        </h4>
                        <ul className="flex flex-wrap gap-4">
                            {footerLinks.connect.map((link) => (
                                <li key={link.label}>
                                    <Magnetic>
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-background/5 text-background/70 transition-all duration-300 group"
                                            title={link.label}
                                        >
                                            <link.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </a>
                                    </Magnetic>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </footer>
    );
}
