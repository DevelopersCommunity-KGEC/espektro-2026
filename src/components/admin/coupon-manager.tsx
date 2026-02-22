"use client";

import { useState, useEffect } from "react";
import { createCouponCodes, getCouponCodes, deleteCouponCode, createReusableCoupon, updateCouponLimit } from "@/actions/coupon-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Copy, Trash2, RefreshCw, Loader2, Edit3 } from "lucide-react";
import { clubs } from "@/data/clubs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

interface CouponManagerProps {
    clubId: string;
    isSuperAdmin?: boolean;
    featureFlagsByClub?: Record<string, boolean>;
}

const formSchema = z.object({
    clubId: z.string().min(1, "Please select a club"),
    count: z.coerce.number().min(1, "At least 1").max(50, "Max 50"),
    discountPercentage: z.coerce.number().min(1, "At least 1%").max(100, "Max 100%"),
    isFree: z.boolean().default(false),
});

const reusableFormSchema = z.object({
    clubId: z.string().min(1, "Select a club"),
    code: z.string().min(3, "Min 3 chars"),
    discountPercentage: z.coerce.number().min(1).max(100),
    maxUses: z.coerce.number().min(1, "Min 1 use"),
});

export function CouponManager({ clubId, isSuperAdmin = false, featureFlagsByClub = {} }: CouponManagerProps) {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [creatingReusable, setCreatingReusable] = useState(false);

    // For super-admin pick first club; for club-admin use their clubId
    const initialClub = clubId === "all" ? (clubs[0]?.id || "") : clubId;
    const [selectedClub, setSelectedClub] = useState(initialClub);

    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            clubId: initialClub,
            count: 1,
            discountPercentage: 20,
            isFree: false
        },
    });

    const isFree = useWatch({ control: form.control, name: "isFree" });

    const reusableForm = useForm<z.infer<typeof reusableFormSchema>>({
        resolver: zodResolver(reusableFormSchema) as any,
        defaultValues: {
            clubId: initialClub,
            code: "",
            discountPercentage: 100,
            maxUses: 10,
        }
    });

    // Determine which club is active and whether reusable coupons are enabled for it
    const effectiveClubId = clubId === "all" ? selectedClub : clubId;
    const reusableEnabled = Boolean(effectiveClubId && featureFlagsByClub[effectiveClubId]);
    // For super-admin: check if ANY club has feature enabled (to know whether section ever appears)
    const anyClubHasReusable = isSuperAdmin
        ? Object.values(featureFlagsByClub).some(Boolean)
        : reusableEnabled;

    useEffect(() => {
        if (isFree) {
            form.setValue("discountPercentage", 100);
        }
    }, [isFree, form]);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const data = await getCouponCodes(clubId);
            setCoupons(data);
        } catch (error) {
            toast.error("Failed to fetch coupons");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [clubId]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setGenerating(true);
        try {
            await createCouponCodes(values);
            toast.success("Coupons generated successfully!");
            fetchCoupons();
        } catch (error: any) {
            toast.error(error.message || "Failed to generate");
        } finally {
            setGenerating(false);
        }
    };

    const onReusableSubmit = async (values: z.infer<typeof reusableFormSchema>) => {
        setCreatingReusable(true);
        try {
            await createReusableCoupon(values);
            toast.success("Reusable coupon saved!");
            reusableForm.reset({ ...values, code: "" });
            fetchCoupons();
        } catch (error: any) {
            toast.error(error.message || "Failed to create coupon");
        } finally {
            setCreatingReusable(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deleteCouponCode(id);
            toast.success("Deleted");
            fetchCoupons();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    const handleEditLimit = async (coupon: any) => {
        const input = prompt("Set max uses", coupon.maxUses || 1);
        if (!input) return;
        const parsed = parseInt(input, 10);
        if (Number.isNaN(parsed) || parsed < 1) {
            toast.error("Invalid number");
            return;
        }
        try {
            await updateCouponLimit(coupon._id, parsed);
            toast.success("Updated limit");
            fetchCoupons();
        } catch (error: any) {
            toast.error(error.message || "Failed to update limit");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Manage Coupons</CardTitle>
                        <CardDescription>Create and track discount codes</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={fetchCoupons}>
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {/* Generator Form */}
                    <div className="p-4 bg-muted rounded-lg border">
                        <h3 className="font-semibold mb-3">Generate New Codes</h3>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {isSuperAdmin && clubId === "all" && (
                                        <FormField
                                            control={form.control}
                                            name="clubId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Club Scope</FormLabel>
                                                    <Select
                                                        value={selectedClub}
                                                        onValueChange={(value) => {
                                                            setSelectedClub(value);
                                                            field.onChange(value);
                                                            reusableForm.setValue("clubId", value);
                                                        }}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Club" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {clubs.map((c) => (
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
                                                    <Input type="number" {...field} />
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
                                                    <Input type="number" {...field} disabled={isFree} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="isFree"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        100% Off (Free)
                                                    </FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button type="submit" disabled={generating}>
                                    {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Generate
                                </Button>
                            </form>
                        </Form>
                    </div>

                    {/* Reusable Coupon Form — hidden entirely when feature is off */}
                    {(isSuperAdmin ? anyClubHasReusable : reusableEnabled) && (
                        <div className="p-4 bg-muted rounded-lg border">
                            <h3 className="font-semibold mb-3">Create Reusable Coupon (Type-2)</h3>

                            {/* Super-admin: show club selector inside + disable form fields when selected club has feature off */}
                            {isSuperAdmin && clubId === "all" && !reusableEnabled && (
                                <Alert className="mb-4">
                                    <AlertTitle>Feature not enabled</AlertTitle>
                                    <AlertDescription>
                                        Reusable coupons are not enabled for <strong>{clubs.find(c => c.id === selectedClub)?.name || selectedClub}</strong>. Enable it from the Feature Flags page.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Form {...reusableForm}>
                                <form onSubmit={reusableForm.handleSubmit(onReusableSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {isSuperAdmin && clubId === "all" && (
                                            <FormField
                                                control={reusableForm.control}
                                                name="clubId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Club Scope</FormLabel>
                                                        <Select
                                                            value={selectedClub}
                                                            onValueChange={(value) => {
                                                                setSelectedClub(value);
                                                                field.onChange(value);
                                                                form.setValue("clubId", value);
                                                            }}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select Club" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {clubs.map((c) => (
                                                                    <SelectItem key={c.id} value={c.id}>
                                                                        {c.name} {featureFlagsByClub[c.id] ? "✓" : ""}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}

                                        <FormField
                                            control={reusableForm.control}
                                            name="code"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Coupon Code</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="EVENT_KGEC" {...field} disabled={!reusableEnabled} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={reusableForm.control}
                                            name="discountPercentage"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Discount %</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} disabled={!reusableEnabled} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={reusableForm.control}
                                            name="maxUses"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Max Uses</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} disabled={!reusableEnabled} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button type="submit" disabled={creatingReusable || !reusableEnabled}>
                                        {creatingReusable && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Reusable Coupon
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    )}

                    {/* Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Club</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Usage</TableHead>
                                    <TableHead>Used By</TableHead>
                                    <TableHead>Created By</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {coupons.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                            No coupons found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    coupons.map((coupon) => (
                                        <TableRow key={coupon._id}>
                                            <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                                            <TableCell>{coupon.clubId}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={coupon.type === "multi-use" ? "border-blue-500 text-blue-700" : undefined}>
                                                    {coupon.type === "multi-use" ? "Multi-use" : "Single-use"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{coupon.discountPercentage}%</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {coupon.type === "multi-use" ? (
                                                    <div className="flex flex-col text-xs text-muted-foreground">
                                                        <span>{coupon.usageCount || 0} / {coupon.maxUses ?? "∞"} used</span>
                                                    </div>
                                                ) : (
                                                    coupon.isUsed ? (
                                                        <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">Used</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                                                    )
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {coupon.type === "multi-use" ? (
                                                    coupon.usedByEmails && coupon.usedByEmails.length > 0 ? (
                                                        <div className="space-y-1">
                                                            {coupon.usedByEmails.slice(0, 3).map((email: string) => (
                                                                <div key={email}>{email}</div>
                                                            ))}
                                                            {coupon.usedByEmails.length > 3 && (
                                                                <div className="text-[10px] text-muted-foreground">+{coupon.usedByEmails.length - 3} more</div>
                                                            )}
                                                        </div>
                                                    ) : "-"
                                                ) : (
                                                    coupon.usedBy ? (
                                                        <div className="flex flex-col">
                                                            <span>{coupon.usedBy}</span>
                                                            <span>{new Date(coupon.usedAt).toLocaleDateString()}</span>
                                                        </div>
                                                    ) : "-"
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {coupon.createdBy}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(coupon.code)}>
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(coupon._id)}
                                                        disabled={coupon.isUsed || (coupon.type === "multi-use" && coupon.usageCount > 0)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                    {coupon.type === "multi-use" && (
                                                        <Button variant="ghost" size="icon" onClick={() => handleEditLimit(coupon)}>
                                                            <Edit3 className="h-4 w-4" />
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
                </div>
            </CardContent>
        </Card>
    );
}
