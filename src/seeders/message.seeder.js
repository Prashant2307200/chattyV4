import { Types } from "mongoose";
import { users } from "./user.seeder.js";
import { chats } from "./chat.seeder.js";

const johndoe = users.find(user => user.username === "johndoe");
const janesmith = users.find(user => user.username === "janesmith");
const bobjohnson = users.find(user => user.username === "bobjohnson");

const directChat = chats[0]; 
const groupChat = chats[2]; 

export const messages = [
  
  {
    _id: new Types.ObjectId(),
    chat: directChat._id,
    sender: johndoe._id,
    text: "Hey Jane, how are you?",
    createdAt: new Date(Date.now() - 60 * 60 * 1000), 
    updatedAt: new Date(Date.now() - 60 * 60 * 1000)
  },
  {
    _id: new Types.ObjectId(),
    chat: directChat._id,
    sender: janesmith._id,
    text: "I'm good, thanks! How about you?",
    createdAt: new Date(Date.now() - 55 * 60 * 1000), 
    updatedAt: new Date(Date.now() - 55 * 60 * 1000)
  },
  {
    _id: new Types.ObjectId(),
    chat: directChat._id,
    sender: johndoe._id,
    text: "Doing well. Working on the project.",
    createdAt: new Date(Date.now() - 50 * 60 * 1000),  
    updatedAt: new Date(Date.now() - 50 * 60 * 1000)
  },
  {
    _id: new Types.ObjectId(),
    chat: directChat._id,
    sender: janesmith._id,
    text: "How's it going with that?",
    createdAt: new Date(Date.now() - 45 * 60 * 1000),  
    updatedAt: new Date(Date.now() - 45 * 60 * 1000)
  },
  {
    _id: new Types.ObjectId(),
    chat: directChat._id,
    sender: johndoe._id,
    text: "Making good progress. Should be done soon.",
    createdAt: new Date(Date.now() - 40 * 60 * 1000),  
    updatedAt: new Date(Date.now() - 40 * 60 * 1000)
  },
 
  {
    _id: new Types.ObjectId(),
    chat: groupChat._id,
    sender: johndoe._id,
    text: "Hey team, welcome to our project group!",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),  
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    _id: new Types.ObjectId(),
    chat: groupChat._id,
    sender: bobjohnson._id,
    text: "Thanks for setting this up, John.",
    createdAt: new Date(Date.now() - 110 * 60 * 1000),  
    updatedAt: new Date(Date.now() - 110 * 60 * 1000)
  },
  {
    _id: new Types.ObjectId(),
    chat: groupChat._id,
    sender: johndoe._id,
    text: "When can we meet to discuss the next steps?",
    createdAt: new Date(Date.now() - 100 * 60 * 1000),  
    updatedAt: new Date(Date.now() - 100 * 60 * 1000)
  },
  {
    _id: new Types.ObjectId(),
    chat: groupChat._id,
    sender: bobjohnson._id,
    text: "I'm free tomorrow afternoon.",
    createdAt: new Date(Date.now() - 90 * 60 * 1000),  
    updatedAt: new Date(Date.now() - 90 * 60 * 1000)
  },
  {
    _id: new Types.ObjectId(),
    chat: groupChat._id,
    sender: johndoe._id,
    text: "Perfect, let's meet at 2pm then.",
    createdAt: new Date(Date.now() - 80 * 60 * 1000), 
    updatedAt: new Date(Date.now() - 80 * 60 * 1000)
  }
];
