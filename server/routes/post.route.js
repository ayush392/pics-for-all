const router = require("express").Router();
const requireAuth = require("../middleware/requireAuth");
const upload = require("../config/multer")

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
router.get("/", allPosts); // TODO: add pagination

// SEARCH posts with given query
router.get("/search/:query", searchPost);  

//CREATE a new post
router.post("/", requireAuth, upload.single("image"), createPost);  

// TODO: DOWNLOAD an image
router.get("/download/:id", downloadImage);

// LIKE a post
router.patch("/like/:postId", requireAuth, likePost);  

// DISLIKE a post
router.patch("/unlike/:postId", requireAuth, dislikePost);  

// UPDATE a post
router.patch("/:id", requireAuth, updatePost);

// GET a single post
router.get("/:id", singlePost);   

// DELETE a post
router.delete("/:id", requireAuth, deletePost);

module.exports = router;
