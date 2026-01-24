import { notFound, redirect } from "next/navigation";
import { getCurrentUser, hasClubPermission } from "@/lib/rbac";
import { ReferralManager } from "@/components/admin/referral-manager";

export default async function ClubReferralsPage({ params }: { params: Promise<{ clubId: string }> }) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const { clubId } = await params;

    const canManage = await hasClubPermission(user.id, clubId, ["club-admin"]);
    if (!canManage) return notFound();

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 capitalize">{clubId} Referrals</h1>
            <ReferralManager clubId={clubId} />
        </div>
    );
}
