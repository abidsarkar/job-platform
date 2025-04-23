import {
  jobSeekerUser,
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
export const otpVerificationJobSeekersUserService = async (
  email: string,
  otp: string
) => {
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
// Resend OTP Service
export const resendOTPJobSeekersUserService = async (email: string) => {
  // 1. Check if the user exists
  const user = await jobSeekerUser.findOne({ email });
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
export const forgotPasswordOTPJobSeekersUserService = async (email: string) => {
  // 1. Check if the user exists
  const user = await jobSeekerUser.findOne({ email });
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
    otp, // Return the generated OTP
  };
};
export const changePasswordForgetPassJobSeekersUserService = async (
  email: string,
  password: string,
  confirmPassword: string
) => {
  // 1. Check if the user exists
  const user = await jobSeekerUser.findOne({ email });
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
export const changePasswordJobSeekersUserService = async (
  email: string,
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
) => {
  // 1. Check if the user exists
  const user = await jobSeekerUser.findOne({ email });
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
//profile picture
// Handle profile picture upload
export const uploadJobSeekersProfilePictureService = async (file: Express.Multer.File) => {
  if (!file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Profile picture is required.");
  }

  // Construct the public URL for the file
  const fileName = file.filename;
  const filePath = file.path;
  const publicFileURL = `/uploads/${fileName}`; // Public URL to access the file

  return { fileName, filePath, publicFileURL };
};

export const updateNameJobSeekersUserService = async (
  name: string,
  email: string
) => {
  if (!email) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }
  if (!name) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Name is not found.");
  }
  // 1. Check if the user exists
  const user = await jobSeekerUser.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }
  // 2 update name
  user.name = name;
  await user.save();
  return {
    id: user._id.toString(),
    updatedName: user.name,
  };
};
// Service to handle job seeker's personal information
export const uploadJobSeekersPersonalInformationService = async (
  id: string,
  title: string,
  experience: string,
  education: string,
  personalWebsite: string
) => {
  let user = await jobSeekerUser.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  // Check if the job seeker's personal information exists, if not create it
  let jobSeekerPersonal = await JobSeekersPersonal.findOne({ userId: user._id });
  if (!jobSeekerPersonal) {
    jobSeekerPersonal = new JobSeekersPersonal({
      userId: user._id,
      jobTitle: title,
      experience,
      education,
      personalWebsite,
    });
  } else {
    // Update the personal information if it exists
    jobSeekerPersonal.jobTitle = title;
    jobSeekerPersonal.experience = experience;
    jobSeekerPersonal.education = education;
    jobSeekerPersonal.personalWebsite = personalWebsite;
  }

  await jobSeekerPersonal.save(); // Save updated or new personal info
  return jobSeekerPersonal;
};
// Service to handle job seeker's profile information (address, city, etc.)
