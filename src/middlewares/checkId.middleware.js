import { isValidObjectId } from "mongoose";
import { AppConfig } from "../config/app.config.js";
import { ExpressError } from "../utils/expressError.util.js";

export function checkId(_req, _res, next, id) {

  if (!isValidObjectId(id))
    return next(new ExpressError(`Invalid id ${id}`, AppConfig.Status.BadRequest));

  return next();
}