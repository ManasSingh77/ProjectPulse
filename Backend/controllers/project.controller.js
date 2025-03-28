import User from "../models/user.model.js";
import Team from "../models/team.model.js";
import Project from "../models/project.model.js";
import SubProject from "../models/subProject.model.js";


export const getActiveProject = async (req, res) => {
    try {
      const { leader } = req.body;
      const activeProject = await Project.findOne({ leader, status: "Active" });
  
      if (!activeProject) {
        return res.status(404).json({ message: "No active project found." });
      }
  
      res.status(200).json({ project: activeProject });
    } catch (error) {
      console.error("Error fetching active project:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };

  export const createProject = async (req, res) => {
    try {
      const { username,name, description } = req.body;

      const existingProject = await Project.findOne({ leader: username, status: "Active" });
  
      if (existingProject) {
        return res.status(400).json({ message: "A project is already active. End it before starting a new one." });
      }
  
      const newProject = new Project({
        name,
        description,
        leader: username,
        status: "Active", 
      });
  
      await newProject.save();
  
      res.status(201).json({ message: "Project created successfully", project: newProject });
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  export const createSubProject = async (req, res) => {
    try {
      const { username,name, description,deadline,assignTo } = req.body;
      const user=await User.findOne({username:assignTo});
      if (!user) {
        return res.status(400).json({ message: "Username does not exist" });
      }
      if(user.projectStatus!=="Not Working"){
        return res.status(400).json({ message: "User is already working on a sub-project" });
      }
      const newProject = new SubProject({
        username,
        name,
        description,
        deadline,
        assignTo,
      });
      user.projectStatus="Working";
      await newProject.save();
      await user.save();

  
      res.status(201).json({ message: "Sub-Project created successfully", project: newProject });
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  export const getProject = async (req, res) => {
    try {
      const { username} = req.body;
      const project=await SubProject.find({username});
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  export const deleteSubProject = async (req, res) => {
    try {
      const {id} = req.params;
      console.log(id);
      const projects=await SubProject.findById(id);
      const username=projects.assignTo;
      const user=await User.findOne({username:username});
      user.projectStatus="Not Working";
      await user.save();
      const project=await SubProject.findByIdAndDelete(id);
      console.log(project);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  export const getSubProject = async (req, res) => {
    try {
      const { username} = req.body;
      const project=await SubProject.findOne({assignTo:username,status:"Active"});
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  export const submit = async (req, res) => {
    try {
      const { username} = req.body;
      const project=await SubProject.findOne({assignTo:username});
      if (!project) {
        return res.status(404).json({ message: "Sub-project not found" });
      }
      project.status="completed";
      console.log(project.status);
      await project.save();
      const user=await User.findOne({username:username});
      user.projectStatus="Not Working";
      await user.save();
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

