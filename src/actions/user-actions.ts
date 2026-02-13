"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import Ticket from "@/models/Ticket";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { ensureUserReferralCode } from "@/lib/referral"; // Import helper

export async function getMyReferralStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { count: 0, revenue: 0 };

  await dbConnect();

  // Aggregate stats
  const stats = await Ticket.aggregate([
    {
      $match: {
        referrerUserId: new mongoose.Types.ObjectId(session.user.id),
        status: { $in: ["booked", "checked-in"] },
      },
    },
    {
      $project: {
        computedPrice: { $ifNull: ["$price", 0] },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        revenue: { $sum: "$computedPrice" },
      },
    },
  ]);

  return {
    count: stats[0]?.count || 0,
    revenue: stats[0]?.revenue || 0,
  };
}

export async function getMyReferralCode() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { code: null };

  // Ensure code exists
  const code = await ensureUserReferralCode(session.user.id);
  return { code };
}

export async function updateUserProfile(data: {
  name: string;
  phone: string;
  course: string;
  graduationYear: string;
  collegeName: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  // Update user in MongoDB
  // We update via Mongoose to ensure schema consistency
  // Better Auth will pick up these changes on next session refresh if they match the DB structure
  await UserModel.findByIdAndUpdate(session.user.id, {
    name: data.name,
    phone: data.phone,
    course: data.course,
    graduationYear: data.graduationYear,
    collegeName: data.collegeName,
  });

  revalidatePath("/");
  return { success: true };
}

export async function getReferralLeaderboard() {
  await dbConnect();

  const leaderboard = await Ticket.aggregate([
    {
      $match: {
        referrerUserId: { $exists: true, $ne: null },
        status: { $in: ["booked", "checked-in"] },
      },
    },
    {
      $group: {
        _id: "$referrerUserId",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "user",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        count: 1,
        name: "$user.name",
        image: "$user.image",
        collegeName: "$user.collegeName",
      },
    },
  ]);

  return leaderboard;
}
