"use server";

import dbConnect from "@/lib/db";
import EventModel from "@/models/Event";
import TicketModel from "@/models/Ticket";
import UserModel from "@/models/User";
import ClubModel from "@/models/Club";
import ClubRoleModel from "@/models/ClubRole";
import PendingClubRoleModel from "@/models/PendingClubRole";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { hasClubPermission, ClubRoleType, canEditEvent } from "@/lib/rbac";

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

// --- Club Management ---

export async function assignClubRole(
  email: string,
  clubId: string,
  role: string,
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const canManage = await hasClubPermission(session.user.id, clubId, [
    "club-admin",
  ]);
  if (!canManage) throw new Error("Unauthorized");

  await dbConnect();
  const user = await UserModel.findOne({ email });

  if (user) {
    await ClubRoleModel.findOneAndUpdate(
      { userId: user._id, clubId },
      { role },
      { upsert: true, new: true },
    );
  } else {
    // User not found, create pending role
    await PendingClubRoleModel.findOneAndUpdate(
      { email, clubId },
      { role },
      { upsert: true, new: true },
    );
  }

  revalidatePath("/dashboard/users");
  revalidatePath(`/club/${clubId}/users`);
  return { success: true };
}

export async function removeClubRole(email: string, clubId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const canManage = await hasClubPermission(session.user.id, clubId, [
    "club-admin",
  ]);
  if (!canManage) throw new Error("Unauthorized");

  await dbConnect();
  const user = await UserModel.findOne({ email });

  if (user) {
    await ClubRoleModel.deleteOne({ userId: user._id, clubId });
  }

  // Also try deleting pending role (covers both cases)
  await PendingClubRoleModel.deleteMany({ email, clubId });

  revalidatePath("/dashboard/users");
  return { success: true };
}

export async function getClubAdmins(clubId: string) {
  const session = await getSession();
  if (!session) return [];

  // Allow viewing provided they have some access or if public? Usually admin only.
  const canView = await hasClubPermission(session.user.id, clubId, [
    "club-admin",
  ]);
  if (!canView) return []; // Or throw

  await dbConnect();
  const roles = await ClubRoleModel.find({ clubId }).populate(
    "userId",
    "name email image",
  );
  return JSON.parse(JSON.stringify(roles));
}

