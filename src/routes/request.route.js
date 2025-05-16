import { Router } from "express";

import { AppConfig } from "../config/app.config.js"
import { catchError } from "../utils/catchError.util.js";
import { checkId } from "../middlewares/checkId.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { RequestController } from "../controllers/request.controller.js";
import { requestValidationSchema, responseValidationSchema } from "../schemas/request.schema.js";

const router = Router();
const { Paths } = AppConfig;

router.use(authMiddleware);
 
router.param("id", checkId);

router.get(Paths.Requests.Get, catchError(RequestController.getMyRequests));

router.post(Paths.Requests.Create, validate(requestValidationSchema), catchError(RequestController.sendRequest));

router.put(Paths.Requests.Update, validate(responseValidationSchema), catchError(RequestController.respondToRequest));

router.delete(Paths.Requests.Cancel, catchError(RequestController.cancelRequest));

export default router;