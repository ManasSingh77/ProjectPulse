import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectMongoDB from "./config/connectMongoDB.js";

import authRoutes from "./routes/auth.route.js";
import teamRoutes from "./routes/team.route.js";
import leaderRoutes from "./routes/leader.route.js";
import projectRoutes from "./routes/project.route.js";
import generalRoutes from "./routes/general.route.js";
import postRoutes from "./routes/post.route.js";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true })); 

app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/team",teamRoutes);
app.use("/api/leader",leaderRoutes);
app.use("/api/projects",projectRoutes);
app.use("/api/general",generalRoutes);
app.use("/api/post",postRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/Frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
});