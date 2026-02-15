"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

/**
 * Fallback onboarding page — redirects users to the home page.
 * The onboarding flow is now handled by the OnboardingDialog
 * that appears as a modal overlay on any page via OnboardingCheck.
 *
 * This page is kept to handle:
 * - Users with bookmarked /onboarding links
 * - Direct URL access
 */
export default function OnboardingPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (isPending) return;

        if (!session) {
            // Not logged in, send to login
            router.replace("/login");
            return;
        }

        const user = session.user as any;
        const isProfileIncomplete = !user.phone || !user.course || !user.graduationYear || !user.collegeName;

        if (isProfileIncomplete) {
            // Profile is incomplete — redirect to home where OnboardingDialog will appear
            router.replace("/");
        } else {
            // Profile is complete, go to events
            router.replace("/events");
        }
    }, [session, isPending, router]);

    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
}
