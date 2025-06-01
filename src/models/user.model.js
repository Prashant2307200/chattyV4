import { Schema, model } from "mongoose";

import { Hash } from "../utils/Hash.util.js";
import { Token } from "../utils/Token.util.js";
import Parallism from "../utils/parallism.util.js";

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

userSchema.pre("save", async function (nextFunc) {
  const hashPasswordWorker = new Parallism();
  if (this.isModified("password"))
    await hashPasswordWorker.run(Hash.hsh, { model: this, field: "password" });
  return nextFunc();
});

userSchema.methods = {
  comparePassword: async function (password) {
    return await Hash.validate(password, this.password);
  },
  generateAuthTokens: async function (response) {
    return await Token.generateAuthTokens(response, this._id);
  },
  clearAuthTokens: async function (response) {
    await Token.clearAuthTokens(response, this._id);
  }
};

const UserModel = model("User", userSchema);

export default UserModel;
