const { default: mongoose } = require("mongoose");
const cloudinary = require("../config/cloudinary");
const Post = require("../models/post.model");
const User = require("../models/user.model")
const { successResponse, errorResponse } = require("../utils/responseHandler");
const axios = require("axios");
const emailNotification = require("../utils/emailNotification");

// GET
const allPosts = async (req, res) => {
  try {
    let posts = await Post.find({})
      .select("image.thumbnail likedBy height width createdBy")
      .populate({
        path: "createdBy",
        model: "User",
        select: "fName lName username avatar",
      })
      .sort({ createdAt: -1 })
      .lean();

    const userId = req?.user?.toString() || "";
    const updatedPosts = posts.map(post => {
      return {
        ...post,
        isLiked: post.likedBy.some(like => like.user.toString() === userId),
        likedBy: post.likedBy.length,
      }
    })
    successResponse(res, 200, updatedPosts);
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
    if (!/^[a-zA-Z0-9\s]+$/.test(searchQuery)) {
      return errorResponse(res, "", 400, "BadRequest", "Invalid Search query");
    }

    const regex = new RegExp(searchQuery, 'i'); // case-insensitive

    let results = await Post.aggregate([
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
            { description: regex },
            { 'creator.fName': regex },
            { 'creator.lName': regex },
            { 'creator.username': regex },
          ],
        },
      },
      {
        $addFields: {
          createdBy: {
            _id: '$creator._id',
            fName: '$creator.fName',
            lName: '$creator.lName',
            username: '$creator.username',
            avatar: '$creator.avatar',
          },
        },
      },
      {
        $project: {
          _id: 1,
          image: { thumbnail: 1 },
          likedBy: 1,
          height: 1,
          width: 1,
          createdAt: 1,
          updatedAt: 1,
          createdBy: 1,
        },
      },
    ]);

    const userId = req?.user?.toString() || "";
    results = results.map(post => {
      return {
        ...post,
        isLiked: post.likedBy.some(like => like.user.toString() === userId),
        likedBy: post.likedBy.length,
      }
    })

    successResponse(res, 200, results);

  } catch (e) {
    errorResponse(res, e, 500);
  }
};

const singlePost = async (req, res) => {
  try {
    let post = await Post.findById({ _id: req.params.id })
      .populate({
        path: "createdBy",
        model: "User",
        select: "fName lName username avatar",
      })
      .lean();

    if (!post) {
      return errorResponse(res, "", 404, "NotFound", "Post not found");
    }

    post = {
      ...post,
      likedBy: post.likedBy.length,
      isLiked: (post.likedBy.some(like => like.user.toString() === req?.user?.toString()))
    }

    successResponse(res, 200, post);
  } catch (error) {
    errorResponse(res, e, 500);
  }
};

// POST
const createPost = async (req, res) => {
  try {
    const { location } = req.body;
    successResponse(res, 200, {}, "You will be notified via email once the image is processed");
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
    const thumbnailUrl = secure_url.replace('/upload/', '/upload/f_auto,q_auto:eco,w_380/');

    try {
      const response = await axios.post(
        `https://${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}@api.cloudinary.com/v2/analysis/${process.env.CLOUDINARY_CLOUD_NAME}/analyze/ai_vision_moderation`,
        {
          source: {
            uri: secure_url,
          },
          rejection_questions: [
            "Is this image unrelated to nature?",
            "Does this image lack animals or birds or wildlife?",
            "Does the image contain alcohol, nudity, or offensive content?"
          ]
        }
      );

      const analysisRes = response.data?.data?.analysis?.responses;
      let lackNature = false, lackWildlife = false, isOffensive = true;

      analysisRes.forEach(res => {
        if (res.prompt === "Is this image unrelated to nature?") {
          lackNature = (res.value === "yes");
        } else if (res.prompt === "Does this image lack animals or birds or wildlife?") {
          lackWildlife = (res.value === "yes");
        } else if (res.prompt === "Does the image contain alcohol, nudity, or offensive content?") {
          isOffensive = (res.value === "yes");
        }
      })

      const user = await User.findById(req.user).select("email fName lName");

      console.log("Lack Nature: ", lackNature, " | Lack Wildlife: ", lackWildlife, " | Is Offensive: ", isOffensive);

      if (!(lackNature && lackWildlife) && !isOffensive) {
        await Post.create({
          image: { url: secure_url, thumbnail: thumbnailUrl },
          description,
          tags,
          height,
          width,
          location: location || "",
          createdBy: req.user,
        })

        // accept image
        emailNotification(user, thumbnailUrl, 'accepted')

      }
      else {
        // reject image
        emailNotification(user, thumbnailUrl, 'rejected')
      }

    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Something went wrong' });
    }
  } catch (e) {
    errorResponse(res, e, 500);
  }
};

//PATCH
const updatePost = async (req, res) => {
  let { description, location } = req.body;

  try {
    const post = await Post.findById(req.params.id).select("description location createdBy");
    if (!post)
      return errorResponse(res, "", 404, "NotFound", "Image not found");

    if (post.createdBy.toString() !== req.user.toString()) {
      return errorResponse(res, "", 403, "Forbidden", "You are not authorized to update this Image");
    }

    if (description && description.trim().length > 10)
      post.description = String(description).trim();
    if (location && location.trim().length > 3)
      post.location = String(location).trim();

    const updatedPost = await post.save();

    successResponse(res, 200, updatedPost, "Image updated successfully");
  } catch (e) {
    errorResponse(res, e, 500);
  }
};

// PATCH
const likePost = async (req, res) => {
  let { postId } = req.params;
  postId = new mongoose.Types.ObjectId(postId);
  console.log(postId, 135);
  const userId = req.user;
  try {
    const post = await Post.findOne({ _id: postId, "likedBy.user": userId }).select("_id likedBy")
    if (post) {
      return successResponse(res, 200, { _id: post._id, isLiked: true }, "Post liked already");
    }
    const x = await Post.findByIdAndUpdate(
      { _id: postId },
      { $push: { likedBy: { user: userId, date: new Date() } } },
      { new: true }
    );
    // console.log(x, 137);
    return successResponse(res, 200, { _id: x._id, isLiked: true }, "Image liked");
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
    successResponse(res, 200, { _id: x._id, isLiked: false }, "Image disliked");
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
    successResponse(res, 200, {}, "Image deleted successfully");
  } catch (e) {
    errorResponse(res, e, 500);
  }
};

module.exports = {
  allPosts,
  searchPost,
  singlePost,
  createPost,
  updatePost,
  likePost,
  dislikePost,
  deletePost,
};
