import { Server } from "socket.io";
import logger from "../Utils/logger.js";

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        logger.info(`A user connected: ${socket.id}`);
        socket.on("disconnect", () => {
            logger.info(`User disconnected: ${socket.id}`);
        });
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
