import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		fullName: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minLength: 6,
		},
		bio: {
			type: String,
		},
		profileImg: {
			type: String,
			default: "",
		},
		coverImg: {
			type: String,
			default: "",
		},
		teamName: {
			type: String,
			default: "",
		},
		roleName: {
			type: String,
			default: "",
		},
		projectStatus: {
			type: String,
			default: "Not Working",
		},
		linkedInURL: {
			type: String,
		},
		GithubURL: {
			type: String,
		},
		XURL: {
			type: String,
		},
		assignedSubProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubProject' }],
		followers: [{
			type: String,
			default: [],
		}],
		following: [{
			type: String,
			default: [],
		}],
		specialties: {
			type: [String],
			validate: [arrayLimit, 'You can select up to 5 specialties.'],
		},
	},
	{ timestamps: true }
);

function arrayLimit(val) {
	return val.length <= 5;
}

const User = mongoose.model("User", userSchema);

export default User;
