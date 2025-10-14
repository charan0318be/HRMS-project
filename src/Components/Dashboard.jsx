import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUserCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaSync,
} from "react-icons/fa";

const Dashboard = () => {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState({
    name: "",
   
  });
  const [leaveData, setLeaveData] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const [file, setFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Load saved profile data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("dashboardUser");
    const savedImage = localStorage.getItem("dashboardProfileImage");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedImage) setProfileImage(savedImage);
  }, []);

  // ✅ Fetch leave data
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/leave/balance/${userId}`);
        setLeaveData(res.data || []);
      } catch (err) {
        console.error("Error fetching leave data:", err);
      }
    };
    fetchLeaves();
  }, [userId]);

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      await axios.post("http://localhost:3001/attendance/checkin", { userId });
      alert("✅ Checked in successfully!");
    } catch (err) {
      alert(err.response?.data || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Check-out
  const handleCheckOut = async () => {
    try {
      setLoading(true);
      await axios.put("http://localhost:3001/attendance/checkout", { userId });
      alert("✅ Checked out successfully!");
    } catch (err) {
      alert(err.response?.data || "Check-out failed");
    } finally {
      setLoading(false);
    }
  };


  // ✅ Handle file change (profile image)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setProfileImage(imageUrl);
      localStorage.setItem("dashboardProfileImage", imageUrl);
    }
  };

  // ✅ Handle upload (mock or real)
  const handleUpload = async () => {
    if (!file) return alert("Select an image first!");
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      await axios.put(`http://localhost:3001/profile/upload/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated!");
      setFile(null);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  // ✅ Save profile data to localStorage
  const handleSaveProfile = () => {
    localStorage.setItem("dashboardUser", JSON.stringify(user));
    alert("Profile saved!");
    setEditMode(false);
  };

  return (
    <div className="bg-white  rounded-2xl min-h-screen p-8">
      {/* Top Section */}
     <div>
         <div className="flex justify-between items-center  pb-4 mb-6">
        <h2 className="text-x font-semibold text-gray-800">Dashboard</h2>

        {/* Profile */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setEditMode(!editMode)}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full border object-cover"
            />
          ) : (
            <FaUserCircle className="text-4xl text-gray-500" />
          )}
          <span className="font-medium text-gray-800">{user.name}</span>
        </div>
      </div>

      {/* Edit Profile */}
      {editMode && (
        <div className="bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.6)]  p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">Edit Profile</h3>
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <input type="file" accept="image/*" onChange={handleFileChange} className=" rounded border-yellow-500 block px-3 py-2 inset-shadow-2xs shadow-md " />
              {file && (
                <button
                  onClick={handleUpload}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Upload
                </button>
              )}
            </div>
            <div className="flex  gap-3">
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className=" rounded px-3 py-2 w-60 inset-shadow-2xs shadow-md"
              />
             
              <button
                onClick={handleSaveProfile}
                className="bg-green-600  text-white  px-4 py-2 rounded "
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <hr className="border-0 h-[1px] bg-gray-200 mb-6 shadow-[0_2px_6px_rgba(0,0,0,0.2)]" />
      <div className="flex justify-between items-center pb-2 mb-6">
        
  {/* Left: Title */}
  <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>

  {/* Right: Refresh Button */}
  <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 border px-3 py-2 rounded transition hover:bg-gray-100"title="Refresh">
           <FaSync className="text-lg" />
           <span className="font-medium">Refresh</span>
          </button>
  
</div>


     </div>
      {/* Welcome Section */}
      <div className="shadow-[0_0_15px_rgba(0,0,0,0.3)] px-6 py-6 rounded-2xl">
        <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.4)] text-center py-8 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h1>
        <p className="text-gray-500 mt-2">
          Stay updated with company announcements and meetings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.2)] p-5 text-center">
          <FaCheckCircle className="text-green-500 text-3xl mx-auto mb-2" />
          <p className="text-sm text-gray-500">Total Awards</p>
          <h2 className="text-xl font-bold text-gray-800 mt-1"></h2>
        </div>

        <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.2)]  p-5 text-center">
          <FaExclamationTriangle className="text-yellow-500 text-3xl mx-auto mb-2" />
          <p className="text-sm text-gray-500">Total Working Time</p>
          <h2 className="text-xl font-bold text-gray-800 mt-1"></h2>
        </div>

        <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.2)]  p-5 text-center">
          <FaTimesCircle className="text-red-500 text-3xl mx-auto mb-2" />
          <p className="text-sm text-gray-500">Total Complaints</p>
          <h2 className="text-xl font-bold text-gray-800 mt-1"></h2>
        </div>
      </div>

      {/* Participation */}
      <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.2)]  p-6 text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Participation</h3>
        <div className="bg-blue-50 shadow-[0_0_15px_rgba(0,0,0,0.6)] border-teal-300 rounded-lg py-3">
          <p className="text-blue-700 font-medium">Morning Shift 09:00 to 18:00</p>
        </div>
      </div>

      {/* Check-in / Check-out */}
     <div className="flex justify-center gap-6 mb-10">
        <button
          onClick={handleCheckIn}
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg shadow text-white transition ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          <FaSignInAlt /> Check-in
        </button>

        <button
          onClick={handleCheckOut}
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg shadow text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          <FaSignOutAlt /> Check-out
        </button>
      </div>
      {/* Leave Balance */}
      <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]  p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Leave Balance</h2>
        {leaveData.length === 0 ? (
          <p className="text-gray-600">No leave data available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {leaveData.map((leave, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-lg p-4 text-center shadow-sm"
              >
                <p className="text-gray-600 text-sm">{leave.type}</p>
                <h3 className="text-lg font-bold text-gray-800">{leave.available}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
