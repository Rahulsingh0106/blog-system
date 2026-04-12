import { allPosts, createPost } from "../Services/post.services.js";

export const posts = async (req, res) => {
    try {
        const result = await allPosts();
        res.status(200).json({
            status: true,
            data: result,
            msg: "Posts fetched successfully."
        })
    }
    catch (error) {
        res.status(500).json({
            status: false,
            data: {},
            msg: "Something went wrong."
        })
    }
}

export const create = async (req, res) => {
    try {
        const result = createPost(req.body);
        res.status(200).json({
            status: true,
            data: result,
            msg: "Post created successfully."
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            data: {},
            msg: "Something went wrong"
        })
    }
} 