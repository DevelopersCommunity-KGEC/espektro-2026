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
            className="w-full h-auto py-4 text-xl font-bold rounded-xl"
        >
            {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
            Book Ticket Now
        </Button>
    );
}

