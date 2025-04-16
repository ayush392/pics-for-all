const express = require('express');
const { loginUser, signupUser, postsOfUser, likedPosts, userInfo } = require('../controllers/userController');
const requireUserId = require('../middleware/requireUserId');

const router = express.Router();

//login
router.post('/login', loginUser);

// signup
router.post('/signup', signupUser);

// // GET posts of user
// router.get('/posts/:id', postsOfUser); 

// //GET posts liked by user
// router.get('/likes/:id', likedPosts)

// GET user info
router.get('/info/:username', requireUserId, userInfo)

module.exports = router 