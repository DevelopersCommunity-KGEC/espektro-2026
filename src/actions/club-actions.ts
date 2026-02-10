"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Ticket from "@/models/Ticket";
import User from "@/models/User";
import { getCurrentUser, hasClubPermission } from "@/lib/rbac";
import { v4 as uuidv4 } from "uuid";

export async function getClubParticipants(clubId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  // Check permission
  const hasPermission = await hasClubPermission(user.id, clubId, [
    "club-admin",
    "volunteer",
    "event-editor",
  ]);
  if (!hasPermission) throw new Error("Forbidden");

  await dbConnect();

  // 1. Get all events for this club
  const events = await Event.find({ clubId }).select("_id title");
  const eventIds = events.map((e) => e._id);

  // 2. Get tickets for these events
  const tickets = await Ticket.find({ eventId: { $in: eventIds } })
    .populate({
      path: "userId",
      model: User,
      select: "name email phone image course collegeName graduationYear",
    })
    .populate({
      path: "eventId",
      model: Event,
      select: "title",
    })
    .sort({ purchaseDate: -1 });

  return JSON.parse(JSON.stringify(tickets));
}

export type CreateManualTicketData = {
  clubId: string;
  eventId: string;
  userEmail: string;
  userName?: string; // Optional if user doesn't exist yet
  phone?: string;
};

export async function createManualTicket(data: CreateManualTicketData) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Unauthorized" };

  const { clubId, eventId, userEmail, userName, phone } = data;

  const hasPermission = await hasClubPermission(user.id, clubId, [
    "club-admin",
    "event-editor",
  ]);
  if (!hasPermission) return { success: false, message: "Forbidden" };

  await dbConnect();

  // 1. Verify event belongs to club
  const event = await Event.findById(eventId);
  if (!event || event.clubId !== clubId) {
    return { success: false, message: "Invalid event" };
  }

  // 2. Check duplicates (optional: maybe allow multiple tickets?)
  // Basic check: prevent duplicates for same event currently
  const existingTicket = await Ticket.findOne({
    userEmail,
    eventId,
    status: { $ne: "cancelled" },
  });

  if (existingTicket) {
    return {
      success: false,
      message: "User already has a ticket for this event",
    };
  }

  // 3. Find if user exists to link userId
  const targetUser = await User.findOne({ email: userEmail });

  // Generate simple manual ID or standard ID
  const qrCodeToken = uuidv4();

  const newTicket = new Ticket({
    userId: targetUser?._id,
    userEmail: userEmail,
    eventId: eventId,
    paymentId: "MANUAL-" + uuidv4().slice(0, 8).toUpperCase(),
    qrCodeToken: qrCodeToken,
    status: "booked",
    issueType: "manual",
    issuedBy: user.email,
    purchaseDate: new Date(),
    guestName: userName,
    guestPhone: phone,
  });

  await newTicket.save();

  // Increment tickets sold
  await Event.findByIdAndUpdate(eventId, { $inc: { ticketsSold: 1 } });

  return { success: true, message: "Ticket created successfully" };
}

export async function getClubEventsSimple(clubId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await dbConnect();
  const events = await Event.find({ clubId }).select("_id title date");
  return JSON.parse(JSON.stringify(events));
}
