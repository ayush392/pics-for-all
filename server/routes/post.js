const router = require("express").Router();
require("../config/firebase");

//middlewares
const requireAuth = require("../middleware/requireAuth");
const getPost = require("../middleware/getPost");
const { upload } = require("../config/firebase");

const {
  allPosts,
  updatePost,
  searchPost,
  likePost,
  dislikePost,
  deletePost,
  createPost,
  singlePost,
  downloadImage,
} = require("../controllers/postController");

// GET all posts
router.get("/", allPosts);

// SEARCH posts with given query
router.get("/search/:query", searchPost);

//CREATE a new post
router.post("/", requireAuth, upload.single("image"), createPost);

// DOWNLOAD an image
router.get("/download/:id", getPost, downloadImage);

// GET a single post
router.get("/photos/:id", getPost, singlePost);

// UPDATE a post
router.patch("/:id", requireAuth, getPost, updatePost);

// DELETE a post
router.delete("/:id", requireAuth, getPost, deletePost);

// LIKE a post
router.put("/like", requireAuth, likePost);

// DISLIKE a post
router.put("/unlike", requireAuth, dislikePost);

module.exports = router;
