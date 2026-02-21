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
import dbConnect from "@/lib/db";
import Ticket from "@/models/Ticket";
import { ShowTicketQr } from "@/components/events/show-ticket-qr";
import { VENUES } from "@/data/venues";

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

  const venueInfo = VENUES.find(v => v.name === event.venue);

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

  let existingTicket = null;
  if (session?.user && !event.allowMultipleBookings) {
    await dbConnect();
    if (id === "season-pass") {
      // Season pass creates individual tickets per fest-day event.
      // Check if the user already has tickets for ALL fest-day events.
      const festDays = await import("@/models/Event").then(m => m.default.find({ type: "fest-day", isVisible: true }));
      if (festDays && festDays.length > 0) {
        const festDayIds = festDays.map((e: any) => e._id);
        const userTickets = await Ticket.find({
          userId: session.user.id,
          eventId: { $in: festDayIds },
          status: { $in: ["booked", "checked-in"] },
        });
        // If the user has a ticket for every fest day, they already have the season pass
        const bookedEventIds = new Set(userTickets.map((t: any) => t.eventId.toString()));
        const allBooked = festDayIds.every((id: any) => bookedEventIds.has(id.toString()));
        if (allBooked && userTickets.length > 0) {
          existingTicket = JSON.parse(JSON.stringify(userTickets[0]));
        }
      }
    } else {
      const ticket = await Ticket.findOne({
        userId: session.user.id,
        eventId: event._id,
        status: { $in: ["booked", "checked-in"] },
      });
      if (ticket) {
        existingTicket = JSON.parse(JSON.stringify(ticket));
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <EventImageViewer title={event?.title} image={event?.image} />
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {event?.title}
              </h1>
              <p className="text-gray-500 flex items-center gap-2">
                <span>
                  {new Date(event?.date).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                  {event?.endDate && new Date(event?.date).getTime() !== new Date(event?.endDate).getTime() && (
                    <>
                      {" "}
                      -{" "}
                      {new Date(event?.endDate).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </>
                  )}
                </span>
                <span>•</span>
                <span>{event?.venue}</span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 w-full md:w-auto">
              <div className="text-left md:text-right">
                <p className="text-3xl font-bold text-blue-600">
                  {event?.price === 0 ? "Free" : `₹${event?.price}`}
                </p>
                <p className="text-sm text-gray-500">
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
            <div className="prose max-w-none text-gray-700 dark:text-gray-300 dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {event?.description}
              </ReactMarkdown>
            </div>
          </div>

          {venueInfo?.map_iframe && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Venue Location</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{venueInfo.name}</p>
              <div className="rounded-lg overflow-hidden border shadow-sm aspect-video w-full">
                <iframe
                  src={venueInfo.map_iframe}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}

          <div className="border-t pt-8">
            {event.allowBooking === false ? (
              <div className="w-full py-8 text-center text-xl font-bold text-gray-500 bg-gray-100 rounded-lg">
                No Registration Required
              </div>
            ) : existingTicket ? (
              <ShowTicketQr ticket={existingTicket} />
            ) : isSoldOut ? (
              <Button disabled className="w-full py-8 text-xl font-bold" variant="secondary">
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
