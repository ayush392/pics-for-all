const express = require('express');
const { loginUser, signupUser } = require('../controllers/userController')
const Post = require('../models/postModel');
const { UserDetail } = require('../models/userModel')

const router = express.Router();

//login
router.post('/login', loginUser);

// signup
router.post('/signup', signupUser);

// GET posts of user
router.get('/posts/:username', async (req, res) => {
    const username = req.params.username
    try {
        const post = await Post.find({ 'user.username': username })
        // console.log(post, 'posts-19');
        res.json(post)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

//GET posts liked by user
router.get('/likes/:username', async (req, res) => {
    const username = req.params.username
    try {
        const post = await Post.find({ liked_by: username })
        // console.log(post, 'likes-30');
        res.json(post)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

// GET user info
router.get('/info/:username', async (req, res) => {
    const username = req.params.username
    // console.log(username, 28);
    try {
        const post = await UserDetail.find({ username: username })
        // console.log(post);
        res.json(post)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router 