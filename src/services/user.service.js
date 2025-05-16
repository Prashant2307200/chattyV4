import User from "../models/user.model.js";
import mongoose from "mongoose";

export const UserService = {

  getUser(payload) {
    return User.findOne(payload);
  },

  getUserByEmail(email) {
    return User.findOne({ email }).select("+password");
  },

  getUserById(id) {
    return User.findById(id);
  },

  createUser(payload) {
    return User.create(payload);
  },

  updateUserById(id, payload) {
    return User.findByIdAndUpdate(id, payload, { new: true });
  },

  searchAllUsers(id, search) { 
    return User.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(id) },
          ...(search && search.trim() !== '' ? {
            $or: [
              { username: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } }
            ]
          } : {})
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          profilePic: 1
        }
      },
      {
        $sort: { username: 1 }
      },
      {
        $limit: 20
      }
    ]);
  },
};