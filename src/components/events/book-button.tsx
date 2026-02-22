"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BookButton({ eventId }: { eventId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleBook = () => {
        setLoading(true);
        router.push(`/events/${eventId}/book`);
    };

    return (
        <Button
            onClick={handleBook}
            disabled={loading}
            variant="theatrical"
            className="w-full h-auto py-8 text-2xl font-bold font-[family-name:var(--font-medieval-sharp)] tracking-wide group"
        >
            {loading ? <Loader2 className="mr-3 h-7 w-7 animate-spin" /> : null}
            <span className="flex items-center gap-2">
                Book Ticket Now
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </span>
        </Button>
    );
}

