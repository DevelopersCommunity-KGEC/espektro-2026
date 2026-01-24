"use client";

import { useState, useEffect } from "react";
import { createReferralCodes, getReferralCodes, deleteReferralCode } from "@/actions/referral-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Copy, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { clubs } from "@/data/clubs";

import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

interface ReferralManagerProps {
    clubId: string;
    isSuperAdmin?: boolean;
}

const formSchema = z.object({
    clubId: z.string().min(1, "Please select a club"),
    count: z.coerce.number().min(1, "At least 1").max(50, "Max 50"),
    discountPercentage: z.coerce.number().min(1, "At least 1%").max(100, "Max 100%"),
    isFree: z.boolean().default(false),
});

export function ReferralManager({ clubId, isSuperAdmin = false }: ReferralManagerProps) {
    const [referrals, setReferrals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            clubId: clubId === "all" ? "" : clubId,
            count: 1,
            discountPercentage: 10,
            isFree: false,
        },
    });

    const watchedClubId = useWatch({ control: form.control, name: "clubId" });

    const fetchReferrals = async () => {
        setLoading(true);
        try {
            // If super admin and "all" is selected (empty string from form), fetch all.
            const targetClub = isSuperAdmin ? (watchedClubId || "all") : clubId;
            const data = await getReferralCodes(targetClub);
            setReferrals(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch referrals");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReferrals();
    }, [watchedClubId]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setGenerating(true);
        try {
            await createReferralCodes({
                clubId: values.clubId,
                count: values.count,
                discountPercentage: values.isFree ? 100 : values.discountPercentage,
            });
            toast.success("Referral codes generated successfully");
            fetchReferrals();
        } catch (error: any) {
            toast.error(error.message || "Failed to generate codes");
        } finally {
            setGenerating(false);
        }
    };

    // Helper to toggle 'isFree' and auto-set discount
    const isFree = form.watch("isFree");

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this code?")) return;
        try {
            await deleteReferralCode(id);
            setReferrals(prev => prev.filter(r => r._id !== id));
            toast.success("Code deleted");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const getClubName = (id: string) => clubs.find(c => c.id === id)?.name || id;

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Generate Referrals</CardTitle>
                    <CardDescription>Create new discount codes for users.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                                {isSuperAdmin && (
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
                                )}

                                <FormField
                                    control={form.control}
                                    name="count"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="1" max="50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="discountPercentage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Discount %</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max="100"
                                                    {...field}
                                                    value={isFree ? 100 : field.value}
                                                    disabled={isFree}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="isFree"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-end space-x-3 space-y-0 pb-2 h-full">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                100% Off
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" disabled={generating}>
                                {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Generate Codes
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Existing Referrals</CardTitle>
                        <CardDescription>Manage and track your referral codes.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchReferrals}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Club</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created By</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {referrals.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            No referrals found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    referrals.map((referral) => (
                                        <TableRow key={referral._id}>
                                            <TableCell className="font-mono font-medium">
                                                {referral.code}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{referral.discountPercentage}% OFF</Badge>
                                            </TableCell>
                                            <TableCell>{getClubName(referral.clubId)}</TableCell>
                                            <TableCell>
                                                {referral.isUsed ? (
                                                    <Badge variant="destructive">Used</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Active</Badge>
                                                )}
                                                {referral.isUsed && referral.usedBy && (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        by {referral.usedBy}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {referral.createdBy}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => copyToClipboard(referral.code)}
                                                        title="Copy Code"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    {!referral.isUsed && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDelete(referral._id)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
