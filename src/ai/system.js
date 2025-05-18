import getExamples from "./example.js";

import { UserService } from "../services/user.service.js";
import { ChatService } from "../services/chat.service.js";
import { MessageService } from "../services/message.service.js";
import { RequestService } from "../services/request.service.js";

import UserModel from "../models/user.model.js";
import ChatModel from "../models/chat.model.js";
import MessageModel from "../models/message.model.js";
import RequestModel from "../models/request.model.js";


const toolDescriptions = {
  
  getChatMessages: "Fetches all messages in a chat with sender details.",
  getMessageById: "Fetches a message by its ID with sender details.",
  createMessage: "Creates a new message with sender, chat, and text/image.",

  getChatUsers: "Returns all chats the user is part of, with other participant details.",
  createChat: "Creates a new chat or group chat.",
  getChatById: "Gets a chat by ID with populated participants.",
  getChatBySenderReceiver: "Finds a one-on-one chat between two users.",

  getRequestsByUserId: "Returns all friend requests sent and received by a user.",
  getRequestBySenderReceiver: "Finds a pending request between two users.",
  createRequest: "Creates a new friend request.",
  getRequestById: "Gets a request by ID with sender and receiver details.",
  fetchRequest: "Gets a request by ID without population.",
  cancelRequest: "Deletes a friend request by ID.",
  updateRequestStatus: "Accept/Decline request by updating status Accepted/Declined",
 
  getUser: "Finds a user matching the given condition.",
  getUserByEmail: "Finds a user by email and includes the password field.",
  getUserById: "Finds a user by their MongoDB ObjectId.",
  createUser: "Creates a new user with the provided data.",
  updateUserById: "Updates a user by ID with the given fields and returns the updated user.",
  searchAllUsers: "Returns up to 20 users (excluding current) whose username or email matches the search text."
};


function formatExamples(userId) {
  const examples = getExamples(userId);
  return Object.entries(examples).map(
    ([task, group], index) => [
      `Example ${index + 1} - ${task}`,
      "START",
      group.map(e => JSON.stringify(e)).join('\n')
    ].join('\n')
  ).join('\n\n');
}
 
function generateToolList(serviceObj, category) {
  const methods = Object.entries(serviceObj)
    .map(([fn, impl]) => {
      const argMatch = impl.toString().match(/\(([^)]*)\)/);
      const args = argMatch ? argMatch[1].trim() : "";
      const description = toolDescriptions[fn] || "Description TBD";
      return `- ${fn}(${args}): ${description}`;
    }).join('\n');
  return `# ${category} Tools\n${methods}`;
}

function formatSchema(model, name) {
  const paths = model.schema.paths;
  const formatted = Object.entries(paths).map(([key, val]) => {
    if (key === '__v') return null; // skip __v
    return `- ${key}: ${val.instance}`;
  }).filter(Boolean).join('\n');
  return `${name} DB Schema:\n${formatted}`;
}

export function getSystemPrompt(userId) {

  const toolSections = [
    generateToolList(MessageService, 'Message'),
    generateToolList(ChatService, 'Chat'),
    generateToolList(RequestService, 'Request'),
    generateToolList(UserService, 'User')
  ].join('\n\n');

  const schemaSections = [
    formatSchema(UserModel, 'User'),
    formatSchema(MessageModel, 'Message'),
    formatSchema(ChatModel, 'Chat'),
    formatSchema(RequestModel, 'Request')
  ].join('\n\n');

  return `

You are an AI Assistant with START, PLAN, ACTION, Observation and Output State.
Wait for the user prompt and first PLAN using available tools.
After Planning, Take the action with appropriate tools and wait for Observation based on Action.
Once you get observations, Return the AI response based on START prompt and observation. 

Note: 
1.Perform task with Read tools and you can use Create, Update and Delete tools also only if user specify other wise try to do task with Read tools.
2.Assume individual chat by default unless user specify for group chat.
3.Use tools with minimum Create, Update and Delete if possible.
4.If task is not done that notify to user with applogy and tell issue that you face.
5.Use your brain also for example message not sent without chat, group not created without individual chat and chat not exists without request accepted etc.
6.If you fine pre task then you can do that and tell user to wait for example if user taht i have to send message is not exist then you can send request to that user and tell for wait till request accept by user.


${schemaSections}


Available Tools:

${toolSections}


Examples:

${formatExamples(userId)}

`;
}
