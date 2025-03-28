import React, { useEffect, useState } from "react";
import Header from "../../components/Header.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CommunityPage = () => {
  const navigate = useNavigate();

  // Tabs and loading state
  const [activeTab, setActiveTab] = useState("forYou");
  const [loading, setLoading] = useState(true);

  // Posts arrays for different feeds
  const [forYouPosts, setForYouPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);

  // Create post states
  const [username, setUsername] = useState("");
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);

  // For editing posts
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedText, setEditedText] = useState("");

  // For commenting
  const [commentingPostId, setCommentingPostId] = useState(null);
  const [newComment, setNewComment] = useState("");

  // For option menu (edit/delete) per post
  const [openMenuPostId, setOpenMenuPostId] = useState(null);

  // Fetch "For You" posts
  useEffect(() => {
    const fetchForYouPosts = async () => {
      try {
        const response = await axios.post("/api/post/getPost");
        setForYouPosts(response.data);
      } catch (error) {
        console.error("Error fetching 'For You' posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchForYouPosts();
  }, []);

  // Fetch "Following" posts & logged-in username
  useEffect(() => {
    const fetchFollowingPosts = async () => {
      try {
        const userResponse = await axios.get("/api/auth/me");
        setUsername(userResponse.data.username);
        const response = await axios.post("/api/post/getFollowingPost", {
          username: userResponse.data.username,
        });
        setFollowingPosts(response.data);
      } catch (error) {
        console.error("Error fetching 'Following' posts:", error);
      }
    };
    fetchFollowingPosts();
  }, []);

  // Create New Post with FormData to enable image upload
  const handleCreatePost = async () => {
    if (!newPostText.trim()) {
      alert("Please add some text before posting.");
      return;
    }
  
    const formData = new FormData();
    formData.append("username", username);
    formData.append("description", newPostText);
    if (newPostImage) {
      formData.append("img", newPostImage);
    }
  
    try {
      const response = await axios.post("/api/post/createPost", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (activeTab === "forYou") {
        setForYouPosts([response.data, ...forYouPosts]);
      } else {
        setFollowingPosts([response.data, ...followingPosts]);
      }
      setNewPostText("");
      setNewPostImage(null);
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  // Edit a post: set editing mode with current description
  const handleEditPost = (post) => {
    setEditingPostId(post._id);
    setEditedText(post.description);
    // Close the options menu
    setOpenMenuPostId(null);
  };

  // Save edited post; assume backend sets an 'edited' flag to true
  const handleSaveEdit = async (postId) => {
    try {
      const response = await axios.put("/api/post/editPost", {
        postId,
        description: editedText,
      });
      if (activeTab === "forYou") {
        setForYouPosts(
          forYouPosts.map((post) => (post._id === postId ? response.data : post))
        );
      } else {
        setFollowingPosts(
          followingPosts.map((post) =>
            post._id === postId ? response.data : post
          )
        );
      }
      setEditingPostId(null);
    } catch (error) {
      console.error("Error editing post", error);
      alert("Failed to edit post");
    }
  };

  // Delete a post
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete("/api/post/deletePost", { data: { postId } });
      if (activeTab === "forYou") {
        setForYouPosts(forYouPosts.filter((post) => post._id !== postId));
      } else {
        setFollowingPosts(
          followingPosts.filter((post) => post._id !== postId)
        );
      }
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post", error);
      alert("Failed to delete post");
    }
  };

  // Like a post
  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post("/api/post/likePost", { postId, username });
      if (activeTab === "forYou") {
        setForYouPosts(
          forYouPosts.map((post) => (post._id === postId ? response.data : post))
        );
      } else {
        setFollowingPosts(
          followingPosts.map((post) =>
            post._id === postId ? response.data : post
          )
        );
      }
    } catch (error) {
      console.error("Error liking post", error);
      alert("Failed to like post");
    }
  };

  // Add a comment to a post
  const handleAddComment = async (postId) => {
    try {
      const response = await axios.post("/api/post/addComment", {
        postId,
        username,
        text: newComment,
      });
      if (activeTab === "forYou") {
        setForYouPosts(
          forYouPosts.map((post) => (post._id === postId ? response.data : post))
        );
      } else {
        setFollowingPosts(
          followingPosts.map((post) =>
            post._id === postId ? response.data : post
          )
        );
      }
      setNewComment("");
      setCommentingPostId(null);
    } catch (error) {
      console.error("Error adding comment", error);
      alert("Failed to add comment");
    }
  };

  // Render posts with all actions and beautiful styling
  const renderPosts = (posts) =>
    posts.length > 0 ? (
      posts.map((post) => (
        <div
          key={post._id}
          className="relative bg-white shadow-md rounded-md p-5 mb-4 border-l-4 border-blue-500"
        >
          {/* Options menu icon - shown only for posts created by logged-in user */}
          {post.username === username && (
            <div className="absolute top-2 right-2">
              <img
                src="https://img.icons8.com/ios/50/menu-2.png"
                alt="Options"
                className="w-6 h-6 cursor-pointer"
                onClick={() =>
                  setOpenMenuPostId(openMenuPostId === post._id ? null : post._id)
                }
              />
              {openMenuPostId === post._id && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-md z-10">
                  <button
                    onClick={() => handleEditPost(post)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}

          {/* User Info with Navigation */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 bg-blue-400 text-white flex items-center justify-center rounded-full font-bold cursor-pointer"
              onClick={() => navigate(`/profile/${post.username}`)}
            >
              {post.username.charAt(0).toUpperCase()}
            </div>
            <h3
              className="font-bold text-lg cursor-pointer"
              onClick={() => navigate(`/profile/${post.username}`)}
            >
              {post.username}
            </h3>
          </div>

          {/* Post Content – clicking navigates to full post view */}
          <div className="cursor-pointer">
            {editingPostId === post._id ? (
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-gray-700 mb-3">
                {post.description}{" "}
                {post.edited && (
                  <span className="text-sm text-gray-500">(edited)</span>
                )}
              </p>
            )}
            {post.img && (
              <img
                src={post.img}
                alt="Post"
                className="w-full h-60 object-cover rounded-md shadow-sm mb-3"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-4">
              <button
                onClick={() => handleLikePost(post._id)}
                className="flex items-center gap-1 text-blue-500 font-semibold hover:underline"
              >
                <img
                  src="https://img.icons8.com/ios/50/facebook-like--v1.png"
                  alt="Like"
                  className="w-5 h-5"
                />
                {post.likes.length}
              </button>
              <button
                onClick={() =>
                  setCommentingPostId(
                    commentingPostId === post._id ? null : post._id
                  )
                }
                className="flex items-center gap-1 text-yellow-500 font-semibold hover:underline"
              >
                <img
                  src="https://img.icons8.com/ios/50/speech-bubble--v1.png"
                  alt="Comment"
                  className="w-5 h-5"
                />
                {post.comments.length}
              </button>
            </div>
          </div>

          {/* Comments Section */}
          {commentingPostId === post._id && (
            <div className="mt-3">
              {post.comments.map((comment, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 bg-gray-300 text-black flex items-center justify-center rounded-full font-bold cursor-pointer"
                    onClick={() => navigate(`/profile/${comment.username}`)}
                  >
                    {comment.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span
                      className="font-semibold cursor-pointer"
                      onClick={() => navigate(`/profile/${comment.username}`)}
                    >
                      {comment.username}
                    </span>
                    : {comment.text}
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={() => handleAddComment(post._id)}
                  className="px-3 py-1 bg-blue-400 text-white rounded-md hover:bg-blue-500"
                >
                  Comment
                </button>
              </div>
            </div>
          )}

          {/* If in edit mode, show save button */}
          {editingPostId === post._id && (
            <div className="mt-2">
              <button
                onClick={() => handleSaveEdit(post._id)}
                className="px-3 py-1 bg-purple-400 text-white rounded-md hover:bg-purple-500"
              >
                Save
              </button>
            </div>
          )}
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500">No posts available.</p>
    );

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto mt-5">
        {/* Tabs Section */}
        <div className="flex border-b border-gray-300">
          <button
            className={`w-1/2 text-center py-3 text-lg font-semibold ${
              activeTab === "forYou" ? "bg-yellow-200" : "bg-white"
            } hover:bg-yellow-100 transition duration-200`}
            onClick={() => setActiveTab("forYou")}
          >
            For You
          </button>
          <button
            className={`w-1/2 text-center py-3 text-lg font-semibold ${
              activeTab === "following" ? "bg-yellow-200" : "bg-white"
            } hover:bg-yellow-100 transition duration-200`}
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>
        </div>

        {/* Create Post Form */}
        <div className="p-5 bg-white shadow-md rounded-md mt-3">
          <h2 className="text-xl font-bold text-blue-600 mb-3">
            Create a New Post
          </h2>
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewPostImage(e.target.files[0])}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleCreatePost}
            className="w-full mt-3 bg-yellow-400 text-white py-2 rounded-md hover:bg-yellow-500 transition duration-200"
          >
            Post
          </button>
        </div>

        {/* Posts Section */}
        <div className="p-5 bg-white shadow-md rounded-md mt-3">
          {loading ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : activeTab === "forYou" ? (
            renderPosts(forYouPosts)
          ) : (
            renderPosts(followingPosts)
          )}
        </div>
      </div>
    </>
  );
};

export default CommunityPage;
