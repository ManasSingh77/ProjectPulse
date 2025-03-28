import mongoose from "mongoose";
const subProjectSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date },
    assignTo: {type:String},
    status:{type:String,default:"Active"}
  });
  
const SubProject= mongoose.model('SubProject', subProjectSchema);
export default SubProject;
  