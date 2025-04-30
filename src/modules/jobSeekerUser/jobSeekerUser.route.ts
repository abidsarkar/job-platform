import express from "express";

import { updateProfileInformationJobSeekersUser } from "./jobSeekerUser.controller";
import { profilePictureUpload } from "../../multer/multer.upload";
import { roleCheckMiddleware } from "../../middlewares/roleCheckMiddleware";
import { verifyTokenMiddleware } from "../../middlewares/verifyTokenMiddleware";
import {
  loginRateLimiter,
  otpRateLimiter,
  forgotPasswordRateLimiter,
} from "../../middlewares/rateLimiter";
const router = express.Router();

router.post(
  "/updateProfilePicture",
  verifyTokenMiddleware,
  roleCheckMiddleware("jobSeeker"),
  profilePictureUpload,
  updateProfileInformationJobSeekersUser
);

export const jobSeekerUserRoutes = router;
