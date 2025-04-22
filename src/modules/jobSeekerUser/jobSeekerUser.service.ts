import {
  jobSeekerUser,
  JobSeekersJob,
  JobSeekersPersonalInfo,
  JobSeekersSocialMedia,
} from "./jobSeekerUser.model"; // Import updated model
import {
  generateOTP,
  hashPassword,
  verifyPassword,
  sendOTPEmailRegister,
  otpExpireTime,
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
// Register user service (handles OTP and registration)
export const registerJobSeekersUserService = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  // Check if name, email, password, and confirm password are provided
  if (!name || !email || !password || !confirmPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Name, email, password, and confirm password are required."
    );
  }
  if (password.length < 6) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password must be at least 6 characters long."
    );
  }

  // Check if password and confirm password match
  if (password !== confirmPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password and confirm password do not match."
    );
  }
  // Check if user is already registered
  const isUserRegistered = await jobSeekerUser.findOne({ email });
  if (isUserRegistered) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "This account is already registered. Please log in or use a different account."
    );
  }
  // Hash the password before saving
  const hashedPassword = await hashPassword(password);
  // Generate OTP
  const otp = generateOTP(); // Generate OTP
  const otpExpiresAt = await otpExpireTime();
  
  // Create a new job seeker user document with OTP and other fields
  const newUser = new jobSeekerUser({
    name,
    email,
    password: hashedPassword, // In production, remember to hash the password
    otp,
    otpExpiresAt,
    role: "jobSeeker",
  });

  await newUser.save(); // Save user with OTP

  // Send OTP to the user's email
  await sendOTPEmailRegister(name, email, otp);

  return { otp }; // Return OTP for registration process
};

export const loginJobSeekersUserService = async (
  email: string,
  password: string
) => {
  //1. check if email and password are provided
  if (!email || !password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email and password required.");
  }
  // 2. Check if user exists
  const user = await jobSeekerUser.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }
  // 3. Check if password is available in the user object
  if (!user.password) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Password not found.");
  }
  // 4. Compare the provided password with the stored hashed password
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid password.");
  }
  //5. is account active
  if (user.isActiveAccount !== "active") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      `Your account is Suspended by admin Mail to ${Nodemailer_GMAIL}for more details`
    );
  }
  //6. is account verified
  const otp = generateOTP();
  if (!user.isVerified) {
    await sendOTPEmailRegister(user.name, email, otp);
    throw new ApiError(httpStatus.UNAUTHORIZED, `Your account is not verified`);
  }
  // 4. Generate a JWT token for the user
  const token = generateToken({
    id: user._id, // Correct property name
    role: user.role, // Correct the role name spelling
    email: user.email,
  });
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
// OTP Verification Service
export const otpVerificationService = async (email: string, otp: string) => {
  // 1. Check if the user exists in the database
  const user = await jobSeekerUser.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  // 2. Find the OTP record for the provided email
  const otpRecord = user.otp;
  if (!otpRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "OTP record not found.");
  }

  // 3. Check if the OTP has expired
  const currentTime = new Date();
  let otpExpiresAt = user.otpExpiresAt;
  if (!otpExpiresAt) {
    throw new ApiError(httpStatus.NOT_FOUND, "OTP expired is not found.");
  }
  if (otpExpiresAt < currentTime) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "OTP has expired.");
  }

  // 4. Validate the OTP
  if (otpRecord !== otp) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid OTP.");
  }

  // 5. Mark the user as verified (optional, depending on your workflow)
  user.isVerified = true;
  user.otp = null; // Clear OTP after successful verification
  user.otpExpiresAt = null; // Clear OTP expiration time
  await user.save();

  // 6. Generate a JWT token for the user after successful OTP verification
  const token = generateToken({
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  // 7. Return a success message along with the token
  return {
    message: "OTP verified successfully.",
    token, // Return the generated token
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
export const resendOTPService = async (email: string) => {
  // 1. Check if the user exists
  const user = await jobSeekerUser.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  // 2. send otp again
  const otp = generateOTP(); // Generate OTP
  const otpExpiresAt = await otpExpireTime();

  await user.save();

  // 6. Generate a JWT token for the user after successful OTP verification
  const token = generateToken({
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  // 7. Return a success message along with the token
  return {
    token, // Return the generated token
    otp,
  };
};
