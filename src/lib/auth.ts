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
          const adminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "").split(",").map(e => e.trim());
          if (adminEmails.includes(user.email)) {
            const client = new MongoClient(process.env.MONGODB_URI!);
            await client.connect();
            const db = client.db();
            await db.collection("user").updateOne(
              { _id: (user as any).id || (user as any)._id },
              { $set: { role: "admin" } }
            );
            await client.close();
          }
        },
      },
    },
  },
});
