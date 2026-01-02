"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Correct hook for app router
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Ticket, User, LogOut, LayoutDashboard } from "lucide-react";

interface NavbarProps {
    isAdmin?: boolean;
    userRole?: string;
}

export function Navbar({ isAdmin, userRole }: NavbarProps) {
    const { data: session } = authClient.useSession();
    const pathname = usePathname();

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
        if (userRole === "security") return { name: "Scan", href: "/scan" };
        if (userRole === "ticket-issuer") return { name: "Manual Tickets", href: "/dashboard/manual-tickets" };
        if (isAdmin || userRole === "admin") return { name: "Admin", href: "/dashboard" };
        return null;
    };

    const adminLink = getAdminLink();

    const navItems = [
        { name: "Events", href: "/events" },
        { name: "My Tickets", href: "/my-tickets" },
        ...(adminLink ? [adminLink] : []),
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {session.user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/my-tickets" className="cursor-pointer">
                                        <Ticket className="mr-2 h-4 w-4" />
                                        <span>My Tickets</span>
                                    </Link>
                                </DropdownMenuItem>
                                {/* Admin Link again here for convenience */}
                                {adminLink && (
                                    <DropdownMenuItem asChild>
                                        <Link href={adminLink.href} className="cursor-pointer">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>{adminLink.name}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
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
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[80%] max-w-[300px] pt-10">
                            <div className="flex flex-col gap-6">
                                <Link href="/" className="text-lg font-bold px-2">
                                    ESPEKTRO 2026
                                </Link>
                                <div className="flex flex-col gap-2">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`text-sm font-medium transition-colors hover:text-primary px-2 py-2 rounded-md hover:bg-muted ${pathname === item.href
                                                ? "text-foreground bg-muted"
                                                : "text-muted-foreground"
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
