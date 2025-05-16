import { createClient } from "redis";

import { AppConfig } from "../config/app.config.js";

export const redisClient = createClient({
  url: AppConfig.env.REDIS_URI
});