const Post = require('../model/post');

exports.createPost = async (req, res) => {
    try {
        const { name, title, description } = req.body;
        const newPost = new Post({ name, title, description });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ timestamp: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};