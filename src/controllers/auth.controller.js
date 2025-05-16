import jwt from "jsonwebtoken";

import { AppConfig } from "../config/app.config.js";
import { redisClient } from "../utils/redis.util.js";
import { UserService } from "../services/user.service.js";
import { ExpressError } from "../utils/expressError.util.js";
import { catchAsyncError } from "../utils/catchAsyncError.util.js";

const { Status } = AppConfig;

export const AuthController = {

  async register(request, response, nextFunc) {

    const { username, email, password } = request.body;

    const UserExists = await UserService.getUserByEmail(email);
    if (UserExists)
      return nextFunc(new ExpressError("User already exists", Status.Conflict));

    const [error, user] = await catchAsyncError(UserService.createUser({ username, email, password }));
    if (error)
      return nextFunc(new ExpressError("Error creating user", Status.InternalServerError));

    await user.generateAuthTokens(response); 

    return response.status(Status.Created).json(user);
  },

  async login(request, response, nextFunc) {

    const { email, password } = request.body;  

    const [error, user] = await catchAsyncError(UserService.getUserByEmail(email));
    if (error || !user)
      return nextFunc(new ExpressError("Invalid credentials", Status.Unauthorized));

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return nextFunc(new ExpressError("Invalid credentials", Status.Unauthorized));

    await user.generateAuthTokens(response); 

    return response.status(Status.Created).json(user);
  },

  async logout(request, response, nextFunc) {

    const user = request.user;

    if (!user)
      return nextFunc(new ExpressError("User not found", Status.NotFound));

    await user.clearAuthTokens(response);

    return response.status(Status.NoContent).json({ message: "Logged out successfully" });
  },

  async updateProfile(request, response, nextFunc) {

    const [error, updatedUser] = await catchAsyncError(UserService.updateUserById(request.user._id, { profilePic: request.file.path }));
    if (error)
      return nextFunc(new ExpressError(`Failed to update user profile ${error.message}`, Status.BadRequest));

    return response.status(Status.Success).json(updatedUser);
  },

  async check(request, response) {

    const { access_token, refresh_token } = request.signedCookies; 

    if (!access_token) {
      if (!refresh_token) return response.json({})

      const decodedRefreshToken = jwt.verify(refresh_token, AppConfig.env.REFRESH_TOKEN_SECRET);
      if (!decodedRefreshToken?._id) return response.json({});

      const storedRefreshToken = await redisClient.get(`refresh_token:${decodedRefreshToken._id}`);
      if (!storedRefreshToken || storedRefreshToken !== refresh_token)
        return response.json({});

      const newAccessToken = jwt.sign({ _id: decodedRefreshToken._id }, AppConfig.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });
      const newRefreshToken = jwt.sign({ _id: decodedRefreshToken._id }, AppConfig.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
      })

      response.cookie("access_token", newAccessToken, { ...AppConfig.cookieOptions, maxAge: 15 * 60 * 1000 });
      response.cookie("refresh_token", newRefreshToken, { ...AppConfig.cookieOptions });

      redisClient.setEx("refresh_token", 60 * 60 * 24 * 7, newRefreshToken); 
    }

    const decodedAccessToken = jwt.verify(access_token, AppConfig.env.ACCESS_TOKEN_SECRET);
    if (!decodedAccessToken?._id) return response.json({});

    const user = await UserService.getUserById(decodedAccessToken._id); 
    return response.status(Status.Success).json(user);
  }
};