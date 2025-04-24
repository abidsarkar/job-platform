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
  isForgotPasswordVerified?: boolean;
  // Profile Picture
  profilePicture?: {
    filePathURL: string;   // The name of the file (e.g., 'profile_picture.jpg')
    fileOriginalName: string;   // The relative path of the file in the public folder (e.g., 'uploads/profile_pictures/profile_picture.jpg')
    fileServerName: string;  // The URL to access the file (e.g., '/uploads/profile_pictures/profile_picture.jpg')
  };
  // Reference fields
  jobDetailsID?: mongoose.Types.ObjectId; // Reference to JobSeekersJob model
  personalInfoID?: mongoose.Types.ObjectId; // Reference to JobSeekersPersonalInfo model
  socialMediaID?: mongoose.Types.ObjectId; // Reference to JobSeekersSocialMedia model
}

// Job Information Interface
export interface IJobSeekerPersonal extends Document {
  _id: mongoose.Types.ObjectId; // Make sure it's a valid ObjectId reference
  jobTitle?: string;
  experience?: string;
  education?: string;
  personalWebsite?: string;
   // CV
   resume?: {
    fileName: string;
    filePath: string;
    publicFileURL: string;
  };
  
  userId?: mongoose.Types.ObjectId; // Reference to JobSeekerUser model
}

// Personal Information Interface
export interface IJobSeekerProfile extends Document {
  _id: mongoose.Types.ObjectId;
  nationality?: string;
  dob?: Date;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  biography?: string;
  userId?: mongoose.Types.ObjectId; // Reference to JobSeekerUser model
}
export interface IJobSeekerAccountSettings extends Document{
  _id: mongoose.Types.ObjectId;
  fullAddress?: string;
  city?: string;
  phoneNumber?: string;
  jobAlertRole?: JobAlertRole;
  jobAlertCity?: string;
  userId?: mongoose.Types.ObjectId; // Reference to JobSeekerUser model

}
// Social Media Information Interface
export interface IJobSeekerSocialMedia extends Document {
  _id: mongoose.Types.ObjectId;
  facebookLink?: string;
  xLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
  userId?: mongoose.Types.ObjectId; // Reference to JobSeekerUser model
}
