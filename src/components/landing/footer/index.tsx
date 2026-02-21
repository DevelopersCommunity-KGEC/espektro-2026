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
            <footer className="bg-[#423f3d] text-background min-h-[70vh] md:h-[70vh] relative overflow-hidden flex flex-col justify-end">
                <motion.div
                    className="absolute inset-0 -bottom-[50%] flex items-center justify-center opacity-[0.4] pointer-events-none"
                >
                    <Image
                        src="/images/background_web_2.webp"
                        alt="Decorative lotus mandala"
                        fill
                        className="object-contain hidden md:block"
                    />
                    <Image
                        src="/images/background_web_2_mobile.webp"
                        alt="Decorative lotus mandala"
                        fill
                        className="object-contain w-fit md:hidden bottom-50"
                    />
                </motion.div>
                <div className="container mx-auto px-6 lg:px-8 relative z-10 py-12 md:py-16">
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-12 lg:gap-12">
                        <div className="col-span-2 lg:col-span-2 pt-24 md:pt-0">

                            <Link href="/" className="inline-block mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center">
                                        <span className="text-5xl md:text-7xl font-bold text-primary font-[family-name:var(--font-medieval-sharp)] tracking-wider">
                                            Espektro 26
                                        </span>

                                    </div>
                                </div>
                            </Link>

                            <p className="text-background/60 leading-relaxed max-w-sm font-[family-name:var(--font-open-sans)] text-sm md:text-base">
                                The annual techno-management cultural fest of Kalyani Government Engineering College.
                                Evolution of Bengali Culture.
                            </p>
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <p className="text-[10px] text-background/40 font-[family-name:var(--font-roboto-slab)] uppercase tracking-[0.2em]">
                                    © 2026 Espektro KGEC. All rights reserved.
                                </p>
                            </div>
                        </div>

                        <div className="col-span-1">
                            <h4 className="text-primary font-bold mb-6 text-sm uppercase tracking-[0.3em] font-[family-name:var(--font-roboto-slab)]">
                                Explore
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.explore.map((link) => (
                                    <li key={link.label}>
                                        <Magnetic>
                                            <a href={link.href} className="text-lg md:text-2xl text-background/70 hover:text-primary transition-colors inline-block font-[family-name:var(--font-medieval-sharp)] uppercase tracking-tight">
                                                {link.label}
                                            </a>
                                        </Magnetic>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="col-span-1">
                            <h4 className="text-primary font-bold mb-6 text-sm uppercase tracking-[0.3em] font-[family-name:var(--font-roboto-slab)]">
                                Participate
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.participate.map((link) => (
                                    <li key={link.label}>
                                        <Magnetic>
                                            <Link href={link.href} className="text-lg md:text-2xl text-background/70 hover:text-primary transition-colors inline-block font-[family-name:var(--font-medieval-sharp)] uppercase tracking-tight">
                                                {link.label}
                                            </Link>
                                        </Magnetic>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <h4 className="text-primary font-bold mb-6 text-sm uppercase tracking-[0.3em] font-[family-name:var(--font-roboto-slab)]">
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
