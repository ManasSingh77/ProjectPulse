import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./../../components/Header";
import axios from "axios";

const CreateTeam = () => {
  const [username, setUsername] = useState("");
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleCreateTeam = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/team/createTeam", {
        username,
        teamName,
        description,
      });
      console.log(response);
      if (response.data.success) {
        navigate("/home"); 
      }
      else{
        response.data.error;
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-r from-yellow-50 to-yellow-100 pt-10">
        <h1 className="text-3xl font-bold text-yellow-600 mb-10">Create a New Team</h1>

        <div className="w-full max-w-lg bg-yellow-100 rounded-lg shadow-lg p-8">
          <form onSubmit={handleCreateTeam}>
            <label className="block text-yellow-700 text-lg font-semibold mb-2" htmlFor="teamName">
              Team Name
            </label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-2 mb-6 border border-yellow-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter team name"
              required
            />

            <label className="block text-yellow-700 text-lg font-semibold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 mb-6 border border-yellow-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
              rows="4"
              placeholder="Enter a brief description of your team"
              required
            ></textarea>

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-yellow-600 text-white font-semibold rounded-full hover:bg-yellow-700 transition duration-200"
              disabled={!username} 
            >
              Create Team
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateTeam;
