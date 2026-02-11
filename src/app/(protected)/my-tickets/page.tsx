import React, { Suspense } from "react";
import { getMyTickets } from "@/actions/ticket-actions";
import { getMyReferralCode, getMyReferralStats } from "@/actions/user-actions";
import TicketCard from "@/components/tickets/ticket-card";
import { MyTicketsSkeleton } from "@/components/skeletons";
import { ReferralSection } from "@/components/user/referral-section";

async function TicketsList() {
    const tickets = await getMyTickets();

    if (tickets.length === 0) {
        return (
            <div className="text-center py-20 bg-muted rounded-2xl border-2 border-dashed">
                <p className="text-muted-foreground text-lg">You haven't booked any tickets yet.</p>
                <a href="/events" className="text-primary font-semibold hover:underline mt-2 block">
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

export default async function MyTicketsPage() {
    // Fetch referral data in parallel
    const [referralData, stats] = await Promise.all([
        getMyReferralCode(),
        getMyReferralStats()
    ]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">My Tickets</h1>

            <ReferralSection code={referralData.code} stats={stats} />

            <Suspense fallback={<MyTicketsSkeleton />}>
                <TicketsList />
            </Suspense>
        </div>
    );
}
