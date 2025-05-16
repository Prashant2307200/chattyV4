import pino from "pino";

import { AppConfig } from "../config/app.config.js";

export const logger = pino({
  level: AppConfig.env.NODE_ENV === "production" ? "info" : "debug"
});
