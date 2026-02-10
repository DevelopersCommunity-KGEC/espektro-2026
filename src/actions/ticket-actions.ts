"use server";

import dbConnect from "@/lib/db";
import Ticket from "@/models/Ticket";
import Event from "@/models/Event";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { hasClubPermission } from "@/lib/rbac";

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function getMyTickets() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();
  // Find tickets by userId OR by email (for manual tickets issued before account creation)
  const tickets = await Ticket.find({
    $or: [{ userId: session.user.id }, { userEmail: session.user.email }],
  })
    .populate({
      path: "eventId",
      model: Event,
    })
    .sort({ purchaseDate: -1 });

  return JSON.parse(JSON.stringify(tickets));
}

export async function verifyTicket(token: string) {
  const session = await getSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized: Please login to scan" };
  }

  await dbConnect();
  const ticket = await Ticket.findOne({ qrCodeToken: token }).populate({
    path: "eventId",
    model: Event,
  });

  if (!ticket) {
    return { success: false, message: "Invalid Ticket / Fake QR" };
  }

  // RBAC Check
  const event = ticket.eventId as any;
  if (event && event.clubId) {
    const canScan = await hasClubPermission(session.user.id, event.clubId, [
      "club-admin",
      "volunteer",
    ]);
    if (!canScan)
      return {
        success: false,
        message: `Unauthorized: This ticket belongs to ${event.clubId}`,
        ticket: JSON.parse(JSON.stringify(ticket)),
      };
  }

  if (ticket.status === "checked-in") {
    return {
      success: false,
      message: `Already Scanned at ${new Date(
        ticket.checkInTime,
      ).toLocaleTimeString()}`,
      ticket: JSON.parse(JSON.stringify(ticket)),
    };
  }

  if (ticket.status === "cancelled") {
    return { success: false, message: "Ticket has been cancelled" };
  }

  // Update status
  ticket.status = "checked-in";
  ticket.checkInTime = new Date();
  await ticket.save();

  return {
    success: true,
    message: "Access Granted",
    ticket: JSON.parse(JSON.stringify(ticket)),
  };
}

export async function bookTicket(eventId: string) {
  const session = await getSession();
  if (!session?.user) throw new Error("Please login to book tickets");

  await dbConnect();

  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  if (event.capacity !== -1 && event.ticketsSold >= event.capacity) {
    throw new Error("Event is sold out");
  }

  // Create pending ticket
  const ticket = await Ticket.create({
    userId: session.user.id,
    userEmail: session.user.email,
    eventId: event._id,
    paymentId: "PENDING",
    qrCodeToken: "PENDING-" + Date.now(), // Temporary token
    status: "pending",
  });

  return { success: true, ticketId: ticket._id.toString() };
}

export async function getTicketById(ticketId: string) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  await dbConnect();
  const ticket = await Ticket.findById(ticketId).populate({
    path: "eventId",
    model: Event,
  });

  if (!ticket) return null;

  // Ensure user owns this ticket
  if (
    ticket.userId.toString() !== session.user.id &&
    ticket.userEmail !== session.user.email &&
    session.user.role !== "super-admin"
  ) {
    throw new Error("Unauthorized access to ticket");
  }

  return JSON.parse(JSON.stringify(ticket));
}

export async function confirmPayment(ticketId: string) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  await dbConnect();
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) throw new Error("Ticket not found");
  if (ticket.status !== "pending")
    throw new Error("Ticket is not in pending state");

  // Verify ownership
  if (
    ticket.userId.toString() !== session.user.id &&
    ticket.userEmail !== session.user.email
  ) {
    throw new Error("Unauthorized");
  }

  const { v4: uuidv4 } = require("uuid");
  const newToken = uuidv4();

  ticket.status = "booked";
  ticket.paymentId = "MOCK_PAYMENT_" + Date.now();
  ticket.qrCodeToken = newToken;
  await ticket.save();

  // Update event count
  await Event.findByIdAndUpdate(ticket.eventId, { $inc: { ticketsSold: 1 } });

  return { success: true };
}
