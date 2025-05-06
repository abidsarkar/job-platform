import fs from "fs";
import path from "path";
import { generalUser, SubEmployerUser } from "../generalUser/generalUser.model"; // Import updated model
import {
  EmployerCompanyInfo,
  EmployerFoundingInfo,
  EmployerSocialMedia,
  EmployerContact,
} from "./employerUser.model";
import {
  generateRegisterToken,
  generateToken,
  verifyToken,
} from "../../utils/JwtToken";
import { sendSubEmployerRegistrationEmail } from "./employerUser.utils";
import ApiError from "../../errors/ApiError";
import httpStatus, { ACCEPTED } from "http-status";
import { OTP_EXPIRE_TIME, Nodemailer_GMAIL } from "../../config/index";
import { string } from "zod";
import mongoose from "mongoose";
import e from "express";
import { hashPassword } from "../user/user.utils";
export const registerSubEmployerUserService = async (
  defaultEmployerID: mongoose.Types.ObjectId,
  defaultEmployerEmail: string,
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  //check if the default employer email is same as the email of the new user
  if (email === defaultEmployerEmail) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You cannot register with the same email as the default employer"
    );
  }
  // Check if user is already registered
  const isUserRegistered = await generalUser.findOne({ email });
  if (isUserRegistered) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "This account is already registered. Please log in or use a different account."
    );
  }

  //check if the sub employer email is already registered as sub employer another account
  const isAccountRegistered = await SubEmployerUser.findOne({ email: email });
  if (isAccountRegistered) {
    throw new ApiError(
      httpStatus.NOT_ACCEPTABLE,
      "This account is Already working as a sub employer Please use another email or delete the previous account"
    );
  }
  //validate the default employer ID
  const isDefaultEmployerValid = await generalUser.findOne({
    _id: defaultEmployerID,
  });
  if (!isDefaultEmployerValid) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "the Default employer id is not valid"
    );
  }
  // Check how many sub-employers are already associated with the default employer
  const subEmployerCount = await SubEmployerUser.countDocuments({
    defaultEmployerID: defaultEmployerID,
  });

  // If there are already two sub-employers, throw an error
  if (subEmployerCount >= 2) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can only have a maximum of two sub-employers."
    );
  }
  //password validation
  if (password.length < 6) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password must be at least 6 characters Long"
    );
  }
  //check if the both passwords are same
  if (password !== confirmPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password and confirm password do not match"
    );
  }

  // Hash the password before saving
  const hashedPassword = await hashPassword(password);

  await sendSubEmployerRegistrationEmail(name, email, "localhost:5000");
  // Create a new user document
  const newSubUser = new SubEmployerUser({
    defaultEmployerID,
    defaultEmployerEmail,
    name,
    email,
    role: "subEmployer",
    password: hashedPassword, // Hashed password
    isDefaultAccount: false,
  });

  await newSubUser.save(); // Save user with OTP
  const newSubUser2 = await SubEmployerUser.findOne({ email }).select(
    "-password"
  );

  // Return OTP and token for registration process
  return { newSubUser2 };
};
//delete sub employer by default employer
export const deleteSubEmployerUserService = async (
  subEmployerID: string,
  defaultEmployerID: string,
  defaultEmployerEmail: string
) => {
  // console.log(defaultEmployerID);
  const deleted = await SubEmployerUser.findOneAndDelete({
    _id: subEmployerID,
    defaultEmployerID: defaultEmployerID,
  });
  if (!deleted) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "the sub employer user is not found"
    );
  }
  // Return OTP and token for registration process
  return { deleted };
};
export const updateCompanyInfoService = async (
  id: string,
  email: string,
  role: string,
  companyName: string,
  aboutUs: string
) => {
  //check if the input is valid
  if (!companyName || !aboutUs) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "please provide company name and about us "
    );
  }
  // console.log(id,email,role,companyName,aboutUs);
  //check if the user is is valid
  const user = await generalUser.findOne({ _id: id });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "The user is not found");
  }
  // Find the company information by userId
  let companyInfo = await EmployerCompanyInfo.findOne({
    userId: id,
  });

  if (companyInfo) {
    // Update only the fields that are different
    const updates: any = {};

    if (companyInfo.companyName !== companyName) {
      updates.companyName = companyName;
    }
    if (companyInfo.aboutUs !== aboutUs) {
      updates.aboutUs = aboutUs;
    }

    // Use findOneAndUpdate to update fields without overwriting the document
    companyInfo = await EmployerCompanyInfo.findOneAndUpdate(
      { userId: id },
      { $set: updates }, // Updates only the changed fields
      { new: true } // To return the updated document
    );

    // console.log("Company information updated:", companyInfo);
  } else {
    // If the document doesn't exist, create a new one
    companyInfo = new EmployerCompanyInfo({
      userId: id,
      email: email,
      companyName,
      aboutUs,
    });

    await companyInfo.save(); // Save the new document
    // console.log("New company information created:", companyInfo);
  }
  const token = generateToken({
    id: id,
    role: role,
    email: email,
  });

  return { token, data: { companyInfo } };
};
// Company Logo and Banner Upload Service
export const companyLogoAndBannerUploadService = async (
  email: string,
  fileOriginalName: string,
  fileServerName: string,
  filePathURL: string,
  pathA: string,
  type: "logo" | "banner" // Added type to distinguish between logo and banner
) => {
  // Find the company profile by email
  const companyProfile = await EmployerCompanyInfo.findOne({ email });
  if (!companyProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Company profile not found.");
  }

  // Check if the existing logo or banner is not the default and delete it
  let oldFilePath: string | undefined;
  if (type === "logo" && companyProfile.logo) {
    oldFilePath = companyProfile.logo.pathA;
  } else if (type === "banner" && companyProfile.banner) {
    oldFilePath = companyProfile.banner.pathA;
  }

  // If an old logo or banner exists, delete it
  if (oldFilePath && oldFilePath !== "/default/path/to/logo_or_banner") {
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath); // Delete the old file from the filesystem
    }
  }

  // Update the company logo or banner fields in the company's profile
  if (type === "logo") {
    companyProfile.logo = {
      filePathURL,
      fileOriginalName,
      fileServerName,
      pathA, // Full path of the uploaded file
    };
  } else if (type === "banner") {
    companyProfile.banner = {
      filePathURL,
      fileOriginalName,
      fileServerName,
      pathA, // Full path of the uploaded file
    };
  }

  // Save the updated company profile
  await companyProfile.save();

  return companyProfile; // Return the updated company profile
};
// Upload company logo
export const companyLogoUploadService = async (
  email: string,
  fileOriginalName: string | undefined,
  fileServerName: string | undefined,
  filePathURL: string | undefined,
  pathA: string | undefined
) => {
  const companyLogo = await EmployerCompanyInfo.findOne({ email });
  if (!companyLogo) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employer account not found.");
  }

  // Delete the previous logo if it exists
  if (
    companyLogo.logo?.fileServerName &&
    companyLogo.logo.fileServerName !== fileServerName
  ) {
    const oldFilePath = companyLogo.logo.pathA;
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath); // Delete the old file
    }
  }
  if (!fileOriginalName || !fileServerName || !filePathURL || !pathA) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "please provide all the file data"
    );
  }
  // Update or set the logo data
  companyLogo.logo = {
    filePathURL,
    fileOriginalName,
    fileServerName,
    pathA,
  };

  await companyLogo.save(); // Save the updated data
  return companyLogo;
};

// Upload company banner
export const companyBannerUploadService = async (
  email: string | undefined,
  fileOriginalName: string | undefined,
  fileServerName: string | undefined,
  filePathURL: string | undefined,
  pathA: string | undefined
) => {
  const companyBanner = await EmployerCompanyInfo.findOne({ email });
  if (!companyBanner) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employer account not found.");
  }

  // Delete the previous banner if it exists
  if (
    companyBanner.banner?.fileServerName &&
    companyBanner.banner.fileServerName !== fileServerName
  ) {
    const oldFilePath = companyBanner.banner.pathA;
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath); // Delete the old file
    }
  }
  if (!fileOriginalName || !fileServerName || !filePathURL || !pathA) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "please provide all the file data"
    );
  }
  // Update or set the banner data
  companyBanner.banner = {
    filePathURL,
    fileOriginalName,
    fileServerName,
    pathA,
  };

  await companyBanner.save(); // Save the updated data
  return companyBanner;
};
