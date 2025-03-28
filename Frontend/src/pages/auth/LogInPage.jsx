import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

const LogInPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      toast.success("Logged in successfully");
      window.location.href = "/home";
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border-4 border-yellow-500">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-600">Project Pulse</h1>
          <p className="text-yellow-500 mt-2">Empowering your productivity</p>
        </div>
        <h2 className="text-2xl font-semibold text-yellow-600 mb-6 text-center">
          Log In
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-yellow-600 font-semibold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              required
              className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200 ease-in-out"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-yellow-600 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200 ease-in-out"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold transition duration-200 hover:bg-yellow-600 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
          {error && (
            <p className="text-red-500 mt-4 text-center font-semibold">
              {error}
            </p>
          )}
        </form>
        <div className="mt-4 text-center">
          <p className="text-yellow-600">
            New here?{" "}
            <Link
              to="/SignUpPage"
              className="text-yellow-800 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;