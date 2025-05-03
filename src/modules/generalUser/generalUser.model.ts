import mongoose, { Schema } from "mongoose";
import {
  IGeneralUser,
  Role,
  AccountStatus,
  ISubEmployerUser,
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
  isDefaultAccount: { type: Boolean },
  defaultEmployerID: { type: Schema.Types.ObjectId, ref: "generalUser" },
});
const generalUser = mongoose.model<IGeneralUser>(
  "generalUser",
  generalUserSchema
);
const SubEmployerSchema = new Schema<ISubEmployerUser>({
  defaultEmployerID: { type: Schema.Types.ObjectId, ref: "generalUser" },
  defaultEmployerEmail: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
});
const SubEmployerUser = mongoose.model<ISubEmployerUser>(
  "subEmployerUser",
  SubEmployerSchema
);
export { generalUser, SubEmployerUser };
