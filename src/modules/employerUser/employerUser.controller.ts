import { Request, Response } from "express";

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
    const { id, role, email }: any = req.user;

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
    const { id, role, email }: any = req.user;

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
//update social media
export const updateSocialMediaInformationJobSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    // Extract user data from req.user (set by the verifyTokenMiddleware)
    const { id, role, email }: any = req.user;
    const { facebookLink, xLink, instagramLink, linkedinLink } = req.body; // Data from request body

    // Update other profile information (without overwriting existing data if not provided)
    const updatedData = {
      facebookLink: facebookLink || undefined, // Only update if provided
      xLink: xLink || undefined,
      instagramLink: instagramLink || undefined,
      linkedinLink: linkedinLink || undefined,
    };
    //send data to update information
    const { token, data } = await updateSocialMediaJobSeekersService(
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
      message: "social media information is updated", // Message to be sent in the response
      data: {
        accessToken: token, // Send the JWT token
        data,
      },
    });
  }
);
//get social media 
export const getSocialMediaInformationJobSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    const { id, role, email }: any = req.user;

    const { token, data } = await getSocialMediaServices(
      id,
      email,
      role
    );
    sendCookie(res, token);
    // Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.OK, // Status code for successful login
      success: true, // Indicates success
      message: "successfully social information gated", // Message to be sent in the response
      data: {
        accessToken: token, // Send the JWT token
        data,
      },
    });
  }
);
//update account 
export const updateAccountInformationJobSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    // Extract user data from req.user (set by the verifyTokenMiddleware)
    const { id, role, email }: any = req.user;
    const { fullAddress, phoneNumber,jobAlertRole ,jobAlertCity} = req.body; // Data from request body
    if (!fullAddress) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Full address is required.");
    }
  
    // Split the full address into city, state, and country using comma as delimiter
    const addressParts = fullAddress.split(',');
  
    if (addressParts.length !== 3) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid address format. Please provide city, state, and country.");
    }
  
    const [city, state, country] = addressParts.map((part: string) => part.trim()); // Trim spaces around the parts
    // Update other profile information (without overwriting existing data if not provided)
    const updatedData = {
      fullAddress: fullAddress || undefined, // Only update if provided
      city: city || undefined,
      state: state || undefined,
      country: country || undefined,
      phoneNumber: phoneNumber || undefined,
      jobAlertRole: jobAlertRole || undefined,
      jobAlertCity: jobAlertCity || undefined,
    };

    //send data to update information
    const { token, data } = await updateAccountJobSeekersService(
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
      message: "Account information is updated", // Message to be sent in the response
      data: {
        accessToken: token, // Send the JWT token
        data,
      },
    });
  }
);
//get account
export const getAccountInformationJobSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    const { id, role, email }: any = req.user;

    const { token, data } = await getAccountJobSeekersService(
      id,
      email,
      role
    );
    sendCookie(res, token);
    // Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.OK, // Status code for successful login
      success: true, // Indicates success
      message: "successfully Account information gated", // Message to be sent in the response
      data: {
        accessToken: token, // Send the JWT token
        data,
      },
    });
  }
);
//get account
export const getAllJobSeekersUser = catchAsync(
  async (req: Request, res: Response) => {
    const { id, role, email }: any = req.user;

    const { token, data } = await getAllInformationJobSeekersService(
      id,
      email,
      role
    );
    sendCookie(res, token);
    // Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.OK, // Status code for successful login
      success: true, // Indicates success
      message: "full information", // Message to be sent in the response
      data: {
        accessToken: token, // Send the JWT token
        data,
      },
    });
  }
);