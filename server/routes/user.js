const express = require('express');
const { loginUser, signupUser } = require('../controllers/userController')
const Post = require('../models/postModel');

const router = express.Router();

//login
router.post('/login', loginUser);

// signup
router.post('/signup', signupUser);

// GET user info
router.get('/:username', async (req, res) => {
    const username = req.params.username
    try {
        const post = await Post.find({ 'user.username': username })
        console.log(post);
        res.json(post)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router 