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
const jobSeekerPersonalSchema = new Schema<IJobSeekerPersonal>({
  jobTitle: { type: String, required: false },
  experience: { type: String, required: false },
  education: { type: String, required: false },
  personalWebsite: { type: String, required: false },
  profilePicture: {
    filePathURL: { type: String,default:"/uploads/profile_pictures/1745471655982-763482898.jpg", required: false },
    fileOriginalName: { type: String,default:"defaultProfilePictureAADD.jpg", required: false },
    fileServerName: { type: String,default:
      "1745471655982-763482898.jpg", required: false },
  },
  resume:{
    fileName: { type: String, required: false },
    filePath: { type: String, required: false },
    publicFileURL: { type: String, required: false },
  },
  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "generalUser", required: true }, // Reference to the JobSeekerUser model
});

const JobSeekersPersonal = mongoose.model<IJobSeekerPersonal>("JobSeekersPersonal", jobSeekerPersonalSchema);

// Personal Information Schema
const JobSeekersProfileSchema = new Schema<IJobSeekerProfile>({
  nationality: { type: String, required: false },
  dob: { type: Date, required: false },
  gender: { type: String, enum: Object.values(Gender), required: false },
  maritalStatus: {
    type: String,
    enum: Object.values(MaritalStatus),
    required: false,
  },
  biography: { type: String, required: false },
 userId: { type: mongoose.Schema.Types.ObjectId, ref: "generalUser", required: true }, // Reference to the JobSeekerUser model

});

const JobSeekersProfile = mongoose.model<IJobSeekerProfile>("JobSeekersProfile", JobSeekersProfileSchema);

const JobSeekersAccountSettingSchema = new Schema<IJobSeekerAccountSettings>({
  fullAddress:{type:String,required:false},
  city:{type:String,required:false},
  phoneNumber:{type:String,required:false},
  jobAlertRole:{type:String,required:false},
  jobAlertCity:{type:String,required:false},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "generalUser", required: true }, // Reference to the JobSeekerUser model
})
const JobSeekersAccountSetting = mongoose.model<IJobSeekerProfile>("JobSeekersAccountSetting", JobSeekersAccountSettingSchema);

// Social Media Schema
const JobSeekersSocialMediaSchema = new Schema<IJobSeekerSocialMedia>({
  
  facebookLink: { type: String, required: false },
  xLink: { type: String, required: false },
  instagramLink: { type: String, required: false },
  linkedinLink: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "generalUser", required: true }, // Reference to the JobSeekerUser model
});

const JobSeekersSocialMedia = mongoose.model<IJobSeekerSocialMedia>("JobSeekersSocialMedia", JobSeekersSocialMediaSchema);



export { JobSeekersPersonal,JobSeekersProfile, JobSeekersAccountSetting, JobSeekersSocialMedia };

