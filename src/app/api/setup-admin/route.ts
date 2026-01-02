import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
    const adminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "").split(",").map(e => e.trim()).filter(Boolean);

    if (!process.env.MONGODB_URI || adminEmails.length === 0) {
        return NextResponse.json({ error: "Missing MONGODB_URI or ADMIN_EMAILS environment variable is empty" }, { status: 500 });
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        const db = client.db();

        // Update all users found in the adminEmails list
        const result = await db.collection("user").updateMany(
            { email: { $in: adminEmails } },
            { $set: { role: "admin" } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "No matching users found to promote. Please ensure you have logged in first.", adminEmails }, { status: 404 });
        }

        return NextResponse.json({
            message: `Success! Promoted ${result.modifiedCount} users to admin. (Matched: ${result.matchedCount})`,
            adminEmails
        });
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    } finally {
        await client.close();
    }
}
