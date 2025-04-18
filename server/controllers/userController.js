const User = require('../models/user.model')
const Post = require('../models/post.model');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcrypt');
const { errorResponse, successResponse } = require('../utils/responseHandler');

const createToken = function (_id) {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

//login user
const loginUser = async function (req, res) {
    let { email, password, role } = req.body
    if(role==='guest'){
        email = process.env.GUEST_EMAIL;
        password = process.env.GUEST_PASSWORD;
    }
    let emailOrUsername = email;
    console.log(emailOrUsername, password, 10);
    try {
        if (!emailOrUsername) return errorResponse(res, '', 400, 'BadRequest', 'Email or username is required')
        if (!password) return errorResponse(res, '', 400, 'BadRequest', 'Password is required')

        emailOrUsername = String(emailOrUsername).toLowerCase().trim();

        const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] }).select('-fName -lName -__v -createdAt -updatedAt')
        if (!user) return errorResponse(res, '', 400, 'BadRequest', 'User not found')

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            if (!validator.isEmail(emailOrUsername))
                return errorResponse(res, '', 400, 'BadRequest', 'Invalid email or username')
            return errorResponse(res, '', 400, 'BadRequest', 'Invalid username or password')
        }


        const token = createToken(user._id)

        successResponse(res, 200, { uid: user._id, token, username: user.username, avatar: user.avatar }, 'Login successful')
    } catch (e) {
        errorResponse(res, e, 500)
    }
}

// signup user
const signupUser = async function (req, res) {
    let { fName, lName, email, username, password } = req.body
    try {
        fName = String(fName).trim()
        lName = String(lName).trim()
        email = String(email).toLowerCase().trim()
        username = String(username).trim()
        password = String(password);

        if (!fName) return errorResponse(res, '', 400, 'BadRequest', 'First name is required')
        if (!lName) return errorResponse(res, '', 400, 'BadRequest', 'Last name is required')
        if (!email) return errorResponse(res, '', 400, 'BadRequest', 'Email is required')
        if (!validator.isEmail(email)) return errorResponse(res, '', 400, 'BadRequest', 'Invalid email address')
        if (!username || username.length < 6) return errorResponse(res, '', 400, 'BadRequest', 'Username is required and must be at least 6 characters long')
        if (!password || password.length < 6 || password.length > 20) return errorResponse(res, '', 400, 'BadRequest', 'Password must be between 6 and 20 characters long')

        const isExist = await User.findOne({ $or: [{ email }, { username }] })
        if (isExist) {
            if (isExist.email === email) return errorResponse(res, '', 400, 'BadRequest', 'Email already exists')
            if (isExist.username === username) return errorResponse(res, '', 400, 'BadRequest', 'Username already exists')
        }

        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10)
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fName, lName, email, username, password: hashPassword,
        })
        if (!newUser) return errorResponse(res, '', 400, 'BadRequest', 'User not created')
        const token = createToken(newUser._id)

        successResponse(res, 201, { email: newUser.email, token, username: newUser.username, avatar: newUser.avatar }, 'Signup successful')

    } catch (e) {
        errorResponse(res, e, 500)
    }
}

const postsOfUser = async function (req, res) {
    // const userId = req.params.id
    try {
        const userId = new mongoose.Types.ObjectId(req.params.id);
        const posts = await Post.find({ createdBy: userId })
            .select("image.thumbnail likedBy createdBy")
            .populate({
                path: "createdBy",
                model: "User",
                select: "fName lName username avatar",
            })
            .sort({ createdAt: -1 });
        successResponse(res, 200, posts)
    } catch (e) {
        errorResponse(res, e, 500)
    }
}

const likedPosts = async function (req, res) {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.id);
        const posts = await Post.find({ "likedBy.user": userId })
            .select("image.thumbnail likedBy createdBy")
            .populate({
                path: "createdBy",
                model: "User",
                select: "fName lName username avatar",
            })
            .sort({ createdAt: -1 });
        successResponse(res, 200, posts)
    } catch (e) {
        errorResponse(res, e, 500)
    }
}

const userInfo = async function (req, res) {
    const username = String(req.params.username);
    // console.log(username, 28);
    try {
        const user = await User.findOne({ username }).select('-password -__v -createdAt -updatedAt')
        if (!user) return errorResponse(res, '', 400, 'BadRequest', 'User not found')

        const userId = user._id;

        let likedPosts = await Post.find({ "likedBy.user": userId })
            .select("image.thumbnail likedBy createdBy")
            .populate({
                path: "createdBy",
                model: "User",
                select: "fName lName username avatar",
            })
            .sort({ createdAt: -1 })
            .lean();

        let posts = await Post.find({ createdBy: userId })
            .select("image.thumbnail likedBy createdBy")
            .populate({
                path: "createdBy",
                model: "User",
                select: "fName lName username avatar",
            })
            .sort({ createdAt: -1 })
            .lean();

        likedPosts = likedPosts.map(post => {
            return {
                ...post,
                likedBy: post.likedBy.length,
                isLiked: (post.likedBy.some(like => like.user.toString() === req?.user?.toString()))
            }
        })
        
        posts = posts.map(post => {
            return {
                ...post,
                likedBy: post.likedBy.length,
                isLiked: (post.likedBy.some(like => like.user.toString() === req?.user?.toString()))
            }
        })

        // console.log(post);
        successResponse(res, 200, { userPosts: posts, likedPosts, userInfo: user }, 'User info fetched successfully')
    } catch (e) {
        errorResponse(res, e, 500)
    }
}

module.exports = { loginUser, signupUser, postsOfUser, likedPosts, userInfo };
