import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  clubId: string;
  type: "single-use" | "multi-use";
  maxUses?: number;
  discountPercentage: number;
  isUsed: boolean;
  usedBy?: string; // User Email
  usedAt?: Date;
  createdBy: string;
  createdAt: Date;
}

const CouponSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  clubId: { type: String, required: true }, // 'all' or specific clubId
  type: {
    type: String,
    enum: ["single-use", "multi-use"],
    default: "single-use",
  },
  maxUses: { type: Number, default: 1 },
  discountPercentage: { type: Number, required: true, min: 0, max: 100 },
  isUsed: { type: Boolean, default: false },
  usedBy: { type: String },
  usedAt: { type: Date },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Coupon ||
  mongoose.model<ICoupon>("Coupon", CouponSchema);
