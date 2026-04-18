import { Worker } from "bullmq";
import { redisConnection } from "../Config/redis.config.js";
import Post from "../Models/post.model.js";

const initializeWorker = () => {
    const worker = new Worker(
        "post-publish-queue",
        async (job) => {
            const { postId } = job.data;
            console.log(`[Worker] Processing publish job for post: ${postId}`);

            try {
                const post = await Post.findById(postId);
                if (!post) {
                    console.error(`[Worker] Post ${postId} not found. Skipping.`);
                    return;
                }

                if (post.status === "published") {
                    console.log(`[Worker] Post ${postId} is already published. Skipping.`);
                    return;
                }

                // Update post status to published
                post.status = "published";
                await post.save();

                console.log(`[Worker] Post ${postId} published successfully!`);
            } catch (error) {
                console.error(`[Worker] Error publishing post ${postId}:`, error.message);
                throw error; // Let BullMQ handle the retry if configured
            }
        },
        { connection: redisConnection }
    );

    worker.on("completed", (job) => {
        console.log(`[Worker] Job ${job.id} completed!`);
    });

    worker.on("failed", (job, err) => {
        console.error(`[Worker] Job ${job.id} failed with error: ${err.message}`);
    });

    console.log("[Worker] Post Publish Worker initialized and listening...");
    return worker;
};

export default initializeWorker;
