import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Header = () => {
  const [username, setUsername] = useState('');
  const [UserName, setUserName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const profile = () => {
    navigate(`/profile/${UserName}`);
  };

  const myTeam = () => {
    navigate(`/team/${teamName}`);
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      window.location.href = "/logInPage";
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error in logout', error);
      toast.error('Logout failed!');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/auth/me');
        setUserName(response.data.username || 'Guest');
        setUsername(response.data.fullName || 'Guest');
        setTeamName(response.data.teamName || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    })();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-yellow-300 h-16 w-full mb-0 flex items-center relative">
      <p className="ml-5 mr-40 font-bold inline-block">
        <Link to="/home" className="font-bold">
          Project Pulse
        </Link>
      </p>
      <p className="ml-80 font-semibold inline-block">
        <Link to="/community" className="font-semibold">
          Community
        </Link>
      </p>
      <p className="ml-8 font-semibold inline-block cursor-pointer" onClick={myTeam}>
        My Team
      </p>
      <p className="ml-8 font-semibold inline-block">
        <Link to="/team" className="font-semibold">
          Find Teams
        </Link>
      </p>
      <p className="ml-8 font-semibold inline-block">
        <Link to="/developer" className="font-semibold">
          Find Developers
        </Link>
      </p>
      <button
          onClick={() => navigate("/notification")}
          className=" mt-0 ml-40 bg-yellow-200 p-2 rounded-full shadow-md hover:bg-yellow-300 transition duration-200 z-20"
        >
          <img 
            src="https://cdn-icons-png.flaticon.com/512/1827/1827272.png" 
            alt="Notification Bell" 
            className="h-6 w-6"
          />
        </button>
      <div className="ml-auto mr-5 font-semibold inline-block relative" ref={dropdownRef}>
        <p onClick={toggleDropdown} className="cursor-pointer inline-block">
          <img
            className="inline-block pr-1"
            src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/profile-52e0dc.svg"
            alt="Profile"
          />
          {username}
          <img
            className={`inline-block pl-1 pt-0 transition-transform duration-300 ${
              dropdownOpen ? 'rotate-180' : 'rotate-0'
            }`}
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAxNCAxMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjBfZF80OTc0Xzc1OTY5KSI+CjxwYXRoIGQ9Ik0zIDJMNyA2TDExIDIiIHN0cm9rZT0iIzExMTExMiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L2c+CjxkZWZzPgo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2RfNDk3NF83NTk2OSIgeD0iMC4yNSIgeT0iMC4yNSIgd2lkdGg9IjEzLjUiIGhlaWdodD0iOS44MTI1IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgo8ZmVPZmZzZXQgZHk9IjEiLz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMSIvPgo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjE2IDAiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfNDk3NF83NTk2OSIgcmVzdWx0PSJzaGFwZSIvPgo8L2ZpbHRlcj4KPC9kZWZzPgo8L3N2Zz4K"
            alt="Dropdown Arrow"
          />
        </p>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 mb-0 bg-white border rounded-lg shadow-lg">
            <div onClick={profile} className="block px-6 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
              Profile
            </div>
            <Link to="/settings" className="block px-6 py-2 text-gray-800 hover:bg-gray-100">
              Settings
            </Link>
            <button onClick={logout} className="block px-6 py-2 text-left w-full text-gray-800 hover:bg-gray-100">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;