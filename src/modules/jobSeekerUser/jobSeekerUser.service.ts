import fs from "fs";
import path from "path";
import {
  
  JobSeekersPersonal,
  JobSeekersProfile,
  JobSeekersAccountSetting,
  JobSeekersSocialMedia,
} from "./jobSeekerUser.model"; // Import updated model
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
//forgot password service
export const updateProfileInformationJobSeekersService = async (id: string,email:string, role:string) => {
  // 1. Check if the user exists
  const user = await JobSeekersPersonal.findOne({ id });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  // 2. Generate OTP
  const otp = generateOTP(); // Generate OTP
  const otpExpiresAt = await otpExpireTime(); // Get the OTP expiration time

  
  await user.save();

  // 4. Send OTP email to the user


  // 5. Generate a JWT token for the user after successful OTP generation
  const token = generateToken({
    id: id,
    role: role,
    email: email,
  });

  // 6. Return the OTP and token in the response
  return {
    token, // Return the generated token
  };
};