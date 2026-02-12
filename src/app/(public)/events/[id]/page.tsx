import React from "react";
import { getPublicEventById } from "@/actions/event-actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookButton } from "@/components/events/book-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { EditEventModal } from "@/components/events/edit-event-modal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { EventImageViewer } from "@/components/events/event-image-viewer";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getPublicEventById(id);

  if (!event) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userEmail = session?.user?.email;
  const isAdmin = session?.user?.role === "super-admin";
  const isEditor =
    userEmail && event.editors && event.editors.includes(userEmail);
  const canEdit = isAdmin || isEditor;

  const isSoldOut =
    event.capacity !== -1 && event.ticketsSold >= event.capacity;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
        <EventImageViewer title={event?.title} image={event?.image} />
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {event?.title}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <span>
                  {new Date(event?.date).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
                <span>•</span>
                <span>{event?.venue}</span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 w-full md:w-auto">
              <div className="text-left md:text-right">
                <p className="text-3xl font-bold text-primary">
                  {event?.price === 0 ? "Free" : `₹${event?.price}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {event?.capacity === -1
                    ? "Unlimited tickets"
                    : `${event?.capacity - event?.ticketsSold} tickets left`}
                </p>
              </div>
              {canEdit && <EditEventModal event={event} />}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">About this event</h3>
            <div className="prose max-w-none text-muted-foreground dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {event?.description}
              </ReactMarkdown>
            </div>
          </div>

          <div className="border-t pt-8">
            {isSoldOut ? (
              <Button
                disabled
                className="w-full py-8 text-xl font-bold"
                variant="secondary"
              >
                Sold Out
              </Button>
            ) : (
              <BookButton eventId={event?._id.toString()} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
