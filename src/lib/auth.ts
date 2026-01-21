import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import dbConnect from "./db";
import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const adminEmails = (
            process.env.ADMIN_EMAILS ||
            process.env.ADMIN_EMAIL ||
            ""
          )
            .split(",")
            .map((e) => e.trim());
          if (adminEmails.includes(user.email)) {
            const client = new MongoClient(process.env.MONGODB_URI!);
            await client.connect();
            const db = client.db();
            await db
              .collection("user")
              .updateOne(
                { _id: (user as any).id || (user as any)._id },
                { $set: { role: "super-admin" } },
              );
            await client.close();
          }

          // Check for pending club roles
          try {
            const client = new MongoClient(process.env.MONGODB_URI!);
            await client.connect();
            const db = client.db();

            const pendingRoles = await db
              .collection("pendingclubroles")
              .find({ email: user.email })
              .toArray();

            if (pendingRoles.length > 0) {
              const operations = pendingRoles.map((p) => ({
                userId: (user as any).id || (user as any)._id, // BetterAuth ID might be string, MongoDB ObjectId. Ensure type match.
                clubId: p.clubId,
                role: p.role,
                createdAt: new Date(),
                updatedAt: new Date(),
              }));

              // Using insertMany for bulk addition (assuming no conflicts, or handle appropriately)
              if (operations.length > 0) {
                // Need to handle potential ObjectId casting if references require it.
                // ClubRole schema expects userId as ObjectId. BetterAuth might use string IDs.
                // If BetterAuth uses MongoDB adapter, ID is typically ObjectId but serialized.
                // Let's assume we need to cast if using Mongoose, but here we use raw driver.

                // Important: The user._id from passed 'user' object might be string or ObjectId depending on adapter.
                // Since we used mongodbAdapter, it's likely ObjectId in DB but string in 'user' object hook?
                // No, 'after' hook usually receives the object returned by adapter.
                // Safest is to use the raw ID from user object.

                // We need to use Mongoose or raw driver to insert.
                // Using raw driver here to avoid re-establishing Mongoose connection if not needed,
                // but 'dbConnect' is available.
                // Let's use raw driver since we have 'client'.

                const fixedOps = operations.map((op) => ({
                  ...op,
                  userId: new mongoose.Types.ObjectId(op.userId),
                }));

                await db.collection("clubroles").insertMany(fixedOps);
                await db
                  .collection("pendingclubroles")
                  .deleteMany({ email: user.email });
              }
            }
            await client.close();
          } catch (error) {
            console.error("Failed to process pending roles", error);
          }
        },
      },
    },
  },
});
