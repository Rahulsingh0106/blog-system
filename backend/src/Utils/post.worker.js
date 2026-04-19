import { Worker } from "bullmq";
import { redisConnection } from "../Config/redis.config.js";
import Post from "../Models/post.model.js";
import { getIO } from "../Config/socket.js";
import logger from "./logger.js";

const initializeWorker = () => {
    const worker = new Worker(
        "post-publish-queue",
        async (job) => {
            const { postId } = job.data;
            logger.info(`[Worker] Processing publish job for post: ${postId}`);

            try {
                const post = await Post.findById(postId);
                if (!post) {
                    logger.error(`[Worker] Post ${postId} not found. Skipping.`);
                    return;
                }

                if (post.status === "published") {
                    logger.info(`[Worker] Post ${postId} is already published. Skipping.`);
                    return;
                }

                // Update post status to published
                post.status = "published";
                await post.save();

                logger.info(`[Worker] Post ${postId} published successfully!`);

                // Emit socket event for real-time update
                const io = getIO();
                if (io) {
                    io.emit("post_published", post);
                    logger.info(`[Worker] Emitted post_published for post: ${postId}`);
                }
            } catch (error) {
                logger.error(`[Worker] Error publishing post ${postId}: ${error.message}`);
                throw error; // Let BullMQ handle the retry if configured
            }
        },
        { connection: redisConnection }
    );

    worker.on("completed", (job) => {
        logger.info(`[Worker] Job ${job.id} completed!`);
    });

    worker.on("failed", (job, err) => {
        logger.error(`[Worker] Job ${job.id} failed with error: ${err.message}`);
    });

    logger.info("[Worker] Post Publish Worker initialized and listening...");
    return worker;
};

export default initializeWorker;
