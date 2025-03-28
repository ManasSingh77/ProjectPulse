import mongoose from "mongoose";
const teamSchema=new mongoose.Schema(
    {
        teamName: {
            type: String,
            required: true,
            unique: true,
        },
        description:{
            type: String,
        },
        teamLeader: {
            type: String,
            required: true,
        },
        teamMember :{
            type:[String],
        },
    },
);
const Team =mongoose.model("Team",teamSchema);
export default Team;