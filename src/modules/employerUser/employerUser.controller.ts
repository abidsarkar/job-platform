import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { generateToken } from "../../utils/JwtToken";
import ApiError from "../../errors/ApiError";
import { registerSubEmployerUserService } from "./employerUser.service";
import { sendCookie } from "../generalUser/generalUser.utils";

const path = require("path");
// sub employer user registration
export const registerSubEmployerUser = catchAsync(
  async (req: Request, res: Response) => {
    const {
      defaultEmployerID,
      defaultEmployerEmail,
      name,
      email,
      password,
      confirmPassword,
    } = req.body;

    // Call the service to register the user and send OTP
    const { newSubUser } = await registerSubEmployerUserService(
      defaultEmployerID,
      defaultEmployerEmail,
      name,
      email,
      password,
      confirmPassword
    );
    // Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message:
        "Sub Employer User Registration successful. Please Login To continue",
      data: { newSubUser },
    });
  }
);
