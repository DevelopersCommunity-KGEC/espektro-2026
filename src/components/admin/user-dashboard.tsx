"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { UserData } from "@/types/user-management";
import { UserFilters } from "./user-filters";
import { UserList } from "./user-list";
import { UserManagementSheet } from "./user-management-sheet";
import { AddUserDialog } from "./add-user-dialog";
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
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Update selected user when the list refreshes (e.g. after edit)
    useEffect(() => {
        if (selectedUser && isSheetOpen) {
            const updated = users.find(u => u.email === selectedUser.email);
            if (updated) {
                setSelectedUser(updated);
            }
        }
    }, [users, isSheetOpen, selectedUser]); // Check if this causes loop. updating selectedUser shouldn't trigger if it just sets same object, but `users` changes reference. 

    const handleManage = (user: UserData) => {
        setSelectedUser(user);
        setIsSheetOpen(true);
    };

    const handleAddUserSelected = (user: UserData) => {
        setSelectedUser(user);
        setIsSheetOpen(true);
    };

    // Pagination helper
    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
            </div>

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
                onOpenChange={setIsSheetOpen}
            />

            <AddUserDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onUserSelected={handleAddUserSelected}
            />
        </div>
    );
}
