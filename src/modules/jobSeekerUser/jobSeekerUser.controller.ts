import { Request, Response } from "express";
import {
  updateProfileInformationJobSeekersService,
  profilePictureUploadService,
  resumeUploadService,
} from "./jobSeekerUser.service";
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
    const { id, role, email }: any = req.user;
    const { name, jobTitle, experience, education, personalWebsite } = req.body; // Data from request body

    // Check if the profile picture is uploaded (from multer)
    // Handle the profile picture
    let fileOriginalName = null;
    let fileServerName = null;
    let filePathURL = null;
    let pathA = null;
    if (req.file) {
      // If profile picture is uploaded, store its path in the variable
      fileOriginalName = req.file.originalname;
      fileServerName = req.file.filename;
      filePathURL = `/uploads/profile_pictures/${fileServerName}`;
      pathA = req.file.path;
      await profilePictureUploadService(
        email,
        fileOriginalName,
        fileServerName,
        filePathURL,
        pathA
      );
    }

    //send data to update information
    const { token, data } = await updateProfileInformationJobSeekersService(
      id,
      email,
      role,
      name,
      jobTitle,
      experience,
      education,
      personalWebsite
    );
    sendCookie(res, token);
    // Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED, // Status code for successful login
      success: true, // Indicates success
      message: "profile information is updated", // Message to be sent in the response
      data: {
        token, // Send the JWT token
        data,
      },
    });
  }
);
export const resumeUpdateJobSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    // Extract user data from req.user (set by the verifyTokenMiddleware)
    const { id, role, email }: any = req.user;

    let fileOriginalName = null;
    let fileServerName = null;
    let filePathURL = null;
    let pathA = null;
    if (req.file) {
      // If profile picture is uploaded, store its path in the variable
      fileOriginalName = req.file.originalname;
      fileServerName = req.file.filename;
      filePathURL = `/uploads/cvs/${fileServerName}`;
      pathA = req.file.path;
      await resumeUploadService(
        email,
        fileOriginalName,
        fileServerName,
        filePathURL,
        pathA
      );
    }

    // Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED, // Status code for successful login
      success: true, // Indicates success
      message: "resume upload successful", // Message to be sent in the response
      data: {},
    });
  }
);
