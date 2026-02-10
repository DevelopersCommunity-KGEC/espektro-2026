"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Ticket from "@/models/Ticket";
import { getCurrentUser, hasClubPermission } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function updateTicketStatus(
  clubId: string,
  ticketId: string,
  newStatus: string,
) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Unauthorized" };

  const hasPermission = await hasClubPermission(user.id, clubId, [
    "club-admin",
    "volunteer", // Volunteers should be able to check people in
    "event-editor",
  ]);
  if (!hasPermission) return { success: false, message: "Forbidden" };

  await dbConnect();

  // Verify ticket falls under a club event
  const ticket = await Ticket.findById(ticketId).populate("eventId");
  if (!ticket) return { success: false, message: "Ticket not found" };

  const event = await Event.findById(ticket.eventId);
  if (!event || event.clubId !== clubId) {
    return { success: false, message: "Ticket does not belong to this club" };
  }

  const updates: any = { status: newStatus };
  if (newStatus === "checked-in" && !ticket.checkInTime) {
    updates.checkInTime = new Date();
  } else if (newStatus !== "checked-in") {
    updates.checkInTime = null; // Reset if un-checked
  }

  await Ticket.findByIdAndUpdate(ticketId, updates);

  // Revalidate the participants page for this club
  revalidatePath(`/club/${clubId}/participants`);

  return { success: true, message: "Status updated" };
}
