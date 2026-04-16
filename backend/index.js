import dotenv from "dotenv";
dotenv.config();

import express from "express"
import { db } from "./src/Config/db.js";
import { connectRedis } from "./src/Config/redis.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes.js";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser())
db();
connectRedis();
app.use("/api/v1", router);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server is running"))