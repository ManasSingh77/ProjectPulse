import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./../../components/Header";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams} from 'react-router-dom'; 
const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username,setUserName]=useState('');
  const navigate=useNavigate();
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        let user= await axios.get('/api/auth/me');
        console.log("and the user is",user);
        const usernames=user.data.username;
        setUserName(usernames);
        const response = await axios.post("/api/general/getNotification",{username,username});
        console.log(response);
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [notifications]);

  const handleAccept = async (notificationId,teamName) => {
    try {
      await axios.post("/api/general/acceptInvite", { id: notificationId });
      await axios.post("/api/team/joinTeam", {username:username,teamName,teamName });
      toast.success("Invitation accepted!");
      window.location.href = "/home";
    } catch (error) {
      console.error("Error accepting invitation:", error);
      alert("Failed to accept invitation.");
    }
  };

  const handleReject = async (notificationId) => {
    try {
      await axios.post("/api/general/rejectInvite", { id: notificationId });
      toast.success("Invitation rejected!");
      window.location.href = "/home";
    } catch (error) {
      console.error("Error rejecting invitation:", error);
      alert("Failed to reject invitation.");
    }
  };

  return (
    <>
      <Header />
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-5">Notifications</h1>
        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="flex items-center justify-between p-4 border border-gray-300 rounded-lg shadow-md"
              >
                <div>
                  <p className="text-lg font-semibold">
                    {notification.sender} has invited you to join the{" "}
                    <span className="font-bold text-blue-500">
                      {notification.teamName}
                    </span>{" "}
                    team.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    onClick={() => handleAccept(notification._id,notification.teamName)}
                  >
                    ✅ Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    onClick={() => handleReject(notification._id)}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No notifications available.</p>
        )}
      </div>
    </>
  );
};

export default NotificationPage;