"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Expand } from "lucide-react";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EventData } from "@/types";
import Link from "next/link";

interface EventCardProps {
  event: EventData;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Set Locale for Moment if not global
  // moment.locale('en-IN') // Optional

  // Convert dates to IST Date objects for Moment handling
  // Moment might use local time of the user's browser, which is typically desired.
  // But request asks for explicit Kolkata/IST.
  // Since Moment parses Date objects in local time, and `toLocaleString` with timezone does string.
  // We can use native Intl for consistent timezone rendering or use moment-timezone if installed.
  // Assuming moment-timezone is NOT installed, we use native formatting.

  const formatDate = (date: Date | string, options: Intl.DateTimeFormatOptions) => {
    // Note: 'width' is not valid in options, so removing it. Using valid options.
    return new Date(date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", ...options });
  }

  // Handle data inconsistencies (API vs Legacy types)
  const displayImage =
    event.image ||
    (event.eventImages && event.eventImages.length > 0
      ? event.eventImages[0].url
      : "/images/placeholder.webp");

  const displayPrice =
    event.price !== undefined ? event.price : event.eventPrice;
  const isFree = displayPrice === 0 || displayPrice === "0" || !displayPrice;

  const eventDate = event.date
    ? new Date(event.date)
    : event.startTime
      ? new Date(event.startTime)
      : new Date();

  const eventEndDate = event.endDate ? new Date(event.endDate) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-card dark:bg-zinc-900 rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-60 w-full overflow-hidden">
        <img
          src={displayImage}
          alt={event.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-3">
            {/* <span className="flex items-center gap-1 bg-secondary/10 text-secondary-foreground px-2 py-0.5 rounded-md">
              {event.type === "fest-day" ? "Pro Show" : "Event"}
            </span> */}
            {event.eventOrganiserClub && (
              <span className="flex items-center gap-1 border border-border px-2 py-0.5 rounded-md">
                {event.eventOrganiserClub.name}
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2 text-primary/70" />
              <span>
                {formatDate(eventDate, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} •{" "}
                {formatDate(eventDate, { hour: 'numeric', minute: 'numeric', hour12: true })}
                {eventEndDate && eventDate.getTime() !== eventEndDate.getTime() && (
                  <>
                    {" "}
                    -{" "}
                    {new Date(eventDate).getDate() === new Date(eventEndDate).getDate()
                      ? formatDate(eventEndDate, { hour: 'numeric', minute: 'numeric', hour12: true })
                      : formatDate(eventEndDate, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2 text-primary/70" />
              <span className="line-clamp-1">
                {event.venue || event.eventVenue || "To be announced"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            {/* <span className="line-clamp-2">{event.description}</span> */}
          </div>
        </div>

        {/* Actions & Price */}
        <div className="pt-4 border-t border-border flex items-center justify-between gap-3 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium">
              Entry Fee
            </span>
            {isFree ? (
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                Free
              </span>
            ) : (
              <span className="text-lg font-bold text-primary">
                ₹{displayPrice}
              </span>
            )}
          </div>
          <Button asChild variant="theatrical" className="group/btn h-10">
            <Link href={`/events/${event._id}`}>
              Details
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
