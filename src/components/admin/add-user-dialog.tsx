"use client";

import React, { useState } from "react";
import { getUserByEmail } from "@/actions/admin-actions";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { UserData } from "@/types/user-management";

interface AddUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUserSelected: (user: UserData) => void;
}

export function AddUserDialog({ open, onOpenChange, onUserSelected }: AddUserDialogProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [foundUser, setFoundUser] = useState<UserData | null>(null);
    const [notFoundEmail, setNotFoundEmail] = useState("");

    const handleSearch = async () => {
        if (!email) return;
        setLoading(true);
        setFoundUser(null);
        setNotFoundEmail("");
        try {
            const user = await getUserByEmail(email);
            if (user) {
                setFoundUser(user);
            } else {
                setNotFoundEmail(email);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error searching user");
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = () => {
        if (foundUser) {
            onUserSelected(foundUser);
            onOpenChange(false);
        } else if (notFoundEmail) {
            // Create a temporary dummy user object
            onUserSelected({
                _id: "",
                name: "Pending User",
                email: notFoundEmail,
                role: "user",
                clubRoles: []
            });
            onOpenChange(false);
        }
        // Reset state
        setFoundUser(null);
        setNotFoundEmail("");
        setEmail("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Find or Add User</DialogTitle>
                    <DialogDescription>
                        Search for an existing user by email to assign roles.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="search-email" className="sr-only">Email</Label>
                        <Input
                            id="search-email"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <Button type="button" size="sm" className="px-3" onClick={handleSearch} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                </div>

                {foundUser && (
                    <div className="flex items-center gap-3 p-3 border rounded-md bg-green-50 border-green-200 mt-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={foundUser.image} />
                            <AvatarFallback>{foundUser.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-medium text-sm truncate">{foundUser.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{foundUser.email}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={handleSelect}>Select</Button>
                    </div>
                )}

                {notFoundEmail && (
                    <div className="flex flex-col gap-2 p-3 border rounded-md bg-yellow-50 border-yellow-200 mt-2 text-sm">
                        <p className="font-medium text-yellow-800">User not found.</p>
                        <p className="text-yellow-700">You can still assign permissions to <strong>{notFoundEmail}</strong>. They will apply once the user registers.</p>
                        <Button size="sm" variant="outline" className="self-end mt-1" onClick={handleSelect}>Proceed Anyway</Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
