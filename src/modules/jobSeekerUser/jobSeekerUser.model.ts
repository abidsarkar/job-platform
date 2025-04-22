import mongoose, { Schema } from "mongoose";
import {
  IJobSeekerUser ,
  Gender,
  MaritalStatus,
  JobAlertRole,
  Role,
  AccountStatus,
  
  IJobSeekerJob,
  IJobSeekerPersonalInfo,
  IJobSeekerSocialMedia,
} from "./jobSeekerUser.interface"; // Import IUser Interface
// User Schema for Job Seeker
const jobSeekerUserSchema = new Schema<IJobSeekerUser>({
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
  profilePicture: {
    publicFileURL: { type: String, required: false },
    path: { type: String, required: false },
  },
   // Adding references to other models
   jobDetailsID: { type: mongoose.Schema.Types.ObjectId, ref: "JobSeekersJob" },
   personalInfoID: { type: mongoose.Schema.Types.ObjectId, ref: "JobSeekersPersonalInfo" },
   socialMediaID: { type: mongoose.Schema.Types.ObjectId, ref: "JobSeekersSocialMedia" },
});

const jobSeekerUser = mongoose.model<IJobSeekerUser>("JobSeekerUser", jobSeekerUserSchema);
// Job Information Schema
const jobSeekerJobSchema = new Schema<IJobSeekerJob>({
  jobTitle: { type: String, required: false },
  experience: { type: String, required: false },
  education: { type: String, required: false },
  portfolio: { type: String, required: false },
  resumeSrc: { type: String, required: false },
  jobAlertRole: {
    type: String,
    enum: Object.values(JobAlertRole),
    required: false,
  },
  jobAlertCity: { type: String, required: false },
  jobAlertRegion: { type: String, required: false },
  jobAlertCountry: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "JobSeekerUser", required: true }, // Reference to the JobSeekerUser model
});

const JobSeekersJob = mongoose.model<IJobSeekerJob>("JobSeekersJob", jobSeekerJobSchema);

// Personal Information Schema
const JobSeekersPersonalInfoSchema = new Schema<IJobSeekerPersonalInfo>({
  nationality: { type: String, required: false },
  dob: { type: Date, required: false },
  gender: { type: String, enum: Object.values(Gender), required: false },
  maritalStatus: {
    type: String,
    enum: Object.values(MaritalStatus),
    required: false,
  },
  biography: { type: String, required: false },
  fullAddress: { type: String, required: false },
  city: { type: String, required: false },
  country: { type: String, required: false },
  region: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "JobSeekerUser", required: true }, // Reference to the JobSeekerUser model

});

const JobSeekersPersonalInfo = mongoose.model<IJobSeekerPersonalInfo>("JobSeekersPersonalInfo", JobSeekersPersonalInfoSchema);
// Social Media Schema
const JobSeekersSocialMediaSchema = new Schema<IJobSeekerSocialMedia>({
  facebookLink: { type: String, required: false },
  xLink: { type: String, required: false },
  instagramLink: { type: String, required: false },
  linkedinLink: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "JobSeekerUser", required: true }, // Reference to the JobSeekerUser model
});

const JobSeekersSocialMedia = mongoose.model<IJobSeekerSocialMedia>("JobSeekersSocialMedia", JobSeekersSocialMediaSchema);
// Mongoose Schema for Job Seeker (Initial Registration)


export { jobSeekerUser, JobSeekersJob, JobSeekersPersonalInfo, JobSeekersSocialMedia };

