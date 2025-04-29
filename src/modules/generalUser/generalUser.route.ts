import express from "express";

import {
  registerGeneralUser,
  emailVerificationGeneralUser,
  logionGeneralUser,
  resendOTPGeneralUser
} from "./generalUser.controller";
import { upload } from "../../multer/multer.upload";
import { RoleCheckMiddleware } from "../../middlewares/roleGuard";
import { verifyTokenMiddleware } from "../../middlewares/verifyTokenMiddleware";
import {
  loginRateLimiter,
  otpRateLimiter,
  forgotPasswordRateLimiter,
} from "../../middlewares/rateLimiter";
const router = express.Router();

router.post("/register", registerGeneralUser);
router.post("/verifyOtp", emailVerificationGeneralUser);
router.post("/login", loginRateLimiter, logionGeneralUser);
router.post("/resendOTP", otpRateLimiter, resendOTPGeneralUser);


export const generalUserRoutes = router;
