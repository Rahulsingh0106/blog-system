import dotenv from "dotenv";
dotenv.config();

import { db } from "./src/Config/db.js";
import initializeWorker from "./src/Utils/post.worker.js";
import logger from "./src/Utils/logger.js";

const startWorker = async () => {
    try {
        await db();
        logger.info("Database connected successfully in Worker process");
        initializeWorker();
    } catch (error) {
        logger.error("Failed to initialize Worker process", error);
        process.exit(1);
    }
};

startWorker();
