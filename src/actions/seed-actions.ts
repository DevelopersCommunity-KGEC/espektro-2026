"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";

import { FEST_DAYS } from "@/data/event";

export async function ensureFestDays() {
    await dbConnect();

    const results = [];

    for (const day of FEST_DAYS) {
        const existing = await Event.findOne({ title: day.title, type: "fest-day" });
        if (!existing) {
            await Event.create(day);
            results.push(`Created ${day.title}`);
        } else {
            results.push(`Skipped ${day.title} (Already exists)`);
        }
    }

    return results;
}
