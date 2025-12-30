"use server";

import dbConnect from "@/lib/db";
import EventModel from "@/models/Event";
import TicketModel from "@/models/Ticket";
import UserModel from "@/models/User";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function updateUserRole(
  email: string,
  role: string,
  quota: number = 0
) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const updateData: any = { role };

  // If role is ticket-issuer, update quota.
  // If we just want to add quota to existing issuer, we can handle that logic too.
  // Assuming this function is "Set Role & Quota".
  if (role === "ticket-issuer" || quota > 0) {
    updateData.ticketQuota = quota;
  }

  const user = await UserModel.findOneAndUpdate({ email }, updateData, {
    new: true,
    upsert: false,
  });

  if (!user) {
    throw new Error("User not found");
  }

  revalidatePath("/dashboard/users");
  return { success: true, user: JSON.parse(JSON.stringify(user)) };
}

export async function getMyQuota() {
  const session = await getSession();
  if (!session) return 0;

  await dbConnect();
  const user = await UserModel.findById(
    (session.user as any).id || (session.user as any)._id
  );
  return user?.ticketQuota || 0;
}

export async function getUserByEmail(email: string) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  const user = await UserModel.findOne({ email });
  return user ? JSON.parse(JSON.stringify(user)) : null;
}

export async function issueManualTicket(
  eventId: string,
  email: string,
  isSeasonPass: boolean = false
) {
  const session = await getSession();
  const role = session?.user?.role;

  if (!session || (role !== "admin" && role !== "ticket-issuer")) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  // If ticket issuer, check and deduct quota
  if (role === "ticket-issuer") {
    const issuer = await UserModel.findById(
      (session.user as any).id || (session.user as any)._id
    );
    if (!issuer) throw new Error("Issuer account not found");

    const cost = isSeasonPass ? 4 : 1;
    if (!issuer.ticketQuota || issuer.ticketQuota < cost) {
      throw new Error(
        `Insufficient ticket quota. Required: ${cost}, Remaining: ${
          issuer.ticketQuota || 0
        }`
      );
    }

    // Deduct quota
    await UserModel.findByIdAndUpdate(issuer._id, {
      $inc: { ticketQuota: -cost },
    });
  }

  const issuedBy = session.user.email;

  if (isSeasonPass) {
    const festDays = await EventModel.find({ type: "fest-day" });
    if (!festDays || festDays.length === 0) {
      throw new Error("No Fest Day events found. Please seed them first.");
    }

    const tickets = [];
    for (const event of festDays) {
      try {
        const ticket = await createTicketForEvent(event, email, issuedBy);
        tickets.push(ticket);
      } catch (e) {
        console.error(`Failed to issue ticket for ${event.title}:`, e);
      }
    }
    revalidatePath("/dashboard/manual-tickets");
    return {
      success: true,
      count: tickets.length,
      message: `Issued Season Pass (${tickets.length} tickets)`,
    };
  } else {
    const event = await EventModel.findById(eventId);
    if (!event) throw new Error("Event not found");
    const ticket = await createTicketForEvent(event, email, issuedBy);
    revalidatePath("/dashboard/manual-tickets");
    return {
      success: true,
      count: 1,
      message: "Ticket issued successfully",
      ticket: JSON.parse(JSON.stringify(ticket)),
    };
  }
}

