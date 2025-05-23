import { AppConfig } from "../config/app.config.js";
import { ChatService } from "../services/chat.service.js";
import { ExpressError } from "../utils/expressError.util.js";
import { MessageService } from "../services/message.service.js";
import { catchAsyncError } from "../utils/catchAsyncError.util.js";

const { Status } = AppConfig;

export const ChatController = {

  async getChatUsers(request, response, nextFunc) {

    const [error, chatUsers] = await catchAsyncError(ChatService.getChatUsers(request.user._id));

    if (error)
      return nextFunc(new ExpressError(error.message || "Failed to fetch chats", error.statusCode || 500));

    return response.status(200).json(chatUsers);
  },

  async getChatMessages(request, response, nextFunc) {

    const { id } = request.params;
    const [error, messages] = await catchAsyncError(MessageService.getChatMessages(id)); 

    if (error)
      return nextFunc(new ExpressError("Error fetching messages", 404));

    return response.status(Status.Success).json(messages);
  },

  async createGroupChat(request, response, nextFunc) {
    const { name, participants } = request.body;
 
    if (!name || !name.trim()) 
      return nextFunc(new ExpressError("Group name is required", 400));

    if (!participants || !Array.isArray(participants) || participants.length < 2) 
      return nextFunc(new ExpressError("At least 2 participants are required", 400));


    const allParticipants = new Set([...participants, request.user._id.toString()]); 

    const groupChatData = {
      name: name.trim(),
      isGroupChat: true,
      participants: Array.from(allParticipants),
      groupAdmin: request.user._id
    }; 

    const [error, groupChat] = await catchAsyncError(ChatService.createChat(groupChatData));

    if (error) 
      return nextFunc(new ExpressError("Failed to create group chat", 500));
    
    const [populateError, populatedChat] = await catchAsyncError(ChatService.getChatById(groupChat._id));

    if (populateError) 
      return nextFunc(new ExpressError("Failed to populate group chat", 500));

    return response.status(Status.Created).json(populatedChat); 
  }
}