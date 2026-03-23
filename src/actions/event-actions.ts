"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Ticket from "@/models/Ticket";
import mongoose from "mongoose";

export async function getPublicEvents() {
  try {
    await dbConnect();
    const events = await Event.find({ isVisible: true }).sort({ date: 1 });

    // Manually compute ticketsSold for each event
    const eventsList = await Promise.all(
      events.map(async (event) => {
        try {
          const eventObj = JSON.parse(JSON.stringify(event));
          // Backward compatibility for missing endDate
          if (!eventObj.endDate) {
            eventObj.endDate = eventObj.date;
          }

          if (event.type === "season-pass") {
            const originIds = [event._id.toString()];
            if (originIds[0] !== "season-pass") originIds.push("season-pass");

            const distinctPayments = await Ticket.find({
              origin: { $in: originIds },
              status: { $in: ["booked", "checked-in"] },
            }).distinct("paymentId");
            return {
              ...eventObj,
              ticketsSold: distinctPayments.length,
            };
          }
          const soldCount = await Ticket.countDocuments({
            eventId: event._id,
            status: { $in: ["booked", "checked-in"] },
          });
          return {
            ...eventObj,
            ticketsSold: soldCount,
          };
        } catch (e) {
          console.error(`Error processing event ${event._id}:`, e);
          return {
            ...JSON.parse(JSON.stringify(event)),
            ticketsSold: 0,
          };
        }
      }),
    );

    // Construct Season Pass
    const festDays = eventsList.filter((e: any) => e.type === "fest-day");
    const existingSeasonPass = eventsList.find(
      (e: any) => e.type === "season-pass",
    );

    // Check if a real season pass exists (even if hidden) because if so,
    // we should NOT generate a virtual one if it's hidden (admin explicitly hid it)
    const realSeasonPass = await Event.findOne({ type: "season-pass" });
    const isSeasonPassHidden = realSeasonPass && !realSeasonPass.isVisible;

    if (festDays && festDays.length > 0) {
      // Calculate min availability across fest days
      let minAvailable = Infinity;
      festDays.forEach((e: any) => {
        let available;
        if (e.capacity === -1) {
          available = Infinity;
        } else {
          available = (e.capacity || 0) - (e.ticketsSold || 0);
        }
        if (available < minAvailable) minAvailable = available;
      });
      if (minAvailable === Infinity) minAvailable = -1;

      if (existingSeasonPass) {
        // Hardcode image for season pass (and move to top)
        existingSeasonPass.image =
          "https://res.cloudinary.com/ds5reytim/image/upload/v1774300194/Schedule_s4hvwd.png";

        // If real season pass exists (and is visible), update its capacity constraint
        // It must respect the minimum availability of any single fest day
        if (existingSeasonPass.capacity === -1) {
          existingSeasonPass.capacity = minAvailable;
        } else {
          // If manual capacity is set, take the stricter of manual vs calculated
          if (minAvailable !== -1) {
            existingSeasonPass.capacity = Math.min(
              existingSeasonPass.capacity,
              minAvailable,
            );
          }
        }

        // Move to top
        const index = eventsList.indexOf(existingSeasonPass);
        if (index > -1) {
          eventsList.splice(index, 1);
          eventsList.unshift(existingSeasonPass);
        }
      } else if (!isSeasonPassHidden) {
        // Create virtual Season Pass (Fallback), ONLY if not explicitly hidden
        const totalPrice = festDays.reduce(
          (acc: number, curr: any) => acc + (curr.price || 0),
          0,
        );

        // Count tickets sold for virtual season pass
        const distinctPayments = await Ticket.find({
          origin: "season-pass",
          status: { $in: ["booked", "checked-in"] },
        }).distinct("paymentId");

        const seasonPass = {
          _id: "season-pass",
          title: "Espektro Season Pass (All 4 Days)",
          description:
            "Get access to all 4 days of Espektro Pro Shows with a single pass! Includes: " +
            festDays.map((e: any) => e.title || "TBA").join(", "),
          image:
            "https://res.cloudinary.com/ds5reytim/image/upload/v1774300194/Schedule_s4hvwd.png",
          date: festDays[0]?.date,
          endDate:
            festDays[festDays.length - 1]?.endDate ||
            festDays[festDays.length - 1]?.date,
          venue: festDays[0]?.venue || "Espektro Ground",
          price: totalPrice,
          capacity: minAvailable,
          ticketsSold: distinctPayments.length,
          type: "season-pass", // Ensure type is consistent, even if virtual
          clubId: "espektro",
          isVisible: true,
          allowMultipleBookings: true,
          allowBooking: true,
          maxTeamSize: 1,
        };

        // Add to top of list
        eventsList.unshift(seasonPass);
      }
    }

    return eventsList;
  } catch (error) {
    console.error("Error in getPublicEvents:", error);
    return []; // Return empty array instead of throwing to prevent page crash
  }
}

