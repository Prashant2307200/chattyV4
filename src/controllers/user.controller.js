import { AppConfig } from "../config/app.config.js";
import { UserService } from "../services/user.service.js";
import { ExpressError } from "../utils/expressError.util.js";
import { catchAsyncError } from "../utils/catchAsyncError.util.js";

const { Status } = AppConfig;

export const UserController = {

  async getAllUsers(request, response, nextFunc) {
 
    const { search } = request.query;
    const currentUserId = request.user._id;

    const [error, user] = await catchAsyncError(UserService.searchAllUsers(currentUserId, search)); 
    if (error) 
      return nextFunc(new ExpressError("Failed to fetch users", Status.InternalServerError));

    return response.status(Status.Success).json(user);  
  }
};
