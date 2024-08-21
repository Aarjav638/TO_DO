const postSchema = require("../models/postModel");

const createPostController = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validation
    if (!title || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    const post = new postSchema({
      title,
      description,
      postedBy: req.auth._id,
    });

    const savedPost = await post.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      savedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getUserPostsController = async (req, res) => {
  try {
    const posts = await postSchema
      .find({ postedBy: req.auth._id })
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllPostsController = async (req, res) => {
  try {
    const posts = await postSchema
      .find()
      .populate("postedBy", "_id name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await postSchema.findOne({ _id: id });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    await postSchema.findOneAndDelete({ _id: id });

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updatePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const existingPost = await postSchema.findById({ _id: id });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (!title && !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill at least one field to update",
      });
    }

    const updatedPost = await postSchema.findOneAndUpdate(
      { _id: id },
      {
        title: title || existingPost.title,
        description: description || existingPost.description,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Batch processing controller for syncing offline changes
const syncPostsController = async (req, res) => {
  const { actions } = req.body; // expecting an array of actions
  const results = [];

  for (const action of actions) {
    try {
      let result;
      if (action.type === "add") {
        result = await createPostController(
          { body: action.note, auth: req.auth },
          res
        );
      } else if (action.type === "update") {
        result = await updatePostController(
          { params: { id: action.id }, body: action.note, auth: req.auth },
          res
        );
      } else if (action.type === "delete") {
        result = await deletePostController(
          { params: { id: action.id }, auth: req.auth },
          res
        );
      }
      results.push({ success: true, result });
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }

  res.status(200).json({
    success: true,
    message: "Sync completed",
    results,
  });
};

module.exports = {
  createPostController,
  deletePostController,
  getUserPostsController,
  getAllPostsController,
  updatePostController,
  syncPostsController,
};
