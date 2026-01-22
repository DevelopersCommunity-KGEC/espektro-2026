
"use client";

import React, { useState } from "react";
import { assignClubRole, removeClubRole, getClubTeam } from "@/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, Plus, RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { ClubTeamMember } from "@/types/user-management";

const roleSchema = z.object({
    email: z.string().email("Invalid email"),
    role: z.string(),
});

interface ClubUserListProps {
    initialUsers: ClubTeamMember[];
    clubId: string;
}

export function ClubUserList({ initialUsers, clubId }: ClubUserListProps) {
    const [users, setUsers] = useState<ClubTeamMember[]>(initialUsers);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            email: "",
            role: "volunteer",
        },
    });

    const refreshUsers = async () => {
        setLoading(true);
        try {
            const data = await getClubTeam(clubId);
            setUsers(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to refresh users");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values: z.infer<typeof roleSchema>) => {
        setLoading(true);
        try {
            await assignClubRole(
                values.email,
                clubId,
                values.role,
            );
            toast.success("User assigned successfully");
            setIsDialogOpen(false);
            form.reset();
            refreshUsers();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to assign role");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (email: string | undefined) => {
        if (!email) {
            toast.error("User email is missing");
            return;
        }

        setLoading(true);
        try {
            await removeClubRole(email, clubId);
            toast.success("User removed");
            refreshUsers();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to remove user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Team Members ({users.length})</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={refreshUsers} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" /> Add Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Club Member</DialogTitle>
                                <DialogDescription>
                                    Assign a role to a user for this club.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="user@example.com" {...field} />
                                                </FormControl>
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
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select role" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="club-admin">Club Admin</SelectItem>
                                                        <SelectItem value="volunteer">Volunteer</SelectItem>
                                                        {/* <SelectItem value="event-editor">Event Editor</SelectItem> */}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <Button type="submit" disabled={loading}>
                                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Assign Role
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((role) => (
                            <TableRow key={role._id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={role.userId?.image} />
                                            <AvatarFallback>{role.userId?.name?.[0] || role.userId?.email?.[0] || "?"}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span>{role.userId?.name || "Pending User"}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {role.userId?.email || "Email not linked"}
                                                {/* If userId is null, we might be showing a pending role, but getClubTeam populated userId. 
                                                    If PendingClubRole, structure is different. 
                                                    Wait, getClubTeam uses ClubRoleModel. 
                                                    It doesn't fetch PendingClubRoles. 
                                                    I should update getClubTeam to fetch pending too or handle it separate?
                                                    For now let's assume registered users.
                                                 */}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="capitalize">{role.role.replace("-", " ")}</TableCell>
                                <TableCell className="text-right">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Remove member?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to remove access for <strong>{role.userId?.email}</strong>?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleRemove(role.userId?.email)} className="bg-red-600 hover:bg-red-700">
                                                    Remove
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                                    No members found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
