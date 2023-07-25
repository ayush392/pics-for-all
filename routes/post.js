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

// Search images with given query
router.get('/search/:query', async (req, res) => {
    const query = req.params.query;
    try {
        // { email: new RegExp(`^${emailVariable}$`, 'i') }
        const post = await Post.find({ tags: new RegExp(`^${query}$`, 'i') })
        console.log(post, 28);
        res.json(post);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})


//POST a new image
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

    const tagsArr = tags.split(',');
    tagsArr.forEach((ele, idx) => {
        tagsArr[idx] = ele.trim();
    });

    const savePost = new Post({
        description: description,
        tags: tagsArr,
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

router.get('/download/:id', getPost, async (req, res) => {
    console.log('96');
    let imgPath = res.post.image;
    res.download(`./public/${imgPath}`)
})

// GET a single image
router.get('/photos/:id', getPost, async (req, res) => {
    res.json(res.post);
})

// UPDATE an image
router.patch('/:id', requireAuth, getPost, async (req, res) => {
    const { description, tags, location } = req.body;

    const tagsArr = tags.split(',');
    tagsArr.forEach((ele, idx) => {
        tagsArr[idx] = ele.trim();
    });

    console.log(description, tags, location);
    res.post.description = description
    res.post.tags = tagsArr
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

// LIKE a post
router.put('/like', requireAuth, async (req, res) => {
    const { postId, username } = req.body;
    try {
        const x = await Post.findByIdAndUpdate({ _id: postId }, { $push: { liked_by: username } }, { new: true });
        // console.log(x, 137);
        res.json(x)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

router.put('/unlike', requireAuth, async (req, res) => {
    const { postId, username } = req.body;
    try {
        const x = await Post.findByIdAndUpdate({ _id: postId }, { $pull: { liked_by: username } }, { new: true });
        // res.json({ message: 'image disliked by ' + username })
        res.json(x);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router;