"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contacts } from "@/data/landing-content";

export function Contact() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="contact"
            className="py-20 lg:py-32 relative z-10 "
            style={{ backgroundColor: "#FFF8F0" }}
        >
            {/* Lotus Mandala Background - Centered and Subtle */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
                <Image
                    src="/images/360_F_1706070199_WZV67PDH1xx2nGjbDWR2M7U3bc4CsQi8.webp"
                    alt="Decorative lotus mandala"
                    width={800}
                    height={600}
                    className="object-contain"
                />
            </div>

            {/* Left Tribal Border Pattern */}
            <div
                className="absolute top-0 left-0 bottom-0 w-16 md:w-24 overflow-hidden hidden sm:block"
                style={{
                    backgroundImage: 'url(/images/43a0b75b3caae95caa70550adda8ed60.webp)',
                    backgroundRepeat: 'repeat-y',
                    backgroundSize: '100% auto',
                    backgroundPosition: 'top center'
                }}
            />
            <div className="container mx-auto px-4 lg:px-24 relative z-10 pl-4 sm:pl-20 md:pl-28 lg:pl-32">
                {/* Section Header */}
                <div
                    className={`flex flex-col items-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    <p className="text-lg md:text-xl text-[#8B2635] tracking-wide mb-3 font-medium uppercase font-[family-name:var(--font-roboto-slab)] text-center">
                        Get in Touch
                    </p>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl text-[#2C1810] mb-6 leading-[1.1] font-[family-name:var(--font-medieval-sharp)] text-center">
                        Contact <span className="text-[#B7410E]">Us</span>
                    </h2>
                    <p className="text-[#4A3428]/80 max-w-2xl mx-auto text-center font-[family-name:var(--font-open-sans)] text-sm md:text-lg">
                        Have questions? Reach out to our organizing team for information about tickets, events, or sponsorship opportunities.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Contact Information */}
                    <div
                        className={`transition-all duration-700 delay-100 h-full ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                            }`}
                    >
                        {/* Venue Block */}
                        <div className="bg-white/70 backdrop-blur-md border-2 [#B7410E]/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 lg:p-8 h-full flex flex-col justify-center">
                            <div className="flex items-start gap-5 mb-8">
                                <div className="bg-[#8B2635]/10 rounded-2xl p-4 flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-[#8B2635]" />
                                </div>
                                <div>
                                    <h3 className="font-[family-name:var(--font-medieval-sharp)] text-2xl text-[#2C1810] mb-2">
                                        Venue
                                    </h3>
                                    <p className="text-[#4A3428] leading-relaxed opacity-80 font-medium">
                                        Kalyani Government Engineering College
                                        <br />
                                        Kalyani, Nadia, West Bengal - 741235
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 mb-8">
                                <div className="bg-[#B7410E]/10 rounded-2xl p-4 flex-shrink-0">
                                    <Clock className="w-6 h-6 text-[#B7410E]" />
                                </div>
                                <div>
                                    <h3 className="font-[family-name:var(--font-medieval-sharp)] text-2xl text-[#2C1810] mb-2">
                                        Event Dates
                                    </h3>
                                    <p className="text-[#4A3428] opacity-80 font-medium">
                                        March 2026 (Dates TBA)
                                        <br />
                                        <span className="text-sm font-bold uppercase tracking-widest text-[#B7410E]/80">4 Days of Spectacle</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5">
                                <div className="bg-[#8B2635]/10 rounded-2xl p-4 flex-shrink-0">
                                    <Mail className="w-6 h-6 text-[#8B2635]" />
                                </div>
                                <div>
                                    <h3 className="font-[family-name:var(--font-medieval-sharp)] text-2xl text-[#2C1810] mb-2">
                                        Email
                                    </h3>
                                    <a
                                        href="mailto:espektrokgec@gmail.com"
                                        className="text-[#B7410E] hover:text-[#8B2635] font-bold underline underline-offset-4 transition-colors"
                                    >
                                        espektrokgec@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Map Embed */}
                        {/* <div className="relative aspect-video rounded-3xl overflow-hidden border border-[#4A3428]/10 shadow-xl group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.907823258028!2d88.44954007505136!3d22.99041681752783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f895327fbf3adb%3A0xabd136dfaf4f1628!2sEspektro%20Ground!5e0!3m2!1sen!2sus!4v1770658553857!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="group-hover:grayscale-0 transition-all duration-1000"
                            />
                            <a
                                href="https://maps.google.com/?q=Kalyani+Government+Engineering+College"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-bold text-[#2C1810] hover:bg-[#8B2635] hover:text-white transition-all shadow-lg"
                            >
                                Open in Maps
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div> */}
                    </div>

                    {/* Committee Cards */}
                    <div
                        className={`transition-all duration-700 delay-200 h-full min-h-[350px] lg:min-h-0 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                            }`}
                    >
                        <div className="bg-white/70 backdrop-blur-md border-2 border-[#4A3428]/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl h-full overflow-hidden relative group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.907823258028!2d88.44954007505136!3d22.99041681752783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f895327fbf3adb%3A0xabd136dfaf4f1628!2sEspektro%20Ground!5e0!3m2!1sen!2sus!4v1770658553857!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="group-hover:grayscale-0 transition-all duration-1000"
                            />
                            <a
                                href="https://maps.google.com/?q=Kalyani+Government+Engineering+College"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-bold text-[#2C1810] hover:bg-[#8B2635] hover:text-white transition-all shadow-lg z-10"
                            >
                                Open in Maps
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                        {/* <h3 className="font-[family-name:var(--font-medieval-sharp)] text-3xl text-[#2C1810] mb-8">
                            Organizing Committee
                        </h3>
                        <div className="space-y-5">
                            {contacts.map((contact, index) => (
                                <div
                                    key={contact.name}
                                    className="bg-white/80 border border-[#4A3428]/5 rounded-2xl p-6 hover:border-[#B7410E]/30 hover:shadow-2xl transition-all duration-300 group shadow-sm"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-[family-name:var(--font-medieval-sharp)] text-xl text-[#2C1810] group-hover:text-[#B7410E] transition-colors mb-1">
                                                {contact.name}
                                            </h4>
                                            <p className="text-xs font-bold uppercase tracking-widest text-[#8B2635] opacity-80">
                                                {contact.role}
                                            </p>
                                        </div>
                                        <Button
                                            asChild
                                            variant="theatrical"
                                            className="bg-[#B7410E] hover:bg-[#8B2635] text-white shadow-md hover:shadow-lg transition-all h-10 shrink-0 font-[family-name:var(--font-roboto-slab)] uppercase text-[10px] tracking-[0.1em]"
                                        >
                                            <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                                                <Phone className="w-3 h-3 md:mr-2" />
                                                <span className="hidden md:inline">Call Now</span>
                                            </a>
                                        </Button>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-[#4A3428]/5">
                                        <p className="text-[#2C1810] font-bold tracking-widest font-[family-name:var(--font-open-sans)]">
                                            {contact.phone}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        
                        <div className="mt-10 p-8 bg-[#B7410E]/5 rounded-3xl border border-[#B7410E]/10 shadow-sm">
                            <h4 className="font-[family-name:var(--font-medieval-sharp)] text-xl text-[#2C1810] mb-6">
                                Quick Navigation
                            </h4>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                <a href="#events" className="text-sm font-bold text-[#4A3428]/70 hover:text-[#B7410E] transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#B7410E]" /> Event Schedule
                                </a>
                                <a href="#tickets" className="text-sm font-bold text-[#4A3428]/70 hover:text-[#B7410E] transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#B7410E]" /> Buy Tickets
                                </a>
                                <a href="#sponsors" className="text-sm font-bold text-[#4A3428]/70 hover:text-[#B7410E] transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#B7410E]" /> Sponsorship
                                </a>
                                <a href="#gallery" className="text-sm font-bold text-[#4A3428]/70 hover:text-[#B7410E] transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#B7410E]" /> Media Gallery
                                </a>
                            </div>
                        </div> */}

                    </div>
                </div>
            </div>
            <div className="absolute -bottom-17 left-0 w-full h-18 md:h-24 -translate-y-[50%]  pointer-events-none overflow-hidden rounded-b-4xl">
                <div className="flex justify-center h-full w-max mx-auto flex-nowrap">
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className="relative h-full aspect-[4/1] flex-shrink-0 -mx-14">
                            <Image
                                src="/images/shapartist.webp"
                                alt=""
                                fill
                                className="object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}