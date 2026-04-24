import { Redis } from "ioredis";
import dotenv from "dotenv";
import logger from "../Utils/logger.js";

dotenv.config();

const redisConfig = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null,
    retryStrategy(times) {
        const maxRetries = 5;
        if (times > maxRetries) {
            logger.error(`Redis connection failed after ${maxRetries} retries. Stopping reconnection attempts.`);
            return null; // Return null to stop retrying
        }
        const delay = Math.min(times * 1000, 3000);
        logger.info(`Retrying Redis connection in ${delay}ms... (Attempt ${times} of ${maxRetries})`);
        return delay;
    }
};
export const redisConnection = new Redis(redisConfig);

redisConnection.on("error", (err) => logger.error("Redis connection error", err));
redisConnection.on("connect", () => logger.info("Redis connected successfully"));