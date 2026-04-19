import mongoose from "mongoose";
import logger from "../Utils/logger.js";
import dotenv from "dotenv";
dotenv.config();

export const db = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.info("DB connected successfully")
    } catch (error) {
        logger.error(`DB connection failed: ${error.message}`);
        process.exit(1);
    }

}

