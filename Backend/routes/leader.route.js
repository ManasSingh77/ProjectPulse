import express from "express";
import {kickMember,joinMember,promoteMember,demoteMember} from "../controllers/leader.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router=express.Router();

router.post("/kickMember",kickMember);
router.post("/joinMember",joinMember);
router.post("/promoteMember",promoteMember);
router.post("/demoteMember",demoteMember);
export default router;