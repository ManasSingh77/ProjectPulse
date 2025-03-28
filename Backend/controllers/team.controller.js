import User from "../models/user.model.js";
import Team from "../models/team.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
export const createTeam=async(req,res)=>{
    try{
    const username=req.body.username;
    const teamName=req.body.teamName;
    const description=req.body.description;
    const user=await User.findOne(
        { username:username},
    );
    if (!user) {
        return res.status(404).send({ error: 'User not found' });
    }
    if(user.teamName!==""){
        return res.status(404).send({ error: 'You are already in the team' });
    }
    const team=await Team.findOne(
        { teamName:teamName},
    );
    if(team){
        return res.status(400).json({ success:false, error: 'Team Name is already taken' });
    }
    user.teamName=teamName;
    user.roleName="leader";
    await user.save();
    console.log("user updates");
    const newTeam=new Team(
        {teamName: teamName,
        teamLeader: username,
        description:description,
        teamMember:[username]}
    );
    console.log("team Created");
    if(newTeam){
        console.log("team unsaved");
    await newTeam.save();
    console.log("team saved");
    res.status(200).json({ success:true, _id: newTeam._id,
        teamName: newTeam.teamName,
        teamLeader: newTeam.teamLeader,
        teamMember: newTeam.teamMember,});
    }
    else{
        res.status(400).json({ error: "Team cannot be created" });
    }
    }
    catch{
        console.log("Error in createTeam controller");
		res.status(500).json({ success:false, error: "Internal Server Error" });
    }
    
}
export const joinTeam=async(req,res)=>{
    try{
        const username=req.body.username;
        const teamName=req.body.teamName;
        const user=await User.findOne(
            { username:username},
        );
        if(user.teamName==teamName){
            return res.status(404).send({ error: 'You are already in this team' })
        }
        if(user.teamName!==""){
            return res.status(404).send({ error: 'You are already in the team' });
        }
        console.log("user updates");
        const team=await Team.findOne(
            {teamName:teamName}
        );
        if(!team){
            return res.status(404).send({ error: 'Team not found' });
        }
        if(team.teamMember.length>=5){
            return res.status(404).send({ error: 'The team is already full' });
        }
        team.teamMember.push(username);
        await team.save();
        console.log("team saved");
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        user.teamName=teamName;
        user.roleName="member";
        await user.save();
        res.status(200).json({ _id: team._id,
            teamName: team.teamName,
            teamLeader: team.teamLeader,
            teamMember: team.teamMember,});
        }
        catch{
            console.log("Error in joinTeam controller");
            res.status(500).json({ error: "Internal Server Error" });
        }
}
export const leftTeam=async(req,res)=>{
    try{
        const username=req.body.username;
        const user= await User.findOne({username:username});
        if(!user){
            return res.status(404).send({ error: 'User not found' })
        }
        const teamName= user.teamName;
        if(teamName===""){
            return res.status(404).send({ error: 'You are not in the team' })
        }
        const team= await Team.findOne({teamName:teamName});
        if(username===team.teamLeader){
            return res.status(404).send({ error: 'Leader cannot leave the team' })
        }
        user.teamName="";
        user.roleName="";
        await user.save();
        if(!teamName){
            return res.status(404).send({ error: 'Team not found' })
        }
        let members=team.teamMember;
        members=members.filter(item=>item!==username);
        team.teamMember=members;
        await team.save();
        res.status(200).json({ _id: team._id,
            teamName: team.teamName,
            teamLeader: team.teamLeader,
            teamMember: team.teamMember,});
    }
    catch{
        console.log("Error in leftTeam controller");
            res.status(500).json({ error: "Internal Server Error" });
    }
}
export const updateUser=async(req,res)=>{
    try{
        const username=req.body.username;
        const {fullName,bio,linkedInName,linkedInURL,GitHubName,GitHubURL,xName,xUrl }=req.body;
        const user=await User.findOne({username:username});
        console.log(bio);
        if(!user){
            return res.status(404).send({ error: 'User not found' });
        }
        user.fullName=fullName || user.fullName;
        user.bio = bio || user.bio;
        user.linkedInURL = linkedInURL || user.linkedInURL;
        user.GithubURL = GitHubURL || user.GithubURL;
        user.XURL = xUrl || user.XURL;
        console.log(user);
        await user.save();
        user.password=null;
        return res.status(200).json(user);
    }
    catch{
        console.log("Error in updateUser controller");
		res.status(500).json({ error: "Internal Server Error" });
    }
}
export const getTeam=async(req,res)=>{
    try{
        const teamName=req.body.teamName;
        const team=await Team.findOne({teamName:teamName});
        if(!team){
            return res.status(400).send({error:'Team not found'});
        }
        return res.status(200).json(team);
    }
    catch{
        console.log("Error in getTeam controller");
		res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateProfileImage = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Remove existing profile image if exists
    if (user.profileImgId) {
      await cloudinary.uploader.destroy(user.profileImgId);
    }

    // Ensure file is provided
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No image file provided" });

    // Convert file buffer to base64 data URI
    const base64Str = file.buffer.toString("base64");
    const dataUri = `data:${file.mimetype};base64,${base64Str}`;

    const uploadedResponse = await cloudinary.uploader.upload(dataUri);
    user.profileImg = uploadedResponse.secure_url;
    user.profileImgId = uploadedResponse.public_id;
    await user.save();
    res.status(200).json({ profileImg: user.profileImg });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ error: "Failed to update profile image" });
  }
};

export const updateCoverImage = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Remove existing cover image if exists
    if (user.coverImgId) {
      await cloudinary.uploader.destroy(user.coverImgId);
    }

    // Ensure file is provided
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No image file provided" });

    const base64Str = file.buffer.toString("base64");
    const dataUri = `data:${file.mimetype};base64,${base64Str}`;

    const uploadedResponse = await cloudinary.uploader.upload(dataUri);
    user.coverImg = uploadedResponse.secure_url;
    user.coverImgId = uploadedResponse.public_id;
    await user.save();
    res.status(200).json({ coverImg: user.coverImg });
  } catch (error) {
    console.error("Error updating cover image:", error);
    res.status(500).json({ error: "Failed to update cover image" });
  }
};
export const removeProfileImage = async (req, res) => {
    try {
      const { username } = req.body;
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ error: "User not found" });
  
      // Remove existing profile image from Cloudinary if it exists
      if (user.profileImgId) {
        await cloudinary.uploader.destroy(user.profileImgId);
      }
      
      // Clear the profile image fields
      user.profileImg = "";
      user.profileImgId = "";
      await user.save();
  
      res.status(200).json({ profileImg: user.profileImg });
    } catch (error) {
      console.error("Error removing profile image:", error);
      res.status(500).json({ error: "Failed to remove profile image" });
    }
  };
  
  export const removeCoverImage = async (req, res) => {
    try {
      const { username } = req.body;
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ error: "User not found" });
  
      // Remove existing cover image from Cloudinary if it exists
      if (user.coverImgId) {
        await cloudinary.uploader.destroy(user.coverImgId);
      }
      
      // Clear the cover image fields
      user.coverImg = "";
      user.coverImgId = "";
      await user.save();
  
      res.status(200).json({ coverImg: user.coverImg });
    } catch (error) {
      console.error("Error removing cover image:", error);
      res.status(500).json({ error: "Failed to remove cover image" });
    }
  };
