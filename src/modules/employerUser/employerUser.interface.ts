import mongoose, { Document } from "mongoose";

// company information interface
export interface IEmployerCompanyInfo extends Document {
  _id: mongoose.Types.ObjectId; // Make sure it's a valid ObjectId reference
  //company logo
  logo?: {
    filePathURL: string;
    fileOriginalName: string;
    fileServerName: string;
    pathA: string;
  };
  banner?: {
    filePathURL: string;
    fileOriginalName: string;
    fileServerName: string;
    pathA: string;
  };
  companyName?: string | null;
  aboutUs?: string | null;
  userId?: mongoose.Types.ObjectId; // Reference to JobSeekerUser model
  email: string;
}

// company founding Information Interface
export interface IEmployerFoundingInfo extends Document {
  _id: mongoose.Types.ObjectId;
  organizationType?: string | null;
  industryType?: string | null;
  teamSize?: string | null;
  foundIN?: Date | null;
  companyWebsite?: string | null;
  companyVision?: string | null;
  userId?: mongoose.Types.ObjectId; // Reference to JobSeekerUser model
  email: string;
}
// Social Media Information Interface
export interface IEmployerSocialMedia extends Document {
  _id: mongoose.Types.ObjectId;
  facebookLink?: string | null;
  xLink?: string | null;
  instagramLink?: string | null;
  linkedinLink?: string | null;
  userId?: mongoose.Types.ObjectId; // Reference to JobSeekerUser model
  email: string;
}
export interface IEmployerContact extends Document {
  _id: mongoose.Types.ObjectId;
  fullAddress?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  phoneNumber?: string | null;
  userId?: mongoose.Types.ObjectId; // Reference to JobSeekerUser model
  email: string;
}

