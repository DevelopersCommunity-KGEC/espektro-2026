import { notFound, redirect } from "next/navigation";
import { getCurrentUser, hasClubPermission } from "@/lib/rbac";
import { DetailedReferralLeaderboard } from "@/components/admin/detailed-referral-leaderboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ClubReferralPage({
    params,
}: {
    params: Promise<{ clubId: string }>;
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const { clubId } = await params;
    const canView = await hasClubPermission(user.id, clubId, ["club-admin"]);

    if (!canView) return notFound();

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/club/${clubId}/dashboard`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight capitalize">{clubId} Referrals</h1>
                    <p className="text-muted-foreground">
                        Top performers for your club&apos;s events.
                    </p>
                </div>
            </div>

            <DetailedReferralLeaderboard clubId={clubId} />
        </div>
    );
}
