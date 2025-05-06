import express from "express";

import { registerSubEmployerUser ,deleteSubEmployerUser,updateCompanyInfo} from "./employerUser.controller";
import { profilePictureUpload ,logoUpload,bannerUpload,cvUpload} from "../../multer/multer.upload";
import {uploadLogoAndBanner} from "../../multer/multer.uploadBannerAndLogo"
import { RoleCheckMiddleware } from "../../middlewares/roleGuard";
import { verifyTokenMiddleware } from "../../middlewares/verifyTokenMiddleware";
import {
  loginRateLimiter,
  otpRateLimiter,
  forgotPasswordRateLimiter,
} from "../../middlewares/rateLimiter";
import { roleCheckMiddleware } from "../../middlewares/roleCheckMiddleware";
const router = express.Router();

router.post("/register-sub-employer",verifyTokenMiddleware, roleCheckMiddleware("employer"),registerSubEmployerUser);
router.delete("/delete-sub-employer",verifyTokenMiddleware, roleCheckMiddleware("employer"),deleteSubEmployerUser);
router.patch("/update-company-information",verifyTokenMiddleware, roleCheckMiddleware("employer"),uploadLogoAndBanner,updateCompanyInfo);


export const employerUserRoutes = router;
