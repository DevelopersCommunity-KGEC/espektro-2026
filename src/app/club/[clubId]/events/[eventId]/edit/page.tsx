
import React from "react";
import EventForm from "@/components/events/event-form";
import { getEventById } from "@/actions/admin-actions";
import { getCurrentUser, canEditEvent } from "@/lib/rbac";
import { notFound, redirect } from "next/navigation";

export default async function EditClubEventPage({ params }: { params: Promise<{ clubId: string; eventId: string }> }) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const { clubId, eventId } = await params;

    // Validate IDs
    if (!clubId || !eventId) return notFound();

    const event = await getEventById(eventId);

    if (!event) notFound();

    // Verify event belongs to club (security check)
    // event.clubId might be populated if someone changed getEventById. 
    // Assuming string based on model.
    const eventClubId = (typeof event.clubId === 'object' && event.clubId !== null) ? event.clubId.id || event.clubId._id : event.clubId;

    if (String(eventClubId) !== clubId) {
        return notFound();
    }

    const authorized = await canEditEvent(user.id, eventId);
    if (!authorized) return notFound();

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 capitalize">Edit {clubId} Event</h1>
            <EventForm
                initialData={event}
                isEditing lockedClubId={clubId} redirectPath={`/club/${clubId}/events`}
            />
        </div>
    );
}
