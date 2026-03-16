import { Schema, model, models } from "mongoose";

export type UserDocument = {
  clerkId: string;
  email: string;
  name: string;
  createdAt: Date;
};

const UserSchema = new Schema<UserDocument>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    name: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const User = models.User || model<UserDocument>("User", UserSchema);

export default User;
