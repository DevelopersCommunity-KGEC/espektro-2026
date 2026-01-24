import mongoose, { Schema, Document } from "mongoose";

export interface IReferral extends Document {
  code: string;
  clubId: string;
  discountPercentage: number;
  isUsed: boolean;
  usedBy?: string; // User Email
  usedAt?: Date;
  createdBy: string;
  createdAt: Date;
}

const ReferralSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  clubId: { type: String, required: true }, // 'all' or specific clubId
  discountPercentage: { type: Number, required: true, min: 0, max: 100 },
  isUsed: { type: Boolean, default: false },
  usedBy: { type: String },
  usedAt: { type: Date },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Referral ||
  mongoose.model<IReferral>("Referral", ReferralSchema);
