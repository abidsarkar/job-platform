import fs from "fs";
import path from "path";
import { Role } from "./generalUser.interface";
import { generalUser } from "./generalUser.model"; // Import updated model
import {
  generateOTP,
  hashPassword,
  verifyPassword,
  sendOTPEmailRegister,
  otpExpireTime,
  resendOTPEmail,
  sendForgotPasswordOTPEmail,
  sendCookie,
  findUserByEmail,
} from "./generalUser.utils"; // Utility to generate OTP
import {
  generateRegisterToken,
  generateToken,
  verifyToken,
} from "../../utils/JwtToken";
import ApiError from "../../errors/ApiError";
import httpStatus, { ACCEPTED } from "http-status";

import { OTP_EXPIRE_TIME, Nodemailer_GMAIL } from "../../config/index";
import { string } from "zod";
import {
  JobSeekersPersonal,
  JobSeekersProfile,
  JobSeekersAccountSetting,
  JobSeekersSocialMedia,
} from "../jobSeekerUser/jobSeekerUser.model";
// Register user service (handles OTP and registration)
export const registerGeneralUserService = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  role: string
) => {
  const start = Date.now();

  // Check if name, email, password, confirm password, and role are provided
  if (!name || !email || !password || !confirmPassword || !role) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Name, email, password, role, and confirm password are required."
    );
  }

  // Validate the role and cast the string to Role enum
  if (!Object.values(Role).includes(role as Role)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid role.");
  }

  const validRole = role as Role; // Now we have a valid Role type

  // Password validation
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
  const isUserRegistered = await generalUser.findOne({ email });
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
  const token = generateRegisterToken({ email, role });

  // OTP expiration time
  const otpExpiresAt = await otpExpireTime();

  // Set account status based on role
  const isActiveAccount = validRole === Role.employer ? "pending" : "active";

  // Create a new user document
  const newUser = new generalUser({
    name,
    email,
    password: hashedPassword, // Hashed password
    otp,
    otpExpiresAt,
    role: validRole,
    isActiveAccount,
  });

  await newUser.save(); // Save user with OTP
  const user = await generalUser.findOne({ email });
  if (user?.role === "jobSeeker") {
    const newJobSeekersPersonal = new JobSeekersPersonal({
      userId: user._id,
    });
    await newJobSeekersPersonal.save();
    const newJobSeekersProfile = new JobSeekersProfile({
      userId: user._id,
    });
    await newJobSeekersProfile.save();

    const newJobSeekersAccountSetting = new JobSeekersAccountSetting({
      userId: user._id,
    });
    await newJobSeekersAccountSetting.save();

    const newJobSeekersSocialMedia = new JobSeekersSocialMedia({
      userId: user._id,
    });
    await newJobSeekersSocialMedia.save();
  }
  // Send OTP to the user's email
  await sendOTPEmailRegister(name, email, otp);
  //save the ref id to other model

  // Return OTP and token for registration process
  return { otp, token };
};

