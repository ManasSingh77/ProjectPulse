import mongoose from "mongoose";
const notificationSchema=new mongoose.Schema(
    {
        username:{
            type:String,
        },
        sender:{
            type:String,
        },
        teamName:{
            type:String,
        },

    },
);

const Notification=mongoose.model("Notification",notificationSchema);
export default Notification;