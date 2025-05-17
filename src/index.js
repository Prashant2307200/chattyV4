import cors from "cors";
import helmet from "helmet";
import express from "express";
import mongoose from "mongoose";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit"; 

import path from "node:path";

import indexRoute from "./routes/index.route.js";
import { createDatabaseIndexes, seedDB } from "./seeders/index.seeder.js";

import { app, server } from "./config/socket.config.js";
import { AppConfig } from "./config/app.config.js";

import { logger } from "./utils/logger.util.js";
import { redisClient } from "./utils/redis.util.js";

import { pathHandler } from "./middlewares/pathHandler.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";


const {
  env,
  corsConfig,
  helmetConfig,
  rateLimitConfig,
  jsonParseConfig,
  urlencodedConfig,
  compressionConfig
} = AppConfig;

const {
  PORT,
  NODE_ENV,
  MONGO_URI,
  COOKIE_SECRET
} = env;
 
app.use(cookieParser(COOKIE_SECRET));

app.use(express.json(jsonParseConfig));
app.use(express.urlencoded(urlencodedConfig));

if (NODE_ENV === "production") {

  app.use(cors(corsConfig));

  app.set('trust proxy', 1);
  
  app.use(compression(compressionConfig));
  
  app.use(helmet(helmetConfig));
  app.use(rateLimit(rateLimitConfig));

  app.use(express.static(path.resolve(__dirname, "../client", "dist"), {
    maxAge: '1y',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html'))
        res.setHeader('Cache-Control', 'no-store');
    }
  }));

  app.get('/', (_request, response) => {
    return response.sendFile(path.resolve(__dirname, "../client", "dist", "index.html"));
  });

} else {

  app.get('/', (_request, response) => {
    response.json({ message: "Hello World" });
  });

  app.get("/seed-db", async (_request, response) => {
    await seedDB();
    return response.json({ message: "Database seeded successfully." });
  });

  app.use((request, _response, nextFunc) => {
    logger.info(`request received: ${request.method} ${request.url}`);
    nextFunc();
  });
}

app.get("/health", (_request, response) => {
  return response.json({ message: "Server is Healthy!" });
});

app.use("/api/v1", indexRoute);

app.use(pathHandler)
app.use(errorHandler);

server.listen(PORT, async () => {

  try {
    await Promise.all([
      mongoose.connect(MONGO_URI),
      redisClient.connect()
    ]);
  } catch (error) {
    logger.error("Server crashed...", error);
  } finally {
    logger.info("Server running..."); 
    await createDatabaseIndexes();
    logger.info("Database indexed successfully!");
  }
});

process.on("uncaughtException", (error) => { 

  NODE_ENV !== "production" && console.log(error);

  logger.error("Internal server Error!", error);
  process.exit(1);
});
