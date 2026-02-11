"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import {
    LogOut,
    Ticket,
    Menu,
    LayoutDashboard,
    User,
    ScanLine,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
    SheetTitle,
    SheetDescription,
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

interface NavigationProps {
    isAdmin?: boolean;
    userRole?: string;
    clubRoles?: { clubId: string; role: string }[];
}

export function Navigation({ isAdmin, userRole, clubRoles }: NavigationProps) {
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

    const hasClubs = clubRoles && clubRoles.length > 0;

    const activeClubRole = hasClubs
        ? clubRoles!.find((cr) => pathname.startsWith(`/club/${cr.clubId}`))
        : null;

    // App navigation items for mobile sheet
    const appLinks = [
        { name: "All Events", href: "/events" },
        { name: "My Tickets", href: "/my-tickets" },
        ...(hasClubs ? [{ name: "Scan Ticket", href: "/scan" }] : []),
        ...(sessionIsAdmin
            ? [{ name: "Admin Dashboard", href: "/dashboard" }]
            : []),
    ];

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
                        {/* Landing page section links */}
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
                            <Button
                                onClick={handleSignIn}
                                className="bg-[#B7410E] hover:bg-[#9A3008] text-white px-5 py-2 text-[11px] font-bold uppercase tracking-widest rounded-sm"
                            >
                                Login
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2">
                                {/* Events link */}
                                <Link
                                    href="/events"
                                    className="px-3 py-2 text-[11px] font-medium text-foreground/70 hover:text-[#B7410E] transition-colors uppercase tracking-wider"
                                >
                                    Events
                                </Link>

                                {/* Club switcher dropdown */}
                                {hasClubs && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="px-3 py-2 text-[11px] font-medium text-foreground/70 hover:text-[#B7410E] transition-colors uppercase tracking-wider focus:outline-none flex items-center gap-1 h-auto hover:bg-transparent">
                                                <LayoutDashboard className="h-3.5 w-3.5" />
                                                {activeClubRole ? (
                                                    <span className="capitalize">
                                                        {activeClubRole.clubId}
                                                    </span>
                                                ) : (
                                                    <span>Clubs</span>
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            sideOffset={8}
                                        >
                                            <DropdownMenuLabel>
                                                Switch Club
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {clubRoles?.map((cr) => (
                                                <DropdownMenuItem
                                                    key={cr.clubId}
                                                    asChild
                                                    className="focus:bg-primary/10 focus:text-primary focus:outline-none"
                                                >
                                                    <Link
                                                        href={`/club/${cr.clubId}/dashboard`}
                                                        className="flex justify-between items-center w-full"
                                                    >
                                                        <span className="capitalize">
                                                            {cr.clubId}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded ml-2 capitalize">
                                                            {cr.role.replace(
                                                                "-",
                                                                " "
                                                            )}
                                                        </span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}

                                {/* User avatar dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-9 w-9 rounded-full 
                                        ring-2 ring-border/50 hover:ring-[#B7410E]/50 transition-all focus:outline-none p-0 hover:bg-transparent">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage
                                                    src={
                                                        session.user.image || ""
                                                    }
                                                    alt={session.user.name}
                                                />
                                                <AvatarFallback className="text-xs">
                                                    {session.user.name?.charAt(
                                                        0
                                                    ) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56 bg-background"
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
                                        <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary focus:outline-none focus:[&_svg]:text-primary">
                                            <Link
                                                href="/my-tickets"
                                                className="cursor-pointer"
                                            >
                                                <Ticket className="mr-2 h-4 w-4" />
                                                My Tickets
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary focus:outline-none focus:[&_svg]:text-primary">
                                            <Link
                                                href="/profile"
                                                className="cursor-pointer"
                                            >
                                                <User className="mr-2 h-4 w-4" />
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        {hasClubs && (
                                            <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary focus:outline-none focus:[&_svg]:text-primary">
                                                <Link
                                                    href="/scan"
                                                    className="cursor-pointer"
                                                >
                                                    <ScanLine className="mr-2 h-4 w-4" />
                                                    Scan Ticket
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        {sessionIsAdmin && (
                                            <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary focus:outline-none focus:[&_svg]:text-primary">
                                                <Link
                                                    href="/dashboard"
                                                    className="cursor-pointer"
                                                >
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    Admin Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleSignOut}
                                            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 focus:outline-none focus:[&_svg]:text-destructive"
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
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-72">
                                <SheetTitle className="font-serif text-xl mb-6">
                                    Espektro &apos;26
                                </SheetTitle>
                                <SheetDescription className="sr-only">
                                    Site navigation
                                </SheetDescription>
                                <div className="flex flex-col gap-1">
                                    {/* App links */}
                                    {appLinks.map((item) => (
                                        <SheetClose key={item.href} asChild>
                                            <Link
                                                href={item.href}
                                                className="py-2.5 px-3 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        </SheetClose>
                                    ))}
                                    {session && (
                                        <SheetClose asChild>
                                            <Link
                                                href="/profile"
                                                className="py-2.5 px-3 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                                            >
                                                Profile
                                            </Link>
                                        </SheetClose>
                                    )}

                                    {/* Club links in mobile */}
                                    {hasClubs && (
                                        <>
                                            <div className="h-px bg-border my-3" />
                                            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                                My Clubs
                                            </p>
                                            {clubRoles?.map((cr) => (
                                                <SheetClose
                                                    key={cr.clubId}
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/club/${cr.clubId}/dashboard`}
                                                        className="flex items-center justify-between py-2.5 px-3 text-sm rounded-md transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                                                    >
                                                        <span className="capitalize">
                                                            {cr.clubId}
                                                        </span>
                                                        <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded capitalize">
                                                            {cr.role.replace(
                                                                "-",
                                                                " "
                                                            )}
                                                        </span>
                                                    </Link>
                                                </SheetClose>
                                            ))}
                                        </>
                                    )}

                                    <div className="h-px bg-border my-3" />

                                    {/* Section links */}
                                    <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                        On this page
                                    </p>
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

                                    {/* Auth section */}
                                    {!session ? (
                                        <SheetClose asChild>
                                            <Button
                                                onClick={handleSignIn}
                                                className="w-full bg-[#B7410E] hover:bg-[#9A3008]"
                                            >
                                                Login
                                            </Button>
                                        </SheetClose>
                                    ) : (
                                        <div className="flex items-center gap-3 px-3 py-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={
                                                        session.user.image || ""
                                                    }
                                                    alt={session.user.name}
                                                />
                                                <AvatarFallback className="text-xs">
                                                    {session.user.name?.charAt(
                                                        0
                                                    ) || "U"}
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
