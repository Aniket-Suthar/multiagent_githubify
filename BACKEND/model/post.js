// models/Post.js

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    name: String,
    title: String,
    description: String,
    timestamp: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
