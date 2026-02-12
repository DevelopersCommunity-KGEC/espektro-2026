"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Correct hook for app router
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, Ticket, User, LogOut, LayoutDashboard, ScanLine } from "lucide-react";

interface NavbarProps {
    isAdmin?: boolean;
    userRole?: string;
    clubRoles?: { clubId: string; role: string }[];
}

export function Navbar({ isAdmin, userRole, clubRoles }: NavbarProps) {
    const { data: session } = authClient.useSession();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Hide global navbar on landing page as it has its own dedicated navigation
    if (pathname === "/") {
        return null;
    }

    const handleSignOut = async () => {
        await authClient.signOut();
        window.location.href = "/";
    };

    const handleSignIn = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/my-tickets"
        });
    };

    const getAdminLink = () => {
        const sessionRole = (session?.user as any)?.role;
        if (isAdmin || userRole === "super-admin" || sessionRole === "admin" || sessionRole === "super-admin") {
            return { name: "Admin Dashboard", href: "/dashboard" };
        }
        return null;
    };

    // Determine the active club dashboard link if authorized
    // Use Dropdown for multiple clubs
    const hasClubs = clubRoles && clubRoles.length > 0;

    const adminLink = getAdminLink();

    const activeClubRole = hasClubs
        ? clubRoles!.find((cr) => pathname.startsWith(`/club/${cr.clubId}`))
        : null;

    const navItems = [
        { name: "Events", href: "/events" },
        { name: "My Tickets", href: "/my-tickets" },
        ...(hasClubs ? [{ name: "Scan Ticket", href: "/scan" }] : []),
        ...(adminLink ? [adminLink] : []),
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold tracking-tighter">
                            ESPEKTRO <span className="text-primary">2026</span>
                        </span>
                    </Link>
                    <div className="hidden md:flex gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === item.href
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {hasClubs && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="hidden md:flex gap-2 items-center h-auto py-2">
                                    {activeClubRole ? (
                                        <div className="flex flex-col items-start leading-none gap-1">
                                            <span className="font-semibold capitalize text-sm">{activeClubRole.clubId}</span>
                                            <span className="text-[10px] text-muted capitalize">{activeClubRole.role.replace('-', ' ')}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <LayoutDashboard className="h-4 w-4" />
                                            <span>Manage Clubs</span>
                                        </>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-background" align="end">
                                <DropdownMenuLabel>Switch Club</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {clubRoles?.map((cr) => (
                                    <DropdownMenuItem
                                        key={cr.clubId}
                                        asChild
                                        className="focus:bg-primary/10 focus:text-primary focus:outline-none"
                                    >
                                        <Link href={`/club/${cr.clubId}/dashboard`} className="flex justify-between items-center w-full">
                                            <span className="capitalize">{cr.clubId}</span>
                                            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded ml-2 capitalize group-hover:text-foreground">
                                                {cr.role.replace("-", " ")}
                                            </span>
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                                        <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-background" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {session.user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary focus:outline-none focus:[&_svg]:text-primary">
                                    <Link href="/my-tickets" className="cursor-pointer">
                                        <Ticket className="mr-2 h-4 w-4" />
                                        <span>My Tickets</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary focus:outline-none focus:[&_svg]:text-primary">
                                    <Link href="/profile" className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                {hasClubs && (
                                    <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary focus:outline-none focus:[&_svg]:text-primary">
                                        <Link href="/scan" className="cursor-pointer">
                                            <ScanLine className="mr-2 h-4 w-4" />
                                            <span>Scan Ticket</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                {/* Admin Link again here for convenience */}
                                {adminLink && (
                                    <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary focus:outline-none focus:[&_svg]:text-primary">
                                        <Link href={adminLink.href} className="cursor-pointer">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>{adminLink.name}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleSignOut}
                                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 focus:outline-none focus:[&_svg]:text-destructive"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button onClick={handleSignIn} size="sm">
                            Login
                        </Button>
                    )}

                    {/* Mobile Menu */}
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[80%] max-w-75 pt-10">
                            <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                            <SheetDescription className="sr-only">Site navigation</SheetDescription>
                            <div className="flex flex-col gap-6">
                                <Link href="/" className="text-lg font-bold px-2" onClick={() => setIsMobileMenuOpen(false)}>
                                    ESPEKTRO 2026
                                </Link>
                                <div className="flex flex-col gap-2">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`text-sm font-medium transition-colors hover:text-primary px-2 py-2 rounded-md hover:bg-muted ${pathname === item.href
                                                ? "text-foreground bg-muted"
                                                : "text-muted-foreground"
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                    {session && (
                                        <>
                                            <Link
                                                href="/profile"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`text-sm font-medium transition-colors hover:text-primary px-2 py-2 rounded-md hover:bg-muted ${pathname === "/profile"
                                                    ? "text-foreground bg-muted"
                                                    : "text-muted-foreground"
                                                    }`}
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                href="/my-tickets"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`text-sm font-medium transition-colors hover:text-primary px-2 py-2 rounded-md hover:bg-muted ${pathname === "/my-tickets"
                                                    ? "text-foreground bg-muted"
                                                    : "text-muted-foreground"
                                                    }`}
                                            >
                                                My Tickets
                                            </Link>
                                        </>
                                    )}
                                </div>

                                {hasClubs && (
                                    <div className="mt-2 pt-4 border-t">
                                        <h4 className="mb-2 px-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">My Clubs</h4>
                                        <div className="flex flex-col gap-1">
                                            {clubRoles?.map((cr) => (
                                                <Link
                                                    key={cr.clubId}
                                                    href={`/club/${cr.clubId}/dashboard`}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={`flex items-center justify-between px-2 py-2 text-sm rounded-md transition-colors hover:bg-muted ${pathname.startsWith(`/club/${cr.clubId}`)
                                                        ? "bg-muted font-medium text-primary"
                                                        : "text-muted-foreground hover:text-primary"
                                                        }`}
                                                >
                                                    <span className="capitalize">{cr.clubId}</span>
                                                    <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded capitalize">
                                                        {cr.role.replace("-", " ")}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-auto pt-4 border-t">
                                    {!session ? (
                                        <Button
                                            onClick={handleSignIn}
                                            className="w-full"
                                        >
                                            Login
                                        </Button>
                                    ) : (
                                        <div className="flex items-center gap-3 px-2 py-2">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage
                                                    src={session.user.image || ""}
                                                    alt={session.user.name || "User"}
                                                />
                                                <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
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
                                                onClick={handleSignOut}
                                                className="text-muted-foreground hover:text-destructive"
                                            >
                                                <LogOut className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav >
    );
}
