const { default: mongoose } = require("mongoose");
const cloudinary = require("../config/cloudinary");
const Post = require("../models/post.model");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// GET
const allPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .select("image.thumbnail likedBy createdBy")
      .populate({
        path: "createdBy",
        model: "User",
        select: "fName lName username avatar",
      })
      .sort({ createdAt: -1 });
    successResponse(res, 200, posts);
  } catch (e) {
    errorResponse(res, e, 500);
  }
};

const searchPost = async (req, res) => {
  const searchQuery = req.params.query;
  try {
    if (!searchQuery) {
      return errorResponse(res, "", 400, "BadRequest", "Search query is required");
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(query)){
      return errorResponse(res, "", 400, "BadRequest", "Invalid Search query");
    }
    
    const regex = new RegExp(searchQuery, 'i'); // case-insensitive

    const results = await Post.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      {
        $match: {
          $or: [
            { location: regex },
            { tags: regex },
            { 'creator.fName': regex },
            { 'creator.lName': regex },
            { 'creator.userName': regex },
          ],
        },
      },
    ]);
    successResponse(res, 200, results);

  } catch (e) {
    errorResponse(res, e, 500);
  }
};

const singlePost = async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id })
      .populate({
        path: "createdBy",
        model: "User",
        select: "fName lName username avatar",
      });

    if (!post) {
      return errorResponse(res, "", 404, "NotFound", "Post not found");
    }
    successResponse(res, 200, post);
  } catch (error) {
    errorResponse(res, e, 500);
  }
};

const downloadImage = async (req, res) => {
  // console.log('96');
  let imgPath = res.post.image;
  res.download(`./public/${imgPath}`);
};

// POST
const createPost = async (req, res) => {
  try {
    const { location } = req.body;
    // console.log(req.file);

    //req.file is an object with the following properties:
    // {
    //   fieldname: 'image',
    //   originalname: 'cld-sample-2.jpg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg',
    //   destination: 'C:\\Users\\Ayush\\AppData\\Local\\Temp',
    //   filename: 'image-1744537650184-507474916.jpg',
    //   path: 'C:\\Users\\Ayush\\AppData\\Local\\Temp\\image-1744537650184-507474916.jpg',
    //   size: 592235
    // }
    // https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_400/sample.jpg

    const cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
      detection: "captioning",
      categorization: "google_tagging",
      auto_tagging: 0.7,
      folder: "posts",
      resource_type: "image",
    });

    const { tags, width, height, secure_url } = cloudinaryData;
    const description = cloudinaryData?.info?.detection?.captioning?.data?.caption || " ";
    const thumbnailUrl = secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_400/');

    const newPost = await Post.create({
      image: { url: secure_url, thumbnail: thumbnailUrl },
      description,
      tags,
      height,
      width,
      location: location || "",
      createdBy: req.user,
    })

    successResponse(res, 200, newPost, "Post created successfully");
  } catch (e) {
    errorResponse(res, e, 500);
  }
};

//PATCH
const updatePost = async (req, res) => {
  let { description, location } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return errorResponse(res, "", 404, "NotFound", "Post not found");

    if (post.createdBy.toString() !== req.user.toString()) {
      return errorResponse(res, "", 403, "Forbidden", "You are not authorized to update this post");
    }

    if (description && description.trim().length > 10)
      post.description = String(description).trim();
    if (location && location.trim().length > 3)
      post.location = String(location).trim();

    const updatedPost = await post.save();

    successResponse(res, 200, updatedPost, "Post updated successfully");
  } catch (e) {
    errorResponse(res, e, 500);
  }
};

// PUT
const likePost = async (req, res) => {
  let { postId } = req.params;
  postId = new mongoose.Types.ObjectId(postId);
  console.log(postId, 135);
  const userId = req.user;
  try {
    const post = await Post.findOne({ _id: postId, "likedBy.user": userId });
    if (post) {
      return successResponse(res, 200, post, "Post liked successfully prev");
    }
    const x = await Post.findByIdAndUpdate(
      { _id: postId },
      { $push: { likedBy: { user: userId, date: new Date() } } },
      { new: true }
    );
    // console.log(x, 137);
    return successResponse(res, 200, x, "Post liked successfully");
  } catch (e) {
    errorResponse(res, e, 500);
  }
};

const dislikePost = async (req, res) => {
  let { postId } = req.params;
  // postId = new mongoose.Types.ObjectId(postId);
  const userId = req.user;
  try {
    const x = await Post.findByIdAndUpdate(
      { _id: postId },
      { $pull: { likedBy: { user: userId } } },
      { new: true }
    );
    successResponse(res, 200, x, "Post disliked successfully");
  } catch (e) {
    errorResponse(res, e, 500);
  }
};

// DELETE
const deletePost = async (req, res) => {
  const { id } = req.params;
  // const desertRef = fbStorage.ref(storage, imgUrl);
  try {
    await Post.findByIdAndDelete(id);
    successResponse(res, 200, {}, "Post deleted successfully");
  } catch (e) {
    errorResponse(res, e, 500);
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
