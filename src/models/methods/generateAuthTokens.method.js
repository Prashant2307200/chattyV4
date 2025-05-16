import jwt from "jsonwebtoken";

import { AppConfig } from "../../config/app.config.js";
import { redisClient } from "../../utils/redis.util.js";

export async function generateAuthTokens (response) {

  const payload = { _id: this._id }; 

  const accessToken = jwt.sign(payload, AppConfig.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, AppConfig.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

  await redisClient.setEx(`refresh_token:${this._id}`, 60 * 60 * 24 * 7, refreshToken);

  response.cookie("access_token", accessToken, { ...AppConfig.cookieOptions, maxAge: 15 * 60 * 1000 });
  response.cookie("refresh_token", refreshToken, { ...AppConfig.cookieOptions });

  return { access_token: accessToken, refresh_token: refreshToken };
};