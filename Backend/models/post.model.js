import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: String },
    likes: [{ type: String }],
    comments: [
      {
        text: { type: String },
        username: { type: String },
      },
    ],
    edited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;