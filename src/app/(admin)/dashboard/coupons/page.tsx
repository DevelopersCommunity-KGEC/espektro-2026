import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CouponManager } from "@/components/admin/coupon-manager";
import { getFeatureFlags } from "@/actions/feature-flag-actions";

export default async function AdminCouponsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || session.user.role !== "super-admin") {
        redirect("/dashboard");
    }

    const flags = await getFeatureFlags();
    const featureMap = flags.reduce<Record<string, boolean>>((acc, row) => {
        acc[row.clubId] = row.reusableCoupon;
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Coupon Management</h1>
                <p className="text-muted-foreground">
                    Generate and manage discount codes for clubs.
                </p>
            </div>

            <CouponManager clubId="all" isSuperAdmin={true} featureFlagsByClub={featureMap} />
        </div>
    );
}
