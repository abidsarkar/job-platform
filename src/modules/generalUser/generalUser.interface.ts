import mongoose, { Document } from "mongoose";
import { TRole } from "../../config/role"; // Assuming TRole is imported from somewhere

// Enum for Gender, Marital Status, and Job Alert Role for better type safety
export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export enum MaritalStatus {
  Single = "Single",
  Married = "Married",
  Divorced = "Divorced",
  Widowed = "Widowed",
}

export enum JobAlertRole {
  Developer = "Developer",
  Designer = "Designer",
  Manager = "Manager",
  // Add more roles as needed
}

export enum Role {
  admin = "admin",
  jobSeeker = "jobSeeker",
  employer = "employer",
}

export enum AccountStatus {
  active = "active",
  deactivate = "deactivate",
  suspend = "pending",
}

// User Interface (for general information)
export interface IGeneralUser extends Document {
  _id: mongoose.Types.ObjectId; // Reference to the JobSeekerUser model
  name: string;
  email: string;
  password: string | null;
  role: Role;
  otp: string | null;
  otpExpiresAt: Date | null;
  isVerified?: boolean;
  isActiveAccount?: AccountStatus;
  isForgotPasswordVerified?: boolean;
  // Reference fields
  jobDetailsID?: mongoose.Types.ObjectId; // Reference to JobSeekersJob model
  personalInfoID?: mongoose.Types.ObjectId; // Reference to JobSeekersPersonalInfo model
  socialMediaID?: mongoose.Types.ObjectId; // Reference to JobSeekersSocialMedia model
}

