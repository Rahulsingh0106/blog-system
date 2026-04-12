import Post from "../Models/post.model.js";

export const allPosts = async () => {
    try {
        const result = await Post.find({});
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const createPost = async (data) => {
    try {
        const result = await Post.create({ ...data });
        return result;
    } catch (error) {
        throw new Error(error);
    }
}