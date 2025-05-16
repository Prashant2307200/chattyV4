import { Router } from 'express';
import { AppConfig } from '../config/app.config.js';

import authRoute from './auth.route.js';
import userRoute from './user.route.js';
import chatRoute from './chat.route.js';
import requestRoute from './request.route.js';

const { Paths } = AppConfig;

const router = Router();

router.use(Paths.Auth.Base, authRoute);
router.use(Paths.Users.Base, userRoute);
router.use(Paths.Chats.Base, chatRoute);
router.use(Paths.Requests.Base, requestRoute);

export default router;