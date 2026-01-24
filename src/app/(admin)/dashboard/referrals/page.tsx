import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReferralManager } from "@/components/admin/referral-manager";

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
                    Generate and manage discount codes for clubs.
                </p>
            </div>

            <ReferralManager clubId="all" isSuperAdmin={true} />
        </div>
    );
}
