"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function OnboardingCheck() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isPending) return;
        if (!session) return;

        // Avoid redirect loop
        if (pathname === "/onboarding") return;

        // Check if required fields are missing
        const user = session.user as any;
        const isProfileIncomplete = !user.phone || !user.course || !user.graduationYear || !user.collegeName;

        if (isProfileIncomplete) {
            router.replace("/onboarding");
        }
    }, [session, isPending, pathname, router]);

    return null;
}
