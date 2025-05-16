import { Types } from "mongoose";
import { users } from "./user.seeder.js";
 
const johndoe = users.find(user => user.username === "johndoe");
const janesmith = users.find(user => user.username === "janesmith");
const bobjohnson = users.find(user => user.username === "bobjohnson");
 
const now = new Date();
const yesterday = new Date(now - 24 * 60 * 60 * 1000);
const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000);

export const chats = [ 

  {
    _id: new Types.ObjectId(),
    participants: [johndoe._id, janesmith._id],
    isGroupChat: false,
    createdAt: yesterday,
    updatedAt: yesterday
  },

  {
    _id: new Types.ObjectId(),
    participants: [johndoe._id, bobjohnson._id],
    isGroupChat: false,
    createdAt: yesterday,
    updatedAt: yesterday
  }, 
  {
    _id: new Types.ObjectId(),
    name: "Project Team",
    participants: [johndoe._id, bobjohnson._id, janesmith._id],
    isGroupChat: true,
    groupAdmin: johndoe._id,
    createdAt: threeDaysAgo,
    updatedAt: threeDaysAgo
  }
]