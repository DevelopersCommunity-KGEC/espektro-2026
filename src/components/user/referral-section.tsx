"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ReferralSectionProps {
    code: string | null;
    stats?: { count: number };
}

export function ReferralSection({ code, stats }: ReferralSectionProps) {
    const [copied, setCopied] = useState(false);

    if (!code) return null;

    const referralLink = typeof window !== "undefined"
        ? `${window.location.origin}/?ref=${code}`
        : `https://espektro.kgec.edu.in/?ref=${code}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast.success("Referral link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="mb-8 border-dashed border-2 bg-blue-50/50">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl text-blue-700">Invite Friends & Earn Rewards</CardTitle>
                        <CardDescription>Share your unique link. You have referred <strong>{stats?.count || 0}</strong> people so far.</CardDescription>
                    </div>
                    <div className="bg-white p-3 rounded-full shadow-sm hidden md:block">
                        <Share2 className="h-6 w-6 text-blue-600" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2">
                    <Input
                        readOnly
                        value={referralLink}
                        className="bg-white font-mono text-sm"
                    />
                    <Button onClick={handleCopy} className="gap-2 shrink-0">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Copy Link"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
