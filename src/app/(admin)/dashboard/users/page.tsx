"use client";

import React, { useState, useEffect } from "react";
import { getUserByEmail, updateUserRole } from "@/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ShieldAlert, ShieldCheck, UserCog } from "lucide-react";
import { useAuthorization } from "@/hooks/use-authorization";

export default function UserRolesPage() {
    const [email, setEmail] = useState("");
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const { isAuthorized, isLoading, session } = useAuthorization(['admin']);

    if (isLoading || !isAuthorized) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const foundUser = await getUserByEmail(email);
            if (foundUser) {
                setUser(foundUser);
            } else {
                setUser(null);
                setMessage({ type: 'error', text: "User not found" });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const [quota, setQuota] = useState(0);

    const handleRoleUpdate = async (newRole: string) => {
        setLoading(true);
        try {
            // For ticket-issuer, we pass the specific quota. For others, we might pass 0 or keep existing?
            // User requested capability to "Assign a given number of tickets".
            await updateUserRole(user.email, newRole, newRole === 'ticket-issuer' ? quota : 0);

            setUser({ ...user, role: newRole, ticketQuota: newRole === 'ticket-issuer' ? quota : 0 });
            setMessage({ type: 'success', text: `Successfully updated role to ${newRole.toUpperCase()}${newRole === 'ticket-issuer' ? ` with ${quota} tickets` : ''}` });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center space-x-2">
                <UserCog className="h-6 w-6" />
                <h1 className="text-3xl font-bold tracking-tight">User Role Management</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Search User</CardTitle>
                    <CardDescription>Find a user by email to manage their permissions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Label htmlFor="email" className="sr-only">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="student@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            <span className="ml-2">Search</span>
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {message && (
                <div className={`p-4 rounded-md flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.type === 'success' ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            {user && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={user.image} alt={user.name} />
                                <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>{user.name}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                                <div className="mt-2">
                                    <Badge variant="outline" className="uppercase">{user.role}</Badge>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Label>Assign New Role</Label>

                            <div className="mb-4">
                                <Label className="text-sm text-gray-500 mb-1 block">Ticket Quota (for Issuer role)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={quota}
                                    onChange={(e) => setQuota(parseInt(e.target.value) || 0)}
                                    placeholder="Enter ticket limit"
                                    className="max-w-xs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {["user", "security", "ticket-issuer", "admin"].map((role) => (
                                    <Button
                                        key={role}
                                        variant={user.role === role ? "default" : "outline"}
                                        onClick={() => handleRoleUpdate(role)}
                                        disabled={loading || user.role === role}
                                        className="capitalize"
                                    >
                                        {role}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