// OTP Verification Service
export const otpVerificationGeneralUserService = async (
  email: string,
  otp: string
) => {
  // 1. Check if the user exists in the database
  const user = await generalUser.findOne({ email });
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
  user.isForgotPasswordVerified = true;
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
//login and send role according to the user
//profile info not send yet after login
export const loginGeneralUserService = async (
  email: string,
  password: string
) => {
  //1. check if email and password are provided
  if (!email || !password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email and password required.");
  }
  // 2. Check if user exists
  const user = await generalUser.findOne({ email });
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

  //5. is account verified
  const otp = generateOTP();
  if (!user.isVerified) {
    await sendOTPEmailRegister(user.name, email, otp);
    throw new ApiError(httpStatus.UNAUTHORIZED, `Your account is not verified`);
  }
  // 6. Generate a JWT token for the user
  const token = generateToken({
    id: user._id, // Correct property name
    role: user.role, // Correct the role name spelling
    email: user.email,
  });
  //7. is account deactivate
  if (user.isActiveAccount === "deactivate") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      `Your account is deactivate by admin Mail to ${Nodemailer_GMAIL}for more details`
    );
  }
  //6. is account deactivate
  if (user.isActiveAccount === "pending") {
    return {
      token,
      message: `Your Account is under Processing for verification please Wait A moment. Or contact ${Nodemailer_GMAIL} for Farther Query`,
      ACCEPTED_BY_ADMIN: false,
      role: user.role.toString(),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userRole: user.role,
      },
    };
  } else {
    return {
      token,
      role: user.role.toString(),
      message: "Login Successful",
      ACCEPTED_BY_ADMIN: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userRole: user.role,
      },
    };
  }
};
//resend otp
export const resendOTPGeneralUserService = async (email: string) => {
  // 1. Check if the user exists
  const user = await generalUser.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  // 2. Generate OTP
  const otp = generateOTP(); // Generate OTP
  const otpExpiresAt = await otpExpireTime(); // Get the OTP expiration time

  // 3. Update the OTP and expiration time in the user's document
  user.otp = otp;
  user.otpExpiresAt = otpExpiresAt;

  // Save the user document with the new OTP and expiration time
  await user.save();

  // 4. Send OTP email to the user
  await resendOTPEmail(email, otp, user.name);

  // 5. Generate a JWT token for the user after successful OTP generation
  const token = generateToken({
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  // 6. Return the OTP and token in the response
  return {
    token, // Return the generated token
    otp, // Return the generated OTP
  };
};
//forgot password service
export const forgotPasswordOTPGeneralUserService = async (email: string) => {
  // 1. Check if the user exists
  const user = await generalUser.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  // 2. Generate OTP
  const otp = generateOTP(); // Generate OTP
  const otpExpiresAt = await otpExpireTime(); // Get the OTP expiration time

  // 3. Update the OTP and expiration time in the user's document
  user.otp = otp;
  user.otpExpiresAt = otpExpiresAt;
  user.isForgotPasswordVerified = false; // Set the forgot password verification flag to true
  // Save the user document with the new OTP and expiration time
  await user.save();

  // 4. Send OTP email to the user
  await sendForgotPasswordOTPEmail(email, otp, user.name);

  // 5. Generate a JWT token for the user after successful OTP generation
  const token = generateToken({
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  // 6. Return the OTP and token in the response
  return {
    token, // Return the generated token
  };
};
//password change for forgot password user
export const changePasswordForgetPassGeneralUserService = async (
  email: string,
  password: string,
  confirmPassword: string
) => {
  // 1. Check if the user exists
  const user = await generalUser.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }
  if (!user.isForgotPasswordVerified) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "User  not verified OTP for forgot password."
    );
  }
  // 2.password validation
  if (!password || !confirmPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password and confirm password are required."
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
  // 3. Hash the new password
  const hashedPassword = await hashPassword(password);
  user.password = hashedPassword; // Update the password in the user document
  user.isForgotPasswordVerified = false; // Reset the forgot password verification flag
  user.otp = null; // Clear OTP after successful verification
  await user.save();

  // 5. Generate a JWT token for the user after successful OTP generation
  const token = generateToken({
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  // 6. Return the OTP and token in the response
  return {
    token, // Return the generated token
  };
};
export const changePasswordGeneralUserService = async (
  email: string,
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
) => {
  // 1. Check if the user exists
  const user = await generalUser.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }
  const storedPassword = user.password;
  if (!storedPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User Not verified");
  }
  //2. check if current password is correct
  const isPasswordValid = await verifyPassword(currentPassword, storedPassword);
  if (!isPasswordValid) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Current Password is not correct"
    );
  }
  // 3.both password same
  if (!newPassword || !confirmNewPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password and confirm password are required."
    );
  }
  if (newPassword.length < 6) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password must be at least 6 characters long."
    );
  }
  // Check if password and confirm password match
  if (newPassword !== confirmNewPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password and confirm password do not match."
    );
  }
  // 3. Hash the new password
  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword; // Update the password in the user document
  user.isForgotPasswordVerified = false; // Reset the forgot password verification flag
  user.otp = null; // Clear OTP after successful verification
  await user.save();

  // 5. Generate a JWT token for the user after successful OTP generation
  const token = generateToken({
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  // 6. Return the OTP and token in the response
  return {
    token, // Return the generated token
  };
};
