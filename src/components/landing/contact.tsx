"use client";

import { useRef, useEffect, useState } from "react";
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
            className="py-20 lg:py-32 bg-muted relative overflow-hidden"
        >
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <div
                    className={`text-center mb-12 lg:mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
                        Get in Touch
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                        Contact <span className="text-primary">Us</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Have questions? Reach out to our organizing team.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Contact Information */}
                    <div
                        className={`transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                            }`}
                    >
                        {/* Venue Card */}
                        <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 mb-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="bg-primary/10 rounded-full p-3">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                                        Venue
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Kalyani Government Engineering College
                                        <br />
                                        Kalyani, Nadia
                                        <br />
                                        West Bengal - 741235
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 mb-6">
                                <div className="bg-secondary/10 rounded-full p-3">
                                    <Clock className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                                        Event Dates
                                    </h3>
                                    <p className="text-muted-foreground">
                                        March 2026 (Exact dates TBA)
                                        <br />
                                        <span className="text-sm">4 Days of Non-Stop Action</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-accent/10 rounded-full p-3">
                                    <Mail className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                                        Email
                                    </h3>
                                    <a
                                        href="mailto:sponsorship.espektro@gmail.com"
                                        className="text-primary hover:underline underline-offset-4"
                                    >
                                        sponsorship.espektro@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Map Embed Placeholder */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-card">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3668.0851168391!2d88.42987851496463!3d22.965785884946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8994c9a2a7e3b%3A0x9dd42b0e5c7c5eb8!2sKalyani%20Government%20Engineering%20College!5e0!3m2!1sen!2sin!4v1612345678901"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="KGEC Location"
                                className="absolute inset-0"
                            />
                            <a
                                href="https://maps.google.com/?q=Kalyani+Government+Engineering+College"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium text-foreground hover:bg-card transition-colors"
                            >
                                Open in Maps
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Contact Cards */}
                    <div
                        className={`transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                            }`}
                    >
                        <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                            Organizing Committee
                        </h3>
                        <div className="space-y-4">
                            {contacts.map((contact, index) => (
                                <div
                                    key={contact.name}
                                    className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                                {contact.name}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {contact.role}
                                            </p>
                                        </div>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="rounded-full bg-transparent"
                                        >
                                            <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                                                <Phone className="w-4 h-4 mr-2" />
                                                Call
                                            </a>
                                        </Button>
                                    </div>
                                    <p className="mt-3 text-foreground font-medium">
                                        {contact.phone}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Quick Links */}
                        <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                            <h4 className="font-serif text-lg font-bold text-foreground mb-4">
                                Quick Links
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <a
                                    href="#events"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Event Schedule
                                </a>
                                <a
                                    href="#tickets"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Buy Tickets
                                </a>
                                <a
                                    href="#sponsors"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Sponsorship
                                </a>
                                <a
                                    href="#gallery"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Gallery
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
