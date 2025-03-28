import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Header from "./../../components/Header";
import axios from "axios";
const EditProfilePage = () => {
    const navigate=useNavigate();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [linkedInName, setLinkedinName] = useState("");
  const [linkedInUrl, setLinkedinUrl] = useState("");
  const [xName, setXName] = useState("");
  const [xUrl, setXUrl] = useState("");
  const [gitHubName, setGithubName] = useState("");
  const [gitHubUrl, setGithubUrl] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        setUsername(response.data.username); 
      } catch (error) {
        setError("Failed to fetch user details. Please log in again.");
      }
    };

    fetchUser();
  }, []);
  const handleSubmit= async(e)=>{
    e.preventDefault();
    try{
    const edit=await axios.post('/api/team/updateUser', {
        username,
        fullName,
        bio,
        linkedInUrl,
        xUrl,
        gitHubUrl,
      });
      console.log(edit);
      if(edit){
        navigate(`/profile/${username}`);
      }
    }
    catch{
        console.log("There is an error");
    }

  }
  return (
    <>
      <Header />
      <div className="min-h-screen bg-yellow-50 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold text-yellow-600 mb-4 text-center">Edit Profile</h2>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-yellow-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border-2 border-yellow-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your full name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bio" className="block text-yellow-700 font-medium mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border-2 border-yellow-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Write a short bio"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="linkedinUrl" className="block text-yellow-700 font-medium mb-2">
              LinkedIn URL
            </label>
            <input
              type="text"
              id="linkedinUrl"
              value={linkedInUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full border-2 border-yellow-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your LinkedIn URL"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="xUrl" className="block text-yellow-700 font-medium mb-2">
              X URL
            </label>
            <input
              type="text"
              id="xUrl"
              value={xUrl}
              onChange={(e) => setXUrl(e.target.value)}
              className="w-full border-2 border-yellow-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your X URL"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="githubUrl" className="block text-yellow-700 font-medium mb-2">
              GitHub URL
            </label>
            <input
              type="text"
              id="githubUrl"
              value={gitHubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full border-2 border-yellow-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your GitHub URL"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProfilePage;