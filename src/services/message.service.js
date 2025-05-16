import mongoose from "mongoose";
import Message from "../models/message.model.js";

export const MessageService = {

  createMessage(payload) {
    return Message.create(payload);
  },

  getChatMessages(chatId) {

    return Message.aggregate([ 
      {
        $match: { chat: new mongoose.Types.ObjectId(chatId) }
      }, 
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "senderDetails"
        }
      }, 
      {
        $addFields: {
          sender: { $arrayElemAt: ["$senderDetails", 0] }
        }
      }, 
      {
        $project: {
          _id: 1,
          text: 1,
          image: 1,
          chat: 1,
          createdAt: 1,
          updatedAt: 1,
          sender: {
            _id: "$sender._id",
            username: "$sender.username",
            profilePic: "$sender.profilePic"
          }
        }
      }
    ]); 
  },

  getMessageById(id) {

    return Message.aggregate([ 
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "senderDetails"
        }
      }, 
      {
        $addFields: {
          sender: { $arrayElemAt: ["$senderDetails", 0] } 
        }
      }, 
      {
        $project: {
          _id: 1,
          chat: 1,
          text: 1,
          image: 1,
          createdAt: 1,
          updatedAt: 1,
          sender: {
            _id: "$sender._id",
            username: "$sender.username",
            profilePic: "$sender.profilePic"
          }, 
        }
      }
    ]).then(results => results[0]); 
  }
}