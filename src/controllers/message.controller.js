import { io } from "../config/socket.config.js"; 

import { AppConfig } from "../config/app.config.js";
import { ExpressError } from "../utils/expressError.util.js";
import { MessageService } from "../services/message.service.js";
import { catchAsyncError } from "../utils/catchAsyncError.util.js"

const { Status } = AppConfig;

export const MessageController = {

  async sendMessage(request, response, nextFunc) {

    const { text, image } = request.body;

    const { _id: sender } = request.user;
    const { id: chatId } = request.params;

    const [error, message] = await catchAsyncError(MessageService.createMessage({ sender, chat: chatId, text, image }))
    const [errorOnFetch, populatedMessage] = await catchAsyncError(MessageService.getMessageById(message._id));
    
    if (error || errorOnFetch)
      return nextFunc(new ExpressError("Failed to send message.", 400)); 

    io.to(chatId).emit("newMessage", populatedMessage);

    return response.status(Status.Created).json(populatedMessage);
  }
}