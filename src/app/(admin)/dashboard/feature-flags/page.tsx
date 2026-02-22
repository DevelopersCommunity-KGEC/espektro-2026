import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getFeatureFlags } from "@/actions/feature-flag-actions";
import { FeatureFlagsPanel } from "@/components/admin/feature-flags-panel";

export default async function FeatureFlagsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || session.user.role !== "super-admin") {
        redirect("/dashboard");
    }

    const flags = await getFeatureFlags();

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Feature Flags</h1>
                <p className="text-muted-foreground">
                    Enable or disable per-club capabilities. Currently controls reusable coupon availability.
                </p>
            </div>
            <FeatureFlagsPanel initialFlags={flags} />
        </div>
    );
}
