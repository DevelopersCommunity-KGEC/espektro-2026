"use server";

import dbConnect from "@/lib/db";
import Club from "@/models/Club";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { clubs as clubSeed } from "@/data/clubs";

async function requireSuperAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user?.role !== "super-admin") {
    throw new Error("Unauthorized");
  }
}

const SUPPORTED_FLAGS = ["reusableCoupon"] as const;
type FlagKey = (typeof SUPPORTED_FLAGS)[number];

export async function getFeatureFlags() {
  await requireSuperAdmin();
  await dbConnect();

  const docs = await Club.find({}).lean();
  const map = new Map<string, any>();
  docs.forEach((d: any) => map.set(d.clubId, d));

  // Ensure we surface all known clubs from seed data
  const rows = clubSeed.map((c) => {
    const doc = map.get(c.id);
    const features = doc?.features || {};
    return {
      clubId: c.id,
      name: c.name,
      reusableCoupon: Boolean(features.reusableCoupon),
    };
  });

  return rows;
}

export async function setFeatureFlag(
  clubId: string,
  key: FlagKey,
  enabled: boolean,
) {
  await requireSuperAdmin();
  if (!SUPPORTED_FLAGS.includes(key)) throw new Error("Unknown feature flag");

  await dbConnect();
  const seed = clubSeed.find((c) => c.id === clubId);
  const update: any = {
    [`features.${key}`]: enabled,
  };
  const setOnInsert: any = {};
  if (seed) {
    setOnInsert.name = seed.name;
    setOnInsert.description = seed.description;
  }

  await Club.findOneAndUpdate(
    { clubId },
    { $set: update, $setOnInsert: setOnInsert },
    { upsert: true },
  );

  // Bust caches so coupons pages pick up the new flag
  revalidatePath("/dashboard/coupons");
  revalidatePath("/dashboard/feature-flags");
  revalidatePath(`/club/${clubId}/coupons`);

  return { success: true };
}

/**
 * Lightweight check usable by any authenticated caller (club-admin or super-admin).
 * Returns true if the given club has reusable coupons enabled.
 */
export async function isReusableCouponEnabled(
  clubId: string,
): Promise<boolean> {
  await dbConnect();
  const club = (await Club.findOne({ clubId }).lean()) as any;
  return Boolean(club?.features?.reusableCoupon);
}
