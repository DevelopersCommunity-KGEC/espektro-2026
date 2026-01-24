"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddUserDialog } from "./add-user-dialog";
import { UserData } from "@/types/user-management";

export function AddUserButton() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleUserSelected = (user: UserData) => {
        // Close dialog
        setIsAddDialogOpen(false);

        // Update URL to trigger the sheet in UserDashboard
        const params = new URLSearchParams(searchParams.toString());
        params.set("manage", user.email);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <>
            <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
            <AddUserDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onUserSelected={handleUserSelected}
            />
        </>
    );
}
