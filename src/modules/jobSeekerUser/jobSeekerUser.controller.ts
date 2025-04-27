import { Request, Response } from "express";
import {
  registerJobSeekersUserService,
  loginJobSeekersUserService,
  otpVerificationJobSeekersUserService,
  resendOTPJobSeekersUserService,
  forgotPasswordOTPJobSeekersUserService,
  changePasswordForgetPassJobSeekersUserService,
  changePasswordJobSeekersUserService,
  uploadJobSeekersProfilePictureService,
  updateNameJobSeekersUserService,
  uploadJobSeekersPersonalInformationService,
} from "./jobSeekerUser.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { generateToken } from "../../utils/JwtToken";
import ApiError from "../../errors/ApiError";
const path = require("path");
export const registerJobSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    const { name, email, password, confirmPassword } = req.body;

    // Call the service to register the user and send OTP
    const { otp } = await registerJobSeekersUserService(
      name,
      email,
      password,
      confirmPassword
    );

    // Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        "OTP sent to your email. Please verify to continue registration.",
      data: {},
    });
  }
);
export const logionJobSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { token, user } = await loginJobSeekersUserService(email, password);
    res.cookie("accessToken", token, {
      httpOnly: true,  // Makes the cookie accessible only to HTTP requests, not JavaScript
      secure: process.env.NODE_ENV === "production",  // Set to true in production to use HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,  // Token expiration time (7 days in milliseconds)
      sameSite: "none",  // Prevents the cookie from being sent in cross-origin requests
    });
    
    // 3. Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.OK, // Status code for successful login
      success: true, // Indicates success
      message: "Login successful.", // Message to be sent in the response
      data: {
        accessToken: token, // Send the JWT token
        userData: user, // Send the user data (excluding password)
      },
    });
  }
);
export const emailVerificationJobSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const { message, token, user } = await otpVerificationJobSeekersUserService(
      email,
      otp
    );
    sendResponse(res, {
      statusCode: httpStatus.OK, // Status code for successful login
      success: true, // Indicates success
      message: message, // Message to be sent in the response
      data: {
        token, // Send the JWT token
        user, // Send the user data (excluding password)
      },
    });
  }
);
export const resendOTPJobSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const { token } = await resendOTPJobSeekersUserService(email);
    sendResponse(res, {
      statusCode: httpStatus.OK, // Status code for successful login
      success: true, // Indicates success
      message: "otp is send again", // Message to be sent in the response
      data: {
        token, // Send the JWT token
        // Send the user data (excluding password)
      },
    });
  }
);

export const forgotPasswordOTPSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const { otp, token } = await forgotPasswordOTPJobSeekersUserService(email);
    sendResponse(res, {
      statusCode: httpStatus.OK, // Status code for successful login
      success: true, // Indicates success
      message: "otp is send again", // Message to be sent in the response
      data: {
        token, // Send the JWT token
        otp, // Send the user data (excluding password)
      },
    });
  }
);
export const ChangePasswordForgetPassSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password, confirmPassword } = req.body;
    const { token } = await changePasswordForgetPassJobSeekersUserService(
      email,
      password,
      confirmPassword
    );
    sendResponse(res, {
      statusCode: httpStatus.OK, // Status code for successful login
      success: true, // Indicates success
      message: "Password Change Successful", // Message to be sent in the response
      data: {
        token,
      },
    });
  }
);
export const ChangePasswordJobSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    const { email, currentPassword, newPassword, confirmNewPassword } =
      req.body;
    const { token } = await changePasswordJobSeekersUserService(
      email,
      currentPassword,
      newPassword,
      confirmNewPassword
    );
    sendResponse(res, {
      statusCode: httpStatus.OK, // Status code for successful login
      success: true, // Indicates success
      message: "Password Change Successful", // Message to be sent in the response
      data: {
        token: token,
      },
    });
  }
);
// profile controller
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}
//------new controller------
export const uploadProfilePictureJobSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const profilePictureFile = files?.profilePicture?.[0];

    if (!profilePictureFile) {
      throw new ApiError(httpStatus.BAD_REQUEST, "No profile picture uploaded.");
    }
    if (!req.user) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User not authenticated.");
    }
    const { email,id} = req.user;  // Assuming email is sent in the request body
    if (!email) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email not found in the token.");
    }
    const filePathURL = `/uploads/profile_pictures/${profilePictureFile.filename}`;
    const fileOriginalName = profilePictureFile.originalname;
    const fileServerName = profilePictureFile.filename;

    // Call the service to upload the profile picture
    const updatedUser = await uploadJobSeekersProfilePictureService(
      email,
      filePathURL,
      fileOriginalName,
      fileServerName
    );

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully.",
      data: updatedUser,
    });
  }
);
export const updateProfileInformationJobSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    const { name, email, title, experience, education, personalWebsite } = req.body;

    // Update user name
    const { id, updatedName } = await updateNameJobSeekersUserService(name, email);

    // Update personal information
    const jobSeekerPersonal = await uploadJobSeekersPersonalInformationService(
      id,
      title,
      experience,
      education,
      personalWebsite
    );

    res.status(200).json({
      success: true,
      message: "Profile information updated successfully.",
      data: {
        name: updatedName,
        jobSeekerPersonal,
      },
    });
  }
);
