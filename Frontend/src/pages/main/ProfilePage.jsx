// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../../components/Header";
import { FaStar } from "react-icons/fa";

const ProfilePage = () => {
  const { UserName } = useParams();
  const navigate = useNavigate();

  // User details states
  const [name, setName] = useState("User");
  const [username, setUserName] = useState("User");
  const [senderName, setSenderName] = useState("");
  const [bio, setBio] = useState("");
  const [team, setTeam] = useState("Not in a team");
  const [position, setPosition] = useState("NA");
  const [status, setStatus] = useState("NA");
  const [lName, setLname] = useState("");
  const [lLink, setLlink] = useState("");
  const [gName, setGname] = useState("");
  const [gLink, setGlink] = useState("");
  const [XName, setXname] = useState("");
  const [XLink, setXlink] = useState("");
  const [profileImg, setProfileImg] = useState("../../../public/avatar-placeholder.png");
  const [coverImg, setCoverImg] = useState("../../../public/cover.png");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [followStatus, setFollowStatus] = useState("Follow");
  const [followUser, setFollowUser] = useState("");
  const [isMyProfile, setIsMyProfile] = useState(true);
  const [specialties, setSpecialties] = useState([]);

  // Dropdown menu states for images
  const [coverMenuOpen, setCoverMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Refs for hidden file inputs
  const profileImgInputRef = useRef(null);
  const coverImgInputRef = useRef(null);

  const handleClick = () => {
    navigate("/EditProfilePage");
  };

  const handleFollowClick = async () => {
    try {
      const response = await axios.post("/api/general/follow", {
        username: followUser,
        follow: UserName,
      });
      if (response.data.message === "Followed successfully") {
        setFollowers(followers + 1);
        setFollowStatus("Following");
      } else {
        setFollowers(followers - 1);
        setFollowStatus("Follow");
      }
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInvite = async () => {
    try {
      const response = await axios.post("/api/general/sendNotification", {
        username: UserName,
        sender: senderName,
      });
      toast.success("Invitation Sent");
      console.log(response);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.response.data.message);
    }
  };

  // --- Cover Image Handlers ---
  const handleCoverImgEditClick = () => {
    // Toggle dropdown menu
    setCoverMenuOpen(!coverMenuOpen);
  };

  const handleCoverImgChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("username", username);
    formData.append("img", file);
    try {
      const response = await axios.put("/api/team/updateCoverImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCoverImg(response.data.coverImg);
      toast.success("Cover image updated!");
      setCoverMenuOpen(false);
    } catch (error) {
      console.error("Error updating cover image", error);
      toast.error("Failed to update cover image.");
    }
  };

  const handleRemoveCoverImg = async () => {
    try {
      const response = await axios.put("/api/team/removeCoverImage", { username });
      setCoverImg("../../../public/cover.png");
      toast.success("Cover image removed!");
      setCoverMenuOpen(false);
    } catch (error) {
      console.error("Error removing cover image", error);
      toast.error("Failed to remove cover image.");
    }
  };

  // --- Profile Image Handlers ---
  const handleProfileImgEditClick = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleProfileImgChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("username", username);
    formData.append("img", file);
    try {
      const response = await axios.put("/api/team/updateProfileImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfileImg(response.data.profileImg);
      toast.success("Profile image updated!");
      setProfileMenuOpen(false);
    } catch (error) {
      console.error("Error updating profile image", error);
      toast.error("Failed to update profile image.");
    }
  };

  const handleRemoveProfileImg = async () => {
    try {
      const response = await axios.put("/api/team/removeProfileImage", { username });
      setProfileImg("../../../public/avatar-placeholder.png");
      toast.success("Profile image removed!");
      setProfileMenuOpen(false);
    } catch (error) {
      console.error("Error removing profile image", error);
      toast.error("Failed to remove profile image.");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let user = await axios.get("/api/auth/me");
        setUserName(user.data.username);
        setFollowUser(user.data.username);
        setSenderName(user.data.username);
        
        // Check if this is the user's own profile
        const isOwnProfile = user.data.username === UserName;
        setIsMyProfile(isOwnProfile);
        
        user = await axios.post("/api/auth/get", { username: UserName });
        setUserName(user.data[0].username);
        setName(user.data[0].fullName);
        setBio(user.data[0].bio);
        setTeam(user.data[0].teamName);
        setPosition(user.data[0].roleName);
        setStatus(user.data[0].projectStatus);
        setLname(user.data[0].linkedInName);
        setLlink(user.data[0].linkedInURL);
        setGname(user.data[0].GitHubName);
        setGlink(user.data[0].GithubURL);
        setXname(user.data[0].XName);
        setXlink(user.data[0].XURL);
        setFollowers(user.data[0].followers.length);
        setFollowing(user.data[0].following.length);
        setSpecialties(user.data[0].specialties || []);
        if (user.data[0].profileImg) {
          setProfileImg(user.data[0].profileImg);
        } else {
          setProfileImg("../../../public/avatar-placeholder.png");
        }
        if (user.data[0].coverImg) {
          setCoverImg(user.data[0].coverImg);
        }
        if (user.data[0].followers.includes(user.data.username)) {
          setFollowStatus("Following");
        } else {
          setFollowStatus("Follow");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [UserName]);

  return (
    <>
      <Header />
      <div className="flex mt-5 ml-48 space-x-12">
        <div className="w-7/12 border-4 border-yellow-400 border-solid rounded-lg relative">
          {/* Cover Image Section */}
          <div className="relative">
            <img className="w-full h-52 object-cover rounded-t-lg" src={coverImg} alt="Cover Image" />
            {isMyProfile && (
              <div className="absolute top-2 right-2">
                <button
                  onClick={handleCoverImgEditClick}
                  className="bg-opacity-50 text-white p-1 rounded-full"
                >
                  <img src="https://img.icons8.com/ios/50/menu-2.png" alt="Cover Menu" className="w-5 h-5" />
                </button>
                {coverMenuOpen && (
                  <div className="absolute top-10 right-2 bg-white border border-gray-200 rounded shadow-md z-10">
                    <button
                      onClick={() => coverImgInputRef.current && coverImgInputRef.current.click()}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Choose Image
                    </button>
                    <button
                      onClick={handleRemoveCoverImg}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={coverImgInputRef}
              onChange={handleCoverImgChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Profile Image Section */}
          <div className="absolute left-24 transform -translate-x-1/2 -translate-y-1/2">
            <img
              className="w-40 h-40 rounded-full object-cover border-4 border-yellow-400"
              src={profileImg}
              alt="Profile Image"
            />
            {isMyProfile && (
              <div className="absolute bottom-0 right-0">
                <button
                  onClick={handleProfileImgEditClick}
                  className="bg-opacity-50 text-white p-1 rounded-full"
                >
                  <img src="https://img.icons8.com/ios/50/menu-2.png" alt="Profile Menu" className="w-5 h-5" />
                </button>
                {profileMenuOpen && (
                  <div className="absolute bottom-10 right-0 bg-white border border-gray-200 rounded shadow-md z-10">
                    <button
                      onClick={() => profileImgInputRef.current && profileImgInputRef.current.click()}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Choose Image
                    </button>
                    <button
                      onClick={handleRemoveProfileImg}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={profileImgInputRef}
              onChange={handleProfileImgChange}
              style={{ display: "none" }}
            />
          </div>

          <div className="flex mt-16 ml-2 p-4">
            <div className="w-full">
              {/* Flex container for name and follow button */}
              <div className="flex justify-between items-center w-full">
                <div className="font-semibold text-2xl truncate max-w-[70%]">
                  {name}
                </div>
                <div>
                  {!isMyProfile && (
                    <button
                      onClick={handleFollowClick}
                      className={`px-4 py-2 text-white font-semibold rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                        followStatus === "Following" ? "bg-green-500 hover:bg-green-600" : "bg-yellow-400 hover:bg-yellow-500"
                      }`}
                    >
                      {followStatus}
                    </button>
                  )}
                </div>
              </div>
              <div className="font-normal text-base">
                @{username}
              </div>
            </div>
            <div className="ml-48">
              {isMyProfile ? (
                <div className="rounded-full hover:bg-gray-200 w-10 h-10 flex items-center justify-center">
                  <img onClick={handleClick} className="h-6 w-6 cursor-pointer" src="https://www.svgrepo.com/show/502644/edit.svg" alt="Edit Icon" />
                </div>
              ) : (
                <button
                  onClick={handleInvite}
                  className="px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                >
                  Invite
                </button>
              )}
            </div>
          </div>
          <div className="ml-6 max-w-lg">{bio}</div>
          <div className="ml-6">
            {(lLink || gLink || XLink) && <p className="font-semibold mt-2 mb-2"> Other Profiles:</p>}
            {lLink && (
              <div className="flex items-center mb-2">
                <img className="h-10" src="../../../public/icons8-linkedin.svg" alt="LinkedIn" />
                <a href={lLink} className="hover:text-yellow-600">{lName}</a>
              </div>
            )}
            {gLink && (
              <div className="flex items-center mb-2">
                <img className="h-10" src="../../../public/icons8-github.svg" alt="GitHub" />
                <a href={gLink} className="hover:text-yellow-600">{gName}</a>
              </div>
            )}
            {XLink && (
              <div className="flex items-center ml-1 mb-5">
                <img className="h-8 mr-1" src="../../../public/x-twitter-brands-solid.svg" alt="X" />
                <a href={XLink} className="hover:text-yellow-600">{XName}</a>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="w-80 border-4 border-yellow-400 border-solid rounded-lg">
            <div className="flex font-bold text-lg justify-center mt-2">TEAM DETAILS</div>
            <div className="flex">
              <div className="font-semibold ml-2 mt-2">TEAM NAME:</div> 
              <div className="mt-2 ml-2">{team ? team : 'NOT IN A TEAM'}</div>
            </div>
            <div className="flex">
              <div className="font-semibold ml-2 mt-2">TEAM POSITION:</div> 
              <div className="mt-2 ml-2">{position ? position : 'NA'}</div>
            </div>
            <div className="flex">
              <div className="font-semibold ml-2 mt-2">STATUS:</div> 
              <div className="mt-2 ml-2">{status}</div>
            </div>
            <div className="flex">
              <div className="font-semibold ml-2 mt-2">FOLLOWERS:</div> 
              <div className="mt-2 ml-2">{followers}</div>
            </div>
            <div className="flex">
              <div className="font-semibold ml-2 mt-2">FOLLOWING:</div> 
              <div className="mt-2 ml-2">{following}</div>
            </div>
          </div>

          {specialties.length > 0 && (
            <div className="w-80 border-4 border-yellow-400 border-solid rounded-lg">
              <div className="flex font-bold text-lg justify-center mt-2">SPECIALTIES</div>
              <div className="flex flex-wrap p-4 gap-2">
                {specialties.map((specialty, index) => (
                  <div 
                    key={index}
                    className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    <FaStar className="mr-1 text-yellow-500" />
                    {specialty}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;