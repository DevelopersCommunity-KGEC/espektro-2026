"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Ticket from "@/models/Ticket";

export async function getAnalyticsData() {
    await dbConnect();

    try {
        const events = await Event.find({}).lean();

        // Calculate aggregate metrics
        const totalTicketsSold = events.reduce((acc, event) => acc + (event.ticketsSold || 0), 0);
        const totalRevenue = events.reduce((acc, event) => acc + ((event.ticketsSold || 0) * (event.price || 0)), 0);

        // Get checked-in count
        const totalCheckedIn = await Ticket.countDocuments({ status: "checked-in" });

        // Format event data for table
        const eventStats = events.map((event: any) => ({
            id: event._id.toString(),
            title: event.title,
            ticketsSold: event.ticketsSold || 0,
            revenue: (event.ticketsSold || 0) * (event.price || 0),
            capacity: event.capacity,
            occupancy: event.capacity ? Math.round(((event.ticketsSold || 0) / event.capacity) * 100) : 0,
        }));

        // Sort by revenue desc
        eventStats.sort((a, b) => b.revenue - a.revenue);

        return {
            totalTicketsSold,
            totalRevenue,
            totalCheckedIn,
            eventStats
        };
    } catch (error) {
        console.error("Analytics Error:", error);
        return {
            totalTicketsSold: 0,
            totalRevenue: 0,
            totalCheckedIn: 0,
            eventStats: []
        };
    }
}
