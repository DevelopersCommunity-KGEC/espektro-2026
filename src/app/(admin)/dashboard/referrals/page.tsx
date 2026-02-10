import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DetailedReferralLeaderboard } from "@/components/admin/detailed-referral-leaderboard";

export default async function AdminReferralsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || session.user.role !== "super-admin") {
        redirect("/dashboard");
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Referral Management</h1>
                <p className="text-muted-foreground">
                    Monitor user performance and top referrers.
                </p>
            </div>

            <DetailedReferralLeaderboard />
        </div>
    );
}
