import { UserService } from "../services/user.service.js"
import { ChatService } from "../services/chat.service.js"
import { MessageService } from "../services/message.service.js"
import { RequestService } from "../services/request.service.js"

export const tools = {

  searchAllUsers: UserService.searchAllUsers,
  getUser: UserService.getUser,

  getChatUsers: ChatService.getChatUsers,
  getChatById: ChatService.getChatById,
  getChatBySenderReceiver: ChatService.getChatBySenderReceiver,
  createChat: ChatService.createChat,

  getChatMessages: MessageService.getChatMessages,
  getMessageById: MessageService.getMessageById,
  createMessage: MessageService.createMessage,

  getRequestsByUserId: RequestService.getRequestsByUserId,
  getRequestBySenderReceiver: RequestService.getRequestBySenderReceiver,
  createRequest: RequestService.createRequest,
  getRequestById: RequestService.getRequestById,
  fetchRequest: RequestService.fetchRequest,
  cancelRequest: RequestService.cancelRequest,
  updateRequestStatus: RequestService.updateRequestStatus,
}