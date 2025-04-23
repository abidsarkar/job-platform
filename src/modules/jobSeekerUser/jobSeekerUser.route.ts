import express from "express";

import {
  registerJobSeekersUser,
  logionJobSeekersUser,
  emailVerificationJobSeekersUser,
  resendOTPJobSeekersUser,
  forgotPasswordOTPSeekersUser,
  ChangePasswordForgetPassSeekersUser,
  ChangePasswordSeekersUser,uploadProfileInformation
} from "./jobSeekerUser.controller";
import {upload} from "../../multer/multer.upload"
import { RoleCheckMiddleware } from "../../middlewares/roleGuard";
import{verifyTokenMiddleware} from "../../middlewares/verifyTokenMiddleware"
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
router.post("/changePassword",verifyTokenMiddleware, RoleCheckMiddleware("jobSeeker"),ChangePasswordSeekersUser);
//upload and update profile picture
router.post("/uploadProject",upload,verifyTokenMiddleware, RoleCheckMiddleware("jobSeeker"),uploadProfileInformation);

export const jobSeekerUserRoutes = router;
