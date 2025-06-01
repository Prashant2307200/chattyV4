import path from "node:path";
import { fileURLToPath } from "node:url";

import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Used for high computational task taking time and space complexity

class Parallism {

  constructor(workerFile = 'parallism.util.js') {
    this.workerPath = path.resolve(__dirname, workerFile);
  }

  run(taskFn, taskData = null) {

    return new Promise((resolve, reject) => {

      const worker = new Worker(this.workerPath, {
        workerData: {
          taskFn: taskFn.toString(),
          taskData,
          isWorker: true
        },
      });

      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
      });
    });
  }

  static sendMessage(message) {
    parentPort.postMessage(message);
  }

  static sendError(error) {
    parentPort.postMessage({ error: error.message });
  }

  static async execute() {
    const taskFn = eval(`(${workerData.taskFn})`);
    const taskData = workerData.taskData; 
    try {
      const result = await taskFn(taskData);
      Parallism.sendMessage(result);
    } catch (error) {
      Parallism.sendError(error);
    }
  }
} 

if (!isMainThread && workerData?.isWorker) {
  await Parallism.execute();
}

export default Parallism;

// const fibWorker = new Parallism();

// const fib = ({ n }) => {
//   const recurse = x => (x <= 1 ? x : recurse(x - 1) + recurse(x - 2));
//   return recurse(n);
// };

// const result = await fibWorker.run(fib, { n: 5 });