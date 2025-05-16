import { Router } from "express";

import { AppConfig } from "../config/app.config.js";
import { catchError } from "../utils/catchError.util.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { UserController } from "../controllers/user.controller.js";

const router = Router();
const { Paths } = AppConfig;

router.use(authMiddleware);
 
router.get(Paths.Users.Search, catchError(UserController.getAllUsers));

export default router;
