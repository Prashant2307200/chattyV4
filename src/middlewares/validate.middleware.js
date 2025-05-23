import { AppConfig } from "../config/app.config.js";

export function validate (schema) {
  return function (request, _response, nextFunc) {

    if (!request.body) return nextFunc(new ExpressError("Invalid request object.", AppConfig.Status.BadRequest));

    const { error } = schema.validate(request.body);
    if (error)
      return nextFunc(error);

    nextFunc();
  }
}