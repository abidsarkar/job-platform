import fs from "fs";
import path from "path";
import { generalUser, SubEmployerUser } from "../generalUser/generalUser.model"; // Import updated model
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
    role:"subEmployer",
    password: hashedPassword, // Hashed password
    isDefaultAccount: false,
  });

  await newSubUser.save(); // Save user with OTP
  const newSubUser2 = await SubEmployerUser.findOne({ email }).select("-password");

  // Return OTP and token for registration process
  return { newSubUser2 };
};
//delete sub employer by default employer
export const deleteSubEmployerUserService = async (
  subEmployerID: string,
  defaultEmployerID: string,
  defaultEmployerEmail: string
) => {
  console.log(defaultEmployerID);
  const deleted = await SubEmployerUser.findOneAndDelete({
    _id: subEmployerID,defaultEmployerID:defaultEmployerID
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
