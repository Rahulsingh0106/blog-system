import jwt from "jsonwebtoken";
import { redisConnection } from "../Config/redis.config.js";


export const protect = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const isBlacklisted = await redisConnection.get(token);
        if (isBlacklisted) {
            return res.status(401).json({ message: "Session expired. Please login again." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}