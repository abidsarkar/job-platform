import express from "express";

import {
  registerJobSeekersUser,
  logionJobSeekersUser,
  emailVerificationJobSeekersUser,
  resendOTPJobSeekersUser,
  forgotPasswordSeekersUser,
} from "./jobSeekerUser.controller";
import upload from "../../multer/multer";
import { guardRole } from "../../middlewares/roleGuard";
import {
  loginRateLimiter,
  otpRateLimiter,
  forgotPasswordRateLimiter
} from "../../middlewares/rateLimiter";
const router = express.Router();

router.post("/register", registerJobSeekersUser);
router.post("/login", loginRateLimiter, logionJobSeekersUser);
router.post("/verifyOtp", emailVerificationJobSeekersUser);
router.post("/resendOTP", otpRateLimiter, resendOTPJobSeekersUser);
router.post("/forgotPassword", forgotPasswordRateLimiter, forgotPasswordSeekersUser);

export const jobSeekerUserRoutes = router;
