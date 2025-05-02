import { Request, Response } from "express";
import {
  updatePersonalInformationJobSeekersService,
  profilePictureUploadService,
  resumeUploadService,
  getPersonalInformationServices,
  updateProfileInformationJobSeekersService,
  getProfileInformationServices,
} from "./jobSeekerUser.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { generateToken } from "../../utils/JwtToken";
import ApiError from "../../errors/ApiError";

import { sendCookie } from "../generalUser/generalUser.utils";

const path = require("path");
// update personal information
export const updatePersonalInformationJobSeekersUser = catchAsync(
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
    // Update other profile information (without overwriting existing data if not provided)
    const updatedData = {
      name: name || undefined, // Only update if provided
      jobTitle: jobTitle || undefined,
      experience: experience || undefined,
      education: education || undefined,
      personalWebsite: personalWebsite || undefined,
    };
    //send data to update information
    const { token, data } = await updatePersonalInformationJobSeekersService(
      id,
      email,
      role,
      updatedData
    );
    sendCookie(res, token);
    // Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED, // Status code for successful login
      success: true, // Indicates success
      message: "profile information is updated", // Message to be sent in the response
      data: {
        accessToken: token, // Send the JWT token
        data,
      },
    });
  }
);
//upload resume
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
//get the personal profile information
export const getPersonalProfileJobSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    // Extract user data from req.user (set by the verifyTokenMiddleware)
    const { id,role, email }: any = req.user;


    //send data to update information
    const { token, data } = await getPersonalInformationServices(
      id,
      email,
      role
    );
    sendCookie(res, token);
    // Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.OK, // Status code for successful login
      success: true, // Indicates success
      message: "successfully personal information gated", // Message to be sent in the response
      data: {
        accessToken: token, // Send the JWT token
        data,
      },
    });
  }
);
//update profile information
export const updateProfileInformationJobSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    // Extract user data from req.user (set by the verifyTokenMiddleware)
    const { id, role, email }: any = req.user;
    const { nationality, dob, gender, maritalStatus, biography } = req.body; // Data from request body

    // Update other profile information (without overwriting existing data if not provided)
    const updatedData = {
      nationality: nationality || undefined, // Only update if provided
      dob: dob || undefined,
      gender: gender || undefined,
      maritalStatus: maritalStatus || undefined,
      biography: biography || undefined,
    };
    //send data to update information
    const { token, data } = await updateProfileInformationJobSeekersService(
      id,
      email,
      role,
      updatedData
    );
    sendCookie(res, token);
    // Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED, // Status code for successful login
      success: true, // Indicates success
      message: "profile information is updated", // Message to be sent in the response
      data: {
        accessToken: token, // Send the JWT token
        data,
      },
    });
  }
);
//get profile information
export const getProfileInformationJobSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    const { id,role, email }: any = req.user;
   
    const { token, data } = await getProfileInformationServices(
      id,
      email,
      role
    );
    sendCookie(res, token);
    // Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.OK, // Status code for successful login
      success: true, // Indicates success
      message: "successfully personal information gated", // Message to be sent in the response
      data: {
        accessToken: token, // Send the JWT token
        data,
      },
    });
  }
);
//update
