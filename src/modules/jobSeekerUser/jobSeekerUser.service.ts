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
//update personal profile information update service
export const updatePersonalInformationJobSeekersService = async (
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
    .populate(
      "userId",
      "-password -otp -otpExpiresAt -isForgotPasswordVerified"
    ) // Populate the user field with user data from the generalUser model
    .exec();
  if (!jobSeekerPersonal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job seeker not found.");
  }
  const token = generateToken({
    id: id,
    role: role,
    email: email,
  });
  return { token, data: jobSeekerPersonal };
};
//update profile information
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
  // 2. Find the job seeker profile by email and populate the user field (exclude password)
  const jobSeekerProfile = await JobSeekersProfile.findOne({ email })
    .populate(
      "userId",
      "-password -otp -otpExpiresAt -isForgotPasswordVerified"
    ) // Populate user data, excluding password
    .exec();

  if (!jobSeekerProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job seeker profile not found.");
  }
  // 3. Update the profile with the provided data (check if data has changed before updating)
  if (
    updatedData.nationality &&
    updatedData.nationality !== jobSeekerProfile.nationality
  ) {
    jobSeekerProfile.nationality = updatedData.nationality;
  }
  if (updatedData.dob && updatedData.dob !== jobSeekerProfile.dob) {
    jobSeekerProfile.dob = updatedData.dob;
  }
  if (updatedData.gender && updatedData.gender !== jobSeekerProfile.gender) {
    jobSeekerProfile.gender = updatedData.gender;
  }
  if (
    updatedData.maritalStatus &&
    updatedData.maritalStatus !== jobSeekerProfile.maritalStatus
  ) {
    jobSeekerProfile.maritalStatus = updatedData.maritalStatus;
  }
  if (
    updatedData.biography &&
    updatedData.biography !== jobSeekerProfile.biography
  ) {
    jobSeekerProfile.biography = updatedData.biography;
  }

  // 4. Save the updated profile
  await jobSeekerProfile.save();

  // 5. Generate a new JWT token for the user
  const token = generateToken({
    id: id,
    role: role,
    email: email,
  });

  // 6. Return the updated profile data and token
  return {
    token,
    data: jobSeekerProfile.toObject(), // Convert Mongoose document to plain object (remove Mongoose methods)
  };
};
//get profile information service
export const getProfileInformationServices = async (
  id: string,
  email: string,
  role: string
) => {
  // 1. Check if the user exists

  const user = await generalUser.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }
  const jobSeekerProfile = await JobSeekersProfile.findOne({ email })
    .populate(
      "userId",
      "-password -otp -otpExpiresAt -isForgotPasswordVerified"
    ) // Populate the user field with user data from the generalUser model
    .exec();
  if (!jobSeekerProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job seeker not found.");
  }
  const token = generateToken({
    id: id,
    role: role,
    email: email,
  });
  return { token, data: jobSeekerProfile };
};
//update social  media information
export const updateSocialMediaJobSeekersService = async (
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
  // 2. Find the job seeker profile by email and populate the user field (exclude password)
  const jobSeekersSocialMedia = await JobSeekersSocialMedia.findOne({ email })
    .populate(
      "userId",
      "-password -otp -otpExpiresAt -isForgotPasswordVerified"
    ) // Populate user data, excluding password
    .exec();

  if (!jobSeekersSocialMedia) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job seeker profile not found.");
  }
  // 3. Update the profile with the provided data (check if data has changed before updating)
  if (
    updatedData.facebookLink &&
    updatedData.facebookLink !== jobSeekersSocialMedia.facebookLink
  ) {
    jobSeekersSocialMedia.facebookLink = updatedData.facebookLink;
  }
  if (updatedData.xLink && updatedData.xLink !== jobSeekersSocialMedia.xLink) {
    jobSeekersSocialMedia.xLink = updatedData.xLink;
  }
  if (
    updatedData.instagramLink &&
    updatedData.instagramLink !== jobSeekersSocialMedia.instagramLink
  ) {
    jobSeekersSocialMedia.instagramLink = updatedData.instagramLink;
  }
  if (
    updatedData.linkedinLink &&
    updatedData.linkedinLink !== jobSeekersSocialMedia.linkedinLink
  ) {
    jobSeekersSocialMedia.linkedinLink = updatedData.linkedinLink;
  }

  // 4. Save the updated profile
  await jobSeekersSocialMedia.save();

  // 5. Generate a new JWT token for the user
  const token = generateToken({
    id: id,
    role: role,
    email: email,
  });

  // 6. Return the updated profile data and token
  return {
    token,
    data: jobSeekersSocialMedia.toObject(), // Convert Mongoose document to plain object (remove Mongoose methods)
  };
};
//get social media information
export const getSocialMediaServices = async (
  id: string,
  email: string,
  role: string
) => {
  // 1. Check if the user exists

  const user = await generalUser.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }
  const jobSeekersSocialMedia = await JobSeekersSocialMedia.findOne({ email })
    .populate(
      "userId",
      "-password -otp -otpExpiresAt -isForgotPasswordVerified"
    ) // Populate the user field with user data from the generalUser model
    .exec();
  if (!jobSeekersSocialMedia) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job seeker not found.");
  }
  const token = generateToken({
    id: id,
    role: role,
    email: email,
  });
  return { token, data: jobSeekersSocialMedia };
};
//update Account information
export const updateAccountJobSeekersService = async (
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
  // 2. Find the job seeker profile by email and populate the user field (exclude password)
  const jobSeekersAccountSetting = await JobSeekersAccountSetting.findOne({
    email,
  })
    .populate(
      "userId",
      "-password -otp -otpExpiresAt -isForgotPasswordVerified"
    ) // Populate user data, excluding password
    .exec();

  if (!jobSeekersAccountSetting) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job seeker profile not found.");
  }
  // 3. Update the profile with the provided data (check if data has changed before updating)
  if (
    updatedData.fullAddress &&
    updatedData.fullAddress !== jobSeekersAccountSetting.fullAddress
  ) {
    jobSeekersAccountSetting.fullAddress = updatedData.fullAddress;
  }
  if (updatedData.city && updatedData.city !== jobSeekersAccountSetting.city) {
    jobSeekersAccountSetting.city = updatedData.city;
  }
  if (
    updatedData.state &&
    updatedData.state !== jobSeekersAccountSetting.state
  ) {
    jobSeekersAccountSetting.state = updatedData.state;
  }
  if (
    updatedData.country &&
    updatedData.country !== jobSeekersAccountSetting.country
  ) {
    jobSeekersAccountSetting.country = updatedData.country;
  }
  if (
    updatedData.phoneNumber &&
    updatedData.phoneNumber !== jobSeekersAccountSetting.phoneNumber
  ) {
    jobSeekersAccountSetting.phoneNumber = updatedData.phoneNumber;
  }
  if (
    updatedData.jobAlertRole &&
    updatedData.jobAlertRole !== jobSeekersAccountSetting.jobAlertRole
  ) {
    jobSeekersAccountSetting.jobAlertRole = updatedData.jobAlertRole;
  }
  if (
    updatedData.jobAlertCity &&
    updatedData.jobAlertCity !== jobSeekersAccountSetting.jobAlertCity
  ) {
    jobSeekersAccountSetting.jobAlertCity = updatedData.phoneNumber;
  }

  // 4. Save the updated profile
  await jobSeekersAccountSetting.save();

  // 5. Generate a new JWT token for the user
  const token = generateToken({
    id: id,
    role: role,
    email: email,
  });

  // 6. Return the updated profile data and token
  return {
    token,
    data: jobSeekersAccountSetting.toObject(), // Convert Mongoose document to plain object (remove Mongoose methods)
  };
};
//get Account information
export const getAccountJobSeekersService = async (
  id: string,
  email: string,
  role: string
) => {
  // 1. Check if the user exists

  const user = await generalUser.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }
  const jobSeekersAccountSetting = await JobSeekersAccountSetting.findOne({
    email,
  })
    .populate(
      "userId",
      "-password -otp -otpExpiresAt -isForgotPasswordVerified"
    ) // Populate the user field with user data from the generalUser model
    .exec();
  if (!jobSeekersAccountSetting) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job seeker not found.");
  }
  const token = generateToken({
    id: id,
    role: role,
    email: email,
  });
  return { token, data: jobSeekersAccountSetting };
};
//get Account information
export const getAllInformationJobSeekersService = async (
  id: string,
  email: string,
  role: string
) => {
  // 1. Check if the user exists in the generalUser model
  const user = await generalUser.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  // 2. Populate and fetch all related job seeker information
  const jobSeekerAccountSetting = await JobSeekersAccountSetting.findOne({
    email,
  });

  const jobSeekerProfile = await JobSeekersProfile.findOne({ email });

  const jobSeekerPersonal = await JobSeekersPersonal.findOne({ email });

  const jobSeekerSocialMedia = await JobSeekersSocialMedia.findOne({ email });

  if (
    !jobSeekerAccountSetting ||
    !jobSeekerProfile ||
    !jobSeekerPersonal ||
    !jobSeekerSocialMedia
  ) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Job seeker profile or related information not found."
    );
  }

  // 3. Generate a JWT token for the user after successful retrieval
  const token = generateToken({
    id: id,
    role: role,
    email: email,
  });

  // 4. Return the full information (token + populated data)
  return {
    token,
    data: {
      user: {
        name: user.name,
        isVerified: user.isVerified,
        isActiveAccount: user.isActiveAccount,
      }, // Include the user info
      jobSeekerAccountSetting, // Include account settings
      jobSeekerProfile, // Include profile information
      jobSeekerPersonal, // Include personal information
      jobSeekerSocialMedia, // Include social media links
    },
  };
};
