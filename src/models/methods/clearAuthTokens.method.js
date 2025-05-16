import { redisClient } from "../../utils/redis.util.js";

export async function clearAuthTokens (response) {

  await redisClient.del(`refresh_token:${this._id}`);

  response.clearCookie("access_token");
  response.clearCookie("refresh_token");
}