const router = require("express").Router();
const requireAuth = require("../middleware/requireAuth");
const upload = require("../config/multer")
const requireUserId = require("../middleware/requireUserId");

const {
  allPosts,
  updatePost,
  searchPost,
  likePost,
  dislikePost,
  deletePost,
  createPost,
  singlePost,
} = require("../controllers/postController");

// GET all posts
router.get("/", requireUserId, allPosts); // TODO: add pagination

// SEARCH posts with given query
router.get("/search/:query", requireUserId, searchPost);  

//CREATE a new post
router.post("/", requireAuth, upload.single("image"), createPost);  

// LIKE a post
router.patch("/like/:postId", requireAuth, likePost);  

// DISLIKE a post
router.patch("/unlike/:postId", requireAuth, dislikePost);  

// UPDATE a post
router.patch("/:id", requireAuth, updatePost);

// GET a single post
router.get("/:id", requireUserId, singlePost);   

// DELETE a post
router.delete("/:id", requireAuth, deletePost);

module.exports = router;
