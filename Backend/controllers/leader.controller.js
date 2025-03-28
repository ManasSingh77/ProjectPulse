import User from "../models/user.model.js";
import Team from "../models/team.model.js";
export const kickMember= async(req,res)=>{
    try{
        const username=req.body.username;
        const member=req.body.member;
        const team=await Team.findOne({teamLeader:username});
        if(!team){
            return res.status(404).send({ error: 'You are not the leader of the team.' });
        }
        const user=await User.findOne({username:member});
        console.log(user);
        user.teamName="";
        user.roleName="";
        await user.save();
        let members=team.teamMember;
        members=members.filter(item=>item!==member);
        team.teamMember=members;
        await team.save();
        res.status(200).json({ _id: team._id,
            teamName: team.teamName,
            teamLeader: team.teamLeader,
            teamMember: team.teamMember,});
    }
    catch{
        console.log("Error in kickMember controller");
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const joinMember= async(req,res)=>{
    try{
        const username=req.body.username;
        const member=req.body.member;
        const user= await User.findOne({username:member});
        if(user.teamName!=""){
            return res.status(404).send({ error: 'User is already in the team' });
        }
        const leader= await User.findOne({username:username});
        if(!user){
            return res.status(404).send({ error: 'User not found' });
        }
        const team=await Team.findOne({teamLeader: username });
        if(!team){
            return res.status(404).send({ error: 'Team not found' });
        }
        if(team.teamMember.length>=5){
            return res.status(404).send({ error: 'Team is already full' });
        }
        user.teamName=leader.teamName;
        user.roleName="member";
        await user.save();
        team.teamMember.push(member);
        await team.save();
        res.status(400).json({ _id: team._id,
            teamName: team.teamName,
            teamLeader: team.teamLeader,
            teamMember: team.teamMember,});
    }
    catch{
        console.log("Error in joinMember controller");
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const promoteMember=async(req,res)=>{
    try{
        const username=req.body.username;
        const membername=req.body.membername;
        const user=await User.findOne({username:username});
        if(!user){
            return res.status(404).send({ error: 'User not found' });
        }
        const team=await Team.findOne({teamLeader:username});
        if(!team){
            return res.status(404).send({ error: 'You are not the leader' });
        }
        const member=await User.findOne({username:membername});
        if(!member){
            return res.status(404).send({ error: 'Member not found' });
        }
        if(member.roleName=="co-leader" || username==membername){
            return res.status(404).send({ error: 'Co-leader cannot be promoted' });
        }
        member.roleName="co-leader";
        await member.save();
        res.status(400).json({ _id: team._id,
            teamName: team.teamName,
            teamLeader: team.teamLeader,
            teamMember: team.teamMember,});
    }
    catch{
        console.log("Error in promoteMember controller");
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const demoteMember=async(req,res)=>{
    try{
        const username=req.body.username;
        const membername=req.body.membername;
        const user=await User.findOne({username:username});
        if(!user){
            return res.status(404).send({ error: 'User not found' });
        }
        const team=await Team.findOne({teamLeader:username});
        if(!team){
            return res.status(404).send({ error: 'You are not the leader' });
        }
        const member=await User.findOne({username:membername});
        if(!member){
            return res.status(404).send({ error: 'Member not found' });
        }
        if(member.roleName=="member" || username==membername){
            return res.status(404).send({ error: 'member cannot be demoted' });
        }
        member.roleName="member";
        await member.save();
        res.status(400).json({ _id: team._id,
            teamName: team.teamName,
            teamLeader: team.teamLeader,
            teamMember: team.teamMember,});
    }
    catch{
        console.log("Error in demoteMember controller");
        res.status(500).json({ error: "Internal Server Error" });
    }
}