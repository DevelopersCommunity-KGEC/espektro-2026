
import React from "react";
import EventForm from "@/components/events/event-form";
import { getCurrentUser, hasClubPermission } from "@/lib/rbac";
import { redirect, notFound } from "next/navigation";

export default async function NewClubEventPage({ params }: { params: Promise<{ clubId: string }> }) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const { clubId } = await params;

    const canCreate = await hasClubPermission(user.id, clubId, ["club-admin"]);
    if (!canCreate) return notFound();

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 capitalize">Create {clubId} Event</h1>
            <EventForm
                initialData={{ clubId }} lockedClubId={clubId} redirectPath={`/club/${clubId}/events`}
            />
        </div>
    );
}
