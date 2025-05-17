import { UserService } from "../services/user.service.js"
import { ChatService } from "../services/chat.service.js"
import { MessageService } from "../services/message.service.js"
import { RequestService } from "../services/request.service.js"

export const tools = {
  ...UserService,
  ...ChatService,
  ...MessageService,
  ...RequestService
}