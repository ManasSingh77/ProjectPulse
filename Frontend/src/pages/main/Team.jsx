import React, { useState } from "react";
import Header from "../../components/Header.jsx";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const Developer = () => {
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate=useNavigate();
  const handleSearch = async () => {
    try {
      setError("");
      const response = await axios.post("api/general/searchTeam", {
        teamName: searchInput,
      });
      setUsers(response.data);
    } catch (error) {
      setError("No teams found with this name.");
      setUsers([]);
    }
  };
  const handleClick=(teamName)=>{
    
    navigate(`/team/${teamName}`);
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-start h-screen bg-gradient-to-r from-yellow-50 to-yellow-100 pt-4">
        <div className="w-full max-w-lg px-6 py-3 flex items-center space-x-2">
          <div className="flex items-center flex-grow border border-gray-300 rounded-full p-2">
            <FaSearch className="text-gray-500 mx-2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress} 
              placeholder="Search for developers..."
              className="w-full px-2 py-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-full hover:bg-yellow-700 transition duration-200"
          >
            Search
          </button>
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-3xl font-semibold text-yellow-600 opacity-90">
            Search for teams
          </h1>
          <p className="text-lg text-gray-500 mt-2">
            Find the best team for your project with ease.
          </p>
        </div>

        {error && (
          <div className="mt-4 text-red-600 text-center">
            {error}
          </div>
        )}

        <div className="mt-6 w-full max-w-lg space-y-4">
          {users.map((user, index) => (
            <div className="cursor-pointer" onClick={() => handleClick(user.teamName)}>
            <div
              key={index}
              className="flex flex-col bg-gradient-to-r from-yellow-200 to-yellow-300 shadow-lg rounded-lg p-4"
            >
              <span className="text-xl font-bold text-gray-800 mb-1">
                {user.teamName}
              </span>
              
              <div className="flex justify-between items-center">
                <span className="text-md text-gray-600">
                  Leader: <span className="font-semibold text-gray-800">{user.teamLeader}</span>
                </span>
                <span className="text-md text-gray-600">
                  Members: <span className="font-semibold text-gray-800">{user.teamMember.length}</span>
                </span>
              </div>
            </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Developer;
