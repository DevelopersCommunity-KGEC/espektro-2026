
import React from "react";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser, hasClubPermission } from "@/lib/rbac";
import { isReusableCouponEnabled } from "@/actions/feature-flag-actions";
import { CouponManager } from "@/components/admin/coupon-manager";

export default async function ClubCouponsPage({ params }: { params: Promise<{ clubId: string }> }) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const { clubId } = await params;

    // Check permission - strictly club-admin
    const canManage = await hasClubPermission(user.id, clubId, ["club-admin"]);
    if (!canManage) return notFound();

    const enabled = await isReusableCouponEnabled(clubId);
    const featureFlags = { [clubId]: enabled };

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold capitalize mb-2">{clubId} Coupons</h1>
                <p className="text-muted-foreground">Generate and manage discount codes for your club events.</p>
            </div>

            <CouponManager clubId={clubId} featureFlagsByClub={featureFlags} />
        </div>
    );
}
