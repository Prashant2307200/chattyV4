import { Router } from "express";

import messageRoute from "./message.route.js";
import { AppConfig } from "../config/app.config.js";
import { catchError } from "../utils/catchError.util.js";
import { checkId } from "../middlewares/checkId.middleware.js"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ChatController } from "../controllers/chat.controller.js";

const router = Router();
const { Paths } = AppConfig;

router.use(catchError(authMiddleware));

router.param("id", checkId)

router.get(Paths.Chats.GetChats, catchError(ChatController.getChatUsers));
router.get(Paths.Chats.GetChatMessages, catchError(ChatController.getChatMessages));
router.post(Paths.Chats.CreateGroup, catchError(ChatController.createGroupChat));

router.use(Paths.Chats.CreateMessage, messageRoute);

export default router;