
import React from "react";
import Link from "next/link";
import { getClubEvents } from "@/actions/admin-actions";
import { hasClubPermission, getCurrentUser } from "@/lib/rbac";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Edit } from "lucide-react";

export default async function ClubEventsPage({ params }: { params: Promise<{ clubId: string }> }) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const { clubId } = await params;

    const canView = await hasClubPermission(user.id, clubId, ["club-admin", "volunteer", "event-editor"]);
    if (!canView) return notFound();

    const canCreate = await hasClubPermission(user.id, clubId, ["club-admin"]);
    const canEdit = await hasClubPermission(user.id, clubId, ["club-admin", "event-editor"]);

    const events = await getClubEvents(clubId);

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold capitalize">{clubId} Events</h1>
                {canCreate && (
                    <Button asChild>
                        {/* Note: We might need a clean way to create events scoped to a club. 
                            The admin 'new' page might need club context or we create a specific one.
                            For now, link to admin new if user is generic admin, 
                            or we reuse the EventForm component in a new page.
                            Let's assume we link to a page we'll allow access to.
                        */}
                        <Link href={`/club/${clubId}/events/new`}>
                            <Plus className="mr-2 h-4 w-4" /> Add Event
                        </Link>
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground py-10">
                        No events found for this club.
                    </div>
                ) : (
                    events.map((event: any) => (
                        <Card key={event._id} className="overflow-hidden">
                            <div className="h-48 bg-muted relative">
                                {event.image ? (
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-start gap-2">
                                    <span className="truncate">{event.title}</span>
                                    {canEdit && (
                                        <Link href={`/club/${clubId}/events/${event._id}/edit`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {new Date(event.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} at {event.venue}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {event.description}
                                </p>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span>
                                        {event.price > 0 ? `₹${event.price}` : "Free"}
                                    </span>
                                    <span className={event.ticketsSold >= event.capacity && event.capacity !== -1 ? "text-red-500" : "text-green-500"}>
                                        {event.ticketsSold} / {event.capacity === -1 ? "∞" : event.capacity} Sold
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
