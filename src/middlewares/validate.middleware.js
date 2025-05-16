import { AppConfig } from "../config/app.config.js";

export function validate (schema) {
  return function (request, _response, nextFunct) {

    if (!request.body) return nextFunct(new ExpressError("Invalid request object.", AppConfig.Status.BadRequest));

    const { error } = schema.validate(request.body);
    if (error)
      return nextFunct(error);

    nextFunct();
  }
}