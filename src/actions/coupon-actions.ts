"use server";

import Coupon from "@/models/Coupon";
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

  return coupons.map((r: any) => ({
    ...r,
    _id: r._id.toString(),
    createdAt: r.createdAt.toISOString(),
    usedAt: r.usedAt?.toISOString(),
  }));
}

export async function deleteCouponCode(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await dbConnect();
  const coupon = await Coupon.findById(id);
  if (!coupon) throw new Error("Coupon not found");

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

export async function validateCouponCode(code: string, clubId?: string) {
  await dbConnect();

  // Normalize code: uppercase and replace spaces with dashes
  const normalizedCode = code.trim().toUpperCase().replace(/\s+/g, "-");

  const coupon = await Coupon.findOne({
    code: normalizedCode,
    isUsed: false,
  });

  if (!coupon) return { valid: false, message: "Invalid or used code" };

  return {
    valid: true,
    discountPercentage: coupon.discountPercentage,
    clubId: coupon.clubId,
    id: coupon._id.toString(),
  };
}
