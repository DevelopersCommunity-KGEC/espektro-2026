import mongoose, { Schema, Document } from "mongoose";

export interface IPendingClubRole extends Document {
  email: string;
  clubId: string;
  role: "club-admin" | "volunteer" | "event-editor";
  createdAt: Date;
}

const PendingClubRoleSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    clubId: { type: String, required: true },
    role: {
      type: String,
      enum: ["club-admin", "volunteer", "event-editor"],
      required: true,
    },
  },
  { timestamps: true },
);

// Ensure unique pending role per email+club (overwrite if exists)
PendingClubRoleSchema.index({ email: 1, clubId: 1, role: 1 }, { unique: true });

export default mongoose.models.PendingClubRole ||
  mongoose.model<IPendingClubRole>("PendingClubRole", PendingClubRoleSchema);
