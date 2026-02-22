"use server";

import Coupon from "@/models/Coupon";
import Ticket from "@/models/Ticket";
import Club from "@/models/Club";
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

export async function createCouponCodes(data: {
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
    throw new Error("Cannot create global coupon codes");
  if (data.count < 1 || data.count > 50)
    throw new Error("Count must be between 1 and 50");
  if (data.discountPercentage < 0 || data.discountPercentage > 100)
    throw new Error("Invalid discount percentage");

  const coupons = [];

  // Try to generate unique codes
  for (let i = 0; i < data.count; i++) {
    let unique = false;
    let code = "";
    let attempts = 0;

    while (!unique && attempts < 10) {
      code = generateCode();
      const existing = await Coupon.findOne({ code });
      if (!existing) unique = true;
      attempts++;
    }

    if (unique) {
      coupons.push({
        code,
        clubId: data.clubId,
        discountPercentage: data.discountPercentage,
        createdBy: user.email,
        isUsed: false,
      });
    }
  }

  if (coupons.length > 0) {
    await Coupon.insertMany(coupons);
  }

  return { success: true, count: coupons.length };
}

export async function createReusableCoupon(data: {
  clubId: string;
  code: string;
  discountPercentage: number;
  maxUses: number;
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

  // Feature flag check: reusable coupons must be enabled for club
  const club = await Club.findOne({ clubId: data.clubId });
  if (!club || !club.features?.reusableCoupon) {
    throw new Error("Reusable coupons are not enabled for this club");
  }

  if (!data.code || data.code.trim().length < 3)
    throw new Error("Code must be at least 3 characters");
  if (data.maxUses < 1) throw new Error("Max uses must be at least 1");
  if (data.discountPercentage < 1 || data.discountPercentage > 100)
    throw new Error("Invalid discount percentage");
  if (data.clubId === "all")
    throw new Error("Global multi-use coupons are not allowed");

  const normalizedCode = data.code.trim().toUpperCase().replace(/\s+/g, "-");

  const existing = await Coupon.findOne({ code: normalizedCode });
  if (existing) throw new Error("Coupon code already exists");

  await Coupon.create({
    code: normalizedCode,
    clubId: data.clubId,
    discountPercentage: data.discountPercentage,
    type: "multi-use",
    maxUses: data.maxUses,
    createdBy: user.email,
    isUsed: false,
  });

  return { success: true };
}

export async function getCouponCodes(clubId: string) {
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
  const coupons = await Coupon.find(query).sort({ createdAt: -1 }).lean();

  // Attach dynamic usage info computed from tickets (booked/checked-in/pending)
  const codes = coupons.map((c: any) => c.code);
  const usage = await Ticket.aggregate([
    {
      $match: {
        couponCode: { $in: codes },
        status: { $in: ["booked", "checked-in", "pending"] },
      },
    },
    {
      $group: {
        _id: "$couponCode",
        count: { $sum: 1 },
        users: { $addToSet: "$userEmail" },
      },
    },
  ]);

  const usageMap = new Map<string, { count: number; users: string[] }>();
  usage.forEach((u: any) =>
    usageMap.set(u._id, { count: u.count, users: u.users }),
  );

  return coupons.map((r: any) => {
    const u = usageMap.get(r.code) || { count: 0, users: [] };
    return {
      ...r,
      _id: r._id.toString(),
      createdAt: r.createdAt.toISOString(),
      usedAt: r.usedAt?.toISOString(),
      usageCount: u.count,
      usedByEmails: u.users,
      maxUses: r.maxUses,
      type: r.type || "single-use",
    };
  });
}

export async function deleteCouponCode(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await dbConnect();
  const coupon = await Coupon.findById(id);
  if (!coupon) throw new Error("Coupon not found");

  if (coupon.type === "multi-use") {
    const usage = await Ticket.countDocuments({
      couponCode: coupon.code,
      status: { $in: ["booked", "checked-in", "pending"] },
    });
    if (usage > 0) throw new Error("Cannot delete a coupon that has been used");
  }

  const canDelete = await hasClubPermission(user.id, coupon.clubId, [
    "club-admin",
  ]);
  if (!canDelete && user.role !== "super-admin") {
    throw new Error("Permission denied");
  }

  if (coupon.isUsed) {
    throw new Error("Cannot delete a used coupon code");
  }

  await Coupon.findByIdAndDelete(id);
  return { success: true };
}

export async function updateCouponLimit(id: string, maxUses: number) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  if (maxUses < 1) throw new Error("Max uses must be at least 1");

  await dbConnect();
  const coupon = await Coupon.findById(id);
  if (!coupon) throw new Error("Coupon not found");
  if (coupon.type !== "multi-use")
    throw new Error("Only multi-use coupons have a limit");

  const canEdit = await hasClubPermission(user.id, coupon.clubId, [
    "club-admin",
  ]);
  if (!canEdit && user.role !== "super-admin")
    throw new Error("Permission denied");

  coupon.maxUses = maxUses;
  await coupon.save();
  return { success: true };
}

export async function validateCouponCode(code: string, clubId?: string) {
  await dbConnect();

  // Normalize code: uppercase and replace spaces with dashes
  const normalizedCode = code.trim().toUpperCase().replace(/\s+/g, "-");

  const coupon = await Coupon.findOne({
    code: normalizedCode,
    isUsed: false,
  });

  if (!coupon) return { valid: false, message: "Invalid or used code" };

  // Feature flag check for multi-use coupons
  if (coupon.type === "multi-use") {
    const club = await Club.findOne({ clubId: coupon.clubId });
    if (!club?.features?.reusableCoupon) {
      return { valid: false, message: "Coupon not enabled for this club" };
    }
  }

  // If single-use behaves as before
  if (coupon.type === "single-use") {
    return {
      valid: true,
      discountPercentage: coupon.discountPercentage,
      clubId: coupon.clubId,
      id: coupon._id.toString(),
      type: coupon.type,
    };
  }

  // Multi-use: compute dynamic usage and enforce limit
  const usageCount = await Ticket.countDocuments({
    couponCode: normalizedCode,
    status: { $in: ["booked", "checked-in", "pending"] },
  });

  if (coupon.maxUses && usageCount >= coupon.maxUses) {
    return { valid: false, message: "Coupon usage limit reached" };
  }

  return {
    valid: true,
    discountPercentage: coupon.discountPercentage,
    clubId: coupon.clubId,
    id: coupon._id.toString(),
    type: coupon.type,
    maxUses: coupon.maxUses,
    remainingUses: coupon.maxUses ? coupon.maxUses - usageCount : undefined,
  };
}
