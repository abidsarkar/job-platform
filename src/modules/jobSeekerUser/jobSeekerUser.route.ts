import express from "express";

import {
  registerJobSeekersUser,
  logionJobSeekersUser,
  emailVerificationJobSeekersUser,
  resendOTPJobSeekersUser,
  forgotPasswordOTPSeekersUser,
  ChangePasswordForgetPassSeekersUser,
  ChangePasswordJobSeekersUser,
  updateProfileInformationJobSeekersUser,
  uploadProfilePictureJobSeekersUser
} from "./jobSeekerUser.controller";
import { upload } from "../../multer/multer.upload";
import { RoleCheckMiddleware } from "../../middlewares/roleGuard";
import { verifyTokenMiddleware } from "../../middlewares/verifyTokenMiddleware";
import {
  loginRateLimiter,
  otpRateLimiter,
  forgotPasswordRateLimiter,
} from "../../middlewares/rateLimiter";
const router = express.Router();

router.post("/register", registerJobSeekersUser);
router.post("/login", loginRateLimiter, logionJobSeekersUser);
router.post("/verifyOtp", emailVerificationJobSeekersUser);
router.post("/resendOTP", otpRateLimiter, resendOTPJobSeekersUser);
router.post(
  "/forgotPasswordOTP",
  forgotPasswordRateLimiter,
  forgotPasswordOTPSeekersUser
);
router.post("/changePasswordForgetPass", ChangePasswordForgetPassSeekersUser);
router.post(
  "/changePassword",
  verifyTokenMiddleware,
  RoleCheckMiddleware("jobSeeker"),
  ChangePasswordJobSeekersUser
);
//upload and update profile picture
// Route to upload profile picture
router.post(
  "/uploadProfilePicture",
  upload,  // Middleware for handling file upload
  verifyTokenMiddleware,  // Middleware to verify the token
  RoleCheckMiddleware("jobSeeker"),  // Middleware to check role
  uploadProfilePictureJobSeekersUser  // Controller to handle profile picture upload
);

router.post(
  "/updateProfile",
  
  verifyTokenMiddleware,
  RoleCheckMiddleware("jobSeeker"),
  updateProfileInformationJobSeekersUser
);

export const jobSeekerUserRoutes = router;
