import express from "express";

import {

  updateProfileInformationJobSeekersUser,

} from "./jobSeekerUser.controller";
import { profilePictureUpload } from "../../multer/multer.upload";
import { RoleCheckMiddleware } from "../../middlewares/roleGuard";
import { verifyTokenMiddleware } from "../../middlewares/verifyTokenMiddleware";
import {
  loginRateLimiter,
  otpRateLimiter,
  forgotPasswordRateLimiter,
} from "../../middlewares/rateLimiter";
const router = express.Router();

router.post("/updateProfilePicture",verifyTokenMiddleware,profilePictureUpload,updateProfileInformationJobSeekersUser);


export const jobSeekerUserRoutes = router;
