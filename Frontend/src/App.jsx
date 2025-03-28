import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/auth/HomePage";
import SignUpPage from "./pages/auth/SignUpPage";
import LogInPage from "./pages/auth/LogInPage";
import MainPage from "./pages/main/MainPage";
import ProfilePage from "./pages/main/ProfilePage";
import Developer from "./pages/main/Developer";
import Team from "./pages/main/Team";
import New from "./pages/main/New";
import CreateTeam from "./pages/main/CreateTeam";
import EditProfilePage from "./pages/main/EditProfilePage";
import TeamPage from "./pages/main/TeamPage";
import NotificationPage from "./pages/main/NotificationPage";
import MessagePage from "./pages/main/MessagePage";
import MemberPage from "./pages/main/MemberPage";
import StartProjectPage from "./pages/main/StartProjectPage";
import CreateSubProjectPage from "./pages/main/CreateSubProjectPage";
import CommunityPage from "./pages/main/CommunityPage";
import { Toaster } from "react-hot-toast";

const AppRoutes = ({ authUser }) => {
  return (
    <Routes>
      <Route path="/" element={!authUser ? <HomePage /> : <Navigate to="/home" />} />
      <Route path="/SignUpPage" element={!authUser ? <SignUpPage /> : <Navigate to="/home" />} />
      <Route path="/LogInPage" element={!authUser ? <LogInPage /> : <Navigate to="/home" />} />
      <Route
        path="/home"
        element={
          authUser ? (
            authUser.teamName ? ( authUser.roleName==="Leader"?<MainPage /> :<MemberPage/> ) : <New />
          ) : (
            <Navigate to="/LogInPage" />
          )
        }
      />
      <Route path="/profile/:UserName" element={authUser ? <ProfilePage /> : <Navigate to="/LogInPage" />} />
      <Route path="/developer" element={authUser ? <Developer /> : <Navigate to="/LogInPage" />} />
      <Route path="/team" element={authUser ? <Team /> : <Navigate to="/LogInPage" />} />
      <Route path="/CreateTeam" element={authUser ? <CreateTeam /> : <Navigate to="/LogInPage" />} />
      <Route path="/EditProfilePage" element={authUser ? <EditProfilePage /> : <Navigate to="/LogInPage" />} />
      <Route path="/team/:teamName" element={authUser ? <TeamPage /> : <Navigate to="/LogInPage" />} />
      <Route path="/notification" element={authUser ? <NotificationPage /> : <Navigate to="/LogInPage" />} />
      <Route path="/message" element={authUser ? <MessagePage /> : <Navigate to="/LogInPage" />} />
      <Route path="/startProject" element={authUser ? <StartProjectPage /> : <Navigate to="/LogInPage" />} />
      <Route path="/startSubProject" element={authUser ? <CreateSubProjectPage /> : <Navigate to="/LogInPage" />} />
      <Route path="/community" element={authUser ? <CommunityPage/> : <Navigate to="/LogInPage" />} />
    </Routes>
  );
};

const App = () => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (res.ok) {
          setAuthUser(data);
        } else {
          setAuthUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch auth user:", error);
        setAuthUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthUser();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <AppRoutes authUser={authUser} />
      <Toaster />
    </Router>
  );
};

export default App;
