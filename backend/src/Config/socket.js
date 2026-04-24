import { Server } from "socket.io";
import logger from "../Utils/logger.js";
import { redisConnection } from "./redis.config.js";

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        logger.info(`A user connected: ${socket.id}`);
        socket.on("disconnect", () => {
            logger.info(`User disconnected: ${socket.id}`);
        });
    });

    // Subscribe to redis events for cross-container communication
    const subscriber = redisConnection.duplicate();
    subscriber.subscribe("socket:post_published", (err, count) => {
        if (err) logger.error("Failed to subscribe to Redis:", err);
    });

    subscriber.on("message", (channel, message) => {
        if (channel === "socket:post_published" && io) {
            try {
                const post = JSON.parse(message);
                io.emit("post_published", post);
                logger.info(`[Socket] Broadcasted scheduled post from Redis Pub/Sub`);
            } catch (err) {
                logger.error("Error parsing redis pub/sub message", err);
            }
        }
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        // We'll return a mock or just log if not initialized yet
        // In this app, it should be initialized at startup
    }
    return io;
};
