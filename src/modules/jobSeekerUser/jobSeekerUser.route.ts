import express from "express";

import {
  updatePersonalInformationJobSeekersUser,
  resumeUpdateJobSeekersUser,
  getPersonalProfileJobSeekersUser,
  updateProfileInformationJobSeekersUser,
  getProfileInformationJobSeekersUser,
  updateSocialMediaInformationJobSeekersUser,
  getSocialMediaInformationJobSeekersUser,
  updateAccountInformationJobSeekersUser,
  getAccountInformationJobSeekersUser,
  getAllJobSeekersUser
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
  "/update-ProfilePicture-personalInformation",
  verifyTokenMiddleware,
  roleCheckMiddleware("jobSeeker"),
  profilePictureUpload,
  updatePersonalInformationJobSeekersUser
);
router.post(
  "/resume-Upload",
  verifyTokenMiddleware,
  roleCheckMiddleware("jobSeeker"),
  cvUpload,
  resumeUpdateJobSeekersUser
);
router.get(
  "/get-personal-profile", // This route is for fetching job seeker profile
  verifyTokenMiddleware, // Ensure the user is authenticated
  roleCheckMiddleware("jobSeeker"), // Ensure the user has the correct role
  getPersonalProfileJobSeekersUser // Controller to handle the GET request
);
router.patch(
  "/update-Profile", // This route is for fetching job seeker profile
  verifyTokenMiddleware, // Ensure the user is authenticated
  roleCheckMiddleware("jobSeeker"), // Ensure the user has the correct role
  updateProfileInformationJobSeekersUser // Controller to handle the GET request
);
router.get(
  "/get-profile", // This route is for fetching job seeker profile
  verifyTokenMiddleware, // Ensure the user is authenticated
  roleCheckMiddleware("jobSeeker"), // Ensure the user has the correct role
  getProfileInformationJobSeekersUser // Controller to handle the GET request
);
router.patch(
  "/update-socialMedia", // This route is for fetching job seeker profile
  verifyTokenMiddleware, // Ensure the user is authenticated
  roleCheckMiddleware("jobSeeker"), // Ensure the user has the correct role
  updateSocialMediaInformationJobSeekersUser // Controller to handle the GET request
);
router.get(
  "/get-socialMedia", 
  verifyTokenMiddleware, 
  roleCheckMiddleware("jobSeeker"), 
  getSocialMediaInformationJobSeekersUser
);
router.patch(
  "/update-account", 
  verifyTokenMiddleware,
  roleCheckMiddleware("jobSeeker"), 
  updateAccountInformationJobSeekersUser 
);
router.get(
  "/get-account", 
  verifyTokenMiddleware, 
  roleCheckMiddleware("jobSeeker"), 
  getAccountInformationJobSeekersUser 
);
router.get(
  "/get-all", 
  verifyTokenMiddleware, 
  roleCheckMiddleware("jobSeeker"), 
  getAllJobSeekersUser 
);

export const jobSeekerUserRoutes = router;
