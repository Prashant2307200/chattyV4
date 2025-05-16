import { Router } from "express";

import { uploads } from "../utils/uploads.util.js";
import { AppConfig } from "../config/app.config.js";
import { catchError } from "../utils/catchError.util.js";
import { messageSchema } from "../schemas/message.schema.js";
import { checkId } from "../middlewares/checkId.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { MessageController } from "../controllers/message.controller.js";

const router = Router({ mergeParams: true });
const { Paths } = AppConfig;

router.use(authMiddleware);

router.param("id", checkId);

router.post(Paths.Messages.CreateMessage,
  uploads.single("image"),
  (request, _response, nextFunc) => {
    request.body ??= {};
    request.body.image = request.file?.path;
    nextFunc();
  },
  validate(messageSchema),
  catchError(MessageController.sendMessage)
)

export default router;