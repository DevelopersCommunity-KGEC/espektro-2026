import { notFound, redirect } from "next/navigation";
import { hasClubPermission, getCurrentUser } from "@/lib/rbac";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ClubDashboardPage({ params }: { params: Promise<{ clubId: string }> }) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const { clubId } = await params;

    // Check permission
    const canView = await hasClubPermission(user.id, clubId, ["club-admin", "volunteer", "event-editor"]);
    if (!canView) return notFound();

    const canManageTeam = await hasClubPermission(user.id, clubId, ["club-admin"]);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 capitalize">{clubId} Club Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Events</CardTitle>
                        <CardDescription>Manage your club events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant={"outline"}>
                            <Link href={`/club/${clubId}/events`}>View Events</Link>
                        </Button>
                    </CardContent>
                </Card>

                {canManageTeam && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Volunteers</CardTitle>
                            <CardDescription>Manage volunteers and permissions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline">
                                <Link href={`/club/${clubId}/users`}>Manage Team</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {canManageTeam && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Coupons</CardTitle>
                            <CardDescription>Manage discount codes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline">
                                <Link href={`/club/${clubId}/coupons`}>Manage Coupons</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Referrals & Leaderboard</CardTitle>
                        <CardDescription>Track attributing users & sales</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline">
                            <Link href={`/club/${clubId}/referrals`}>View Leaderboard</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Participants</CardTitle>
                        <CardDescription>View all ticket holders and attendees</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline">
                            <Link href={`/club/${clubId}/participants`}>View Participants</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Scanner</CardTitle>
                        <CardDescription>Scan tickets for your events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline">
                            <Link href="/scan">Open Scanner</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
