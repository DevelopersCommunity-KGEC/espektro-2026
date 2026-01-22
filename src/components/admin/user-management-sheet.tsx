"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    updateUserRole,
    assignClubRole,
    removeClubRole
} from "@/actions/admin-actions";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, MoreHorizontal, Shield, Trash2 } from "lucide-react";
import { clubs } from "@/data/clubs";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserData } from "@/types/user-management";

const assignmentSchema = z.object({
    clubId: z.string().min(1, "Select a club"),
    role: z.string().min(1, "Select a role"),
});

interface UserManagementSheetProps {
    user: UserData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UserManagementSheet({ user, open, onOpenChange }: UserManagementSheetProps) {
    const [actionLoading, setActionLoading] = useState(false);
    const router = useRouter();

    // Form for new assignments
    const form = useForm({
        resolver: zodResolver(assignmentSchema),
        defaultValues: {
            clubId: "",
            role: "volunteer",
        }
    });

    if (!user) return null;

    const refreshData = () => {
        router.refresh(); // Refreshes Server Components
    };

    const handleGlobalRoleUpdate = async (newRole: "user" | "super-admin") => {
        setActionLoading(true);
        try {
            await updateUserRole(user.email, newRole);
            toast.success(`Global role updated to ${newRole}`);
            refreshData();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const onAssignmentSubmit = async (values: z.infer<typeof assignmentSchema>) => {
        setActionLoading(true);
        try {
            await assignClubRole(
                user.email,
                values.clubId,
                values.role,
            );
            toast.success("Role assigned");
            form.reset({
                clubId: "",
                role: "volunteer",
            });
            refreshData();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveRole = async (clubId: string) => {
        setActionLoading(true);
        try {
            await removeClubRole(user.email, clubId);
            toast.success("Role removed");
            refreshData();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const getClubName = (id: string) => clubs.find(c => c.id === id)?.name || id;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-xl w-full">
                <SheetHeader>
                    <SheetTitle>Manage User Permissions</SheetTitle>
                    <SheetDescription>
                        Edit global role and club-specific assignments for <strong>{user.email}</strong>
                    </SheetDescription>
                </SheetHeader>

                <div className="px-6 pb-10 space-y-6">
                    {/* User Info & Global Role */}
                    <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={user.image} />
                            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="font-semibold">{user.name}</h3>
                            <div className="flex gap-2 text-sm mt-1">
                                <Badge variant={user.role === 'super-admin' ? "destructive" : "outline"}>
                                    {user.role}
                                </Badge>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Global Role</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleGlobalRoleUpdate('user')} disabled={user.role === 'user' || actionLoading}>
                                    Set as Regular User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGlobalRoleUpdate('super-admin')} disabled={user.role === 'super-admin' || actionLoading} className="text-red-600">
                                    Set as Super Admin
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Pending User Warning */}
                    {(user.role === 'pending' || !user._id || user._id.startsWith('pending-')) && (
                        <div className="bg-yellow-100 p-3 rounded-md text-yellow-800 text-sm">
                            This user has not registered/logged in yet. Assigned roles will be effective once they sign up.
                        </div>
                    )}

                    {/* Club Assignments List */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-sm flex items-center gap-2">
                            <Shield className="h-4 w-4" /> Club Assignments
                        </h3>

                        <div className="grid gap-3">
                            {user.clubRoles && user.clubRoles.length > 0 ? (
                                user.clubRoles.map((role: any) => (
                                    <div key={role._id} className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
                                        <div>
                                            <p className="font-medium text-sm">{getClubName(role.clubId)}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-xs capitalize">{role.role}</Badge>
                                            </div>
                                        </div>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" disabled={actionLoading}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Remove role?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Remove <strong>{role.role}</strong> access for <strong>{getClubName(role.clubId)}</strong>?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleRemoveRole(role.clubId)} className="bg-red-600">
                                                        Remove
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No club roles assigned.</p>
                            )}
                        </div>
                    </div>

                    {/* Add New Assignment Form */}
                    <div className="border-t pt-4 mt-2">
                        <h3 className="font-medium text-sm mb-4">Assign New Role</h3>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onAssignmentSubmit)} className="space-y-4">
                                <div className="flex gap-8">
                                    <FormField
                                        control={form.control}
                                        name="clubId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Club</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Club" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {clubs.map(c => (
                                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Role</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="club-admin">Club Admin</SelectItem>
                                                        <SelectItem value="volunteer">Volunteer</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>


                                <Button type="submit" disabled={actionLoading} className="w-full">
                                    {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Assign Role
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
