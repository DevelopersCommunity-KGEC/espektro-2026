"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Club from "@/models/Club";
import { clubs } from "@/data/clubs";
import { FEST_DAYS } from "@/data/event";

export async function seedClubs() {
  await dbConnect();
  const results = [];
  for (const club of clubs) {
    const existing = await Club.findOne({ clubId: club.id });
    if (!existing) {
      await Club.create({
        clubId: club.id,
        name: club.name,
        description: club.description,
      });
      results.push(`Created club: ${club.name}`);
    }
  }
  return results;
}

export async function ensureFestDays() {
  await dbConnect();

  const results = [];

  for (const day of FEST_DAYS) {
    const existing = await Event.findOne({
      title: day.title,
      type: "fest-day",
    });
    if (!existing) {
      await Event.create(day);
      results.push(`Created ${day.title}`);
    } else {
      if (!existing.clubId) {
        existing.clubId = "espectro"; // based on seeding
        await existing.save();
        results.push(`Migrated ${day.title}`);
      }
      results.push(`Skipped ${day.title} (Already exists)`);
    }
  }

  return results;
}
