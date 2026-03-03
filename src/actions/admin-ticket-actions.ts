"use server";

import dbConnect from "@/lib/db";
import Ticket from "@/models/Ticket";
import Event from "@/models/Event";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/rbac";
import mongoose from "mongoose";

export interface TicketFilter {
  search?: string;
  clubId?: string;
  eventId?: string;
  issuedBy?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  excludeManual?: boolean;
}

export async function getAllTickets(filters: TicketFilter) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  // Verify Admin Access
  await dbConnect();
  const dbUser = await User.findById(user.id);

  if (dbUser?.role !== "super-admin") throw new Error("Forbidden");

  const {
    search,
    clubId,
    eventId,
    issuedBy,
    startDate,
    endDate,
    page = 1,
    limit = 20,
  } = filters;

  const skip = (page - 1) * limit;

  const matchStage: any = {};

  if (issuedBy && issuedBy !== "all") {
    matchStage["issuedBy"] = issuedBy;
  }

  if (startDate || endDate) {
    matchStage["purchaseDate"] = {};
    if (startDate) matchStage["purchaseDate"]["$gte"] = new Date(startDate);
    if (endDate) matchStage["purchaseDate"]["$lte"] = new Date(endDate);
  }

  // To filter by clubId, we need to lookup events first.
  // To search by user name, we need to lookup users first.

  const pipeline: any[] = [
    // Optionally exclude manually assigned tickets
    ...(filters.excludeManual
      ? [{ $match: { issueType: { $nin: ["manual", "pass"] } } }]
      : []),
    // Lookup Event
    {
      $lookup: {
        from: "events", // Default mongoose pluralization usually 'events'
        localField: "eventId",
        foreignField: "_id",
        as: "event",
      },
    },
    { $unwind: "$event" },

    // Filter by Club
    ...(clubId && clubId !== "all"
      ? [{ $match: { "event.clubId": clubId } }]
      : []),

    // Filter by EventId after lookup using proper ObjectId conversion
    ...(eventId && eventId !== "all"
      ? [{ $match: { "event._id": new mongoose.Types.ObjectId(eventId) } }]
      : []),

    // Lookup User
    {
      $lookup: {
        from: "user", // Defined in User.ts as 'user'
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

    // Apply main filters (dates, issuedBy)
    { $match: matchStage },
  ];

  // Apply General Search (Email, Payment ID, Guest Name, User Name, User Phone, Guest Phone)
  if (search) {
    const searchRegex = { $regex: search, $options: "i" };
    pipeline.push({
      $match: {
        $or: [
          { paymentId: searchRegex },
          { userEmail: searchRegex },
          { guestName: searchRegex },
          { guestPhone: searchRegex },
          { "user.name": searchRegex },
          { "user.phone": searchRegex },
          { issuedBy: searchRegex },
        ],
      },
    });
  }

  // Count total documents before pagination
  // We need to use $facet to get count and data in one go
  const finalPipeline = [
    ...pipeline,
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          { $sort: { purchaseDate: -1 } },
          { $skip: skip },
          { $limit: limit },
          // Project needed fields only? Optional but good for bandwidth
        ],
      },
    },
  ];

  // For eventId matching, if we filter BEFORE lookup, it is faster, but we need ObjectId.
  // If we filter AFTER lookup, we can use string match if we project or just let mongo handle comparison (often strictly typed).
  // I'll rely on Mongoose models for fetching distinct lists for filters separately.

  // Note: Aggregation returns raw objects, not Mongoose documents.
  // We need to match ObjectId for 'eventId' in the initial stage if we want index usage.
  // However, since we are doing a lot of lookups, let's keep it simple.

  const result = await Ticket.aggregate(finalPipeline);

  const total = result[0].metadata[0]?.total || 0;
  const tickets = result[0].data;

  // Make sure to serialize for Next.js
  return {
    tickets: JSON.parse(JSON.stringify(tickets)),
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function exportAllTickets(filters: TicketFilter) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await dbConnect();
  const dbUser = await User.findById(user.id);
  if (dbUser?.role !== "super-admin") throw new Error("Forbidden");

  const { search, clubId, eventId, issuedBy, startDate, endDate } = filters;

  const matchStage: any = {};
  if (issuedBy && issuedBy !== "all") matchStage["issuedBy"] = issuedBy;
  if (startDate || endDate) {
    matchStage["purchaseDate"] = {};
    if (startDate) matchStage["purchaseDate"]["$gte"] = new Date(startDate);
    if (endDate) matchStage["purchaseDate"]["$lte"] = new Date(endDate);
  }

  const pipeline: any[] = [
    ...(filters.excludeManual
      ? [{ $match: { issueType: { $nin: ["manual", "pass"] } } }]
      : []),
    {
      $lookup: {
        from: "events",
        localField: "eventId",
        foreignField: "_id",
        as: "event",
      },
    },
    { $unwind: "$event" },
    ...(clubId && clubId !== "all"
      ? [{ $match: { "event.clubId": clubId } }]
      : []),
    ...(eventId && eventId !== "all"
      ? [{ $match: { "event._id": new mongoose.Types.ObjectId(eventId) } }]
      : []),
    {
      $lookup: {
        from: "user",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    { $match: matchStage },
  ];

  if (search) {
    const searchRegex = { $regex: search, $options: "i" };
    pipeline.push({
      $match: {
        $or: [
          { paymentId: searchRegex },
          { userEmail: searchRegex },
          { guestName: searchRegex },
          { guestPhone: searchRegex },
          { "user.name": searchRegex },
          { "user.phone": searchRegex },
          { issuedBy: searchRegex },
        ],
      },
    });
  }

  pipeline.push({ $sort: { purchaseDate: -1 } });

  const tickets = await Ticket.aggregate(pipeline);
  return JSON.parse(JSON.stringify(tickets));
}

export async function updateTicketStatusAdmin(
  ticketId: string,
  newStatus: string,
) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Unauthorized" };

  await dbConnect();
  const dbUser = await User.findById(user.id);
  if (dbUser?.role !== "super-admin")
    return { success: false, message: "Forbidden" };

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return { success: false, message: "Ticket not found" };

  const updates: any = { status: newStatus };
  if (newStatus === "checked-in" && !ticket.checkInTime) {
    updates.checkInTime = new Date();
  } else if (newStatus !== "checked-in") {
    updates.checkInTime = null;
  }

  await Ticket.findByIdAndUpdate(ticketId, updates);

  return { success: true, message: "Status updated" };
}

export async function getAdminFilterOptions() {
  await dbConnect();
  const events = await Event.find({}).select("_id title clubId");
  // Get unique clubs from events
  const clubs = Array.from(new Set(events.map((e: any) => e.clubId))).map(
    (id) => ({
      id: id as string,
      name: (id as string).charAt(0).toUpperCase() + (id as string).slice(1), // Simple capitalization or fetch from Club model
    }),
  );
  // Get distinct issuers (admins)
  const issuers = await Ticket.distinct("issuedBy");

  return {
    events: JSON.parse(JSON.stringify(events)),
    clubs,
    issuers: issuers.filter(Boolean) as string[],
  };
}
