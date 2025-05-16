import Request from "../models/request.model.js";
import mongoose from "mongoose";

export const RequestService = {

  async getRequestsByUserId(userId) {

    const results = await Request.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $addFields: {
          isSent: { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] }
        }
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
        $lookup: {
          from: "users",
          localField: "receiver",
          foreignField: "_id",
          as: "receiverDetails"
        }
      }, 
      {
        $addFields: {
          sender: { $arrayElemAt: ["$senderDetails", 0] },
          receiver: { $arrayElemAt: ["$receiverDetails", 0] }
        }
      }, 
      {
        $project: {
          _id: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          isSent: 1,
          sender: {
            _id: "$sender._id",
            username: "$sender.username",
            profilePic: "$sender.profilePic"
          },
          receiver: {
            _id: "$receiver._id",
            username: "$receiver.username",
            profilePic: "$receiver.profilePic"
          }
        }
      }, 
      {
        $sort: { createdAt: -1 }
      }, 
      {
        $group: {
          _id: "$isSent",
          requests: { $push: "$$ROOT" }
        }
      }
    ]);
 
    let sentRequests = [];
    let receivedRequests = [];

    results.forEach(group => {
      if (group._id === true) {
        sentRequests = group.requests.map(req => {
          delete req.isSent;
          return req;
        });
      } else {
        receivedRequests = group.requests.map(req => {
          delete req.isSent;
          return req;
        });
      }
    });

    return [sentRequests, receivedRequests]; 
  },

  getRequestBySenderReceiver(sender, receiver) {
    return Request.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ],
      status: 'pending'
    })
  },

  createRequest(payload) {
    return Request.create(payload);
  },

  getRequestById(id) {
    return Request.findById(id)
      .populate('sender', 'username profilePic')
      .populate('receiver', 'username profilePic'); 
  },

  fetchRequest(id) {
    return Request.findById(id);
  },

  cancelRequest(id) {
    return Request.findByIdAndDelete(id);
  },

  updateRequestStatus(id, status) {

    if (!['accepted', 'declined'].includes(status))
      throw new Error('Status must be either "accepted" or "declined"');

    return Request.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    )
      .populate('sender', 'username profilePic')
      .populate('receiver', 'username profilePic');
  }
}