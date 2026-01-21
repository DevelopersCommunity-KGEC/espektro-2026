import mongoose, { Schema, Document } from "mongoose";

export interface IClub extends Document {
  clubId: string; // The static ID from data/clubs.ts (e.g., 'music', 'espectro')
  name: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClubSchema: Schema = new Schema(
  {
    clubId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Club ||
  mongoose.model<IClub>("Club", ClubSchema);
