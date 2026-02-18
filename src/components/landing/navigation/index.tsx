"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/landing-content";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    LogOut,
    Menu,
    X,
} from "lucide-react";

interface ClientSession {
    user: {
        id: string;
        email: string;
        name: string;
        image?: string | null;
        role?: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

interface NavigationProps {
    isAdmin?: boolean;
    userRole?: string;
    clubRoles?: { clubId: string; role: string }[];
}

export function Navigation({ isAdmin, userRole, clubRoles }: NavigationProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { data } = authClient.useSession();
    const session = data as ClientSession | null;
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleSignOut = async () => {
        await authClient.signOut();
        window.location.href = "/";
    };

    const handleSignIn = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/my-tickets",
        });
    };

    const sessionIsAdmin =
        isAdmin ||
        session?.user?.role === "admin" ||
        session?.user?.role === "super-admin" ||
        userRole === "super-admin";

    // Toggle body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <>
            {/* Header / Logo bar */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "bg-[#FFF8F0]/80 backdrop-blur-md border-b border-[#4A3428]/5 py-3"
                    : "bg-transparent py-5"
                    }`}
            >
                <nav className="container mx-auto px-6 flex items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2 group relative z-[60]">
                        <span className="text-2xl font-bold text-[#2C1810] font-[family-name:var(--font-medieval-sharp)] group-hover:text-[#B7410E] transition-colors">
                            Espektro
                        </span>
                        <span className="text-[10px] font-bold text-[#8B2635] uppercase tracking-widest mt-1.5 font-[family-name:var(--font-roboto-slab)]">
                            &apos;26
                        </span>
                    </Link>

                    {/* Common Hamburger Trigger */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className={`group relative flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 z-[60] ${scrolled
                            ? "bg-[#2C1810] border-[#2C1810] text-white hover:bg-[#8B2635]"
                            : "bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                            }`}
                        aria-label="Toggle Menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </nav>
            </header>

            {/* Sidebar Navigation Drawer */}
            <aside
                className={`fixed inset-0 z-[100] transition-all duration-500 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            >
                {/* Backdrop Layer */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-700"
                    onClick={() => setIsOpen(false)}
                />

                {/* Drawer Content */}
                <div
                    className={`absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[#FBFAF3] text-[#2C1810] shadow-[0_0_50px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    {/* Tribal Border */}
                    <div
                        className="absolute top-0 left-0 bottom-0 w-8 bg-repeat-y bg-contain z-10"
                        style={{ backgroundImage: "url('/images/border2.webp')" }}
                    />

                    {/* Header in Drawer */}
                    <div className="flex items-center justify-between p-8 pl-16 border-b border-[#2C1810]/5">
                        <span className="text-xl font-bold font-[family-name:var(--font-medieval-sharp)] tracking-wider">
                            Menu
                        </span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="bg-[#2C1810]/5 hover:bg-[#2C1810]/10 w-10 h-10 rounded-full flex items-center justify-center transition-all group"
                            aria-label="Close Menu"
                        >
                            <X className="w-5 h-5 text-[#2C1810]/70 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    {/* Main Nav Links */}
                    <div className="flex-1 overflow-y-auto px-10 py-12 pl-16 custom-scrollbar">
                        <nav className="flex flex-col items-end gap-6 uppercase">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-medieval-sharp)] text-[#2C1810]/40 hover:text-[#B7410E] transition-all hover:scale-105 origin-right text-right"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="h-px w-24 bg-[#2C1810]/10 my-4" />

                            <Link
                                href="/events"
                                onClick={() => setIsOpen(false)}
                                className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-medieval-sharp)] text-[#2C1810]/40 hover:text-[#F4A900] transition-all hover:scale-105 origin-right text-right"
                            >
                                Events
                            </Link>

                            {/* Additional Auth-based links */}
                            {session && (
                                <div className="mt-6 flex flex-col items-end gap-4 border-t border-[#2C1810]/5 pt-8 w-full">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="text-2xl font-bold font-[family-name:var(--font-medieval-sharp)] text-[#2C1810]/30 hover:text-[#2C1810] transition-all text-right"
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        href="/my-tickets"
                                        onClick={() => setIsOpen(false)}
                                        className="text-2xl font-bold font-[family-name:var(--font-medieval-sharp)] text-[#2C1810]/30 hover:text-[#2C1810] transition-all text-right"
                                    >
                                        My Tickets
                                    </Link>
                                    {sessionIsAdmin && (
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsOpen(false)}
                                            className="text-2xl font-bold font-[family-name:var(--font-medieval-sharp)] text-[#8B2635] hover:text-[#B7410E] transition-all text-right"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                </div>
                            )}
                        </nav>
                    </div>

                    {/* Footer in Drawer (User Actions / Login) */}
                    <div className="p-8 pb-10 pl-16 border-t border-[#2C1810]/10 bg-[#2C1810]/5">
                        {!session ? (
                            <Button
                                onClick={handleSignIn}
                                variant="theatrical"
                                className="w-full h-11 bg-[#2C1810] hover:bg-[#4A3428] text-white font-bold uppercase tracking-[0.2em] shadow-lg transition-all font-[family-name:var(--font-roboto-slab)] text-xs"
                            >
                                Enter Espektro
                            </Button>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-end gap-3 px-2">
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-[#2C1810] font-[family-name:var(--font-roboto-slab)] truncate max-w-[150px]">
                                            {session.user.name}
                                        </p>
                                        <p className="text-[10px] text-[#2C1810]/40 uppercase tracking-widest font-bold">
                                            {session.user.role || "Member"}
                                        </p>
                                    </div>
                                    <Avatar className="h-12 w-12 ring-2 ring-[#2C1810]/10">
                                        <AvatarImage src={session.user.image || ""} />
                                        <AvatarFallback className="bg-[#B7410E] text-white font-bold">
                                            {session.user.name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <Button
                                    onClick={handleSignOut}
                                    variant="outline"
                                    className="w-full h-12 border-[#2C1810]/10 bg-white hover:bg-[#FFF8F0] text-[#2C1810]/60 hover:text-[#2C1810] rounded-full font-bold uppercase tracking-widest text-[10px]"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Disconnect
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
