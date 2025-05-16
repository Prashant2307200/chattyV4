import { Schema, model } from "mongoose";

const chatSchema = new Schema({
  name: {
    type: String,
    trim: true,
    default: ""
  },

  isGroupChat: {
    type: Boolean,
    default: false
  },

  participants: [{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }],

  groupAdmin: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

const ChatModel = model("Chat", chatSchema);

export default ChatModel;