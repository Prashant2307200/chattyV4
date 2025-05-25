import { logger } from "../utils/logger.util.js";
import { AppConfig } from "../config/app.config.js";
import { ExpressError } from "../utils/expressError.util.js";

export function pathHandler(request, _response, nextFunc) {
  logger.info(`request received: ${request.method} ${request.url}`);
  return nextFunc(new ExpressError("Page Not Found!", AppConfig.Status.NotFound));
}