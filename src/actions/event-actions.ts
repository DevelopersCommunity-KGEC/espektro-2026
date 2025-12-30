"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";

export async function getPublicEvents() {
  await dbConnect();
  const events = await Event.find({ isVisible: true }).sort({ date: 1 });
  return JSON.parse(JSON.stringify(events));
}

export async function getPublicEventById(id: string) {
  await dbConnect();
  const event = await Event.findOne({ _id: id, isVisible: true });
  console.log(event);
  return event ? JSON.parse(JSON.stringify(event)) : null;
}
