import { allPosts, createPost, updatePost, postById, deletePost } from "../Services/post.services.js";

export const posts = async (req, res) => {
    try {
        const result = await allPosts();
        res.status(200).json({
            status: true,
            data: result.data,
            msg: "Posts fetched successfully."
        })
    }
    catch (error) {
        res.status(500).json({
            status: false,
            data: {},
            msg: error.message
        })
    }
}

export const create = async (req, res) => {
    try {
        const result = await createPost(req.body, req.user.id);
        res.status(200).json({
            status: true,
            data: result.data,
            msg: "Post created successfully."
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            data: {},
            msg: error.message
        })
    }
}

export const update = async (req, res) => {
    try {
        const result = await updatePost(req.body, req.user.id);
        res.status(200).json({
            status: true,
            data: result.data,
            msg: "Post updated successfully."
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            data: {},
            msg: error.message
        })
    }
}

export const getPostById = async (req, res) => {
    try {
        const result = await postById(req.params.id);
        res.status(200).json({
            status: true,
            data: result.data,
            msg: "Post fetched successfully."
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            data: {},
            msg: error.message
        })
    }
}

export const deletePostById = async (req, res) => {
    try {
        await deletePost(req.params.id, req.user.id);
        res.status(200).json({
            status: true,
            data: {},
            msg: "Post deleted successfully."
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            data: {},
            msg: error.message
        })
    }
}
