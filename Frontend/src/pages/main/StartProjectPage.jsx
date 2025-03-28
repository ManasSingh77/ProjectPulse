import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";

const StartProjectPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username,setUserName]=useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        setUserName(response.data.username);
      } catch (error) {
        console.error("Error fetching active project:", error);
      }
    };  

    fetch();
  }, []);
  const handleStartProject = async () => {
    if (!name || !description) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("/api/projects/createProject", { username, name, description });

      if (response.status === 201) {
        window.location.href = "/home";
      } else {
        setError("Failed to create project. Please try again.");
      }
    } catch (err) {
      console.error("Error starting project:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="bg-yellow-50 min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white shadow-md p-6 rounded-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Start a New Project</h1>
          <form className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <div>
              <label className="block text-gray-700">Project Name</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-gray-700">Description</label>
              <textarea
                className="w-full border rounded-md p-2"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              type="button"
              onClick={handleStartProject}
              className={`w-full py-2 rounded-md ${loading ? "bg-gray-300" : "bg-yellow-300 hover:bg-yellow-400"} `}
              disabled={loading}
            >
              {loading ? "Starting..." : "Start Project"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default StartProjectPage;