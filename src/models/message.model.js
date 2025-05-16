import mongoose, { Types } from 'mongoose';

const messageSchema = new mongoose.Schema({ 

  sender: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },

  chat: {
    type: Types.ObjectId,
    ref: "Chat",
    required: true
  },

  text: {
    type: String
  },

  image: {
    type: String
  }
}, { timestamps: true });

const MessageModel = mongoose.model("Message", messageSchema);


export default MessageModel;