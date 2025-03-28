import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";

const MainPage = () => {
  const [activeProject, setActiveProject] = useState(null);
  const [subProjects, setSubProjects] = useState([]);
  const [username, setUserName] = useState("");
  const navigate = useNavigate();

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
    const fetchActiveProject = async () => {
      if (!username) return;
      try {
        const response = await axios.post("/api/projects/active", { leader: username });
        setActiveProject(response.data.project);

        const subProjectsResponse = await axios.post("/api/projects/getProject", { username });
        setSubProjects(subProjectsResponse.data || []);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchActiveProject();
  }, [username]);

  const handleDeleteSubProject = async (subProjectId) => {
    try {
      console.log(subProjectId);
      await axios.delete(`/api/projects/deleteSubProject/${subProjectId}`);
      setSubProjects((prev) => prev.filter((sp) => sp._id !== subProjectId));
    } catch (error) {
      console.error("Error deleting sub-project:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-red-500";
      case "pending approval":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <Header />
      <div className="bg-yellow-50 min-h-screen p-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Leader Dashboard</h1>
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
                Active Project: <strong>{activeProject.name}</strong>
              </p>
              <button
                onClick={() => navigate("/startSubProject")}
                className="px-4 py-2 bg-yellow-300 text-gray-800 rounded-md hover:bg-yellow-400"
              >
                Create Sub-Project
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-4">No active projects found. Start a new project!</p>
              <button
                onClick={() => navigate("/startProject")}
                className="px-4 py-2 bg-yellow-300 text-gray-800 rounded-md hover:bg-yellow-400"
              >
                Start New Project
              </button>
            </>
          )}
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Sub-Projects</h2>
          {subProjects.length > 0 ? (
            <div className="space-y-4">
              {subProjects.map((subProject) => (
                <div
                  key={subProject._id}
                  className="p-4 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{subProject.name}</h3>
                    <p className="text-sm text-gray-600">
                      Assigned To: <strong>{subProject.assignTo}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      Deadline: <strong>{new Date(subProject.deadline).toLocaleDateString()}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className={`px-4 py-2 text-white rounded-md flex items-center justify-center ${getStatusColor(
                        subProject.status
                      )}`}
                    >
                      {subProject.status}
                    </div>
                    <button
                      onClick={() => handleDeleteSubProject(subProject._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No sub-projects found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default MainPage;
