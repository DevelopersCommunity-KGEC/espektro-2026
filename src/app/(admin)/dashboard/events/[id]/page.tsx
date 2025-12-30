import React from "react";
import EventForm from "@/components/EventForm";
import { getEventById } from "@/actions/admin-actions";
import { notFound } from "next/navigation";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEventById(id);

    if (!event) {
        notFound();
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Edit Event: {event.title}</h1>
            <EventForm initialData={event} isEditing />
        </div>
    );
}