export async function getAllUsersWithRoles(params: {
  page?: number;
  limit?: number;
  search?: string;
  clubId?: string;
  role?: string;
}) {
  const session = await getSession();
  if (!session || session.user.role !== "super-admin") {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  let userQuery: any = {};
  let clubRoleQuery: any = {};
  let filterByUserIdsFromRoles = false;
  let allowedUserIds: string[] = [];

  // Search
  if (params.search) {
    userQuery.$or = [
      { name: { $regex: params.search, $options: "i" } },
      { email: { $regex: params.search, $options: "i" } },
    ];
  }

  // Role Filter Logic
  if (params.role) {
    if (params.role === "super-admin" || params.role === "user") {
      // Global role filter
      userQuery.role = params.role;
    } else {
      // Club role filter
      clubRoleQuery.role = params.role;
      filterByUserIdsFromRoles = true;
    }
  }

  // Club Filter Logic
  if (params.clubId) {
    clubRoleQuery.clubId = params.clubId;
    filterByUserIdsFromRoles = true;
  }

  // If we need to filter by club roles, fetch matching user IDs first
  if (filterByUserIdsFromRoles) {
    const matchingRoles =
      await ClubRoleModel.find(clubRoleQuery).select("userId");
    const userIds = matchingRoles.map((r: any) => r.userId);

    if (userIds.length === 0) {
      return { users: [], total: 0, totalPages: 0 };
    }

    // If we also have a global role filter (e.g. search for admins who are also volunteers), intersect.
    // But usually role filter is exclusive in UI.

    userQuery._id = { $in: userIds };
  }

  // Execute User Query
  const totalUsers = await UserModel.countDocuments(userQuery);
  const users = await UserModel.find(userQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Attach Club Roles to the fetched users
  const userIdsForDetails = users.map((u: any) => u._id);
  const allRoles = await ClubRoleModel.find({
    userId: { $in: userIdsForDetails },
  }).lean();

  const usersWithRoles = users.map((u: any) => {
    const roles = allRoles.filter(
      (r: any) => r.userId.toString() === u._id.toString(),
    );
    return {
      ...u,
      clubRoles: roles,
    };
  });

  // Fetch Pending Users (Only on first page and if no specific ID filters that exclude them)
  // Logic: Fetch all pending, filter by search/club/role manually, then prepend.
  let pendingUsers: any[] = [];
  if (page === 1) {
    let pendingQuery: any = {};
    if (params.search) {
      pendingQuery.email = { $regex: params.search, $options: "i" };
    }
    if (params.clubId && params.clubId !== "all") {
      pendingQuery.clubId = params.clubId;
    }
    if (params.role) {
      if (
        params.role !== "super-admin" &&
        params.role !== "user" &&
        params.role !== "all"
      ) {
        // It's a club role
        pendingQuery.role = params.role;
      } else if (params.role === "super-admin" || params.role === "user") {
        // Pending users have no global role effectively (or treated as pending), so if filter is for "user" or "super-admin", strictly we shouldn't show them?
        // But let's assume valid "pending" filter logic if we had one.
        // For now if searching for super-admin, don't show pending.
        // If searching for regular users, maybe?
        // Let's exclude pending if global role filter is set
        const excludePending = true;
        if (excludePending) pendingQuery = null;
      }
    }

    if (pendingQuery) {
      const pendingRoles = await PendingClubRoleModel.find(pendingQuery).lean();

      // Group by email
      const pendingMap = new Map<string, any>();
      pendingRoles.forEach((r: any) => {
        if (!pendingMap.has(r.email)) {
          pendingMap.set(r.email, {
            _id: "pending-" + r.email,
            name: "Pending User",
            email: r.email,
            role: "pending",
            clubRoles: [],
            image: null,
          });
        }
        pendingMap.get(r.email).clubRoles.push({
          ...r,
          _id: r._id.toString(),
          userId: "pending-" + r.email, // Dummy ID
        });
      });
      pendingUsers = Array.from(pendingMap.values());
    }
  }

  // Combine
  const combinedUsers = [...pendingUsers, ...usersWithRoles];

  return {
    users: JSON.parse(JSON.stringify(combinedUsers)),
    total: totalUsers + pendingUsers.length,
    totalPages: Math.ceil((totalUsers + pendingUsers.length) / limit),
  };
}

export async function getPendingClubRoles(email?: string) {
  const session = await getSession();
  if (!session || session.user.role !== "super-admin") return [];

  await dbConnect();
  if (email) {
    const roles = await PendingClubRoleModel.find({ email });
    return JSON.parse(JSON.stringify(roles));
  }
  return [];
}

export async function getUserClubRoles(userId: string) {
  const session = await getSession();
  if (!session || session.user.role !== "super-admin") return [];

  await dbConnect();
  const roles = await ClubRoleModel.find({ userId });
  return JSON.parse(JSON.stringify(roles));
}

// --- User Management (Legacy/Global) ---

export async function updateUserRole(email: string, role: string) {
  const session = await getSession();
  if (!session || session.user.role !== "super-admin")
    throw new Error("Unauthorized");

  if (!["user", "super-admin"].includes(role)) {
    throw new Error("Invalid global role");
  }

  await dbConnect();
  await UserModel.findOneAndUpdate({ email }, { role });
  revalidatePath("/dashboard/users");
  return { success: true };
}

export async function getUserByEmail(email: string) {
  const session = await getSession();
  // Allow if super-admin or club-admin looking for user to assign
  // For now, strict check
  if (!session || session.user.role !== "super-admin") {
    // Allow if club admin?
    // For now, let's keep it restricted.
    return null;
  }

  await dbConnect();
  const user = await UserModel.findOne({ email });
  if (user) {
    const clubRoles = await ClubRoleModel.find({ userId: user._id });
    return {
      ...JSON.parse(JSON.stringify(user)),
      clubRoles: JSON.parse(JSON.stringify(clubRoles)),
    };
  }
  return null;
}

// --- Ticket Management ---

export async function issueManualTicket(
  eventId: string,
  email: string,
  isSeasonPass: boolean = false,
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();

  let eventClubId = "";
  let festDays: any[] = [];
  let singleEvent: any = null;

  if (isSeasonPass) {
    // Assume season pass is strictly "espektro" club or handled by super admin?
    // Or fest-days belong to espektro club.
    eventClubId = "espektro"; // based on seeding
    festDays = await EventModel.find({ type: "fest-day" });
    if (!festDays.length) throw new Error("No Fest Days found");
  } else {
    singleEvent = await EventModel.findById(eventId);
    if (!singleEvent) throw new Error("Event not found");
    eventClubId = singleEvent.clubId;
  }

  // Wait, ticket issuer role is removed. Only club-admin can issue tickets manually now?
  // Or maybe "volunteer" if specialized? The prompt said: "only the admin or club admin can manually asign tickets"
  const canIssue = await hasClubPermission(session.user.id, eventClubId, [
    "club-admin",
  ]);
  if (!canIssue) throw new Error("Unauthorized to issue tickets for this club");

  const issuedBy = session.user.email;
  const processed = [];

  const emails = [email]; // Support single email for now, reuse loop logic if we want bulk locally

  for (const mail of emails) {
    const cleanEmail = mail.trim();
    if (isSeasonPass) {
      for (const dy of festDays) {
        await createTicketForEvent(dy, cleanEmail, issuedBy, "pass");
      }
    } else {
      await createTicketForEvent(singleEvent, cleanEmail, issuedBy, "manual");
    }
    processed.push(cleanEmail);
  }

  revalidatePath("/dashboard/manual-tickets");
  return { success: true, message: "Issued successfully" };
}

async function createTicketForEvent(
  event: any,
  email: string,
  issuedBy?: string,
  issueType: "manual" | "pass" = "manual",
) {
  if (event.capacity !== -1 && event.ticketsSold >= event.capacity) {
    throw new Error(`Event ${event.title} is sold out`);
  }

  const qrCodeToken = uuidv4();
  const ticket = await TicketModel.create({
    userEmail: email,
    eventId: event._id,
    paymentId: "MANUAL_ISSUE",
    qrCodeToken,
    status: "booked",
    issueType,
    origin: "admin-dashboard",
    purchaseDate: new Date(),
    issuedBy,
    price: event.price,
  });

  await EventModel.findByIdAndUpdate(event._id, { $inc: { ticketsSold: 1 } });
  return ticket;
}

// --- Event CRUD ---

export async function createEvent(data: any) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const { clubId } = data;
  if (!clubId) throw new Error("Club ID required");

  // Check RBAC
  const canCreate = await hasClubPermission(session.user.id, clubId, [
    "club-admin",
  ]);
  if (!canCreate) throw new Error("Unauthorized");

  await dbConnect();
  // Ensure winners is valid array if passed
  const event = await EventModel.create(data);
  revalidatePath("/dashboard/events");
  return JSON.parse(JSON.stringify(event));
}

export async function updateEvent(id: string, data: any) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const canEdit = await canEditEvent(session.user.id, id);
  if (!canEdit) throw new Error("Unauthorized");

  await dbConnect();
  const event = await EventModel.findByIdAndUpdate(id, data, { new: true });
  revalidatePath("/dashboard/events");
  revalidatePath(`/events/${id}`);
  return JSON.parse(JSON.stringify(event));
}

