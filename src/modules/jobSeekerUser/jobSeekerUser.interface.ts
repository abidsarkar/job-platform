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
  profilePicture?:{
    filePathURL:string;
    fileOriginalName:string;
    fileServerName:string;
  }
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
  jobAlertRole?: string;
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
