import Header from "./../../components/Header";
import { useNavigate } from "react-router-dom";

const New = () => {
  const navigate = useNavigate(); 

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-r from-yellow-50 to-yellow-100">
        <Header /> 

        <div className="flex flex-col items-center justify-start pt-10">
          <h1 className="text-3xl font-bold text-yellow-600 mb-10">Choose Your Team Option</h1>
          
          <div className="flex flex-col md:flex-row gap-10 w-full max-w-5xl px-8">
            
            <div className="flex flex-col items-center bg-yellow-100 rounded-lg shadow-lg p-8 w-full md:w-1/2 h-[80vh]">
              <h2 className="text-3xl font-semibold text-yellow-700 mb-6">Create a Team</h2>
              <p className="text-gray-600 text-center mb-10 text-lg">
                Start your journey by creating a new team. You can gather talented members and work together on exciting projects.
              </p>
              <button 
                onClick={() => navigate("/CreateTeam")} 
                className="mt-auto px-6 py-3 bg-yellow-600 text-white font-semibold rounded-full hover:bg-yellow-700 transition duration-200"
              >
                Create Team
              </button>
            </div>
            
            <div className="flex flex-col items-center bg-yellow-100 rounded-lg shadow-lg p-8 w-full md:w-1/2 h-[80vh]">
              <h2 className="text-3xl font-semibold text-yellow-700 mb-6">Join a Team</h2>
              <p className="text-gray-600 text-center mb-10 text-lg">
                Looking to join an existing team? Browse through available teams and find the perfect fit for your skills and interests.
              </p>
              <button 
                onClick={() => navigate("/Team")} 
                className="mt-auto px-6 py-3 bg-yellow-600 text-white font-semibold rounded-full hover:bg-yellow-700 transition duration-200"
              >
                Join Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default New;