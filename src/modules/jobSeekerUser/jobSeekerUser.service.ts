import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import {
  JobSeekersPersonal,
  JobSeekersProfile,
  JobSeekersAccountSetting,
  JobSeekersSocialMedia,
} from "./jobSeekerUser.model"; // Import updated model
import { generalUser } from "../generalUser/generalUser.model"; // Import updated model

import {
  generateOTP,
  hashPassword,
  verifyPassword,
  sendOTPEmailRegister,
  otpExpireTime,
  resendOTPEmail,
  sendForgotPasswordOTPEmail,
} from "./jobSeekerUser.utils"; // Utility to generate OTP
import {
  generateRegisterToken,
  generateToken,
  verifyToken,
} from "../../utils/JwtToken";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

import { OTP_EXPIRE_TIME, Nodemailer_GMAIL } from "../../config/index";
import { string } from "zod";
//profile information update service
export const updateProfileInformationJobSeekersService = async (
  id: string,
  email: string,
  role: string,
  updatedData: any // Accept updated data as an object
) => {
  // 1. Check if the user exists
  const user = await generalUser.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }
  // Update only the fields that were provided
  if (updatedData.name && updatedData.name !== user.name) {
    user.name = updatedData.name;
  }
  await user.save();
  const jobSeekerPersonal = await JobSeekersPersonal.findOne({ email })
    .populate("userId", "-password") // Populate the user field with user data from the generalUser model
    .exec();
  //console.log(jobSeekerPersonal)

  if (!jobSeekerPersonal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job seeker not found.");
  }
  if (
    updatedData.jobTitle &&
    updatedData.jobTitle !== jobSeekerPersonal.jobTitle
  ) {
    jobSeekerPersonal.jobTitle = updatedData.jobTitle;
  }
  if (
    updatedData.experience &&
    updatedData.experience !== jobSeekerPersonal.experience
  ) {
    jobSeekerPersonal.experience = updatedData.experience;
  }
  if (
    updatedData.education &&
    updatedData.education !== jobSeekerPersonal.education
  ) {
    jobSeekerPersonal.education = updatedData.education;
  }
  if (
    updatedData.personalWebsite &&
    updatedData.personalWebsite !== jobSeekerPersonal.personalWebsite
  ) {
    jobSeekerPersonal.personalWebsite = updatedData.personalWebsite;
  }

  await jobSeekerPersonal.save();
  // 5. Generate a JWT token for the user after successful OTP generation
  const token = generateToken({
    id: id,
    role: role,
    email: email,
  });

  // 6. Return the OTP and token in the response
  return {
    token,
    data: {
      name: user.name,
      jobSeekerPersonal,
    },
  };
};
//profile picture upload
export const profilePictureUploadService = async (
  email: string,
  fileOriginalName: string,
  fileServerName: string,
  filePathURL: string,
  pathA: string
) => {
  // Find the job seeker profile by email
  const userProfile = await JobSeekersPersonal.findOne({ email });
  if (!userProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job seeker profile not found.");
  }
  // Check if the existing profile picture is not the default picture
  if (
    userProfile?.profilePicture?.fileServerName !==
    "1745471655982-763482898.jpg"
  ) {
    // Delete the previous profile picture if it's not the default one
    if (!userProfile?.profilePicture?.filePathURL) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Profile picture file path is undefined."
      );
    }
    // const oldFilePath = path.join("uploads"+ userProfile.profilePicture.filePathURL);
    const oldFilePath = userProfile.profilePicture.pathA;
    // Check if the file exists and delete it
    if (fs.existsSync(oldFilePath)) {
      // console.log("file is existed")
      fs.unlinkSync(oldFilePath); // Delete the file from the filesystem
    }
  }
  // Update the profile picture fields in the user's profile
  userProfile.profilePicture = {
    filePathURL, // URL to access the image
    fileOriginalName, // Original file name
    fileServerName,
    pathA, // Server file name (the actual file stored in the filesystem)
  };

  // Save the updated user profile
  await userProfile.save();

  return userProfile; // Return the updated profile
};
//resume upload service
export const resumeUploadService = async (
  email: string,
  fileOriginalName: string,
  fileServerName: string,
  filePathURL: string,
  pathA: string
) => {
  // Find the job seeker profile by email
  const userProfile = await JobSeekersPersonal.findOne({ email });
  if (!userProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job seeker profile not found.");
  }
  if (userProfile.resume?.fileOriginalName) {
    const oldFilePath = userProfile.resume.pathA;
    // Check if the file exists and delete it
    if (fs.existsSync(oldFilePath)) {
      // console.log("file is existed")
      fs.unlinkSync(oldFilePath); // Delete the file from the filesystem
    } else {
      console.log("No previous resume found, skipping deletion.");
    }
  }

  // Update the profile picture fields in the user's profile
  userProfile.resume = {
    filePathURL, // URL to access the image
    fileOriginalName, // Original file name
    fileServerName,
    pathA, // Server file name (the actual file stored in the filesystem)
  };

  // Save the updated user profile
  await userProfile.save();

  return userProfile; // Return the updated profile
};
//get personal information service
export const getPersonalInformationServices = async (
  id: string,
  email: string,
  role: string
) => {
 // 1. Check if the user exists
 const user = await generalUser.findOne({ email });
 if (!user) {
   throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
 }
 const jobSeekerPersonal = await JobSeekersPersonal.findOne({ email })
    .populate("userId", "-password") // Populate the user field with user data from the generalUser model
    .exec();
    if (!jobSeekerPersonal) {
      throw new ApiError(httpStatus.NOT_FOUND, "Job seeker not found.");
    }
    const token = generateToken({
      id: id,
      role: role,
      email: email,
    });
  return {token,
    data:jobSeekerPersonal};
};
