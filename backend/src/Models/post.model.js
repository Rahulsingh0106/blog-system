import mongoose from "mongoose";
const { Schema } = mongoose;

const post_schema = new mongoose.Schema({
    title: String,
    discription: String,
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
})

export default mongoose.model("Post", post_schema);