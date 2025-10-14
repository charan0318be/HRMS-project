import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProfile } from "./ProfileContext";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { MdExpandMore, MdChevronRight } from "react-icons/md";

// Dashboard components
import Dashboard from "./Dashboard";
import ApplyLeave from "./ApplyLeave";
import Goals from "./Goals";
import CompanyProfile from "./CompanyProfile";
import Calender from "./Calender";
import TakeAppraisal from "./TakeAppraisal";
import ViewPaySlip from "./ViewPaySlip";
import UpdateProfile from "./UpdateProfile";
import Trips from "./Trips";
import AssetManagement from "./AssetManagement";

const DashboardNavbar = () => {
  const { profileName, role } = useProfile() || { profileName: "User", role: "user" };
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [personalExpanded, setPersonalExpanded] = useState(false);
  const [hrExpanded, setHrExpanded] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const personalSubItems = [
    { label: "Apply Leave", key: "applyleave" },
    { label: "Goals", key: "goals" },
    { label: "Take Appraisal", key: "appraisal" },
    { label: "View Payslip", key: "payslip" },
    { label: "Updated Profile", key: "profile" },
  ];

  const HRManagementSubItems = [
    { label: "Trips", key: "trips" },
    { label: "Asset Management", key: "assets" },
  ];

  const otherSections = [
    { label: "Dashboard", key: "dashboard" },
    { label: "Company Profile", key: "company" },
    { label: "Calendar", key: "calender" },
    { label: "Extras", key: "extras" },
  ];

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get("http://localhost:3001/notifications");
        setNotifications(res.data.filter((n) => n.userId === userId));
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleNotificationClick = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      try {
        const unread = notifications.filter((n) => !n.isRead);
        for (let n of unread) {
          await axios.put(`http://localhost:3001/notifications/${n._id}/read`);
        }
        const res = await axios.get("http://localhost:3001/notifications");
        const userId = localStorage.getItem("userId");
        setNotifications(res.data.filter((n) => n.userId === userId));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "applyleave":
        return <ApplyLeave />;
      case "goals":
        return <Goals />;
      case "appraisal":
        return <TakeAppraisal />;
      case "payslip":
        return <ViewPaySlip />;
      case "profile":
        return <UpdateProfile />;
      case "company":
        return <CompanyProfile />;
      case "calender":
        return <Calender />;
      case "trips":
        return <Trips />;
      case "assets":
        return <AssetManagement />;
      case "extras":
        return <div className="p-6 text-gray-700">Extras section coming soon...</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Fixed Gray Background */}
      <div className="fixed inset-0 bg-[#f5f6fa] z-0"></div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-gray-300 shadow w-full z-20">
        <h1 className="text-5xl font-bold">
          <span className="text-green-600">H</span>
          <span className="text-black">R</span>
          <span className="text-black">M</span>
        </h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-2xl text-gray-700"
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-100 shadow-md transition-transform duration-300 z-20 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="px-6 py-6 hidden md:block">
          <h1
            className="text-6xl font-semibold cursor-pointer"
            onClick={() => setActiveSection("dashboard")}
          >
            <span className="text-green-600">H</span>
            <span className="text-black">R</span>
            <span className="text-black">M</span>
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Dashboard */}
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`w-full text-left px-6 py-2 text-sm font-medium transition ${
              activeSection === "dashboard"
                ? "text-black hover:text-red-500"
                : "text-gray-800 hover:bg-[#e0e0e0] hover:text-gray-900"
            }`}
          >
            Dashboard
          </button>

          {/* Personal Management */}
          <button
            onClick={() => setPersonalExpanded(!personalExpanded)}
            className={`w-full text-left px-6 py-2 text-sm font-medium flex items-center justify-between`}
          >
            Personal Management
            {personalExpanded ? <MdExpandMore /> : <MdChevronRight />}
          </button>
          <div
            className={`transition-all duration-300 ${
              personalExpanded ? "max-h-[500px]" : "max-h-0 overflow-hidden"
            }`}
          >
            {personalSubItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full text-left px-6 py-2 text-sm font-normal transition ${
                  activeSection === item.key
                    ? "border-l-4 border-blue-600 bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-[#e0e0e0] hover:text-gray-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* HR Management */}
          <button
            onClick={() => setHrExpanded(!hrExpanded)}
            className={`w-full text-left px-6 py-2 text-sm font-medium flex items-center justify-between`}
          >
            HR Management
            {hrExpanded ? <MdExpandMore /> : <MdChevronRight />}
          </button>
          <div
            className={`transition-all duration-300 ${
              hrExpanded ? "max-h-[200px]" : "max-h-0 overflow-hidden"
            }`}
          >
            {HRManagementSubItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full text-left px-6 py-2 text-sm font-normal transition ${
                  activeSection === item.key
                    ? "border-l-4 border-blue-600 bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-[#e0e0e0] hover:text-gray-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Other Sections */}
          {otherSections
            .filter((s) => s.key !== "dashboard")
            .map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`w-full text-left px-6 py-2 text-sm font-medium transition ${
                  activeSection === section.key
                    ? "text-black bg-blue-50"
                    : "text-gray-800 hover:bg-[#e0e0e0] hover:text-gray-900"
                }`}
              >
                {section.label}
              </button>
            ))}
        </div>

        {/* Footer: Notifications & Logout */}
        <div className="px-4 py-4 border-t border-gray-300">
          <div className="flex items-center justify-between">
            <button
              onClick={handleNotificationClick}
              className="relative text-gray-500 hover:text-blue-600"
              title="Notifications"
            >
              <FaBell size={18} />
              {notifications.filter((n) => !n.isRead).length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              )}
            </button>

            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                profileName
              )}`}
              alt="User"
              className="w-8 h-8 rounded-full"
            />
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 w-full px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 relative overflow-y-auto h-screen z-10 p-6 bg-[#f5f6fa]">
        {renderSection()}
      </div>
    </div>
  );
};

export default DashboardNavbar;
