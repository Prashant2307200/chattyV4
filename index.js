import mongoose from "mongoose";

import "./src/app.js";

import { logger } from "./src/utils/logger.util.js";
import { redisClient } from "./src/utils/redis.util.js";

import { AppConfig } from "./src/config/app.config.js";
import { server } from "./src/config/socket.config.js";

import { createDatabaseIndexes } from "./src/seeders/index.seeder.js";

const { PORT, MONGO_URI, NODE_ENV } = AppConfig.env;

server.listen(PORT, async () => {
  try {
    await Promise.all([
      mongoose.connect(MONGO_URI),
      redisClient.connect()
    ]);
  } catch (error) {
    logger.error("Server crashed...", error);
  } finally {
    logger.info(`Server running... with ${NODE_ENV} environment at port ${PORT}`); 
    await createDatabaseIndexes();
    logger.info("Database indexed successfully!");
  }
});