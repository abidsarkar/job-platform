import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { generateToken } from "../../utils/JwtToken";
import ApiError from "../../errors/ApiError";
import {
  registerSubEmployerUserService,
  deleteSubEmployerUserService,
} from "./employerUser.service";
import { sendCookie } from "../generalUser/generalUser.utils";
import mongoose from "mongoose";
const path = require("path");
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
//delete sub employer user
export const deleteSubEmployerUser = catchAsync(
  async (req: Request, res: Response) => {
    const { subEmployerID }:any = req.query;
    // Extracting the 'id' and 'email' from the JWT token (which was added by the verifyTokenMiddleware)
    const { id: defaultEmployerID, email: defaultEmployerEmail }: any =
      req.user;
    //ok
    //console.log(defaultEmployerID, defaultEmployerEmail);
    // Call the service to register the user and send OTP
    const { deleted } = await deleteSubEmployerUserService(
      subEmployerID,
      defaultEmployerID,
      defaultEmployerEmail,
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