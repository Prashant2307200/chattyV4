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
  params: async (_req, file) => ({
    folder: "chatty_profilePic",
    format: "jpg",  // auto
    transformation: [{ width: 500, height: 500, crop: "limit" }],
    public_id: file.originalname.split(".")[0],
  }),
});

export const uploads = multer({ storage });