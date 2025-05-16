import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { AppConfig } from "../config/app.config.js";

const { env } = AppConfig;

cloudinary.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUD_API_KEY,
  api_secret: env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, _file) => ({
    folder: "chatty_profilePic",
    format: "jpg",
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  }),
});

export const uploads= multer({ storage });