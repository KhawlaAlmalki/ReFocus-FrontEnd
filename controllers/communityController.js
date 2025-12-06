const CommunityPost = require("../models/CommunityPost");

exports.createPost = async (req, res) => {
  const post = await CommunityPost.create({
    user: req.user.id,
    content: req.body.content,
    image: req.body.image ?? null
  });
  res.json(post);
};

exports.getPosts = async (req, res) => {
  const posts = await CommunityPost.find().populate("user", "name");
  res.json(posts);
};
