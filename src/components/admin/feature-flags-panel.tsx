"use client";

import { useState } from "react";
import { setFeatureFlag } from "@/actions/feature-flag-actions";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

export type FeatureFlagRow = {
    clubId: string;
    name: string;
    reusableCoupon: boolean;
};

type Props = {
    initialFlags: FeatureFlagRow[];
};

export function FeatureFlagsPanel({ initialFlags }: Props) {
    const [rows, setRows] = useState<FeatureFlagRow[]>(initialFlags);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleToggleReusable = async (clubId: string, next: boolean) => {
        setSavingId(clubId);
        setError(null);
        try {
            await setFeatureFlag(clubId, "reusableCoupon", next);
            setRows((prev) =>
                prev.map((row) =>
                    row.clubId === clubId ? { ...row, reusableCoupon: next } : row,
                ),
            );
        } catch (err: any) {
            setError(err?.message || "Failed to update feature flag");
        } finally {
            setSavingId(null);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Feature Flags</CardTitle>
                <CardDescription>
                    Toggle per-club features. Changes apply immediately for all coupon
                    creation and validation paths.
                </CardDescription>
                {error ? (
                    <p className="text-sm text-destructive">{error}</p>
                ) : null}
            </CardHeader>
            <CardContent>
                <div className="overflow-hidden rounded-md border">
                    <div className="grid grid-cols-12 bg-muted/50 px-4 py-2 text-sm font-medium text-muted-foreground">
                        <span className="col-span-6">Club</span>
                        <span className="col-span-6 text-right">Reusable coupons</span>
                    </div>
                    <div className="divide-y">
                        {rows.map((row) => {
                            const pending = savingId === row.clubId;
                            return (
                                <div
                                    key={row.clubId}
                                    className="grid grid-cols-12 items-center px-4 py-3 gap-3"
                                >
                                    <div className="col-span-6 space-y-1">
                                        <p className="font-medium leading-tight">
                                            {row.name || row.clubId}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{row.clubId}</p>
                                    </div>
                                    <div className="col-span-6 flex items-center justify-end gap-3">
                                        <Badge variant={row.reusableCoupon ? "outline" : "secondary"}>
                                            {row.reusableCoupon ? "Enabled" : "Disabled"}
                                        </Badge>
                                        <Switch
                                            checked={row.reusableCoupon}
                                            onCheckedChange={(value) => handleToggleReusable(row.clubId, value)}
                                            disabled={pending}
                                        />
                                        {pending ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
