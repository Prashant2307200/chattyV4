import jwt from "jsonwebtoken";

import { AppConfig } from "../config/app.config.js";
import { redisClient } from "../utils/redis.util.js";
import { ExpressError } from "../utils/expressError.util.js";
import { UserService } from "../services/user.service.js";

export async function authMiddleware(request, response, nextFunc) {

  const { access_token, refresh_token } = request.signedCookies;  

  if (!access_token) {
    if (!refresh_token) throw new ExpressError("User is not authenticated", 401);

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
    })

    response.cookie("access_token", newAccessToken, { ...AppConfig.cookieOptions, maxAge: 15 * 60 * 1000 });
    response.cookie("refresh_token", newRefreshToken, { ...AppConfig.cookieOptions });

    await redisClient.setEx(`refresh_token:${decodedRefreshToken._id}`, 60 * 60 * 24 * 7, newRefreshToken);
  }

  const decodedAccessToken = jwt.verify(access_token, AppConfig.env.ACCESS_TOKEN_SECRET);  
  if (!decodedAccessToken?._id) throw new ExpressError("Invalid access_token", AppConfig.Status.Unauthorized);

  const user = await UserService.getUserById(decodedAccessToken._id);
  if (!user) throw new ExpressError("User not found", AppConfig.Status.NotFound);

  request.user = user; 
  return nextFunc();
};