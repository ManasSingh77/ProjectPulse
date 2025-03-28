import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Active', 'Completed'], default: 'Active' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  subProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubProject' }],
  leader: { type: String, ref: 'User', required: true },
});

const Project= mongoose.model('Project', projectSchema);
export default Project;