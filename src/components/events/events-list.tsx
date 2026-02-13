"use client";

import React, { useState, useMemo } from "react";
import EventCard from "@/components/EventCard/EventCard";
import { ClubFilter } from "@/components/events/club-filter";
import { motion, AnimatePresence } from "framer-motion";
import { SearchX } from "lucide-react";

interface EventsListProps {
  initialEvents: any[];
}

export function EventsList({ initialEvents }: EventsListProps) {
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleClub = (clubId: string) => {
    setSelectedClubs((prev) =>
      prev.includes(clubId)
        ? prev.filter((id) => id !== clubId)
        : [...prev, clubId],
    );
  };

  const resetFilters = () => {
    setSelectedClubs([]);
    setSearchQuery("");
  };

  const filteredEvents = useMemo(() => {
    return initialEvents.filter((event) => {
      // 1. Filter by Club
      // If no clubs selected, show all.
      // Special Logic: "Season Pass" usually belongs to 'espektro' or is special.
      // If 'espektro' is selected, show 'espektro' events AND 'season-pass'.
      // If ANY club is selected, check if event.clubId is in the list.
      const matchesClub =
        selectedClubs.length === 0 ||
        (event.clubId && selectedClubs.includes(event.clubId)) ||
        (selectedClubs.includes("espektro") && event._id === "season-pass"); // Ensure season pass shows with Espektro

      // 2. Filter by Search (Optional enhancement, good for UX)
      // const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesClub;
    });
  }, [initialEvents, selectedClubs]);

  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups: { [date: string]: any[] } = {};

    filteredEvents.forEach((event) => {
      const eventDate = event.date
        ? new Date(event.date)
        : event.startTime
          ? new Date(event.startTime)
          : new Date();

      // Normalize to YYYY-MM-DD for grouping
      const dateKey = eventDate.toISOString().split("T")[0];

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });

    // Sort dates
    const sortedDates = Object.keys(groups).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );

    return sortedDates.map((date) => ({
      date,
      events: groups[date],
    }));
  }, [filteredEvents]);

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header & Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Upcoming Events
        </h1>

        <div className="flex items-center gap-4">
          {selectedClubs.length > 0 && (
            <p className="text-sm text-muted-foreground hidden md:block">
              {selectedClubs.length} club{selectedClubs.length !== 1 ? "s" : ""}{" "}
              selected
            </p>
          )}
          <ClubFilter
            selectedClubs={selectedClubs}
            onToggleClub={toggleClub}
            onReset={resetFilters}
          />
        </div>
      </div>

      {/* Grouped Events */}
      {groupedEvents.length > 0 ? (
        <div className="space-y-12">
          {groupedEvents.map((group) => (
            <section
              key={group.date}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-primary/80 border-l-4 border-primary pl-4">
                  {formatDateHeader(group.date)}
                </h2>
                <div className="h-px bg-border flex-grow mt-1 opacity-50"></div>
              </div>

              <motion.div
                layout
                className="flex overflow-x-auto gap-6 pb-6 p-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
              >
                <AnimatePresence mode="popLayout">
                  {group.events.map((event) => (
                    <motion.div
                      layout
                      key={event._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 w-[320px] sm:w-[380px]"
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </section>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-secondary/20 p-4 rounded-full mb-4">
            <SearchX className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No events found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters to see more events.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
