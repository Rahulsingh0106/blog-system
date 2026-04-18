import dotenv from "dotenv";
dotenv.config();

import express from "express"
import { db } from "./src/Config/db.js";
import { connectRedis } from "./src/Config/redis.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes.js";
import initializeWorker from "./src/Utils/post.worker.js";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser())
app.use('/uploads', express.static('uploads'));

db();
connectRedis();
initializeWorker();

app.use("/api/v1", router);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server is running"))