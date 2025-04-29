import mongoose, { Schema } from "mongoose";
import {
  IGeneralUser ,
  Role,
  AccountStatus
} from "./generalUser.interface"; // Import IUser Interface
// User Schema for Job Seeker
const generalUserSchema = new Schema<IGeneralUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), required: true },
  otp: { type: String, required: false },
  otpExpiresAt: { type: Date, required: false },
  isVerified: { type: Boolean, default: false },
  isActiveAccount: {
    type: String,
    enum: Object.values(AccountStatus),
    default: "active",
  },
  isForgotPasswordVerified: { type: Boolean, default: false },
  
});
const generalUser = mongoose.model<IGeneralUser>("generalUser", generalUserSchema);

export {  generalUser};

