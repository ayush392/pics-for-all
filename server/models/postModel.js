const mongoose = require('mongoose');

const Schema = mongoose.Schema

const postSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        required: true,
    },
    location: {
        type: String,
    },
    imageUrl: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Post', postSchema)