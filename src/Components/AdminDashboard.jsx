import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserCircle,
  FaBell,
  FaSync,
} from "react-icons/fa";

const AdminDashboard = () => {
  const userId = localStorage.getItem("userId");

  // --- States ---
  const [user, setUser] = useState({ name: "" });
  const [profileImage, setProfileImage] = useState("");
  const [file, setFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState({
    totalEmployees: 0,
    checkedIn: 0,
    onLeave: 0,
  });
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [recentMeetings, setRecentMeetings] = useState([]);
  const [pendingAppraisals, setPendingAppraisals] = useState(0);
  const [employeeStats, setEmployeeStats] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // --- Load saved profile ---
  useEffect(() => {
    const savedUser = localStorage.getItem("adminDashboardUser");
    const savedImage = localStorage.getItem("adminDashboardProfileImage");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedImage) setProfileImage(savedImage);
  }, []);

  // --- Fetch Employees ---
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:3001/employees");
      setEmployees(res.data || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };
  // --- Load logged-in user ID and name ---
useEffect(() => {
  const userId = localStorage.getItem("userId"); // get ID
  const savedUser = localStorage.getItem("adminDashboardUser"); // get user object
  let userName = "Admin"; // fallback name
  if (savedUser) {
    const parsedUser = JSON.parse(savedUser);
    userName = parsedUser.name || "Admin";
    setUser(parsedUser); // set state so it shows in UI
  }
  console.log("Logged-in user:", { id: userId, name: userName });
}, []);


  // --- Fetch Attendance Stats ---
  const fetchAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:3001/attendance/stats");
      setAttendanceStats(res.data);
    } catch (err) {
      console.error("Error fetching attendance stats:", err);
    }
  };

  // --- Fetch Departments ---
  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/departments");
      setDepartments(res.data || []);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  // --- Fetch Notifications ---
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:3001/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // --- Fetch Recent Data ---
  const fetchRecentData = async () => {
  try {
    // fetch all three in parallel
    const [leavesRes, candidatesRes, meetingsRes] = await Promise.all([
      axios.get("http://localhost:3001/api/leave/recent"),
      axios.get("http://localhost:3001/api/employees/recent"),
      axios.get("http://localhost:3001/api/meetings/recent"),
    ]);

    // Recent Leaves
    setRecentLeaves(
      (leavesRes.data || []).map((l) => ({
        ...l,
        employeeName: l.employee?.name || "Unknown",
      }))
    );

    // Recent Employees
    setRecentCandidates(
      (candidatesRes.data || []).map((c) => ({
        ...c,
        name: c.name || "Unknown",
        role: c.role || "Employee",
        date: c.date ? new Date(c.date).toLocaleDateString() : "N/A",
      }))
    );

    // Recent Meetings
    setRecentMeetings(meetingsRes.data || []);
  } catch (err) {
    console.error("Error fetching recent data:", err);
  }
};


  // --- Fetch Leaves & Appraisals ---
  const fetchDashboardData = async () => {
    try {
      const leavesRes = await axios.get("http://localhost:3001/leave/all");
      const appraisalsRes = await axios.get("http://localhost:3001/appraisals");

      const today = new Date();
      const onLeaveIds = leavesRes.data
        .filter(
          (l) =>
            l.status.toLowerCase() === "approved" &&
            new Date(l.startDate) <= today &&
            new Date(l.endDate) >= today
        )
        .map((l) => l.employeeId.toString());

      const total = employees.length;
      const onLeave = employees.filter((e) =>
        onLeaveIds.includes(e._id.toString())
      ).length;
      const active = total - onLeave;

      setEmployeeStats({ total, active, onLeave });
      setPendingLeaves(
        leavesRes.data.filter((l) => l.status.toLowerCase() === "pending")
          .length
      );
      setPendingAppraisals(
        appraisalsRes.data.filter((a) => a.status.toLowerCase() === "submitted")
          .length
      );
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  // --- Initial Fetch ---
  useEffect(() => {
    const init = async () => {
      await fetchEmployees();
      await fetchAttendance();
      await fetchDepartments();
      await fetchRecentData();
      await fetchNotifications();
    };
    init();
  }, []);

  useEffect(() => {
    if (employees.length) fetchDashboardData();
  }, [employees]);

  // --- Profile Upload ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setProfileImage(imageUrl);
      localStorage.setItem("dashboardProfileImage", imageUrl);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Select an image first!");
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      await axios.put(
        `http://localhost:3001/profile/upload/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Profile updated!");
      setFile(null);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleSaveProfile = () => {
    localStorage.setItem("adminDashboardUser", JSON.stringify(user));
    localStorage.setItem("adminDashboardProfileImage", profileImage);
    alert("Profile saved!");
    setEditMode(false);
  };

  const handleRefresh = async () => {
    await fetchEmployees();
    await fetchAttendance();
    await fetchDepartments();
    await fetchRecentData();
    await fetchDashboardData();
    await fetchNotifications();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white rounded-3xl min-h-screen p-8 relative">
        {/* Top Section */}
        <div className="flex justify-between items-center mb-6 relative">
          <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>

          <div className="flex items-center gap-4 relative">
            {/* Notifications */}
            <div className="relative">
              <button
                className="relative text-gray-600 hover:text-blue-600 p-2 rounded"
                onClick={() => setShowDropdown(!showDropdown)}
                title="Notifications"
              >
                <FaBell className="text-xl" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-700 text-sm">Notifications</h3>
                    <button
                      onClick={() => setNotifications([])}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b last:border-b-0"
                        >
                          {n.message || "New update available"}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">
                        No new notifications
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Refresh */}
            <button
              className="text-gray-600 hover:text-blue-600 p-2 rounded"
              onClick={handleRefresh}
              title="Refresh Dashboard"
            >
              <FaSync className="text-xl" />
            </button>

            {/* Profile */}
            <div
              className="flex items-center gap-3 relative cursor-pointer"
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
              <span className="font-medium text-gray-800">{user.name || "Admin"}</span>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        {editMode && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Edit Profile</h3>
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="rounded border px-3 py-2"
                />
                {file && (
                  <button
                    onClick={handleUpload}
                    className="bg-blue-600 text-white px-4 py-1 rounded mt-2 hover:bg-blue-700"
                  >
                    Upload
                  </button>
                )}
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="rounded px-3 py-2 w-60 border"
                />
                <button
                  onClick={handleSaveProfile}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Pending Leaves */}
          <div className="bg-blue-50 rounded-2xl shadow-md p-6 flex flex-col justify-center items-center hover:scale-105 transition-transform">
            <FaExclamationTriangle className="text-yellow-500 text-3xl mb-2" />
            <span className="text-2xl font-bold text-gray-800">{pendingLeaves}</span>
            <span className="text-sm text-gray-600 mt-1">Pending Leaves</span>
          </div>

          {/* Active Employees */}
          <div className="bg-purple-50 rounded-2xl shadow-md p-6 flex flex-col justify-center items-center hover:scale-105 transition-transform">
            <FaUserCircle className="text-purple-500 text-3xl mb-2" />
            <span className="text-2xl font-bold text-gray-800">{employeeStats.active}</span>
            <span className="text-sm text-gray-600 mt-1">Active Employees</span>
          </div>

          {/* Attendance */}
          <div className="bg-green-50 rounded-2xl shadow-md p-6 flex flex-col justify-center items-center hover:scale-105 transition-transform">
            <FaCheckCircle className="text-green-500 text-3xl mb-2" />
            <span className="text-lg font-semibold text-gray-800">
              Present: {attendanceStats.checkedIn}
            </span>
            <span className="text-sm text-gray-600 mt-1">
              Total: {attendanceStats.totalEmployees}
            </span>
          </div>

          {/* Departments */}
          <div className="bg-yellow-50 rounded-2xl shadow-md p-6 flex flex-col justify-center items-center hover:scale-105 transition-transform">
            <FaUserCircle className="text-yellow-500 text-3xl mb-2" />
            <span className="text-lg font-semibold text-gray-800">
              Total Departments: {departments.length}
            </span>
          </div>
        </div>

        {/* Recent Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {/* Recent Leaves */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" /> Recent Leave Applications
              </h3>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {recentLeaves.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent leaves</p>
              ) : (
                recentLeaves.map((leave, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{leave.employeeName}</p>
                      <p className="text-xs text-gray-500">
                        {leave.leaveType} • {new Date(leave.startDate).toLocaleDateString()} -{" "}
                        {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        leave.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : leave.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Employees */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FaUserCircle className="text-purple-500" /> Recent Employees
              </h3>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {recentCandidates.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent employees</p>
              ) : (
                recentCandidates.map((cand, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{cand.name}</p>
                      <p className="text-xs text-gray-500">
                        {cand.role} • {cand.date}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        cand.status === "New"
                          ? "bg-blue-100 text-blue-700"
                          : cand.status === "Interview"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {cand.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Meetings */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FaSync className="text-blue-500" /> Recent Meetings
              </h3>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {recentMeetings.length === 0 ? (
                <p className="text-gray-500 text-sm">No meetings</p>
              ) : (
                recentMeetings.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{m.title}</p>
                      <p className="text-xs text-gray-500">{m.date} • {m.time}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                      {m.status || "Scheduled"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
