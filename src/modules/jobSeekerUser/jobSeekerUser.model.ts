import mongoose, { Schema } from "mongoose";
import {
  Gender,
  MaritalStatus,
  IJobSeekerPersonal,
  IJobSeekerProfile,
  IJobSeekerAccountSettings,
  IJobSeekerSocialMedia,
} from "./jobSeekerUser.interface"; // Import IUser Interface

// Job Information Schema
const jobSeekerPersonalSchema = new Schema<IJobSeekerPersonal>(
  {
    jobTitle: { type: String, default: null, required: false },
    experience: { type: String, default: null, required: false },
    education: { type: String, default: null, required: false },
    personalWebsite: { type: String, default: null, required: false },
    profilePicture: {
      filePathURL: {
        type: String,
        default: "/uploads/profile_pictures/1745471655982-763482898.jpg",
        required: false,
      },
      fileOriginalName: {
        type: String,
        default: "defaultProfilePictureAADD.jpg",
        required: false,
      },
      fileServerName: {
        type: String,
        default: "1745471655982-763482898.jpg",
        required: false,
      },
      pathA: { type: String, required: false },
    },
    resume: {
      fileOriginalName: { type: String, required: false },
      fileServerName: { type: String, required: false },
      filePathURL: { type: String, required: false },
      pathA: { type: String, required: false },
    },
    userId: { type: mongoose.Types.ObjectId, ref: "generalUser" }, // Reference to the JobSeekerUser model
    email: { type: String, required: false },
  },
  { timestamps: true }
);

const JobSeekersPersonal = mongoose.model<IJobSeekerPersonal>(
  "JobSeekersPersonal",
  jobSeekerPersonalSchema
);

// Personal Information Schema
const JobSeekersProfileSchema = new Schema<IJobSeekerProfile>({
  nationality: { type: String, default: null, required: false },
  dob: { type: Date, default: null, required: false },
  gender: { type: String, enum: Object.values(Gender), required: false },
  maritalStatus: {
    type: String,
    enum: Object.values(MaritalStatus),
    default: null,
    required: false,
  },
  biography: { type: String, default: null, required: false },
  userId: { type: mongoose.Types.ObjectId, ref: "generalUser" }, // Reference to the JobSeekerUser model
  email: { type: String, required: false },
});

const JobSeekersProfile = mongoose.model<IJobSeekerProfile>(
  "JobSeekersProfile",
  JobSeekersProfileSchema
);

const JobSeekersAccountSettingSchema = new Schema<IJobSeekerAccountSettings>({
  fullAddress: { type: String, default: null, required: false },
  city: { type: String, default: null, required: false },
  state: { type: String, default: null, required: false },
  country: { type: String, default: null, required: false },
  phoneNumber: { type: String, default: null, required: false },
  jobAlertRole: { type: String, default: null, required: false },
  jobAlertCity: { type: String, default: null, required: false },
  userId: { type: mongoose.Types.ObjectId, ref: "generalUser" }, // Reference to the JobSeekerUser model
  email: { type: String, required: false },
});
const JobSeekersAccountSetting = mongoose.model<IJobSeekerAccountSettings>(
  "JobSeekersAccountSetting",
  JobSeekersAccountSettingSchema
);

// Social Media Schema
const JobSeekersSocialMediaSchema = new Schema<IJobSeekerSocialMedia>({
  facebookLink: { type: String, default: null, required: false },
  xLink: { type: String, default: null, required: false },
  instagramLink: { type: String, default: null, required: false },
  linkedinLink: { type: String, default: null, required: false },
  userId: { type: mongoose.Types.ObjectId, ref: "generalUser" }, // Reference to the JobSeekerUser model
  email: { type: String, required: false },
});

const JobSeekersSocialMedia = mongoose.model<IJobSeekerSocialMedia>(
  "JobSeekersSocialMedia",
  JobSeekersSocialMediaSchema
);

export {
  JobSeekersPersonal,
  JobSeekersProfile,
  JobSeekersAccountSetting,
  JobSeekersSocialMedia,
};
