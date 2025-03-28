import React, { useState } from "react";
import Header from "../../components/Header.jsx";
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const Developer = () => {
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      setError("");
      const response = await axios.post("api/general/searchDeveloper", {
        username: searchInput,
      });
      setUsers(response.data);
    } catch (error) {
      setError("No users found with this name.");
      setUsers([]);
    }
  };

  const profile = (UserName) => {
    navigate(`/profile/${UserName}`);
  };

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
            Search for developers
          </h1>
          <p className="text-lg text-gray-500 mt-2">
            Find the best developers for your project with ease.
          </p>
        </div>

        {error && (
          <div className="mt-4 text-red-600 text-center">
            {error}
          </div>
        )}

        <div className="mt-6 w-full max-w-lg space-y-4">
          {users.map((user, index) => (
            <div
              onClick={() => profile(user.username)}
              key={index}
              className="flex items-center bg-gradient-to-r from-yellow-200 to-yellow-300 shadow-lg rounded-lg p-4 cursor-pointer"
            >
              <img
                src={user.profileImg || "https://via.placeholder.com/50"}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-yellow-400 mr-4"
              />
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-800">
                  {user.fullName}
                </span>
                <span className="text-sm text-gray-600">@{user.username}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Developer;
