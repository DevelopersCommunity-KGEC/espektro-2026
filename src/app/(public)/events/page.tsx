import React, { Suspense } from "react";
import { getPublicEvents } from "@/actions/event-actions";
import { EventsGridSkeleton } from "@/components/skeletons";
import { EventsList } from "@/components/events/events-list";

export const dynamic = "force-dynamic";

export default async function PublicEventsPage() {
  const events = await getPublicEvents();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Suspense fallback={<EventsGridSkeleton />}>
        <EventsList initialEvents={events} />
      </Suspense>
    </div>
  );
}
