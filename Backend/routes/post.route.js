import express from "express";
import multer from "multer";
import {
  getPost,
  createPost,
  getFollowingPost,
  editPost,
  deletePost,
  likePost,
  addComment,
} from "../controllers/post.controller.js";

const router = express.Router();

// Use multer with memory storage so we can get the file buffer.
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Attach multer middleware to process the file from the "img" field.
router.post("/createPost", upload.single("img"), createPost);

router.post("/getPost", getPost);
router.post("/getFollowingPost", getFollowingPost);
router.put("/editPost", editPost);
router.delete("/deletePost", deletePost);
router.post("/likePost", likePost);
router.post("/addComment", addComment);

export default router;