export async function deleteEvent(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // Only Club Admin can delete?
  // Need to fetch event to know clubId
  await dbConnect();
  const event = await EventModel.findById(id);
  if (!event) throw new Error("Event not found");

  const canDelete = await hasClubPermission(session.user.id, event.clubId, [
    "club-admin",
  ]);
  if (!canDelete) throw new Error("Unauthorized");

  await EventModel.findByIdAndDelete(id);
  revalidatePath("/dashboard/events");
  return { success: true };
}

export async function getEvents() {
  await dbConnect();

  // Manual population for stability
  const events = await EventModel.find().sort({ date: 1 }).lean();

  // Get unique clubIds
  const clubIds = [
    ...new Set(events.map((e: any) => e.clubId).filter(Boolean)),
  ];

  // Fetch matching clubs
  const clubs = await ClubModel.find({ clubId: { $in: clubIds } }).lean();

  // Map clubs by clubId for O(1) lookup
  const clubMap = new Map(clubs.map((c: any) => [c.clubId, c]));

  // Merge
  const populatedEvents = events.map((event: any) => ({
    ...event,
    club: clubMap.get(event.clubId) || null,
  }));

  return JSON.parse(JSON.stringify(populatedEvents));
}

export async function getClubEvents(clubId: string) {
  await dbConnect();
  const events = await EventModel.find({ clubId }).sort({ date: 1 });
  return JSON.parse(JSON.stringify(events));
}

export async function getClubTeam(clubId: string) {
  await dbConnect();
  const roles = await ClubRoleModel.find({ clubId }).populate("userId");
  const pendingRoles = await PendingClubRoleModel.find({ clubId });

  const formattedPending = pendingRoles.map((role: any) => ({
    _id: role._id,
    clubId: role.clubId,
    role: role.role,
    userId: {
      name: "Pending User",
      email: role.email,
      image: null,
    },
  }));

  const allRoles = [
    ...JSON.parse(JSON.stringify(roles)),
    ...JSON.parse(JSON.stringify(formattedPending)),
  ];
  return allRoles;
}

export async function getEventById(id: string) {
  await dbConnect();
  const event = await EventModel.findById(id);
  return event ? JSON.parse(JSON.stringify(event)) : null;
}
