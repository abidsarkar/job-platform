import express from "express";

import { registerSubEmployerUser ,deleteSubEmployerUser,updateCompanyInfo,updateCompanyFundInfo} from "./employerUser.controller";
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
router.patch("/update-company-founding-information",verifyTokenMiddleware, roleCheckMiddleware("employer"),updateCompanyFundInfo);


export const employerUserRoutes = router;
