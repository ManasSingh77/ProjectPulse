import User from "./../models/user.model.js";
import Team from "./../models/team.model.js";
import Notification from "./../models/notification.model.js";
import Message from "./../models/message.model.js";
import Post from "./../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";
export const searchDeveloper = async (req, res) => {
  try {
    const username = req.body.username;
    console.log("Searching for users with fullName containing:", username);

    const users = await User.find({ fullName: new RegExp(username, "i") });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
export const searchTeam = async (req, res) => {
  try {
    const teamName = req.body.teamName;
    console.log("Searching for users with fullName containing:", teamName);

    const teams = await Team.find({ teamName: new RegExp(teamName, "i") });

    if (teams.length === 0) {
      return res.status(404).json({ message: 'No teams found' });
    }

    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

export const sendNotification=async(req,res)=>{
  try{
    const {username,sender}=req.body;
    const teamName=await Team.findOne({teamLeader:sender});
    if(!teamName){
      return res.status(404).json({message: "You are not eligible to send the invite."});
    }
    const senderName=await Notification.findOne({sender:sender});
    if(senderName){
      return res.status(404).json({message: "You have already sent an invite"});
    }
    const user=await User.findOne({username:username});
    if(user.teamName){
      return res.status(404).json({message: "Developer is already in a team."});
    }
    console.log(teamName);
    const notification=new Notification(
      {
        username,
        sender,
        teamName:teamName.teamName,
      }
    )
    await notification.save();
    res.status(200).json(notification);
  }
  catch(error){
    console.error("Error sending notification:", error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
}

export const getNotification=async(req,res)=>{
  try{
    const username=req.body.username;
    const notification=await Notification.find({username:username});
    res.status(200).json(notification);
  }
  catch(error){
    console.error("Error sending notification:", error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
}

export const acceptInvite=async(req,res)=>{
  try{
    const id=req.body.id;
    const notification=await Notification.findByIdAndDelete(id);
    return res.status(200).json({message:"Notification removed"});

  }
  catch(error){
    console.error("Error sending notification:", error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
}

export const rejectInvite=async(req,res)=>{
  try{
    const id=req.body.id;
    const notification=await Notification.findByIdAndDelete(id);
    return res.status(200).json({message:"Notification removed"});

  }
  catch(error){
    console.error("Error sending notification:", error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
}

export const sendMessage=async(req,res)=>{
  try{
    const {username,message} =req.body;
    const user=await User.findOne({username:username});
    const teamName=user.teamName;
    const messages=new Message({
      sender:username,
      message,
      teamName:teamName,
    }
  );
  messages.save();
  res.status(200).json(messages);

  }
  catch(error){
    console.error("Error sending messages:", error);
    res.status(500).json({ error: 'Failed to send messages' });
  }
}

export const getMessage=async(req,res)=>{
  try{
    const {username} =req.body;
    const user=await User.findOne({username:username});
    const teamName=user.teamName;
    const messages=await Message.find({teamName:teamName}).sort({ createdAt: 1 });
  res.status(200).json(messages);

  }
  catch(error){
    console.error("Error getting messages:", error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
}
export const getPost=async(req,res)=>{
  try{
    const posts= await Post.find({}).sort({ createdAt: 1 });
    res.status(200).json(posts);

  }
  catch(error){
    console.error("Error getting messages:", error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
}
export const createPost=async(req,res)=>{
  try{
    const {username,description,img} =req.body;
    console.log(img);
    if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}
    const posts= new Post({
      username:username,
      description:description,
      img:img,
    });
    posts.save();
    res.status(200).json(posts);

  }
  catch(error){
    console.error("Error getting messages:", error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
}
export const follow = async (req, res) => {
  try {
    const { username, follow } = req.body;

    const user = await User.findOne({ username });
    const follower = await User.findOne({ username: follow });

    if (!user || !follower) {
      return res.status(404).json({ error: "User not found" });
    }
    const isFollowing = user.following.includes(follow);

    if (isFollowing) {
      user.following = user.following.filter(f => f !== follow);
      follower.followers = follower.followers.filter(f => f !== username);

      await user.save();
      await follower.save();

      return res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      user.following.push(follow);
      follower.followers.push(username);

      await user.save();
      await follower.save();

      return res.status(200).json({ message: "Followed successfully" });
    }
  } catch (error) {
    console.error("Error following/unfollowing user:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
};
export const getFollowingPost=async(req,res)=>{
  try{
        const { username,follow} = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const posts = await Post.find({ username: { $in: user.following } }).sort({ createdAt: -1 });

        res.status(200).json(posts);

  }
  catch(error){
    console.error("Error getting messages:", error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
}
export const getAllDevelopers=async(req,res)=>{
  try{
    try {
      const developers = await User.find({});
      res.status(200).json(developers);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }

  }
  catch(error){
    console.error("Error getting messages:", error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
}
export const getAllTeams=async(req,res)=>{
  try{
    try {
      const teams = await Team.find({});
      res.status(200).json(teams);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }

  }
  catch(error){
    console.error("Error getting messages:", error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
}
