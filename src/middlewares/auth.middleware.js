import { Token } from "../utils/Token.util.js";

export async function authMiddleware(request, response, nextFunc) {
  request.user = await Token.verifyAuthTokens(request, response);
  return nextFunc();
};