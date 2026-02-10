"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { UserData } from "@/types/user-management";
import { UserFilters } from "./user-filters";
import { UserList } from "./user-list";
import { UserManagementSheet } from "./user-management-sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface UserDashboardProps {
    users: UserData[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
}

export function UserDashboard({ users, totalUsers, totalPages, currentPage }: UserDashboardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // State for interactive elements
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Sync URL param 'manage' with selected user
    useEffect(() => {
        const manageEmail = searchParams.get("manage");
        if (manageEmail) {
            const existingUser = users.find(u => u.email === manageEmail);
            if (existingUser) {
                setSelectedUser(existingUser);
                setIsSheetOpen(true);
            } else {
                // Assuming it's a pending user if not in list
                setSelectedUser({
                    _id: "", // Will be assigned by backend
                    name: "Pending User",
                    email: manageEmail,
                    role: "user",
                    clubRoles: []
                });
                setIsSheetOpen(true);
            }
        }
    }, [searchParams, users]);

    // Update selected user when the list refreshes (e.g. after edit)
    useEffect(() => {
        if (selectedUser && isSheetOpen) {
            const updated = users.find(u => u.email === selectedUser.email);
            if (updated) {
                setSelectedUser(updated);
            }
        }
    }, [users, isSheetOpen, selectedUser]);

    const handleManage = (user: UserData) => {
        // Update URL to match selection
        const params = new URLSearchParams(searchParams.toString());
        params.set("manage", user.email);
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSheetOpenChange = (open: boolean) => {
        setIsSheetOpen(open);
        if (!open) {
            // Remove manage param
            const params = new URLSearchParams(searchParams.toString());
            params.delete("manage");
            router.replace(`${pathname}?${params.toString()}`);
            setSelectedUser(null);
        }
    }

    // Pagination helper
    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="space-y-6">

            <UserFilters />

            <div className="space-y-4">
                <UserList users={users} onManage={handleManage} />

                {/* Pagination Controls */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {users.length} of {totalUsers} users
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage >= totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            <UserManagementSheet
                user={selectedUser}
                open={isSheetOpen}
                onOpenChange={handleSheetOpenChange}
            />
        </div>
    );
}
