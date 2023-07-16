const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');
const { UserDetail } = require('../models/userModel')
const fs = require('fs');
const path = require('path')
const requireAuth = require('../middleware/requireAuth')

const multer = require('multer')

// GET all images
router.get('/', async (req, res) => {
    try {
        const post = await Post.find({}).sort({ date: -1 });
        res.json(post)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
    const { description, tags, location, username } = req.body;
    const userDetails = await UserDetail.findOne({ username })
    const savePost = new Post({
        description: description,
        tags: tags,
        location: location,
        image: req.file.filename,
        user: userDetails,
    })

    try {
        const response = await savePost.save()
        res.status(201).json(response)
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
})



// POST a new image
// router.post('/', upload.single('image'), async (req, res) => {
//     console.log(req.file);
//     const { description, tags, location, username } = req.body;
//     // const tagArray = tags.split(',');
//     // console.log(imageUrl);
//     console.log(req.file.path);
//     const userDetails = await UserDetail.findOne({ username })
//     const newPost = new Post({
//         description: description,
//         tags: tags,
//         location: location,
//         imageUrl: req.file.path,
//         user: userDetails,
//     })

//     try {
//         const response = await newPost.save()
//         res.status(201).json(response)
//     } catch (e) {
//         res.status(400).json({ message: e.message })
//     }
// })

// middleware

async function getPost(req, res, next) {
    let post;
    try {
        post = await Post.findById(req.params.id)
        if (post == null) {
            return res.status(500).json({ message: 'could not find a post' })
        }
    } catch (e) {
        res.status(500).json({ message: e.message })
    }

    res.post = post
    next()
}

// GET a single image
router.get('/photos/:id', getPost, async (req, res) => {
    res.json(res.post);
})

// UPDATE an image
router.patch('/:id', requireAuth, getPost, async (req, res) => {
    const { description, tags, location } = req.body;

    console.log(description, tags, location);
    res.post.description = description
    res.post.tags = tags
    res.post.location = location

    try {
        const updatePost = await res.post.save()
        res.status(200).json(updatePost)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

// DELETE an image
router.delete('/:id', requireAuth, getPost, async (req, res) => {
    let imgUrl = res.post.image;
    fs.unlink('public/' + imgUrl, function (err) {
        if (err) throw err;
        console.log('File deleted!');
    });
    try {
        await res.post.deleteOne()
        res.json({ message: 'post deleted successfully' })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

// router.put('/like', requireLogin, (req,res)=>{})
router.put('/like', requireAuth, async (req, res) => {
    const { postId, username } = req.body;
    try {
        await Post.findByIdAndUpdate({ _id: postId }, { $push: { liked_by: username } }, { new: true });
        res.json({ message: 'image liked by ' + username })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

router.put('/unlike', requireAuth, async (req, res) => {
    const { postId, username } = req.body;
    try {
        await Post.findByIdAndUpdate({ _id: postId }, { $pull: { liked_by: username } }, { new: true });
        res.json({ message: 'image disliked by ' + username })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router;