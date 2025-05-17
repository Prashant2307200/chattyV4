import { logger } from "../utils/logger.util.js";
import { AppConfig } from "../config/app.config.js";

export function errorHandler(error, _request, response, _next) {

  const {
    name,
    stack,
    message = "Internal Server Error",
    status = 500,
    code,
    keyValue,
    details
  } = error; 

  AppConfig.env.NODE_ENV !== "production" && console.log(error);

  if (code === 11000) {
    const duplicateField = Object.keys(keyValue).join(", ");
    const message = `Duplicate field value entered: ${duplicateField}. Please use another value.`;
    logger.error(message, AppConfig.Status.BadRequest);
    response.status(AppConfig.Status.BadRequest).json({ message });
    return;
  } else if (name === "MongoServerError") {
    logger.error("Mongodb error", AppConfig.Status.BadRequest);
    response.status(AppConfig.Status.BadRequest).json({ message: "Mongodb error" });
    return;
  } else if (name === "CastError") {
    logger.error("Resource not found", AppConfig.Status.NotFound);
    response.status(AppConfig.Status.NotFound).json({ message: "Resource not found" });
    return;
  } else if (name === "ValidationError") {
    const message = Object.values(details).map(e => e.message || "Unknown error in validation!").join(', ');
    logger.error(message, AppConfig.Status.BadRequest);
    response.status(AppConfig.Status.BadRequest).json({ message: `Send valid data, ${message}.` });
    return;
  }

  logger.error(`Express Error with ${status} and ${message}`, status);
  return response.status(status).json({ message });
}