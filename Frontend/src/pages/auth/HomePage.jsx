import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-7xl px-6 py-12 text-center">
        <h1 className="text-6xl font-bold text-white mb-4">Welcome to Project Pulse</h1>
        <p className="text-xl text-white mb-8">
          Empowering your productivity and enhancing collaboration with a seamless remote project tracker.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Sign Up Box */}
          <div className="bg-white p-10 rounded-2xl shadow-lg border-4 border-yellow-500 w-full max-w-md mx-auto">
            <h2 className="text-3xl font-semibold text-yellow-600 mb-4">Get Started with Project Pulse</h2>
            <p className="text-lg text-gray-600 mb-6">
              Join the platform and start tracking your remote team's productivity in no time.
            </p>
            <Link to="/signUpPage" className="w-full inline-block bg-yellow-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition duration-300">
              Sign Up
            </Link>
          </div>

          {/* Log In Box */}
          <div className="bg-white p-10 rounded-2xl shadow-lg border-4 border-yellow-500 w-full max-w-md mx-auto">
            <h2 className="text-3xl font-semibold text-yellow-600 mb-12">Already a Member?</h2>
            <p className="text-lg text-gray-600 mb-6">
              Log in to access your dashboard and continue boosting your team's productivity.
            </p>
            <Link to="/logInPage" className="w-full inline-block bg-yellow-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition duration-300">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;