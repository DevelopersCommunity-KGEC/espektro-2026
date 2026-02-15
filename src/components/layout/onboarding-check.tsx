"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { OnboardingDialog } from "@/components/user/onboarding-dialog";

export function OnboardingCheck() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [showOnboardingDialog, setShowOnboardingDialog] = useState(false);

    useEffect(() => {
        if (isPending) return;
        if (!session) {
            // If the user logged out, hide the dialog
            setShowOnboardingDialog(false);
            return;
        }

        // Skip on login page and API routes
        if (pathname === "/login" || pathname.startsWith("/api/")) return;

        // Check if required fields are missing
        const user = session.user as any;
        const isProfileIncomplete = !user.phone || !user.course || !user.graduationYear || !user.collegeName;

        setShowOnboardingDialog(isProfileIncomplete);
    }, [session, isPending, pathname]);

    const handleComplete = () => {
        setShowOnboardingDialog(false);
        // Force a hard reload so session data is refreshed everywhere
        // (Better Auth client cache + server components)
        window.location.reload();
    };

    return (
        <OnboardingDialog
            open={showOnboardingDialog}
            onComplete={handleComplete}
        />
    );
}
