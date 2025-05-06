import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { generateToken } from "../../utils/JwtToken";
import ApiError from "../../errors/ApiError";

import {
  registerSubEmployerUserService,
  deleteSubEmployerUserService,
  updateCompanyInfoService,
  companyLogoUploadService,
  companyBannerUploadService,
} from "./employerUser.service";
import { sendCookie } from "../generalUser/generalUser.utils";
import mongoose from "mongoose";
import path from "path";

import multer from "multer";
interface FileData {
  fileOriginalName: string;
  fileServerName: string;
  filePathURL: string;
  pathA: string;
}

interface MulterFiles {
  [fieldname: string]: Express.Multer.File[];
}

// sub employer user registration
export const registerSubEmployerUser = catchAsync(
  async (req: Request, res: Response) => {
    const { name, email, password, confirmPassword } = req.body;
    // Extracting the 'id' and 'email' from the JWT token (which was added by the verifyTokenMiddleware)
    const { id: defaultEmployerID, email: defaultEmployerEmail }: any =
      req.user;
    //ok
    //console.log(defaultEmployerID, defaultEmployerEmail);
    // Call the service to register the user and send OTP
    const { newSubUser2 } = await registerSubEmployerUserService(
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
      data: { newSubUser2 },
    });
  }
);
//delete sub employer user
export const deleteSubEmployerUser = catchAsync(
  async (req: Request, res: Response) => {
    const { subEmployerID }: any = req.query;
    // Extracting the 'id' and 'email' from the JWT token (which was added by the verifyTokenMiddleware)
    const { id: defaultEmployerID, email: defaultEmployerEmail }: any =
      req.user;
    //ok
    //console.log(defaultEmployerID, defaultEmployerEmail);
    // Call the service to register the user and send OTP
    const { deleted } = await deleteSubEmployerUserService(
      subEmployerID,
      defaultEmployerID,
      defaultEmployerEmail
    );
    // Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Sub Employer User deleted successfully.",
      data: { deleted },
    });
  }
);
//update company information both logo and banner
export const updateCompanyInfo = catchAsync(
  async (req: Request, res: Response) => {
    const { companyName, aboutUs } = req.body;
    const { id, role, email }: any = req.user;
    const { token, data } = await updateCompanyInfoService(
      id,
      email,
      role,
      companyName,
      aboutUs
    );
    // Initialize variables for file data
    let logoData = null;
    let bannerData = null;
    let logoFile = null;
    let bannerFile = null;
    // Handle logo upload if exists
    if (req.files && "logo" in req.files && Array.isArray(req.files["logo"])) {
      console.log("got the logo file");
      logoFile = req.files["logo"][0];
      logoFile = req.files["logo"][0];
      logoData = {
        fileOriginalName: logoFile.originalname,
        fileServerName: logoFile.filename,
        filePathURL: `/uploads/logos/${logoFile.filename}`,
        pathA: logoFile.path,
      };
    }

    // Handle logo upload if exists
    if (
      req.files &&
      "banner" in req.files &&
      Array.isArray(req.files["banner"])
    ) {
      bannerFile = req.files["logo"][0];
      bannerFile = req.files["logo"][0];
      bannerData = {
        fileOriginalName: bannerFile.originalname,
        fileServerName: bannerFile.filename,
        filePathURL: `/uploads/logos/${bannerFile.filename}`,
        pathA: bannerFile.path,
      };
    }
    console.log("logo data",logoData);
    console.log("banner data",bannerData);
    // if (req.file) {
    //   // If logo is uploaded, store its path in the variable
    //   fileOriginalName = req.file.originalname;
    //   fileServerName = req.file.filename;
    //   filePathURL = `/uploads/banners/${fileServerName}`;
    //   pathA = req.file.path;
    //   await companyBannerUploadService(
    //     email,
    //     fileOriginalName,
    //     fileServerName,
    //     filePathURL,
    //     pathA
    //   );
    // }
    sendCookie(res, token);
    // Send the response back to the client
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED, // Status code for successful login
      success: true, // Indicates success
      message: "company information is updated", // Message to be sent in the response
      data: {
        accessToken: token, // Send the JWT token
        data,
      },
    });
  }
);
