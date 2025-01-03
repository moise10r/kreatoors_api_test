import mongoose, { Schema, Document } from "mongoose";

export interface Device {
  deviceId: string;
  deviceName: string;
  lastUsed: Date;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profileImage?: string;
  isVerified: boolean;
  devices: Device[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  isVerified: { type: Boolean, default: false },
  devices: [{ deviceId: String, deviceName: String, lastUsed: Date }],
});

export default mongoose.model<IUser>("User", UserSchema);
