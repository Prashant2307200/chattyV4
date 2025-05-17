import { users } from "./user.seeder.js";
import { chats } from "./chat.seeder.js";
import { messages } from "./message.seeder.js";
import { requests } from "./request.seeder.js";
import { redisClient } from "../utils/redis.util.js";

import UserModel from "../models/user.model.js";
import ChatModel from "../models/chat.model.js";
import RequestModel from "../models/request.model.js";
import MessageModel from "../models/message.model.js";

import createUserIndexes from "../models/indexes/user.index.js";
import createChatIndexes from "../models/indexes/chat.index.js";
import createMessageIndexes from "../models/indexes/message.index.js";
import createRequestIndexes from "../models/indexes/request.index.js";

export async function seedDB() {

  await Promise.all([
    redisClient.flushAll(),
    UserModel.deleteMany({}),
    MessageModel.deleteMany({}),
    ChatModel.deleteMany({}),
    RequestModel.deleteMany({}),
  ]);

  await Promise.all([
    RequestModel.insertMany(requests),
    UserModel.insertMany(users),
    MessageModel.insertMany(messages),
    ChatModel.insertMany(chats),
  ]);
}

export async function createDatabaseIndexes() {

  await Promise.all([
    UserModel.collection.dropIndexes({}),
    MessageModel.collection.dropIndexes({}),
    ChatModel.collection.dropIndexes({}),
    RequestModel.collection.dropIndexes({})
  ]);

  await Promise.all([
    createUserIndexes(),
    createMessageIndexes(),
    createChatIndexes(),
    createRequestIndexes()
  ]);
}