const Post = require("../models/postModel");

const getPost = async (req, res, next) => {
  let post;
  try {
    post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json("could not find a post");
    }
  } catch (e) {
    res.status(500).json(e);
  }

  res.post = post;
  next();
};

module.exports = getPost;