export async function issueBulkManualTickets(
  eventId: string,
  emails: string[],
  isSeasonPass: boolean = false
) {
  const session = await getSession();
  const role = session?.user?.role;

  if (!session || (role !== "admin" && role !== "ticket-issuer")) {
    throw new Error("Unauthorized");
  }

  if (!emails || emails.length === 0) {
    throw new Error("No emails provided");
  }

  await dbConnect();

  let festDays: any[] = [];
  let singleEvent: any = null;

  if (isSeasonPass) {
    festDays = await EventModel.find({ type: "fest-day" });
    if (!festDays || festDays.length === 0) {
      throw new Error("No Fest Day events found. Please seed them first.");
    }
  } else {
    singleEvent = await EventModel.findById(eventId);
    if (!singleEvent) throw new Error("Event not found");
  }

  // Calculate cost
  let costPerUser = 1;
  if (isSeasonPass) {
    costPerUser = festDays.length;
  }

  const totalCost = emails.length * costPerUser;

  // If ticket issuer, check and deduct quota
  if (role === "ticket-issuer") {
    const issuer = await UserModel.findById(
      (session.user as any).id || (session.user as any)._id
    );
    if (!issuer) throw new Error("Issuer account not found");

    if (!issuer.ticketQuota || issuer.ticketQuota < totalCost) {
      throw new Error(
        `Insufficient ticket quota. Required: ${totalCost}, Remaining: ${
          issuer.ticketQuota || 0
        }`
      );
    }

    // Deduct quota
    await UserModel.findByIdAndUpdate(issuer._id, {
      $inc: { ticketQuota: -totalCost },
    });
  }

  const issuedBy = session.user.email;
  let successCount = 0;

  for (const email of emails) {
    const cleanEmail = email.trim();
    if (!cleanEmail) continue;

    if (isSeasonPass) {
      for (const event of festDays) {
        try {
          await createTicketForEvent(event, cleanEmail, issuedBy);
        } catch (e) {
          console.error(
            `Failed to issue ticket for ${event.title} to ${cleanEmail}:`,
            e
          );
        }
      }
      successCount++;
    } else {
      try {
        await createTicketForEvent(singleEvent, cleanEmail, issuedBy);
        successCount++;
      } catch (e) {
        console.error(
          `Failed to issue ticket for ${singleEvent.title} to ${cleanEmail}:`,
          e
        );
      }
    }
  }

  revalidatePath("/dashboard/manual-tickets");
  return {
    success: true,
    message: `Processed tickets for ${successCount} users.`,
  };
}

async function createTicketForEvent(
  event: any,
  email: string,
  issuedBy?: string
) {
  if (event.capacity !== -1 && event.ticketsSold >= event.capacity) {
    throw new Error(`Event ${event.title} is sold out`);
  }

  const qrCodeToken = uuidv4();
  const ticket = await TicketModel.create({
    userEmail: email,
    eventId: event._id,
    paymentId: "MANUAL_ISSUE", // Changed from MANUAL_ADMIN to generic
    qrCodeToken,
    status: "booked",
    purchaseDate: new Date(),
    issuedBy,
  });

  await EventModel.findByIdAndUpdate(event._id, { $inc: { ticketsSold: 1 } });
  return ticket;
}

export async function createEvent(data: any) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  const event = await EventModel.create(data);
  revalidatePath("/dashboard/events");
  return JSON.parse(JSON.stringify(event));
}

export async function updateEvent(id: string, data: any) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  if (session.user.role !== "admin") {
    const existingEvent = await EventModel.findById(id);
    if (!existingEvent) throw new Error("Event not found");

    if (
      !existingEvent.editors ||
      !existingEvent.editors.includes(session.user.email)
    ) {
      throw new Error("You do not have permission to edit this event");
    }
  }

  const event = await EventModel.findByIdAndUpdate(id, data, { new: true });
  revalidatePath("/dashboard/events");
  revalidatePath(`/events/${id}`);
  return JSON.parse(JSON.stringify(event));
}

export async function deleteEvent(id: string) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  await EventModel.findByIdAndDelete(id);
  revalidatePath("/dashboard/events");
  return { success: true };
}

export async function getEvents() {
  await dbConnect();
  const events = await EventModel.find().sort({ date: 1 });
  return JSON.parse(JSON.stringify(events));
}

export async function getEventById(id: string) {
  await dbConnect();
  const event = await EventModel.findById(id);
  return event ? JSON.parse(JSON.stringify(event)) : null;
}
