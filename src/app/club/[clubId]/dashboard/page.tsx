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
                        <Button asChild>
                            <Link href={`/club/${clubId}/events`}>View Events</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Volunteers</CardTitle>
                        <CardDescription>Manage volunteers and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="secondary">
                            <Link href={`/club/${clubId}/users`}>Manage Team</Link>
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
                            <Link href={`/scan?clubId=${clubId}`}>Open Scanner</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
