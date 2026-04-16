import Post from "../Models/post.model.js";
import { validateCreatePost } from "../Validations/post.validate.js";
export const allPosts = async () => {
    try {
        const result = await Post.find({});
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
        if (error) throw new Error("Something went wrong");

        const postData = result.toObject();
        delete postData.user_id;

        return { data: postData };
    } catch (error) {
        throw new Error(error);
    }
}

export const updatePost = async (data, user_id) => {
    try {
        const { error } = validateCreatePost(data);
        if (error) throw new Error(error.details[0].message);

        const result = await Post.findOne({ _id: data.post_id, user_id: user_id });
        if (!result) throw new Error("Post not found");

        const updatedPost = await Post.updateOne({ _id: data.post_id }, { $set: { title: data.title, content: data.content } });
        if (!updatedPost) throw new Error("Something went wrong");

        const post = await Post.findOne({ _id: data.post_id });
        const postData = post.toObject();
        delete postData.user_id;

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
        delete postData.user_id;

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