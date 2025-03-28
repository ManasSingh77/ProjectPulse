import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../../components/Header";

const CreateSubProjectPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user details.");
      }
    };

    fetch();
  }, []);

  const handleCreateSubProject = async () => {
    if (!name || !description || !deadline || !assignTo) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("/api/projects/createSubProject", {
        username,
        name,
        description,
        deadline,
        assignTo,
      });

      if (response) {
        toast.success("Sub-Project created successfully!");
        window.location.href = "/home";
      } else {
        toast.error("Failed to create sub-project. Please try again.");
      }
    } catch (err) {
      console.error("Error creating sub-project:", err);
      toast.error(err.response.data.message);
    }
  };

  return (
    <>
      <Header />
      <div className="bg-yellow-50 min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white shadow-md p-6 rounded-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Create a Sub-Project</h1>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700">Sub-Project Name</label>
              <input
                type="text"
                className="w-full border rounded-md p-2 focus:ring-yellow-300 focus:border-yellow-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700">Description</label>
              <textarea
                className="w-full border rounded-md p-2 focus:ring-yellow-300 focus:border-yellow-300"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700">Deadline</label>
              <input
                type="date"
                className="w-full border rounded-md p-2 focus:ring-yellow-300 focus:border-yellow-300"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700">Assign To (Username)</label>
              <input
                type="text"
                className="w-full border rounded-md p-2 focus:ring-yellow-300 focus:border-yellow-300"
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={handleCreateSubProject}
              className="w-full py-2 rounded-md bg-yellow-300 hover:bg-yellow-400 focus:ring-4 focus:ring-yellow-200"
            >
              Create Sub-Project
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateSubProjectPage;