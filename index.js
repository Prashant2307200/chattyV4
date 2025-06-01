import mongoose from "mongoose";

// import os from "node:os";
// import cluster from "node:cluster";

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
      redisClient.connect(),
      createDatabaseIndexes()
    ]);

    logger.info(`Server running... with ${NODE_ENV} environment at port ${PORT}`);
    logger.info("Database indexed successfully!");

  } catch (error) {
    logger.error("Server crashed...", error);
  }
});

// if (cluster.isPrimary) {

//   const numCPUs = os.availableParallelism();

//   logger.info(`Forking ${numCPUs} worker processes...`);

//   for (let i = 0; i < numCPUs; i++)
//     cluster.fork();

//   cluster.on("exit", (worker, code, signal) => {
//     logger.info(`Worker ${worker.process.pid} died with code: ${code}, signal: ${signal}`);
//     cluster.fork();
//   });

//   logger.info(`Master process is running with PID: ${process.pid}`);

// } else {

//   server.listen(PORT, async () => {
//     try {

//       await Promise.all([
//         mongoose.connect(MONGO_URI),
//         redisClient.connect(),
//         createDatabaseIndexes()
//       ]);

//       logger.info(`Server running... with ${NODE_ENV} environment at port ${PORT}`);
//       logger.info("Database indexed successfully!");

//     } catch (error) {
//       logger.error("Server crashed...", error);
//     }
//   });

//   logger.info(`Worker process started with PID: ${process.pid}`);
// }

// process vs worker -> worker.on("message", cb) -> process.send(msg)