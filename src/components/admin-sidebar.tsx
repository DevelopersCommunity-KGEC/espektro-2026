"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LayoutDashboard, Calendar, Users, Ticket, ScanLine } from "lucide-react";
import { useState } from "react";

interface AdminSidebarProps {
    userRole: string;
}

export function AdminSidebar({ userRole }: AdminSidebarProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const links = [
        ...(userRole === 'admin' ? [
            { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
            { name: "Manage Events", href: "/dashboard/events", icon: Calendar },
            { name: "User Roles", href: "/dashboard/users", icon: Users },
        ] : []),
        ...(userRole === 'admin' || userRole === 'ticket-issuer' ? [
            { name: "Manual Tickets", href: "/dashboard/manual-tickets", icon: Ticket },
        ] : []),
        ...(userRole === 'admin' || userRole === 'security' ? [
            { name: "QR Scanner", href: "/scan", icon: ScanLine },
        ] : []),
    ];

    const NavContent = () => (
        <div className="flex flex-col gap-1">
            {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:text-primary",
                            isActive ? "bg-muted text-primary" : "text-muted-foreground"
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        {link.name}
                    </Link>
                );
            })}
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden border-r bg-muted/40 md:block w-64 min-h-screen sticky top-0">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <span className="">Admin Panel</span>
                    </Link>
                </div>
                <div className="flex-1 px-4 py-4">
                    <NavContent />
                </div>
            </aside>

            {/* Mobile Sidebar Trigger */}
            <div className="flex flex-col md:hidden">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col w-[80%] max-w-[300px] pt-10">
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link
                                    href="#"
                                    className="flex items-center gap-2 text-lg font-semibold mb-4 px-2"
                                >
                                    <span className="">Admin Panel</span>
                                </Link>
                                <NavContent />
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                        <span className="font-semibold">Admin Dashboard</span>
                    </div>
                </header>
            </div>
        </>
    );
}
