"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, UserX } from "lucide-react";
import { clubs } from "@/data/clubs";

export function UserFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get current values from URL or defaults
    const searchQuery = searchParams.get("search") || "";
    const clubFilter = searchParams.get("clubId") || "all";
    const roleFilter = searchParams.get("role") || "all";

    // Update URL helper
    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "" || value === "all") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        // Reset page on filter change
        if (updates.page !== null) { // if not explicitly setting page, reset it
            params.delete("page");
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    // We need local state for the input to allow typing
    const [localSearch, setLocalSearch] = React.useState(searchQuery);

    React.useEffect(() => {
        setLocalSearch(searchQuery);
    }, [searchQuery]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== searchQuery) {
                updateParams({ search: localSearch });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localSearch, searchQuery]);

    return (
        <Card>
            <CardContent className="p-4 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
                <div className="flex-1 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            name="search"
                            placeholder="Search by name or email..."
                            className="pl-8"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Select
                        value={clubFilter}
                        onValueChange={(val) => updateParams({ clubId: val })}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Clubs" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Clubs</SelectItem>
                            {clubs.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    <Select
                        value={roleFilter}
                        onValueChange={(val) => updateParams({ role: val })}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="super-admin">Super Admin</SelectItem>
                            <SelectItem value="club-admin">Club Admin</SelectItem>
                            <SelectItem value="volunteer">Volunteer</SelectItem>
                            <SelectItem value="user">Regular User</SelectItem>
                        </SelectContent>
                    </Select>

                    {(clubFilter !== "all" || roleFilter !== "all" || searchQuery !== "") && (
                        <Button variant="ghost" size="icon" onClick={() => {
                            router.push(pathname); // Clear all
                        }}>
                            <UserX className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
