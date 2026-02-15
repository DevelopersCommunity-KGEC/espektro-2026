"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";

export async function getPublicEvents() {
  await dbConnect();
  const events = await Event.find({ isVisible: true }).sort({ date: 1 });

  const eventsList = JSON.parse(JSON.stringify(events));

  // Construct Season Pass
  const festDays = eventsList.filter((e: any) => e.type === "fest-day");
  if (festDays.length > 0) {
    const totalPrice = festDays.reduce(
      (acc: number, curr: any) => acc + curr.price,
      0,
    );

    // Calculate min availability
    let minAvailable = Infinity;
    festDays.forEach((e: any) => {
      let available;
      if (e.capacity === -1) {
        available = Infinity;
      } else {
        available = e.capacity - e.ticketsSold;
      }
      if (available < minAvailable) minAvailable = available;
    });
    if (minAvailable === Infinity) minAvailable = -1;

    const seasonPass = {
      _id: "season-pass",
      title: "Espektro Season Pass (All 4 Days)",
      description:
        "Get access to all 4 days of Espektro Pro Shows with a single pass! Includes: " +
        festDays.map((e: any) => e.title).join(", "),
      image: festDays[0].image, // Use first day image
      date: festDays[0].date,
      venue: festDays[0].venue || "Espektro Ground",
      price: totalPrice,
      capacity: minAvailable, // Trick: capacity = available, sold = 0
      ticketsSold: 0,
      type: "fest-day",
      clubId: "espektro",
      isVisible: true,
      allowMultipleBookings: true,
      allowBooking: true,
      maxTeamSize: 1,
    };

    // Add to top of list
    eventsList.unshift(seasonPass);
  }

  return eventsList;
}

export async function getPublicEventById(id: string) {
  await dbConnect();

  if (id === "season-pass") {
    const festDays = await Event.find({
      type: "fest-day",
      isVisible: true,
    }).sort({ date: 1 });
    if (!festDays || festDays.length === 0) return null;

    const festDaysJson = JSON.parse(JSON.stringify(festDays));

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
      image: festDaysJson[0].image,
      date: festDaysJson[0].date,
      venue: festDaysJson[0].venue || "Espektro Ground",
      price: totalPrice,
      capacity: minAvailable,
      ticketsSold: 0,
      type: "fest-day",
      clubId: "espektro",
      isVisible: true,
      allowMultipleBookings: true,
      allowBooking: true,
      maxTeamSize: 1,
      editors: [],
      winners: [],
    };
  }

  const event = await Event.findOne({ _id: id, isVisible: true });
  // console.log(event);
  return event ? JSON.parse(JSON.stringify(event)) : null;
}
