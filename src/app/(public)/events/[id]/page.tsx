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
import { clubs } from "@/data/clubs";
import Image from "next/image";

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

  const clubName = event.clubId ? clubs.find(c => c.id === event.clubId)?.name : null;

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
    <main
      className="relative min-h-screen overflow-hidden z-10"
      style={{ backgroundColor: "#FFF8F0" }}
      id="event-details-page"
      data-section-id="events-page"
    >
      {/* Lotus Mandala Background */}
      <div className="fixed inset-0 top-[30%] flex items-center justify-center opacity-[0.9] pointer-events-none z-0">
        <Image
          src="/images/background_web.webp"
          alt="Decorative lotus mandala"
          fill
          priority
          className="object-contain hidden md:block"
        />
        <Image
          src="/images/background_web_mobile.webp"
          alt="Decorative lotus mandala"
          fill
          priority
          className="object-contain w-fit md:hidden"
        />
      </div>

      {/* Left tribal border pattern */}
      <div
        className="absolute top-0 left-0 bottom-0 w-16 md:w-24 overflow-hidden hidden sm:block z-10"
        style={{
          backgroundImage: "url(/images/43a0b75b3caae95caa70550adda8ed60.webp)",
          backgroundRepeat: "repeat-y",
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
        }}
      />

      <div className="relative z-20 max-w-6xl mx-auto px-4 py-12 sm:pl-24 md:pl-32 lg:pl-40">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-[#2C1810]/5">
          <EventImageViewer title={event?.title} image={event?.image} />
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
              <div className="flex-grow">
                <h1 className="text-4xl md:text-5xl font-bold mb-3 text-[#2C1810] font-[family-name:var(--font-medieval-sharp)]">
                  {event?.title}
                </h1>
                {clubName && (
                  <p className="text-lg text-[#8B2635] font-bold mb-4 font-[family-name:var(--font-roboto-slab)]">
                    Hosted by {clubName}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#4A3428]/70 font-[family-name:var(--font-roboto-slab)]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B7410E]" />
                    {new Date(event?.date).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                  {event?.endDate && new Date(event?.date).getTime() !== new Date(event?.endDate).getTime() && (
                    <span className="flex items-center gap-1.5">
                      <span className="opacity-50">—</span>
                      {new Date(event?.endDate).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  )}
                  <span className="hidden md:inline opacity-30">|</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B2635]" />
                    {event?.venue}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 w-full md:w-auto shrink-0">
                <div className="text-left md:text-right w-full">
                  <p className="text-4xl font-bold text-[#B7410E] font-[family-name:var(--font-medieval-sharp)]">
                    {event?.price === 0 ? "Free" : `₹${event?.price}`}
                  </p>
                  <p className="text-sm font-medium text-[#4A3428]/60 font-[family-name:var(--font-open-sans)]">
                    {event?.capacity === -1
                      ? "UNLIMITED TICKETS"
                      : `${event?.capacity - event?.ticketsSold} TICKETS LEFT`}
                  </p>
                </div>
                {canEdit && <EditEventModal event={event} />}
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-xl text-[#8B2635] tracking-wide mb-4 font-bold uppercase font-[family-name:var(--font-roboto-slab)] border-b border-[#8B2635]/10 pb-2">
                About this event
              </h3>
              <div className="prose max-w-none text-[#2C1810]/80 font-[family-name:var(--font-open-sans)] leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {event?.description}
                </ReactMarkdown>
              </div>
            </div>

            {venueInfo?.map_iframe && (
              <div className="mb-10">
                <h3 className="text-xl text-[#8B2635] tracking-wide mb-4 font-bold uppercase font-[family-name:var(--font-roboto-slab)] border-b border-[#8B2635]/10 pb-2">
                  Venue Location
                </h3>
                <p className="text-[#4A3428]/80 font-medium mb-4 font-[family-name:var(--font-open-sans)]">{venueInfo.name}</p>
                <div className="rounded-xl overflow-hidden border border-[#2C1810]/10 shadow-lg aspect-video w-full">
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

            <div className="border-t border-[#2C1810]/10 pt-8 mt-12">
              {event.allowBooking === false ? (
                <div className="w-full py-10 text-center text-2xl font-bold text-[#4A3428]/30 bg-[#FFF8F0] rounded-2xl border-2 border-dashed border-[#4A3428]/10 font-[family-name:var(--font-medieval-sharp)]">
                  No Registration Required
                </div>
              ) : existingTicket ? (
                <ShowTicketQr ticket={existingTicket} />
              ) : isSoldOut ? (
                <Button disabled variant="theatrical" className="w-full h-auto py-8 text-2xl font-bold opacity-50 grayscale font-[family-name:var(--font-medieval-sharp)]">
                  Sold Out
                </Button>
              ) : (
                <BookButton eventId={event?._id.toString()} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
