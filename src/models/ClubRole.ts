import mongoose, { Schema, Document } from "mongoose";

export interface IClubRole extends Document {
  userId: mongoose.Types.ObjectId;
  clubId: string; // Reference to the Club's static ID (e.g. 'music')
  role: "club-admin" | "volunteer" | "event-editor";
  createdAt: Date;
  updatedAt: Date;
}

const ClubRoleSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clubId: { type: String, required: true, ref: "Club" }, // Using the string ID for easier lookups
    role: {
      type: String,
      enum: ["club-admin", "volunteer", "event-editor"],
      required: true,
    },
  },
  { timestamps: true },
);

// Compound index to ensure unique role per user per club?
// A user can be a club-admin AND a volunteer?
// The changes.md says "Stores role inside that club".
// Usually, higher privelege implies lower, but let's assume one role for now or allow multiple.
// "Supports multiple roles per user across clubs" - "User can be Club Admin in Club A, Volunteer in Club B"
// It doesn't explicitly say multiple roles in the SAME club.
// For simplicity, we'll allow multiple entries if needed, but uniqueness on (userId, clubId, role) is safe.
ClubRoleSchema.index({ userId: 1, clubId: 1, role: 1 }, { unique: true });

export default mongoose.models.ClubRole ||
  mongoose.model<IClubRole>("ClubRole", ClubRoleSchema);
