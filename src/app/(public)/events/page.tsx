import React, { Suspense } from "react";
import Link from "next/link";
import { getPublicEvents } from "@/actions/event-actions";
import { EventsGridSkeleton } from "@/components/skeletons";

async function EventsGrid() {
    const events = await getPublicEvents();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event: any) => (
                <div key={event._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                        <p className="text-sm text-gray-500 mb-2">
                            {new Date(event.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} &bull; {event.venue}
                        </p>
                        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-600 font-semibold">₹{event.price}</span>
                            <Link
                                href={`/events/${event._id}`}
                                className="bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-800"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function PublicEventsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-center">Upcoming Events</h1>

            <Suspense fallback={<EventsGridSkeleton />}>
                <EventsGrid />
            </Suspense>
        </div>
    );
}
