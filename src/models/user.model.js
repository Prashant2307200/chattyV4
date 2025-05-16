import { Schema, model } from "mongoose";

import { clearAuthTokens } from "./methods/clearAuthTokens.method.js";
import { comparePassword } from "./methods/comparePassword.method.js"; 
import { hashPassword } from "./middlewares/hashPassword.middleware.js";
import { generateAuthTokens } from "./methods/generateAuthTokens.method.js";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: Number,
      default: 0,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", hashPassword);

userSchema.methods = { comparePassword, generateAuthTokens, clearAuthTokens };

const UserModel = model("User", userSchema);

export default UserModel;
