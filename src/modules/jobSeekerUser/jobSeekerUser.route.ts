import express from "express";

import {
  updatePersonalInformationJobSeekersUser,
  resumeUpdateJobSeekersUser,
  getPersonalProfileJobSeekersUser,
  updateProfileInformationJobSeekersUser,
  getProfileInformationJobSeekersUser,
} from "./jobSeekerUser.controller";
import { profilePictureUpload, cvUpload } from "../../multer/multer.upload";
import { roleCheckMiddleware } from "../../middlewares/roleCheckMiddleware";
import { verifyTokenMiddleware } from "../../middlewares/verifyTokenMiddleware";
import {
  loginRateLimiter,
  otpRateLimiter,
  forgotPasswordRateLimiter,
} from "../../middlewares/rateLimiter";
const router = express.Router();

router.patch(
  "/updateProfilePicture-personalInformation",
  verifyTokenMiddleware,
  roleCheckMiddleware("jobSeeker"),
  profilePictureUpload,
  updatePersonalInformationJobSeekersUser
);
router.post(
  "/resumeUpload",
  verifyTokenMiddleware,
  roleCheckMiddleware("jobSeeker"),
  cvUpload,
  resumeUpdateJobSeekersUser
);
router.get(
  "/personal-profile", // This route is for fetching job seeker profile
  verifyTokenMiddleware, // Ensure the user is authenticated
  roleCheckMiddleware("jobSeeker"), // Ensure the user has the correct role
  getPersonalProfileJobSeekersUser // Controller to handle the GET request
);
router.patch(
  "/updateProfile", // This route is for fetching job seeker profile
  verifyTokenMiddleware, // Ensure the user is authenticated
  roleCheckMiddleware("jobSeeker"), // Ensure the user has the correct role
  updateProfileInformationJobSeekersUser // Controller to handle the GET request
);
router.get(
  "/profile", // This route is for fetching job seeker profile
  verifyTokenMiddleware, // Ensure the user is authenticated
  roleCheckMiddleware("jobSeeker"), // Ensure the user has the correct role
  getProfileInformationJobSeekersUser // Controller to handle the GET request
);

export const jobSeekerUserRoutes = router;
