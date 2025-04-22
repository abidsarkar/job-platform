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
  suspend = "suspend",
}

// User Interface (for general information)
export interface IJobSeekerUser extends Document {
  _id: mongoose.Types.ObjectId; // Reference to the JobSeekerUser model
  name: string;
  email: string;
  password: string | null;
  role: Role;
  otp: string | null;
  otpExpiresAt: Date | null;
  isVerified?: boolean;
  isActiveAccount?: AccountStatus;
  profilePicture?: {
    publicFileURL: string;
    path: string;
  };
  // Reference fields
  jobDetailsID?: mongoose.Types.ObjectId; // Reference to JobSeekersJob model
  personalInfoID?: mongoose.Types.ObjectId; // Reference to JobSeekersPersonalInfo model
  socialMediaID?: mongoose.Types.ObjectId; // Reference to JobSeekersSocialMedia model
}

// Job Information Interface
export interface IJobSeekerJob extends Document {
  _id: mongoose.Types.ObjectId; // Make sure it's a valid ObjectId reference
  jobTitle?: string;
  experience?: string;
  education?: string;
  portfolio?: string;
  resumeSrc?: string;
  jobAlertRole?: JobAlertRole;
  jobAlertCity?: string;
  jobAlertRegion?: string;
  jobAlertCountry?: string;
  userId: mongoose.Types.ObjectId; // Reference to JobSeekerUser model
}

// Personal Information Interface
export interface IJobSeekerPersonalInfo extends Document {
  _id: mongoose.Types.ObjectId;
  nationality?: string;
  dob?: Date;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  biography?: string;
  fullAddress?: string;
  city?: string;
  country?: string;
  region?: string;
  phoneNumber?: string;
  userId: mongoose.Types.ObjectId; // Reference to JobSeekerUser model
}

// Social Media Information Interface
export interface IJobSeekerSocialMedia extends Document {
  _id: mongoose.Types.ObjectId;
  facebookLink?: string;
  xLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
  userId: mongoose.Types.ObjectId; // Reference to JobSeekerUser model
}
