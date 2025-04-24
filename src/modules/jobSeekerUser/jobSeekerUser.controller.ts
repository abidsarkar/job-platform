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

    // 3. Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.OK, // Status code for successful login
      success: true, // Indicates success
      message: "Login successful.", // Message to be sent in the response
      data: {
        token: token, // Send the JWT token
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
export const ChangePasswordSeekersUser = catchAsync(
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
//------new controller------
export const uploadProfileInformation = catchAsync(
  async (req: Request, res: Response) => {
    const { name, email, title, experience, education, personalWebsite } =
      req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const profilePictureFile = files?.profilePicture?.[0];
    //check update on profile picture came or not
    let filePathURL = profilePictureFile.filename;
    let fileOriginalName = profilePictureFile.originalname;
    let fileServerName = profilePictureFile.filename;
    if (profilePictureFile) {
      filePathURL = `/uploads/profile_pictures/${profilePictureFile.filename}`;
      fileOriginalName = profilePictureFile.originalname;
      fileServerName = profilePictureFile.filename;

      // Upload profile picture
      await uploadJobSeekersProfilePictureService(
        email,
        filePathURL,
        fileOriginalName,
        fileServerName
      );
    }
    if(!profilePictureFile){
      
    }

    const { id, updatedName } = await updateNameJobSeekersUserService(
      name,
      email
    );
    const jobSeekerPersonal = await uploadJobSeekersPersonalInformationService(
      id,
      title,
      experience,
      education,
      personalWebsite
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile updated successfully.",
      data: {
        name: updatedName,
        jobSeekerPersonal,
        profilePicturePath: filePathURL,
        profilePictureName: fileOriginalName,
      },
    });
  }
);
