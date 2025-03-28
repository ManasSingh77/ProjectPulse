import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

// Get all posts
export const getPost = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(500).json({ error: "Failed to get posts" });
  }
};

// Create a new post (supports image upload via FormData)
export const createPost = async (req, res) => {
    try {
      const { username, description } = req.body;
      let img;
  
      // If an image file is provided (via multer, available as req.file)
      if (req.file) {
        // Convert the file buffer to a base64 string and build a Data URI
        const base64Str = req.file.buffer.toString("base64");
        const dataUri = `data:${req.file.mimetype};base64,${base64Str}`;
  
        // Upload the image using Cloudinary
        const uploadedResponse = await cloudinary.uploader.upload(dataUri);
        img = uploadedResponse.secure_url;
      } else if (req.body.img) {
        // If the image is provided as a string (fallback scenario)
        const uploadedResponse = await cloudinary.uploader.upload(req.body.img);
        img = uploadedResponse.secure_url;
      }
  
      const post = new Post({
        username,
        description,
        img,
      });
  
      await post.save();
      res.status(200).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  };

// Get posts from users the current user is following
export const getFollowingPost = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const posts = await Post.find({ username: { $in: user.following } }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting following posts:", error);
    res.status(500).json({ error: "Failed to get following posts" });
  }
};

// Edit a post
export const editPost = async (req, res) => {
  try {
    const { postId, description } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    post.description = description;
    post.edited = true; // Flag the post as edited
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Error editing post:", error);
    res.status(500).json({ error: "Failed to edit post" });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
      const { postId } = req.body; // or req.query if you prefer
      // Find the post first
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      
      // If the post has an image and a cloudinary_id, delete the image from Cloudinary
      if (post.img && post.cloudinary_id) {
        await cloudinary.uploader.destroy(post.cloudinary_id);
      }
  
      // Delete the post from the database
      await Post.findByIdAndDelete(postId);
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Failed to delete post" });
    }
  };

// Like or unlike a post
export const likePost = async (req, res) => {
  try {
    const { postId, username } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    // Toggle like: remove if already liked; otherwise add it
    if (post.likes.includes(username)) {
      post.likes = post.likes.filter((u) => u !== username);
    } else {
      post.likes.push(username);
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Failed to like post" });
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { postId, username, text } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    post.comments.push({ username, text });
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};
