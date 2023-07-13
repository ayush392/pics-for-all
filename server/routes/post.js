const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })


router.get('/', async (req, res) => {
    try {
        const post = await Post.find();
        res.json(post)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

// upload image
// app.post('/user/upload', upload.single('image'), function(req, res){
//     console.log(req.file);
//     console.log(req.body);
//     // console.log(req.file);
// })

router.post('/', upload.single('image'), async (req, res) => {
    // console.log(req.body, 27);
    const { description, tags, location } = req.body;
    // const tagArray = tags.split(',');
    // console.log(imageUrl);
    console.log(req.file.path);

    const newPost = new Post({
        description: description,
        tags: tags,
        location: location,
        imageUrl: req.file.path
    })

    try {
        const response = await newPost.save()
        res.status(201).json(response)
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
})

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


router.get('/:id', getPost, async (req, res) => {
    res.json(res.post);
})

router.patch('/:id', getPost, async (req, res) => {
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

router.delete('/:id', getPost, async (req, res) => {
    try {
        await res.post.deleteOne()
        res.json({ message: 'post deleted successfully' })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router;