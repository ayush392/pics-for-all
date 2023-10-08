const { getImageURL } = require("../config/firebase");
const Post = require("../models/postModel");
const { UserDetail } = require("../models/userModel");
const fbStorage = require("firebase/storage");
const { storage } = require("../config/firebase");

// GET

const allPosts = async (req, res) => {
  try {
    const post = await Post.find({}).sort({ date: -1 });
    res.json(post);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const searchPost = async (req, res) => {
  const query = req.params.query;
  try {
    // { email: new RegExp(`^${emailVariable}$`, 'i') }
    const post = await Post.find({ tags: new RegExp(`^${query}$`, "i") });
    // console.log(post, 28);
    res.json(post);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const singlePost = async (req, res) => {
  res.json(res.post);
};

const downloadImage = async (req, res) => {
  // console.log('96');
  let imgPath = res.post.image;
  res.download(`./public/${imgPath}`);
};

// POST
const createPost = async (req, res) => {
  try {
    const { description, tags, location, username } = req.body;
    const userDetails = await UserDetail.findOne({ username });

    const tagsArr = String(tags).split(",");
    tagsArr.forEach((ele, idx) => {
      tagsArr[idx] = ele.trim();
    });

    const downloadURL = await getImageURL(req);
    const newPost = new Post({
      description: description,
      tags: tagsArr,
      location: location,
      image: downloadURL,
      user: userDetails,
    });

    const response = await newPost.save();

    console.log("File successfully uploaded.");
    res.status(201).json("response");
  } catch (e) {
    console.log({ message: e.message });
    res.status(400).json({ message: e.message });
  }
};

//PATCH
const updatePost = async (req, res) => {
  const { description, tags, location } = req.body;

  const tagsArr = String(tags).split(",");
  tagsArr.forEach((ele, idx) => {
    tagsArr[idx] = ele.trim();
  });

  if (
    res.post.description === description &&
    res.post.tags === tagsArr &&
    res.post.location === location
  ) {
    res.status(200).json({ message: "post updated" });
    return;
  }

  res.post.description = description;
  res.post.tags = tagsArr;
  res.post.location = location;

  try {
    const updatePost = await res.post.save();
    res.status(200).json(updatePost);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// PUT
const likePost = async (req, res) => {
  const { postId, username } = req.body;
  try {
    const x = await Post.findByIdAndUpdate(
      { _id: postId },
      { $push: { liked_by: username } },
      { new: true }
    );
    // console.log(x, 137);
    res.json(x);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const dislikePost = async (req, res) => {
  const { postId, username } = req.body;
  try {
    const x = await Post.findByIdAndUpdate(
      { _id: postId },
      { $pull: { liked_by: username } },
      { new: true }
    );
    // res.json({ message: 'image disliked by ' + username })
    res.json(x);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// DELETE
const deletePost = async (req, res) => {
  let imgUrl = res.post.image;
  const desertRef = fbStorage.ref(storage, imgUrl);
  try {
    await fbStorage.deleteObject(desertRef);
    await res.post.deleteOne();
    res.json({ message: "post deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: { message: e.message } });
  }
};

module.exports = {
  allPosts,
  searchPost,
  singlePost,
  downloadImage,
  createPost,
  updatePost,
  likePost,
  dislikePost,
  deletePost,
};
