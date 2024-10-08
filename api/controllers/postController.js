const postSchema = require("../models/postModel");

const createPostController = async (req, res) => {
  try {
    const { title, description, imageUri } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    const post = new postSchema({
      title,
      description,
      image: imageUri,
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
    });
  }
};

const updatePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUri } = req.body;

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
        image: imageUri || existingPost.image,
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
    });
  }
};

module.exports = {
  createPostController,
  deletePostController,
  getUserPostsController,
  updatePostController,
};
