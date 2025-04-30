import express from "express";

import {
  registerGeneralUser,
  emailVerificationGeneralUser,
  logionGeneralUser,
  resendOTPGeneralUser,
  forgotPasswordOTPGeneralUser,
  ChangePasswordForgetPassGeneralUser,
  ChangePasswordGeneralUser,
  logout,
} from "./generalUser.controller";
import { profilePictureUpload } from "../../multer/multer.upload";
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
router.post(
  "/forgotPasswordOTP",
  forgotPasswordRateLimiter,
  forgotPasswordOTPGeneralUser
);
router.post(
  "/changePasswordForgetPass",
  verifyTokenMiddleware,
  ChangePasswordForgetPassGeneralUser
);
router.post(
  "/changePassword",
  verifyTokenMiddleware,
  ChangePasswordGeneralUser
);
router.post("/logout", logout);
export const generalUserRoutes = router;
