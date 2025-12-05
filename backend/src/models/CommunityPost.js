// src/models/CommunityPost.js
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

const CommunityPostSchema = new mongoose.Schema(
    {
        community: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community",
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [CommentSchema],
    },
    {
        timestamps: true,
    }
);

const CommunityPost = mongoose.model("CommunityPost", CommunityPostSchema);
export default CommunityPost;