export const catchError = fn => (req, res, next) => fn(req, res, next).catch(next);
