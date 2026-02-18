"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Ticket from "@/models/Ticket";

export async function getAnalyticsData(excludeManual = false) {
  await dbConnect();

  try {
    const events = await Event.find({}).lean();

    // Base match: only booked/checked-in tickets, optionally exclude manual
    const baseMatch: any = { status: { $in: ["booked", "checked-in"] } };
    if (excludeManual) {
      baseMatch.issueType = { $nin: ["manual", "pass"] };
    }

    // Calculate revenue using Ticket aggregation for accuracy
    const revenueStats = await Ticket.aggregate([
      { $match: baseMatch },
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

    const revenueMap = new Map<string, number>(
      revenueStats.map((stat: any) => [stat._id.toString(), stat.revenue]),
    );

    // Aggregate ticket counts per event
    const ticketCounts = await Ticket.aggregate([
      { $match: baseMatch },
      { $group: { _id: "$eventId", count: { $sum: 1 } } },
    ]);
    const ticketsSoldMap = new Map<string, number>(
      ticketCounts.map((tc: any) => [tc._id.toString(), tc.count]),
    );

    // Calculate aggregate metrics
    const totalTicketsSold = Array.from(ticketsSoldMap.values()).reduce(
      (acc: number, val: number) => acc + val,
      0,
    );
    const totalRevenue = Array.from(revenueMap.values()).reduce(
      (acc: number, val: number) => acc + val,
      0,
    );

    // Get checked-in count
    const checkedInMatch: any = { status: "checked-in" };
    if (excludeManual) {
      checkedInMatch.issueType = { $nin: ["manual", "pass"] };
    }
    const totalCheckedIn = await Ticket.countDocuments(checkedInMatch);

    // Aggregate check-ins per event
    const checkInStats = await Ticket.aggregate([
      { $match: checkedInMatch },
      { $group: { _id: "$eventId", count: { $sum: 1 } } },
    ]);

    const checkInMap = new Map<string, number>(
      checkInStats.map((stat: any) => [stat._id.toString(), stat.count]),
    );

    // Format event data for table
    const eventStats = events.map((event: any) => {
      const checkedInCount = checkInMap.get(event._id.toString()) || 0;
      const soldCount = ticketsSoldMap.get(event._id.toString()) || 0;
      return {
        id: event._id.toString(),
        title: event.title,
        clubId: event.clubId,
        ticketsSold: soldCount,
        checkedInCount,
        revenue: revenueMap.get(event._id.toString()) || 0,
        capacity: event.capacity,
        occupancy: event.capacity
          ? Math.round((soldCount / event.capacity) * 100)
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
