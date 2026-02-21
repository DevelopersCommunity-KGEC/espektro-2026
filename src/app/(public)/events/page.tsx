import React from "react";
import { getPublicEvents } from "@/actions/event-actions";
import { EventsPageContent } from "@/components/events/events-page-content";

export const dynamic = "force-dynamic";

export default async function PublicEventsPage() {
  const events = await getPublicEvents();

  return <EventsPageContent events={events || []} />;
}
