import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  role: "user" | "super-admin";
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: {
      type: String,
      enum: ["user", "super-admin"],
      default: "user",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "user" },
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
