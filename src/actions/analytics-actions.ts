"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Ticket from "@/models/Ticket";

export async function getAnalyticsData() {
  await dbConnect();

  try {
    const events = await Event.find({}).lean();

    // Calculate revenue using Ticket aggregation for accuracy
    const revenueStats = await Ticket.aggregate([
      { $match: { status: { $in: ["booked", "checked-in"] } } },
      {
        $project: {
          eventId: 1,
          computedPrice: { $ifNull: ["$price", 0] },
        },
      },
      {
        $group: {
          _id: "$eventId",
          revenue: { $sum: "$computedPrice" },
        },
      },
    ]);

    const revenueMap = new Map(
      revenueStats.map((stat) => [stat._id.toString(), stat.revenue]),
    );

    // Calculate aggregate metrics
    const totalTicketsSold = events.reduce(
      (acc, event) => acc + (event.ticketsSold || 0),
      0,
    );
    const totalRevenue = Array.from(revenueMap.values()).reduce(
      (acc, val) => acc + val,
      0,
    );

    // Get checked-in count
    const totalCheckedIn = await Ticket.countDocuments({
      status: "checked-in",
    });

    // Aggregate check-ins per event
    const checkInStats = await Ticket.aggregate([
      { $match: { status: "checked-in" } },
      { $group: { _id: "$eventId", count: { $sum: 1 } } },
    ]);

    const checkInMap = new Map(
      checkInStats.map((stat) => [stat._id.toString(), stat.count]),
    );

    // Format event data for table
    const eventStats = events.map((event: any) => {
      const checkedInCount = checkInMap.get(event._id.toString()) || 0;
      return {
        id: event._id.toString(),
        title: event.title,
        clubId: event.clubId,
        ticketsSold: event.ticketsSold || 0,
        checkedInCount,
        revenue: revenueMap.get(event._id.toString()) || 0,
        capacity: event.capacity,
        occupancy: event.capacity
          ? Math.round(((event.ticketsSold || 0) / event.capacity) * 100)
          : 0,
      };
    });

    // Sort by revenue desc
    eventStats.sort((a, b) => b.revenue - a.revenue);

    return {
      totalTicketsSold,
      totalRevenue,
      totalCheckedIn,
      eventStats,
    };
  } catch (error) {
    console.error("Analytics Error:", error);
    return {
      totalTicketsSold: 0,
      totalRevenue: 0,
      totalCheckedIn: 0,
      eventStats: [],
    };
  }
}
