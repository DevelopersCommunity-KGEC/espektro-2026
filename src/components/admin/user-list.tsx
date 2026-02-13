"use client";

import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { clubs } from "@/data/clubs";
import { UserData } from "@/types/user-management";

interface UserListProps {
    users: UserData[];
    loading?: boolean;
    onManage: (user: UserData) => void;
}

export function UserList({ users, loading, onManage }: UserListProps) {
    const getClubName = (id: string) => clubs.find(c => c.id === id)?.name || id;

    return (
        <div className="rounded-md border bg-card overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Global Role</TableHead>
                            <TableHead>Club Assignments</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No users found matching your filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.image} />
                                                <AvatarFallback>{user.name?.[0] || user.email[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium whitespace-nowrap">{user.name}</span>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.role === 'pending' ? (
                                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 whitespace-nowrap">
                                                Pending User
                                            </Badge>
                                        ) : (
                                            <Badge variant={user.role === 'super-admin' ? 'destructive' : 'outline'} className="whitespace-nowrap">
                                                {user.role}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {user.clubRoles && user.clubRoles.length > 0 ? (
                                            <div className="flex flex-wrap gap-1 min-w-50">
                                                {user.clubRoles.slice(0, 3).map((cr: any) => (
                                                    <Badge key={cr._id} variant="secondary" className="text-xs whitespace-nowrap">
                                                        {getClubName(cr.clubId)}: {cr.role}
                                                    </Badge>
                                                ))}
                                                {user.clubRoles.length > 3 && (
                                                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                                                        +{user.clubRoles.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">None</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => onManage(user)}>
                                            Manage
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
