import jwt from "jsonwebtoken";

import { AppConfig } from "../config/app.config.js";
import { UserService } from "../services/user.service.js";

import { redisClient } from "../utils/redis.util.js";
import { ExpressError } from "../utils/expressError.util.js";

export const Token = {

  generateAuthTokens: async (response, _id) => {

    const payload = { _id };

    const accessToken = jwt.sign(payload, AppConfig.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, AppConfig.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    await redisClient.setEx(`refresh_token:${_id}`, 60 * 60 * 24 * 7, refreshToken);

    response.cookie("access_token", accessToken, { ...AppConfig.cookieOptions, maxAge: 15 * 60 * 1000 });
    response.cookie("refresh_token", refreshToken, { ...AppConfig.cookieOptions });

    return { access_token: accessToken, refresh_token: refreshToken };
  },

  clearAuthTokens: async (response, _id) => {

    await redisClient.del(`refresh_token:${_id}`);

    response.clearCookie("access_token");
    response.clearCookie("refresh_token");
  },

  verifyAuthTokens: async (request, response) => {

    let { access_token, refresh_token } = request.signedCookies;

    if (!access_token) {
      if (!refresh_token) throw new ExpressError("User is not authenticated, please loggedin or register to your account.", 401);

      const decodedRefreshToken = jwt.verify(refresh_token, AppConfig.env.REFRESH_TOKEN_SECRET);
      if (!decodedRefreshToken?._id) throw new ExpressError("User is not authenticated", 401);

      const storedRefreshToken = await redisClient.get(`refresh_token:${decodedRefreshToken._id}`);
      if (!storedRefreshToken || storedRefreshToken !== refresh_token)
        throw new ExpressError("Invalid refresh_token", AppConfig.Status.Unauthorized);

      const newAccessToken = jwt.sign({ _id: decodedRefreshToken._id }, AppConfig.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });

      const newRefreshToken = jwt.sign({ _id: decodedRefreshToken._id }, AppConfig.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
      });

      access_token = newAccessToken;

      response.cookie("access_token", newAccessToken, { ...AppConfig.cookieOptions, maxAge: 15 * 60 * 1000 });
      response.cookie("refresh_token", newRefreshToken, { ...AppConfig.cookieOptions });

      await redisClient.setEx(`refresh_token:${decodedRefreshToken._id}`, 60 * 60 * 24 * 7, newRefreshToken);
    }

    const decodedAccessToken = jwt.verify(access_token, AppConfig.env.ACCESS_TOKEN_SECRET);
    if (!decodedAccessToken?._id) throw new ExpressError("Invalid access_token", AppConfig.Status.Unauthorized);

    const user = await UserService.getUserById(decodedAccessToken._id);
    if (!user) throw new ExpressError("User not found", AppConfig.Status.NotFound);

    return user;
  }
};