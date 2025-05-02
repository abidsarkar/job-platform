import mongoose, { Document } from "mongoose";
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
// Job Information Interface
export interface IJobSeekerPersonal extends Document {
  _id: mongoose.Types.ObjectId; // Make sure it's a valid ObjectId reference
  jobTitle?: string | null;
  experience?: string | null;
  education?: string | null;
  personalWebsite?: string | null;
  //profile picture
  profilePicture?: {
    filePathURL: string;
    fileOriginalName: string;
    fileServerName: string;
    pathA: string;
  };
  // CV
  resume?: {
    fileOriginalName: string;
    fileServerName: string;
    filePathURL: string;
    pathA: string;
  };
  userId?: mongoose.Types.ObjectId; // Reference to JobSeekerUser model
  email: string;
}

// Personal Information Interface
export interface IJobSeekerProfile extends Document {
  _id: mongoose.Types.ObjectId;
  nationality?: string | null;
  dob?: Date | null;
  gender?: Gender | null;
  maritalStatus?: MaritalStatus | null;
  biography?: string | null;
  userId?: mongoose.Types.ObjectId ; // Reference to JobSeekerUser model
  email: string;
}
export interface IJobSeekerAccountSettings extends Document {
  _id: mongoose.Types.ObjectId;
  fullAddress?: string | null;
  city?: string | null;
  phoneNumber?: string | null;
  jobAlertRole?: string | null;
  jobAlertCity?: string | null;
  userId?: mongoose.Types.ObjectId; // Reference to JobSeekerUser model
  email: string;
}
// Social Media Information Interface
export interface IJobSeekerSocialMedia extends Document {
  _id: mongoose.Types.ObjectId;
  facebookLink?: string | null;
  xLink?: string | null;
  instagramLink?: string | null;
  linkedinLink?: string | null;
  userId?: mongoose.Types.ObjectId; // Reference to JobSeekerUser model
  email: string;
}
