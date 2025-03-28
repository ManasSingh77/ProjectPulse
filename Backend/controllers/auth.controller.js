import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
export const signup = async (req, res) => {
	try {
		const { fullName, username, password } = req.body;
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: "Username is already taken" });
		}
		if (password.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters long" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			fullName,
			username,
			password: hashedPassword,
		});
		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				profileImg: newUser.profileImg,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const login= async (req, res) => {
	try {
		const {username, password } = req.body;
		const existingUser = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, existingUser?.password || "");
		if (!existingUser) {
			return res.status(400).json({ error: "User is not registered" });
		}
		if(!isPasswordCorrect){
			return res.status(400).json({ error: "Incorrect Password" });
		}
		  generateTokenAndSetCookie(existingUser._id, res);
		res.status(201).json({
			_id: existingUser._id,
			fullName: existingUser.fullName,
			username: existingUser.username,
			profileImg: existingUser.profileImg,
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
export const logout= async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
export const get = async (req, res) => {
	try {
		const username=req.body.username;
		const user = await User.find({username:username});
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};