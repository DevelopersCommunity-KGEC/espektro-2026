import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  role: "user" | "security" | "admin" | "ticket-issuer";
  ticketQuota: number;
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: {
      type: String,
      enum: ["user", "security", "admin", "ticket-issuer"],
      default: "user",
    },
    ticketQuota: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "user" }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
