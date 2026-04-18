import { Queue } from "bullmq";
import { redisConnection } from "../Config/redis.config.js";

export const postQueue = new Queue("post-publish-queue", {
    connection: redisConnection,
});

/**
 * Schedules a post to be published at a specific time.
 * @param {string} postId - The ID of the post.
 * @param {Date} scheduledAt - The date and time to publish.
 */
export const schedulePostPublish = async (postId, scheduledAt) => {
    const delay = new Date(scheduledAt).getTime() - Date.now();

    if (delay > 0) {
        await postQueue.add(
            "publishPost",
            { postId },
            {
                delay,
                removeOnComplete: true, // Clean up jobs after completion
                removeOnFail: false,
            }
        );
        console.log(`[Queue] Post ${postId} scheduled to publish in ${delay}ms`);
    } else {
        console.warn(`[Queue] Scheduled time for post ${postId} is in the past. Job not added.`);
    }
};

/**
 * Removes a scheduled job from the queue if a post is deleted or rescheduled.
 * Note: For simplicity, we are not implementing full job tracking here, 
 * but in a production app, you would store the jobId in the database.
 */
export const cancelScheduledPost = async (postId) => {
    // In a more advanced implementation, we'd find the job by its ID or a unique name and remove it.
    // BullMQ jobs can be given a custom ID to make this easier.
    console.log(`[Queue] Cancellation requested for post ${postId} (Logic not implemented for simplicity)`);
}
