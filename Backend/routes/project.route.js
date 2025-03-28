import express from "express";
import {createProject,getActiveProject,createSubProject,getProject,deleteSubProject,getSubProject,submit} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/createProject", createProject);
router.post("/active", getActiveProject);
router.post("/createSubProject",createSubProject);
router.post('/getProject',getProject);
router.delete('/deleteSubProject/:id',deleteSubProject);
router.post('/getSubProject',getSubProject);
router.post('/submit',submit);
export default router;