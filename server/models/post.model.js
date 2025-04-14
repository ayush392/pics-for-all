const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    image: {
        url: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
    },
    height: {
        type: Number,
        required: true,
    },
    width: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: {
        type: [
            {
                type: String,
                required: true,
            },
        ],
        default: [],
        index: true,
    },
    location: {
        type: String,
        // required: true,
    },
    likedBy: {
        type: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            date: {
                type: Date,
                default: Date.now,
            },
        }],
        default: [],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);