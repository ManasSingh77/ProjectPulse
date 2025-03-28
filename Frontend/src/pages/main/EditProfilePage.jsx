import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./../../components/Header";
import axios from "axios";

const EditProfilePage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [bio, setBio] = useState("");
    const [linkedInUrl, setLinkedinUrl] = useState("");
    const [xUrl, setXUrl] = useState("");
    const [gitHubUrl, setGithubUrl] = useState("");
    const [specialities, setSpecialities] = useState([]);
    const [newSpeciality, setNewSpeciality] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("/api/auth/me");
                setUsername(response.data.username);
                setFullName(response.data.fullName);
                setBio(response.data.bio);
                setLinkedinUrl(response.data.linkedInURL);
                setXUrl(response.data.XURL);
                setGithubUrl(response.data.GithubURL);
                setSpecialities(response.data.specialities || []);
            } catch (error) {
                console.error("Failed to fetch user details.");
            }
        };

        fetchUser();
    }, []);

    const handleAddSpeciality = () => {
        if (newSpeciality && specialities.length < 5) {
            setSpecialities([...specialities, newSpeciality]);
            setNewSpeciality(""); // Clear input
        }
    };

    const handleRemoveSpeciality = (index) => {
        const updatedSpecialities = [...specialities];
        updatedSpecialities.splice(index, 1);
        setSpecialities(updatedSpecialities);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const edit = await axios.post("/api/team/updateUser", {
                username,
                fullName,
                bio,
                linkedInUrl,
                xUrl,
                gitHubUrl,
                specialities,
            });

            if (edit) {
                navigate(`/profile/${username}`);
            }
        } catch {
            console.log("There is an error");
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-yellow-50 flex justify-center items-center">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-bold text-yellow-600 mb-4 text-center">Edit Profile</h2>

                    {/* Full Name */}
                    <div className="mb-4">
                        <label className="block text-yellow-700 font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full border-2 border-yellow-300 rounded-lg px-3 py-2"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Bio */}
                    <div className="mb-4">
                        <label className="block text-yellow-700 font-medium mb-2">Bio</label>
                        <textarea
                            rows="3"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full border-2 border-yellow-300 rounded-lg px-3 py-2"
                            placeholder="Write a short bio"
                        ></textarea>
                    </div>

                    {/* LinkedIn URL */}
                    <div className="mb-4">
                        <label className="block text-yellow-700 font-medium mb-2">LinkedIn URL</label>
                        <input
                            type="text"
                            value={linkedInUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                            className="w-full border-2 border-yellow-300 rounded-lg px-3 py-2"
                            placeholder="Enter your LinkedIn URL"
                        />
                    </div>

                    {/* X (Twitter) URL */}
                    <div className="mb-4">
                        <label className="block text-yellow-700 font-medium mb-2">X URL</label>
                        <input
                            type="text"
                            value={xUrl}
                            onChange={(e) => setXUrl(e.target.value)}
                            className="w-full border-2 border-yellow-300 rounded-lg px-3 py-2"
                            placeholder="Enter your X URL"
                        />
                    </div>

                    {/* GitHub URL */}
                    <div className="mb-4">
                        <label className="block text-yellow-700 font-medium mb-2">GitHub URL</label>
                        <input
                            type="text"
                            value={gitHubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            className="w-full border-2 border-yellow-300 rounded-lg px-3 py-2"
                            placeholder="Enter your GitHub URL"
                        />
                    </div>

                    {/* Specialities */}
                    <div className="mb-4">
                        <label className="block text-yellow-700 font-medium mb-2">Specialities (Max 5)</label>
                        <div className="flex">
                            <input
                                type="text"
                                value={newSpeciality}
                                onChange={(e) => setNewSpeciality(e.target.value)}
                                className="flex-grow border-2 border-yellow-300 rounded-lg px-3 py-2"
                                placeholder="Add a speciality"
                            />
                            <button
                                type="button"
                                onClick={handleAddSpeciality}
                                className="ml-2 bg-yellow-500 text-white px-3 py-2 rounded-lg"
                                disabled={specialities.length >= 5}
                            >
                                Add
                            </button>
                        </div>
                        <div className="mt-2">
                            {specialities.map((spec, index) => (
                                <span
                                    key={index}
                                    className="bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full inline-flex items-center m-1"
                                >
                                    {spec}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSpeciality(index)}
                                        className="ml-2 text-red-600"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600">
                        Save
                    </button>
                </form>
            </div>
        </>
    );
};

export default EditProfilePage;
