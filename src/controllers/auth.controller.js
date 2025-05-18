import { AppConfig } from "../config/app.config.js"; 
import { UserService } from "../services/user.service.js";

import { Token } from "../utils/Token.util.js";
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
    let user;
    try {
      user = await Token.verifyAuthTokens(request, response);
    } catch (error) {
      user = {};
    } finally {
      return response.status(Status.Success).json(user);
    }
  }
};