import { AppConfig } from "../config/app.config.js";
import { ExpressError } from "../utils/expressError.util.js";

export function pathHandler(_request, _response, nextFunc) {
  return nextFunc(new ExpressError("Page Not Found!", AppConfig.Status.NotFound));
}