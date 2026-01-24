import React, { Suspense } from "react";
import { getMyTickets } from "@/actions/ticket-actions";
import TicketCard from "@/components/tickets/ticket-card";
import { MyTicketsSkeleton } from "@/components/skeletons";

async function TicketsList() {
    const tickets = await getMyTickets();

    if (tickets.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
                <p className="text-gray-500 text-lg">You haven't booked any tickets yet.</p>
                <a href="/events" className="text-blue-600 font-semibold hover:underline mt-2 block">
                    Browse events
                </a>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((ticket: any) => (
                <TicketCard key={ticket._id} ticket={ticket} />
            ))}
        </div>
    );
}

export default function MyTicketsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">My Tickets</h1>
            <Suspense fallback={<MyTicketsSkeleton />}>
                <TicketsList />
            </Suspense>
        </div>
    );
}
