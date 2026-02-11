"use server";

import dbConnect from "@/lib/db";
import Ticket from "@/models/Ticket";
import User from "@/models/User";
import Event from "@/models/Event";
import mongoose from "mongoose";

interface ReferralFilter {
  page?: number;
  limit?: number;
  search?: string;
  clubId?: string;
}

export async function getAdminReferralLeaderboard({
  page = 1,
  limit = 10,
  search = "",
  clubId,
}: ReferralFilter) {
  await dbConnect();
  const skip = (page - 1) * limit;

  // 1. Build Ticket Match Query
  const ticketMatch: any = {
    referrerUserId: { $exists: true, $ne: null },
    status: { $in: ["booked", "checked-in"] },
  };

  // If filtering by club, we need to find which events belong to that club first
  // Or do a lookup. Lookup is better for aggregation pipeline.

  const pipeline: any[] = [];

  // Match valid referrals first
  pipeline.push({ $match: ticketMatch });

  // Lookup Event to filter by Club or get Price
  pipeline.push({
    $lookup: {
      from: "events",
      localField: "eventId",
      foreignField: "_id",
      as: "event",
    },
  });
  pipeline.push({ $unwind: "$event" });

  // Filter by Club ID if provided
  if (clubId) {
    pipeline.push({
      $match: {
        "event.clubId": clubId, // Assuming clubId is stored as string in Event or matched type
      },
    });
  }

  // Calculate Revenue (Price - Discount)
  // Assuming Event has 'price' and Ticket has 'discountAmount'
  pipeline.push({
    $addFields: {
      paidAmount: {
        $max: [
          0,
          { $subtract: ["$event.price", { $ifNull: ["$discountAmount", 0] }] },
        ],
      },
    },
  });

  // Group by Referrer
  pipeline.push({
    $group: {
      _id: "$referrerUserId",
      totalReferrals: { $sum: 1 },
      totalRevenue: { $sum: "$paidAmount" },
    },
  });

  // Lookup User Details
  pipeline.push({
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "referrer",
    },
  });
  pipeline.push({ $unwind: "$referrer" });

  // Search Filter (Name or Email)
  if (search) {
    const searchRegex = new RegExp(search, "i");
    pipeline.push({
      $match: {
        $or: [
          { "referrer.name": searchRegex },
          { "referrer.email": searchRegex },
        ],
      },
    });
  }

  // Sort by Total Referrals (Descending)
  pipeline.push({ $sort: { totalReferrals: -1 } });

  // Facet for Pagination
  pipeline.push({
    $facet: {
      metadata: [{ $count: "total" }],
      data: [{ $skip: skip }, { $limit: limit }],
    },
  });

  const result = await Ticket.aggregate(pipeline);

  const metadata = result[0].metadata[0] || { total: 0 };
  const data = result[0].data || [];

  return {
    data: data.map((item: any) => ({
      userId: item._id.toString(),
      name: item.referrer.name,
      email: item.referrer.email,
      image: item.referrer.image,
      collegeName: item.referrer.collegeName,
      totalReferrals: item.totalReferrals,
      totalRevenue: item.totalRevenue,
    })),
    total: metadata.total,
    page,
    limit,
    totalPages: Math.ceil(metadata.total / limit),
  };
}
