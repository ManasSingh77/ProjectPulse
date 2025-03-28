import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios";
import toast from "react-hot-toast";

const TeamPage = () => {
  const { teamName } = useParams();
  const [teamDetails, setTeamDetails] = useState(null);
  const [error, setError] = useState("");
  const [username, setUserName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [isMember, setIsMember] = useState(false);
  const navigate = useNavigate();

  const leaveTeam = async () => {
    try {
      await axios.post("/api/team/leftTeam", { username });
      toast.success("Left the team.");
      window.location.href = "/home";
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong.");
    }
  };

  const joinTeam = async () => {
    try {
      await axios.post("/api/team/joinTeam", { username, teamName });
      toast.success("Joined the team.");
      window.location.href = "/home";
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong.");
    }
  };

  const kickMember = async (member) => {
    try {
      await axios.post("/api/leader/kickMember", { username, member });
      toast.success(`${member} has been removed.`);
      setTeamDetails((prev) => ({
        ...prev,
        teamMember: prev.teamMember.filter((m) => m !== member),
      }));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to remove member.");
    }
  };

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await axios.post("/api/team/getTeam", { teamName });
        setTeamDetails(response.data);

        const user = await axios.get("/api/auth/me");
        setUserName(user.data.username);
        setRoleName(user.data.roleName);

        setIsMember(user.data.teamName === teamName);
        setError("");
      } catch (err) {
        setError("Failed to load team details.");
      }
    };

    fetchTeamDetails();
  }, [teamName]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 flex flex-col items-center py-12">
        {error && <div className="text-red-600 font-semibold">{error}</div>}

        {teamDetails ? (
          <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-8 border border-yellow-300">
            <h1 className="text-4xl font-extrabold text-yellow-700 text-center uppercase tracking-wide mb-6">
              {teamDetails.teamName}
            </h1>

            <p className="text-lg text-gray-700 text-center mb-6 italic">
              {teamDetails.description}
            </p>

            {/* Join / Leave Button */}
            <div className="flex justify-center mb-6">
              {isMember ? (
                <button
                  onClick={leaveTeam}
                  className="px-6 py-3 bg-red-600 text-white font-bold rounded-full shadow-md hover:bg-red-700 transition duration-300 transform hover:scale-105"
                >
                  Leave Team
                </button>
              ) : (
                <button
                  onClick={joinTeam}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-full shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105"
                >
                  Join Team
                </button>
              )}
            </div>

            {/* Team Members List */}
            <h2 className="text-2xl font-semibold text-yellow-700 mb-4 text-center border-b-2 border-yellow-400 pb-2">
              Team Members
            </h2>
            <ul className="space-y-4">
              {teamDetails.teamMember.map((member, index) => (
                <li
                  key={index}
                  className="bg-yellow-100 text-gray-900 rounded-lg shadow p-4 flex justify-between items-center border border-yellow-300 transition duration-300 hover:bg-yellow-200 hover:shadow-md"
                >
                  <div className="flex items-center">
                    <span className="text-yellow-700 font-bold text-lg mr-4">
                      #{index + 1}
                    </span>
                    <span
                      onClick={() => navigate(`/profile/${member}`)}
                      className="font-medium text-lg cursor-pointer hover:text-yellow-600 transition duration-300"
                    >
                      {member}
                    </span>
                  </div>

                  {/* Show Kick button if the logged-in user is the Leader */}
                  {roleName === "Leader" && member !== username && (
                    <button
                      onClick={() => kickMember(member)}
                      className="px-4 py-2 bg-red-500 text-white font-bold rounded-full shadow-md hover:bg-red-600 transition duration-300"
                    >
                      Kick
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          !error && <div className="text-gray-600 text-lg">Loading team details...</div>
        )}
      </div>
    </>
  );
};

export default TeamPage;