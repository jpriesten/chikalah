const Post = require("../models/post.model");
const User = require("../models/user.model");

// Create a new post
exports.newPost = async (req, res) => {
  // Get user information from request
  let post = new Post(req.body);
  console.log(req.user._id + "kajdklfjlaksdjflaksdjfldkjflkdjfl");
  const userId = req.user._id;

  // Check if user is employer
  const user = await User.findOne(userId);

  if (user.userType != "employer") {
    return res
      .status(401)
      .send({ error: true, result: "Register as Employer to create a post" });
  }

  post.userID = userId;

  Post.init()
    .then(async () => {
      try {
        await post.save();
        res.status(201).send({ error: false, result: post });
      } catch (error) {
        console.log(post, error);
        res.status(400).send({ error: true, result: error.message });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send({ error: true, result: error.message });
    });
};

exports.getUserPost = async (req, res) => {
  console.log("userID: ", req.user.user_id);
  try {
    const posts = await Post.find({ userID: req.user._id });
    res.status(201).send({ error: false, result: posts });
  } catch (error) {
    console.log("Errors", error);
    res.status(401).send({
      error: true,
      code: 13589,
      results: "Can't get User Posts",
      message: error.message,
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(201).send({ error: false, result: posts });
  } catch (error) {
    console.log("Errors", error);
    res.status(401).send({
      error: true,
      code: 13590,
      results: "Can't get Posts",
      message: error.message,
    });
  }
};
