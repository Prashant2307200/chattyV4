import Chat from "../models/chat.model.js"; 
import mongoose from "mongoose";

export const ChatService = {

  getChatUsers(userId) { 

    return Chat.aggregate([ 
      {
        $match: {
          participants: new mongoose.Types.ObjectId(userId)
        }
      }, 
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participantDetails"
        }
      }, 
      {
        $addFields: {
          participantDetails: {
            $filter: {
              input: "$participantDetails",
              as: "participant",
              cond: { $ne: ["$$participant._id", new mongoose.Types.ObjectId(userId)] }
            }
          }
        }
      }, 
      {
        $project: {
          _id: 1,
          name: 1,
          isGroupChat: 1,
          groupAdmin: 1,
          createdAt: 1,
          updatedAt: 1,
          participants: {
            $map: {
              input: "$participantDetails",
              as: "participant",
              in: {
                _id: "$$participant._id",
                username: "$$participant.username",
                profilePic: "$$participant.profilePic"
              }
            }
          }
        }
      }, 
      {
        $sort: { updatedAt: -1 }
      }
    ]); 
  },

  createChat(payload) {
    return Chat.create(payload);
  },

  getChatById(chatId) {
    return Chat
      .findById(chatId)
      .populate("participants", "username profilePic");
  },

  getChatBySenderReceiver(sender, receiver) {

    return Chat.findOne({
      isGroupChat: false,
      participants: {
        $all: [sender, receiver],
        $size: 2
      }
    });
  }
}