import dotenv from "dotenv";
dotenv.config();

import express from "express"
import morgan from "morgan";
import logger from "./src/Utils/logger.js";
import { db } from "./src/Config/db.js";

import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes.js";
import initializeWorker from "./src/Utils/post.worker.js";

import { createServer } from "http";
import { initSocket } from "./src/Config/socket.js";

const app = express();
const httpServer = createServer(app);
initSocket(httpServer);

app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser())
app.use('/uploads', express.static('uploads'));

db();

initializeWorker();

app.use("/api/v1", router);
const port = process.env.PORT || 5000;
httpServer.listen(port, () => logger.info(`Server is running on port ${port}`));