import { Request, Response } from "express";
import {
  registerGeneralUserService,
  otpVerificationGeneralUserService,
  loginGeneralUserService,
  resendOTPGeneralUserService,
  forgotPasswordOTPGeneralUserService,
  changePasswordForgetPassGeneralUserService,
  changePasswordGeneralUserService
} from "./generalUser.service";
import { sendCookie } from "./generalUser.utils";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

import ApiError from "../../errors/ApiError";
import path from "path";
export const registerGeneralUser = catchAsync(
  async (req: Request, res: Response) => {
    const { name, email, password, confirmPassword, role } = req.body;

    // Call the service to register the user and send OTP
    const { otp, token } = await registerGeneralUserService(
      name,
      email,
      password,
      confirmPassword,
      role
    );
    sendCookie(res, token);
    // Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        "OTP sent to your email. Please verify to continue registration.",
      data: { accessToken: token },
    });
  }
);
//verify otp of the new user
export const emailVerificationGeneralUser = catchAsync(
  async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const { message, token, user } = await otpVerificationGeneralUserService(
      email,
      otp
    );
    sendCookie(res, token);
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

//login
export const logionGeneralUser = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { token, user, message, role, ACCEPTED_BY_ADMIN } =
      await loginGeneralUserService(email, password);
    sendCookie(res, token);

    // Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.OK, // Status code for successful login
      success: true, // Indicates success
      message: message || "Login successful.", // Fallback message if no message from service
      data: {
        UserRole: role,
        ACCEPTED_BY_ADMIN,
        accessToken: token, // Send the JWT token
        userData: user, // Send the user data (excluding password)
      },
    });
  }
);
//resend otp
export const resendOTPGeneralUser = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const { token } = await resendOTPGeneralUserService(email);
    sendCookie(res, token);
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
//forgot password
export const forgotPasswordOTPGeneralUser = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const { token } = await forgotPasswordOTPGeneralUserService(email);
    sendCookie(res, token);
    sendResponse(res, {
      statusCode: httpStatus.OK, // Status code for successful login
      success: true, // Indicates success
      message: "otp is send again", // Message to be sent in the response
      data: {
        token, // Send the JWT token
      },
    });
  }
);
//change password of forgot password user
export const ChangePasswordForgetPassGeneralUser = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password, confirmPassword } = req.body;
    const { token } = await changePasswordForgetPassGeneralUserService(
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
//change password
export const ChangePasswordGeneralUser = catchAsync(
  async (req: Request, res: Response) => {
    const { email, currentPassword, newPassword, confirmNewPassword } =
      req.body;
    const { token } = await changePasswordGeneralUserService(
      email,
      currentPassword,
      newPassword,
      confirmNewPassword
    );
    sendCookie(res, token);
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
