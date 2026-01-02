"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export function AdminSync() {
    const session = authClient.useSession();

    useEffect(() => {
        // Only verify if we have a user session
        if (session?.data?.user) {
            // Optimistically call setup-admin to ensure roles are sync'd
            fetch("/api/setup-admin").catch(console.error);
        }
    }, [session?.data?.user?.email]);

    return null;
}
