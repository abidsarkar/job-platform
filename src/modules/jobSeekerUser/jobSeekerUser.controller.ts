import { Request, Response } from "express";
import {updateProfileInformationJobSeekersService} from "./jobSeekerUser.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { generateToken } from "../../utils/JwtToken";
import ApiError from "../../errors/ApiError";

import { sendCookie } from "../generalUser/generalUser.utils";

const path = require("path");

export const updateProfileInformationJobSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    // Extract user data from req.user (set by the verifyTokenMiddleware)
    const { id, role, email }:any = req.user;
    const { username, title, experience, education, personalWebsite } = req.body; // Data from request body

// Check if the profile picture is uploaded (from multer)
//const profilePicture = req.files && req.files.profilePicture ? req.files.profilePicture[0].path : null;
const { token } = await updateProfileInformationJobSeekersService(id,role,email);
sendCookie(res, token);
// Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED, // Status code for successful login
      success: true, // Indicates success
      message: "otp is send again", // Message to be sent in the response
      data: {
        token, // Send the JWT token
      },
    });
  }
);