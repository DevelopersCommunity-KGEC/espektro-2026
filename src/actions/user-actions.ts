"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import { revalidatePath } from "next/cache";

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
