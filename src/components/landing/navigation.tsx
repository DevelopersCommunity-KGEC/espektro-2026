"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { navLinks } from "@/data/landing-content";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Ticket, Menu, LayoutDashboard } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
    SheetTitle,
} from "@/components/ui/sheet";

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

export function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const { data } = authClient.useSession();
    const session = data as ClientSession | null;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleSignOut = async () => {
        await authClient.signOut();
        window.location.reload();
    };

    const isAdmin =
        session?.user?.role === "admin" || session?.user?.role === "super-admin";

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm"
                    : "bg-transparent"
                }`}
        >
            <nav className="container mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-serif text-xl font-bold text-foreground">
                            Espektro
                        </span>
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
                            &apos;26
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="px-3 py-2 text-[11px] font-medium text-foreground/70 hover:text-[#B7410E] transition-colors uppercase tracking-wider"
                            >
                                {link.label}
                            </a>
                        ))}

                        <div className="h-4 w-px bg-border/50 mx-2" />

                        {!session ? (
                            <Link
                                href="/login"
                                className="bg-[#B7410E] hover:bg-[#9A3008] text-white px-5 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors rounded-sm"
                            >
                                Login
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/events"
                                    className="px-3 py-2 text-[11px] font-medium text-foreground/70 hover:text-[#B7410E] transition-colors uppercase tracking-wider"
                                >
                                    All Events
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="relative h-9 w-9 rounded-full ring-2 ring-border/50 hover:ring-[#B7410E]/50 transition-all focus:outline-none">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage
                                                    src={session.user.image || ""}
                                                    alt={session.user.name}
                                                />
                                                <AvatarFallback className="text-xs">
                                                    {session.user.name?.charAt(0) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56"
                                        align="end"
                                        sideOffset={8}
                                    >
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {session.user.name}
                                                </p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {session.user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/my-tickets" className="cursor-pointer">
                                                <Ticket className="mr-2 h-4 w-4" />
                                                My Tickets
                                            </Link>
                                        </DropdownMenuItem>
                                        {isAdmin && (
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard" className="cursor-pointer">
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    Admin Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleSignOut}
                                            className="cursor-pointer text-destructive focus:text-destructive"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-72">
                                <SheetTitle className="font-serif text-xl mb-6">
                                    Espektro &apos;26
                                </SheetTitle>
                                <div className="flex flex-col gap-1">
                                    {/* App links */}
                                    <SheetClose asChild>
                                        <Link
                                            href="/events"
                                            className="py-2.5 px-3 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                                        >
                                            All Events
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link
                                            href="/my-tickets"
                                            className="py-2.5 px-3 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                                        >
                                            My Tickets
                                        </Link>
                                    </SheetClose>
                                    {isAdmin && (
                                        <SheetClose asChild>
                                            <Link
                                                href="/dashboard"
                                                className="py-2.5 px-3 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        </SheetClose>
                                    )}

                                    <div className="h-px bg-border my-3" />

                                    {/* Section links */}
                                    {navLinks.map((link) => (
                                        <SheetClose key={link.href} asChild>
                                            <a
                                                href={link.href}
                                                className="py-2.5 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                                            >
                                                {link.label}
                                            </a>
                                        </SheetClose>
                                    ))}

                                    <div className="h-px bg-border my-3" />

                                    {!session ? (
                                        <SheetClose asChild>
                                            <Link href="/login">
                                                <Button className="w-full bg-[#B7410E] hover:bg-[#9A3008]">
                                                    Login
                                                </Button>
                                            </Link>
                                        </SheetClose>
                                    ) : (
                                        <div className="flex items-center gap-3 px-3 py-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={session.user.image || ""}
                                                    alt={session.user.name}
                                                />
                                                <AvatarFallback className="text-xs">
                                                    {session.user.name?.charAt(0) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {session.user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {session.user.email}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 shrink-0"
                                                onClick={handleSignOut}
                                            >
                                                <LogOut className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>
        </header>
    );
}
