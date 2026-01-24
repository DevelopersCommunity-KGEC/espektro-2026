"use server";

import Referral from "@/models/Referral";
import dbConnect from "@/lib/db";
import { getCurrentUser, hasClubPermission } from "@/lib/rbac";
import { nanoid } from "nanoid";

// Generate random code in ABCD-EFGH format
function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let part1 = "";
  let part2 = "";
  for (let i = 0; i < 3; i++)
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
  for (let i = 0; i < 4; i++)
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  return `${part1}-${part2}`;
}

export async function createReferralCodes(data: {
  clubId: string;
  count: number;
  discountPercentage: number;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const canCreate = await hasClubPermission(user.id, data.clubId, [
    "club-admin",
  ]);
  if (!canCreate && user.role !== "super-admin") {
    throw new Error("Permission denied");
  }

  await dbConnect();

  // Validate inputs
  if (data.clubId === "all")
    throw new Error("Cannot create global referral codes");
  if (data.count < 1 || data.count > 50)
    throw new Error("Count must be between 1 and 50");
  if (data.discountPercentage < 0 || data.discountPercentage > 100)
    throw new Error("Invalid discount percentage");

  const referrals = [];

  // Try to generate unique codes
  for (let i = 0; i < data.count; i++) {
    let unique = false;
    let code = "";
    let attempts = 0;

    while (!unique && attempts < 10) {
      code = generateCode();
      const existing = await Referral.findOne({ code });
      if (!existing) unique = true;
      attempts++;
    }

    if (unique) {
      referrals.push({
        code,
        clubId: data.clubId,
        discountPercentage: data.discountPercentage,
        createdBy: user.email,
        isUsed: false,
      });
    }
  }

  if (referrals.length > 0) {
    await Referral.insertMany(referrals);
  }

  return { success: true, count: referrals.length };
}

export async function getReferralCodes(clubId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  // If getting all (super admin only) or specific club
  if (clubId !== "all") {
    const canView = await hasClubPermission(user.id, clubId, ["club-admin"]);
    if (!canView && user.role !== "super-admin")
      throw new Error("Permission denied");
  } else if (user.role !== "super-admin") {
    throw new Error("Permission denied");
  }

  await dbConnect();

  const query = clubId === "all" ? {} : { clubId };
  const referrals = await Referral.find(query).sort({ createdAt: -1 }).lean();

  return referrals.map((r: any) => ({
    ...r,
    _id: r._id.toString(),
    createdAt: r.createdAt.toISOString(),
    usedAt: r.usedAt?.toISOString(),
  }));
}

export async function deleteReferralCode(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await dbConnect();
  const referral = await Referral.findById(id);
  if (!referral) throw new Error("Referral not found");

  const canDelete = await hasClubPermission(user.id, referral.clubId, [
    "club-admin",
  ]);
  if (!canDelete && user.role !== "super-admin") {
    throw new Error("Permission denied");
  }

  if (referral.isUsed) {
    throw new Error("Cannot delete a used referral code");
  }

  await Referral.findByIdAndDelete(id);
  return { success: true };
}

export async function validateReferralCode(code: string, clubId?: string) {
  await dbConnect();

  // Normalize code: uppercase and replace spaces with dashes
  const normalizedCode = code.trim().toUpperCase().replace(/\s+/g, "-");

  const referral = await Referral.findOne({
    code: normalizedCode,
    isUsed: false,
  });

  if (!referral) return { valid: false, message: "Invalid or used code" };

  // Check if code belongs to the event's club (if clubId is strictly enforced)
  // For now, assuming Global/Club codes can be tied to specific Events is complex w/o event-specific mapping.
  // Let's assume Club codes are valid for ANY event if needed, or check if the event matches the club.
  // The prompt implies "generate referral codes of a particular club".
  // Ideally, we check if the event being booked belongs to referral.clubId.
  // We will return the clubId so the frontend/action can verify.

  return {
    valid: true,
    discountPercentage: referral.discountPercentage,
    clubId: referral.clubId,
    id: referral._id.toString(),
  };
}
