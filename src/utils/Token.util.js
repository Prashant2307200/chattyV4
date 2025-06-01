import jwt from "jsonwebtoken";

import { logger } from "../utils/logger.util.js";
import { AppConfig } from "../config/app.config.js";
import { UserService } from "../services/user.service.js";

import { redisClient } from "../utils/redis.util.js";
import { ExpressError } from "../utils/expressError.util.js";

export const Token = {

  generateAuthTokens: async (response, _id) => {

    const payload = { _id };

    const accessToken = jwt.sign(payload, AppConfig.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" }); 
    const refreshToken = jwt.sign(payload, AppConfig.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    await redisClient.setEx(`refresh_token:${_id}`, 7 * 24 * 60 * 60, refreshToken);

    response.cookie("access_token", accessToken, { ...AppConfig.cookieOptions, maxAge: 15 * 60 * 1000 });  // 15 minutes
    response.cookie("refresh_token", refreshToken, { ...AppConfig.cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });  // 7 days

    return { access_token: accessToken, refresh_token: refreshToken };
  },

  clearAuthTokens: async (response, _id) => {

    await redisClient.del(`refresh_token:${_id}`);

    response.clearCookie("access_token");
    response.clearCookie("refresh_token");
  },

  verifyAuthTokens: async (request, response) => {

    const { access_token, refresh_token } = request.signedCookies;

    try {
      if (access_token) {
        const decodedAccess = jwt.verify(access_token, AppConfig.env.ACCESS_TOKEN_SECRET);
        const user = await UserService.getUserById(decodedAccess._id);
        if (!user) throw new ExpressError("User not found", AppConfig.Status.NotFound);
        return user;
      }
    } catch (accessErr) {
      if (accessErr.name !== "TokenExpiredError") 
        throw new ExpressError("Invalid access token", AppConfig.Status.Unauthorized);
    }

    if (!refresh_token) 
      throw new ExpressError("Authentication required. Please login.", AppConfig.Status.Unauthorized);

    try {
      const decodedRefresh = jwt.verify(refresh_token, AppConfig.env.REFRESH_TOKEN_SECRET);
      const storedToken = await redisClient.get(`refresh_token:${decodedRefresh._id}`);

      if (!storedToken || storedToken !== refresh_token) 
        throw new ExpressError("Invalid refresh token", AppConfig.Status.Unauthorized);

      const newAccessToken = jwt.sign({ _id: decodedRefresh._id }, AppConfig.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });

      const newRefreshToken = jwt.sign({ _id: decodedRefresh._id }, AppConfig.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
      });

      response.cookie("access_token", newAccessToken, {
        ...AppConfig.cookieOptions,
        maxAge: 15 * 60 * 1000,
      });

      response.cookie("refresh_token", newRefreshToken, {
        ...AppConfig.cookieOptions,
        maxAge: 7 * 24 * 60  * 60 * 1000,
      });

      await redisClient.setEx(`refresh_token:${decodedRefresh._id}`, 7 * 24 * 60 * 60, newRefreshToken);

      const user = await UserService.getUserById(decodedRefresh._id);
      if (!user) throw new ExpressError("User not found", AppConfig.Status.NotFound);

      return user;

    } catch (refreshErr) {
      if (refreshErr.name === "TokenExpiredError") 
        throw new ExpressError("Session expired. Please login again.", AppConfig.Status.Unauthorized);
      throw new ExpressError("Invalid refresh token", AppConfig.Status.Unauthorized);
    }
  }
};