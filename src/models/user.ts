// models/user.ts
import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  username: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'user'] },
  username: { type: String, required: true, unique: true },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
