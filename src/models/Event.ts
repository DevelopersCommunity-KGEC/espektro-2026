import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  image: string;
  date: Date;
  venue: string;
  price: number;
  capacity: number;
  ticketsSold: number;
  isVisible: boolean;
  clubId: string; // Reference to Club.clubId
  maxTeamSize: number;
  allowMultipleBookings: boolean;
  editors: string[]; // Array of User Emails
  type: "fest-day" | "event";
  winners?: {
    position: number;
    teamName?: string;
    members?: string[];
  }[];
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  ticketsSold: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
  clubId: { type: String, required: true },
  maxTeamSize: { type: Number, default: 1 },
  allowMultipleBookings: { type: Boolean, default: false },
  editors: [{ type: String }],
  type: {
    type: String,
    enum: ["fest-day", "event"],
    default: "event",
  },
  winners: [
    {
      position: { type: Number, required: true },
      teamName: { type: String },
      members: [{ type: String }],
    },
  ],
});

export default mongoose.models.Event ||
  mongoose.model<IEvent>("Event", EventSchema);
