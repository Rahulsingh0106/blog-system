import mongoose from "mongoose";
const { Schema } = mongoose;

const post_schema = new mongoose.Schema({
    title: String,
    content: String,
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'published' },
    scheduledAt: { type: Date, default: null },
}, { timestamps: true })

export default mongoose.model("Post", post_schema);