export async function getPublicEventById(id: string) {
  await dbConnect();

  let event = null;

  // 1. Handle "season-pass" alias or specific ID
  if (id === "season-pass") {
    // Try to find real event first, preferring the latest one if multiple exist
    event = await Event.findOne({ type: "season-pass", isVisible: true }).sort({
      date: -1,
    });
  } else {
    // Try by ID if valid
    // @ts-ignore
    if (mongoose.Types.ObjectId.isValid(id)) {
      event = await Event.findOne({ _id: id, isVisible: true });
    }
  }

  // 2. If no real event found, and ID was "season-pass", generate virtual
  if (!event && id === "season-pass") {
    // Check if a real season pass exists but is HIDDEN
    const hidden = await Event.findOne({
      type: "season-pass",
      isVisible: false,
    });
    if (hidden) return null; // Respect hidden status (return 404, do NOT fallback to virtual)

    const festDays = await Event.find({
      type: "fest-day",
      isVisible: true,
    }).sort({ date: 1 });
    if (!festDays || festDays.length === 0) return null;

    // Calculate ticketsSold for each festDay
    const festDaysJson = await Promise.all(
      festDays.map(async (event) => {
        const soldCount = await Ticket.countDocuments({
          eventId: event._id,
          status: { $in: ["booked", "checked-in"] },
        });
        return {
          ...JSON.parse(JSON.stringify(event)),
          ticketsSold: soldCount,
        };
      }),
    );

    const bundleSales = await Ticket.find({
      origin: "season-pass",
      status: { $in: ["booked", "checked-in"] },
    }).distinct("paymentId");

    const totalPrice = festDaysJson.reduce(
      (acc: number, curr: any) => acc + curr.price,
      0,
    );

    let minAvailable = Infinity;
    festDaysJson.forEach((e: any) => {
      let available;
      if (e.capacity === -1) {
        available = Infinity;
      } else {
        available = e.capacity - e.ticketsSold;
      }
      if (available < minAvailable) minAvailable = available;
    });
    if (minAvailable === Infinity) minAvailable = -1;

    return {
      _id: "season-pass",
      title: "Espektro Season Pass (All 4 Days)",
      description:
        "Get access to all 4 days of Espektro Pro Shows with a single pass! Includes: " +
        festDaysJson.map((e: any) => e.title).join(", "),
      image:
        "https://res.cloudinary.com/ds5reytim/image/upload/v1774300194/Schedule_s4hvwd.png",
      date: festDaysJson[0].date,
      endDate:
        festDaysJson[festDaysJson.length - 1].endDate ||
        festDaysJson[festDaysJson.length - 1].date,
      venue: festDaysJson[0].venue || "Espektro Ground",
      price: totalPrice,
      capacity: minAvailable,
      ticketsSold: bundleSales.length,
      type: "season-pass",
      clubId: "espektro",
      isVisible: true,
      allowMultipleBookings: true,
      allowBooking: true,
      maxTeamSize: 1,
      editors: [],
      winners: [],
    };
  }

  if (!event) return null;

  // 3. If real event found (Season Pass or Normal), attach sold count
  let ticketsSold = 0;
  if (event.type === "season-pass") {
    const originIds = [event._id.toString()];
    if (originIds[0] !== "season-pass") originIds.push("season-pass");

    const distinctPayments = await Ticket.find({
      origin: { $in: originIds },
      status: { $in: ["booked", "checked-in"] },
    }).distinct("paymentId");
    ticketsSold = distinctPayments.length;
  } else {
    ticketsSold = await Ticket.countDocuments({
      eventId: event._id,
      status: { $in: ["booked", "checked-in"] },
    });
  }

  let eventObj = JSON.parse(JSON.stringify(event));
  // Hardcode season pass image
  if (eventObj.type === "season-pass") {
    eventObj.image =
      "https://res.cloudinary.com/ds5reytim/image/upload/v1774300194/Schedule_s4hvwd.png";
  }
  // Backward compatibility for missing endDate
  if (!eventObj.endDate) {
    eventObj.endDate = eventObj.date;
  }

  // 4. If it is a real Season Pass, enforce fest-day capacity constraints
  if (event.type === "season-pass") {
    const festDays = await Event.find({ type: "fest-day", isVisible: true });

    // Calculate remaining capacity on fest days
    let minAvailable = Infinity;

    for (const day of festDays) {
      if (day.capacity === -1) continue;

      const daySold = await Ticket.countDocuments({
        eventId: day._id,
        status: { $in: ["booked", "checked-in"] },
      });

      const available = day.capacity - daySold;
      if (available < minAvailable) minAvailable = available;
    }

    if (minAvailable === Infinity) minAvailable = -1;

    // Update capacity to be the stricter of the two
    // (Manual Limit vs Physical Availability)
    // Note: ticketsSold for season pass is already physically counting against fest day capacity
    // because verifyPayment creates tickets for them?
    // Wait, verifyPayment creates tickets for fest days.
    // So `daySold` INCLUDES season pass holders (if logic creates tickets for them).
    // So `minAvailable` IS the true remaining slots for season passes.
    // So we should report capacity as `ticketsSold + minAvailable`.

    if (minAvailable !== -1) {
      if (eventObj.capacity === -1) {
        eventObj.capacity = ticketsSold + minAvailable;
      } else {
        eventObj.capacity = Math.min(
          eventObj.capacity,
          ticketsSold + minAvailable,
        );
      }
    }
  }

  return { ...eventObj, ticketsSold };
}
