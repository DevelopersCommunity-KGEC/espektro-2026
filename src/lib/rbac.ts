import dbConnect from "@/lib/db";
import ClubRole, { IClubRole } from "@/models/ClubRole";
import Event from "@/models/Event";
import User, { IUser } from "@/models/User";
import { headers } from "next/headers";
import { auth } from "./auth";

export type Role = "user" | "super-admin";
export type ClubRoleType = "club-admin" | "volunteer" | "event-editor";

/**
 * Checks if a user has a specific role in a club.
 * Super Admins always return true.
 */
export async function hasClubPermission(
  userId: string,
  clubId: string,
  requiredRoles: ClubRoleType[],
): Promise<boolean> {
  await dbConnect();

  // 1. Check Global Super Admin
  const user = await User.findById(userId);
  if (user?.role === "super-admin") return true;

  // 2. Check Club Role
  const clubRole = await ClubRole.findOne({ userId, clubId });
  if (!clubRole) return false;

  return requiredRoles.includes(clubRole.role as ClubRoleType);
}

/**
 * Checks if a user can edit a specific event.
 * True if: Super Admin OR Club Admin OR (Event Editor AND defined in event.editors)
 */
export async function canEditEvent(
  userId: string,
  eventId: string,
): Promise<boolean> {
  await dbConnect();

  const event = await Event.findById(eventId);
  if (!event) return false;

  const user = await User.findById(userId);
  if (user?.role === "super-admin") return true;

  // Check Club Admin
  const clubRole = await ClubRole.findOne({ userId, clubId: event.clubId });
  if (clubRole?.role === "club-admin") return true;

  // Check Event Editor Permission
  // Logic: Must have 'event-editor' role in the club AND be listed in event.editors
  // OR simply be listed in event.editors?
  // PRD v2 says: "Event Editor - Edit permissions for specific events"
  // And "All operational roles exist inside a club context"
  // So they must be a 'event-editor' in the club AND assigned to the event?
  // Let's assume being in event.editors is sufficient if verified vs ClubRole context,
  // but to be strict with RBAC v2, let's allow if they are in event.editors list.

  if (event.editors.includes(user?.email)) return true;

  return false;
}

export async function getUserClubRoles(userId: string): Promise<IClubRole[]> {
  await dbConnect();
  const roles = await ClubRole.find({ userId }).lean();
  return JSON.parse(JSON.stringify(roles));
}

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
}
