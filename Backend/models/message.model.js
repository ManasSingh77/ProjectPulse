import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
    },
    sender: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true, 
  }
);

const Message = mongoose.model("Message", MessageSchema);
export default Message;