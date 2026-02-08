import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  userId?: mongoose.Types.ObjectId;
  userEmail: string;
  eventId: mongoose.Types.ObjectId;
  paymentId: string;
  qrCodeToken: string;
  status: "booked" | "checked-in" | "cancelled" | "pending";
  issueType: "payment" | "manual" | "pass" | "coupon";
  origin?: string;
  revoked: boolean;
  purchaseDate: Date;
  checkInTime?: Date;
  issuedBy?: string;
  guestName?: string;
  guestPhone?: string;
  couponCode?: string;
  referrerUserId?: mongoose.Types.ObjectId;
  discountAmount?: number;
}

const TicketSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  userEmail: { type: String, required: true },
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  paymentId: { type: String, required: true },
  qrCodeToken: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["booked", "checked-in", "cancelled", "pending"],
    default: "booked",
  },
  issueType: {
    type: String,
    enum: ["payment", "manual", "pass", "coupon"],
    default: "payment",
  },
  origin: { type: String },
  revoked: { type: Boolean, default: false },
  purchaseDate: { type: Date, default: Date.now },
  checkInTime: { type: Date },
  issuedBy: { type: String }, // Email of the issuer (admin)
  guestName: { type: String },
  guestPhone: { type: String },
  couponCode: { type: String }, // Used for discount coupons
  referrerUserId: { type: Schema.Types.ObjectId, ref: "User" }, // Used for user attribution
  discountAmount: { type: Number },
});

export default mongoose.models.Ticket ||
  mongoose.model<ITicket>("Ticket", TicketSchema);
