"use client";

import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/data/landing-content";
import Magnetic from "../../ui/magnetic";
import { Instagram, Youtube, Facebook, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

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
        <div className="sticky bottom-0 z-0">
            <footer className="bg-[#423f3d] text-background h-[70vh] relative overflow-hidden">
                {/* <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <pattern id="footer-pattern" patternUnits="userSpaceOnUse" width="30" height="30">
                            <circle cx="15" cy="15" r="1" fill="currentColor" />
                        </pattern>
                        <rect fill="url(#footer-pattern)" width="100%" height="100%" />
                    </svg>
                </div> */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-[0.5] pointer-events-none -bottom-60"

                >
                    <Image
                        src="/images/background_web_2.png"
                        alt="Decorative lotus mandala"
                        width={1000}
                        height={800}
                        className="object-contain w-full "
                    />
                </motion.div>
                <div className="container mx-auto px-4 lg:px-8 relative z-10 mt-10">
                    <div className="py-12 lg:py-16 grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                        <div className="lg:col-span-2">
                            <Magnetic>
                                <Link href="/" className="inline-block mb-4">
                                    <div className="flex items-center gap-3">
                                        {/* <Image
                                            src="/espektro-logo.svg"
                                            alt="Espektro Logo"
                                            width={40}
                                            height={40}
                                            className="w-10 h-10 object-contain"
                                        /> */}
                                        <div className="flex items-center">
                                            <span className="text-7xl font-bold text-primary font-[family-name:var(--font-medieval-sharp)] tracking-wider">
                                                Espektro
                                            </span>
                                            <span className="text-[10px] font-bold text-background/50 bg-background/10 px-2 py-0.5 rounded ml-2 font-[family-name:var(--font-roboto-slab)] tracking-[0.2em]">
                                                2K26
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </Magnetic>
                            <p className="text-background/60 leading-relaxed max-w-sm font-[family-name:var(--font-open-sans)] text-sm">
                                The annual techno-management cultural fest of Kalyani Government Engineering College.
                                Evolution of Bengali Culture.
                            </p>
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <p className="text-[10px] text-background/40 font-[family-name:var(--font-roboto-slab)] uppercase tracking-[0.2em]">
                                    © 2026 Espektro KGEC. All rights reserved.
                                </p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-primary font-bold mb-6 text-sm md:text-base uppercase tracking-[0.3em] font-[family-name:var(--font-roboto-slab)]">
                                Explore
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.explore.map((link) => (
                                    <li key={link.label}>
                                        <Magnetic>
                                            <a href={link.href} className="text-xl md:text-2xl text-background/70 hover:text-primary transition-colors inline-block font-[family-name:var(--font-medieval-sharp)] uppercase tracking-tight">
                                                {link.label}
                                            </a>
                                        </Magnetic>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-primary font-bold mb-6 text-sm md:text-base uppercase tracking-[0.3em] font-[family-name:var(--font-roboto-slab)]">
                                Participate
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.participate.map((link) => (
                                    <li key={link.label}>
                                        <Magnetic>
                                            <Link href={link.href} className="text-xl md:text-2xl text-background/70 hover:text-primary transition-colors inline-block font-[family-name:var(--font-medieval-sharp)] uppercase tracking-tight">
                                                {link.label}
                                            </Link>
                                        </Magnetic>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-primary font-bold mb-6 text-sm md:text-base uppercase tracking-[0.3em] font-[family-name:var(--font-roboto-slab)]">
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
        </div>
    );
}
