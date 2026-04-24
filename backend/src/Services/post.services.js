import Post from "../Models/post.model.js";
import { validateCreatePost, validateUpdatePost } from "../Validations/post.validate.js";
import { schedulePostPublish } from "../Utils/post.queue.js";
import { getIO } from "../Config/socket.js";
export const allPosts = async () => {
    try {
        const result = await Post.find({ status: 'published' }).sort({ createdAt: -1 });
        if (!result) throw new Error("No posts found");

        return { data: result };
    } catch (error) {
        throw new Error(error);
    }
}

export const createPost = async (data, user_id) => {
    try {
        const { error } = validateCreatePost(data);
        if (error) throw new Error(error.details[0].message);

        const result = await Post.create({ ...data, user_id: user_id });
        
        if (data.status === 'scheduled' && data.scheduledAt) {
            await schedulePostPublish(result._id, data.scheduledAt);
        } else if (data.status === 'published') {
            const io = getIO();
            if (io) io.emit("post_published", result.toObject());
        }

        const postData = result.toObject();
        return { data: postData };
    } catch (error) {
        throw new Error(error);
    }
}

export const updatePost = async (data, user_id) => {
    try {
        const { error } = validateUpdatePost(data);
        if (error) throw new Error(error.details[0].message);

        const result = await Post.findOne({ _id: data.post_id, user_id: user_id });
        if (!result) throw new Error("Post not found");

        const updatedPost = await Post.updateOne({ _id: data.post_id }, { $set: { title: data.title, content: data.content, status: data.status, scheduledAt: data.scheduledAt } });
        if (!updatedPost) throw new Error("Something went wrong");

        const post = await Post.findOne({ _id: data.post_id });
        const postData = post.toObject();

        if (data.status === 'scheduled' && data.scheduledAt) {
            await schedulePostPublish(data.post_id, data.scheduledAt);
        } else if (data.status === 'published') {
            const io = getIO();
            if (io) io.emit("post_published", postData);
        }

        return { data: postData };
    } catch (error) {
        throw new Error(error);
    }
}

export const postById = async (post_id) => {
    try {
        const post = await Post.findOne({ _id: post_id });
        if (!post) throw new Error("Post not found");

        const postData = post.toObject();

        return { data: postData };
    } catch (error) {
        throw new Error(error);
    }
}

export const deletePost = async (post_id, user_id) => {
    try {
        const result = await Post.findOne({ _id: post_id, user_id: user_id });
        if (!result) throw new Error("Post not found");

        const deletedPost = await Post.deleteOne({ _id: post_id });
        if (!deletedPost) throw new Error("Something went wrong");

        return true;
    } catch (error) {
        throw new Error(error);
    }
}