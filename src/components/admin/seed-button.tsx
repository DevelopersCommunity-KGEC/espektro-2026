"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ensureFestDays } from "@/actions/seed-actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SeedButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSeedFestDays = async () => {
        setLoading(true);
        try {
            const results = await ensureFestDays();
            toast.success("Fest days seeded successfully", {
                description: (
                    <div className="mt-2 flex flex-col gap-1 text-xs">
                        {results.map((r, i) => (
                            <span key={i}>{r}</span>
                        ))}
                    </div>
                ),
            });
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to seed fest days");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            onClick={handleSeedFestDays}
            disabled={loading}
        >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Seed Fest Days
        </Button>
    );
}
