import express from "express";

import { updateProfileInformationJobSeekersUser,resumeUpdateJobSeekersUser } from "./jobSeekerUser.controller";
import { profilePictureUpload,cvUpload } from "../../multer/multer.upload";
import { roleCheckMiddleware } from "../../middlewares/roleCheckMiddleware";
import { verifyTokenMiddleware } from "../../middlewares/verifyTokenMiddleware";
import {
  loginRateLimiter,
  otpRateLimiter,
  forgotPasswordRateLimiter,
} from "../../middlewares/rateLimiter";
const router = express.Router();

router.patch(
  "/updateProfilePicture",
  verifyTokenMiddleware,
  roleCheckMiddleware("jobSeeker"),
  profilePictureUpload,
  updateProfileInformationJobSeekersUser
);
router.post(
  "/resumeUpload",
  verifyTokenMiddleware,
  roleCheckMiddleware("jobSeeker"),
  cvUpload,
  resumeUpdateJobSeekersUser
);

export const jobSeekerUserRoutes = router;
