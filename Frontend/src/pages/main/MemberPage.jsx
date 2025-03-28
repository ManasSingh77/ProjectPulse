import Header from "./../../components/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const MemberPage = () => {
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState(null); 
  const [username, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        setUserName(response.data.username);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (username) {
      const fetchActiveProject = async () => {
        try {
          const response = await axios.post("/api/projects/getSubProject", { username });
          setActiveProject(response.data);
        } catch (error) {
          console.error("Error fetching active project:", error);
        }
      };

      fetchActiveProject();
    }
  }, [username]);

  const handleSubmit = async () => {
    try {
      await axios.post("/api/projects/submit", { username });
      setActiveProject(null);
    } catch (error) {
      console.error("Error submitting project:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="bg-yellow-50 min-h-screen p-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Member Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/message")}
              className="px-4 py-2 bg-yellow-300 text-gray-800 rounded-md hover:bg-yellow-400"
            >
              View Group Chat
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">Current Project</h2>
          {activeProject ? (
            <>
              <p className="text-gray-600 mb-4">
                <strong>Active Project:</strong> {activeProject.name}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Description:</strong> {activeProject.description}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Deadline:</strong> {new Date(activeProject.deadline).toLocaleDateString()}
              </p>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-yellow-300 text-gray-800 rounded-md hover:bg-yellow-400"
              >
                Submit Project
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                No active projects found
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberPage;
