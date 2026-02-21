"use server";

import { getPublicEvents } from "@/actions/event-actions";
import { DaySchedule, GanttEvent } from "@/types/landing";

export async function getTimelineData(): Promise<DaySchedule[]> {
  try {
    const dbEvents = await getPublicEvents();

    if (!dbEvents || dbEvents.length === 0) {
      // Fallback to static data if no DB events (or return empty array)
      const { schedule } = await import("@/data/landing-content");
      // Cast the static schedule to our type if needed, assuming structure matches
      return schedule as unknown as DaySchedule[];
    }

    // Group events by date (YYYY-MM-DD) in IST
    const groupedEvents: Record<string, typeof dbEvents> = {};

    dbEvents.forEach((event: any) => {
      // Skip the 4-day season pass from the Gantt chart
      if (event.title.toLowerCase().includes("season pass")) return;

      // Use IST for grouping
      const d = new Date(event.date);
      const istDate = new Date(
        d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      );
      const key = istDate.toDateString();
      if (!groupedEvents[key]) groupedEvents[key] = [];
      groupedEvents[key].push(event);
    });

    const days = Object.keys(groupedEvents).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );

    return days.map((dateStr, index) => {
      const dateObj = new Date(dateStr); // This str is already "Fri Mar 14 ..." from IST conversion
      const eventsForDay = groupedEvents[dateStr];

      const mappedEvents: GanttEvent[] = eventsForDay.map((e: any) => {
        const d = new Date(e.date);
        // Convert to IST for hour calculation
        // We can get hours from string or shift the time
        // IST is UTC + 5:30
        // But relying on toLocaleString is safer
        const istTimeStr = d.toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        });
        // istTimeStr "09:30" or "23:15"
        const [h, m] = istTimeStr.split(":").map(Number);

        // Handle edge case where 24:00 might appear (rare in JS Date, usually 00:00)
        // If it's early morning (e.g. 00:00 - 04:00), it technically belongs to the "Previous Night"
        // for a fest context, but grouping by date puts it in next day.
        // For simplicity, let's just use the hour.

        const startHour = h + m / 60;

        // Default duration 2 hours if not present
        let duration = 2;
        if (e.endDate) {
          const endD = new Date(e.endDate);

          // Calculate duration in hours using timestamps to handle multi-day events correctly
          const durationMs = endD.getTime() - d.getTime();
          duration = durationMs / (1000 * 60 * 60);

          // Ensure minimum duration of 1 hour for visibility in Gantt chart
          if (duration <= 0) {
            duration = 1;
          }
        }

        let category: GanttEvent["category"] = "technical"; // Default
        const lowerTitle = e.title.toLowerCase();

        if (
          e.type === "fest-day" ||
          lowerTitle.includes("night") ||
          lowerTitle.includes("pro")
        )
          category = "cultural";
        else if (
          lowerTitle.includes("ceremony") ||
          lowerTitle.includes("inauguration")
        )
          category = "ceremony";
        else if (lowerTitle.includes("food")) category = "food";
        else if (
          lowerTitle.includes("game") ||
          lowerTitle.includes("bgmi") ||
          lowerTitle.includes("valorant")
        )
          category = "gaming";
        else if (
          lowerTitle.includes("workshop") ||
          lowerTitle.includes("hackathon") ||
          lowerTitle.includes("code")
        )
          category = "technical";

        return {
          _id: e._id || e.id,
          name: e.title,
          category,
          startHour,
          duration,
          prize: e.description.includes("Prize") ? "See details" : undefined, // Naive extraction
        };
      });

      return {
        day: `Day ${index + 1}`,
        date: dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        label: getDayLabel(index),
        events: mappedEvents.sort((a, b) => a.startHour - b.startHour),
      };
    });
  } catch (error) {
    console.error("Failed to fetch timeline data:", error);
    const { schedule } = await import("@/data/landing-content");
    return schedule;
  }
}

function getDayLabel(index: number): string {
  const labels = ["Genesis", "Evolution", "Revolution", "Celebration"];
  return labels[index] || "Event Day";
}
