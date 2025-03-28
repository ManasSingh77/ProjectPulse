import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./../../components/Header";

const MessagePage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(""); 
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchUsernameAndMessages = async () => {
      try {
        const userResponse = await axios.get("/api/auth/me");
        setUsername(userResponse.data.username);

        const messageResponse = await axios.post("/api/general/getMessage", {
          username: userResponse.data.username,
        });
        setMessages(messageResponse.data);
      } catch (err) {
        setError("Failed to load messages.");
        console.error(err);
      }
    };

    fetchUsernameAndMessages();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await axios.post("/api/general/sendMessage", {
        username,
        message: newMessage,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: username, message: newMessage, createdAt: new Date() },
      ]);

      setNewMessage("");
    } catch (err) {
      setError("Failed to send the message.");
      console.error(err);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-r from-yellow-50 to-yellow-100 flex flex-col items-center py-6">
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-yellow-600 text-center mb-4">
            Team Chat
          </h1>

          <div className="flex flex-col space-y-4 overflow-y-auto max-h-[60vh] p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === username ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                    msg.sender === username
                      ? "bg-yellow-100 text-gray-800"
                      : "bg-yellow-600 text-white"
                  }`}
                >
                  <p className="text-sm">
                    <strong>{msg.sender}</strong>
                  </p>
                  <p className="text-md">{msg.message}</p>
                  <p className="text-xs text-gray-500 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border border-yellow-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-yellow-600 text-white px-6 py-2 rounded-r-lg hover:bg-yellow-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessagePage;