import React from "react";
import EventForm from "@/components/EventForm";

export default function NewEventPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Add New Event</h1>
            <EventForm />
        </div>
    );
}
