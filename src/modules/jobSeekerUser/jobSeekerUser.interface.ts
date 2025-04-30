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
  jobTitle?: string;
  experience?: string;
  education?: string;
  personalWebsite?: string;
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
  userId?: string; // Reference to JobSeekerUser model
  email: string;
}

// Personal Information Interface
export interface IJobSeekerProfile extends Document {
  _id: mongoose.Types.ObjectId;
  nationality?: string;
  dob?: Date;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  biography?: string;
  userId?: string; // Reference to JobSeekerUser model
  email: string;
}
export interface IJobSeekerAccountSettings extends Document {
  _id: mongoose.Types.ObjectId;
  fullAddress?: string;
  city?: string;
  phoneNumber?: string;
  jobAlertRole?: string;
  jobAlertCity?: string;
  userId?: string; // Reference to JobSeekerUser model
  email: string;
}
// Social Media Information Interface
export interface IJobSeekerSocialMedia extends Document {
  _id: mongoose.Types.ObjectId;
  facebookLink?: string;
  xLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
  userId?: string; // Reference to JobSeekerUser model
  email: string;
}
