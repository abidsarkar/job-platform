import fs from "fs";
import path from "path";
import { generalUser, SubEmployerUser } from "../generalUser/generalUser.model"; // Import updated model
import {
  generateRegisterToken,
  generateToken,
  verifyToken,
} from "../../utils/JwtToken";
import{sendSubEmployerRegistrationEmail}from "./employerUser.utils"
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
  // Check if user is already registered
  const isUserRegistered = await generalUser.findOne({ email });
  if (isUserRegistered) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "This account is already registered. Please log in or use a different account."
    );
  }
  //check if the default employer email is same as the email of the new user
  if (email === defaultEmployerEmail) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You cannot register with the same email as the default employer"
    );
  }
  //check if the sub employer email is already registered with another account
  const isAccountRegistered = await generalUser.findOne({ email: email });
  if (isAccountRegistered) {
    throw new ApiError(
      httpStatus.NOT_ACCEPTABLE,
      "This email is already registered with another account Try to use another email"
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
  await sendSubEmployerRegistrationEmail(name,email,"localhost:5000")
  // Create a new user document
  const newSubUser = new SubEmployerUser({
    defaultEmployerID,
    defaultEmployerEmail,
    name,
    email,
    password: hashedPassword, // Hashed password
    isDefaultAccount: false,
  });

  await newSubUser.save(); // Save user with OTP

  // Return OTP and token for registration process
  return {newSubUser};
};
