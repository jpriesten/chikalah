module.exports = (app) => {
  const posts = require("../controllers/post.controller");
  const authenticate = require("../middlewares/authenticator.middleware");

  // Create a new post
  app.post("/api/v1/posts/new", authenticate, posts.newPost);

  // Retrieve all posts by User
  app.get("/api/v1/posts/me", authenticate, posts.getUserPost);

  // Retrieve all posts
  app.get("/api/v1/posts", posts.getAllPosts);

};
