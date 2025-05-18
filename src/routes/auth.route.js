import { Router } from "express";
 
import { uploads } from "../utils/uploads.util.js";
import { AppConfig } from "../config/app.config.js";
import { catchError } from "../utils/catchError.util.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { AuthController } from "../controllers/auth.controller.js";
import { userLoginSchema, userSchema } from "../schemas/user.schema.js";

const router = Router(); 
const { Paths } = AppConfig;

router.get(Paths.Auth.Check, AuthController.check);

router.post(Paths.Auth.Login, validate(userLoginSchema), AuthController.login);
router.post(Paths.Auth.Register, validate(userSchema), AuthController.register);

router.delete(Paths.Auth.Logout, catchError(authMiddleware), AuthController.logout);
router.patch(Paths.Auth.ProfileUpdate, catchError(authMiddleware), uploads.single("profilePic"), AuthController.updateProfile);

export default router;