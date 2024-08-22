const express = require("express");
const {
  getUserPostsController,
  createPostController,
  deletePostController,
  updatePostController,
} = require("../controllers/postController");
const { requireLogin } = require("../middleware");

const router = express.Router();

// Create a new post
router.post("/create-post", requireLogin, createPostController);

// Get posts created by the logged-in user
router.get("/get-posts", requireLogin, getUserPostsController);

// Delete a specific post by ID
router.delete("/delete-post/:id", requireLogin, deletePostController);

// Update a specific post by ID
router.put("/update-post/:id", requireLogin, updatePostController);

module.exports = router;
