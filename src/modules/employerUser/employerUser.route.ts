import express from "express";

import { registerSubEmployerUser ,deleteSubEmployerUser} from "./employerUser.controller";
import { profilePictureUpload } from "../../multer/multer.upload";
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


export const employerUserRoutes = router;
