import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "./ProfileContext";
import axios from "axios";
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
import AssetManagement from "./AssetManagement";
import AttendanceDashboard from "./AttendanceDashboard";
import UserTrip from "./UserTrip";
import EmployeeList from "./EmployeeList";
import ResignationForm from "./ResignationForm";
import UserMeetings from "./UserMeetings";

const DashboardNavbar = () => {
  const { profileName, role } = useProfile() || { profileName: "User", role: "user" };
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [personalExpanded, setPersonalExpanded] = useState(false);
  const [hrExpanded, setHrExpanded] = useState(false);
  const [assetExpanded, setAssetExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [attendanceRefreshTrigger, setAttendanceRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Sidebar Items
  const personalSubItems = [
    { label: "Apply Leave", key: "applyleave" },
    { label: "Goals", key: "goals" },
    { label: "View Payslip", key: "payslip" },
    { label: "Updated Profile", key: "profile" },
  ];

  const hrSubItems = [
    { label: "Trips", key: "trips" },
    { label: "Employee", key: "Employee" },
    { label: "Resignation", key: "resignation" },
  ];

  const assetSubItems = [
    { label: "Asset", key: "asset" },
    { label: "Asset Type", key: "assetType" },
  ];

  const otherSections = [
    { label: "Dashboard", key: "dashboard" },
    { label: "Company Profile", key: "company" },
    { label: "Calendar", key: "calender" },
    { label: "Meeting", key: "Meeting" },
    { label: "Attendance", key: "attendance" },
  ];

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Attendance
  const handleCheckIn = async () => {
    if (!userId) return alert("User ID missing! Cannot check in.");
    try {
      setLoading(true);
      await axios.post("http://localhost:3001/attendance/checkin", { userId });
      alert("✅ Checked in successfully!");
      setAttendanceRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!userId) return alert("User ID missing! Cannot check out.");
    try {
      setLoading(true);
      await axios.put("http://localhost:3001/attendance/checkout", { userId });
      alert("✅ Checked out successfully!");
      setAttendanceRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      alert(err.response?.data?.message || "Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  // Render section
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut} loading={loading} />;
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
      case "Meeting":
        return <UserMeetings />;
      case "trips":
        return <UserTrip />;
      case "resignation":
        return <ResignationForm employeeId={userId} />;
      case "Employee":
        return <EmployeeList />;
      case "attendance":
        return <AttendanceDashboard isAdmin={role === "admin"} refreshTrigger={attendanceRefreshTrigger} />;
      case "asset":
        return <AssetManagement isAdmin={role === "admin"} currentUserId={userId} activeTab="asset" />;
      case "assetType":
        return <AssetManagement isAdmin={role === "admin"} currentUserId={userId} activeTab="assetType" />;
      default:
        return <Dashboard handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut} loading={loading} />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-black shadow-md transition-transform duration-300 z-20 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 flex flex-col`}
      >
        {/* Logo */}
        <div className="px-6 py-6 hidden md:block">
          <h1
            className="text-6xl text-coll font-semibold cursor-pointer"
            onClick={() => setActiveSection("dashboard")}
          >
            <span className="text-green-600">H</span>
            <span className="text-green-600">R</span>
            <span className="text-green-600">M</span>
          </h1>
        </div>

        {/* Scrollable menu */}
        <div className="flex-1 overflow-y-auto px-0 scrollbar-hide">
          {/* Other Sections */}
          {otherSections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`w-full text-left px-6 py-2 text-bold text-white font-medium transition ${
                activeSection === section.key
                  ? "border-l-4 border-blue-600 text-white hover:bg-amber-500 rounded-4xl"
                  : "text-white hover:bg-red-300 rounded-3xl hover:text-blue-900"
              }`}
            >
              {section.label}
            </button>
          ))}

          {/* Personal Management */}
          <button
            onClick={() => setPersonalExpanded(!personalExpanded)}
            className="w-full text-left px-6 py-2 text-bold text-white font-medium flex items-center justify-between mt-4"
          >
            Personal Management
            {personalExpanded ? <MdExpandMore /> : <MdChevronRight />}
          </button>
          <div className={`transition-all duration-300 ${personalExpanded ? "max-h-[500px]" : "max-h-0 overflow-hidden"}`}>
            {personalSubItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full text-left px-6 py-2 text-bold font-normal transition ${
                  activeSection === item.key
                    ? "border-l-4 border-blue-600 text-white hover:bg-amber-500 rounded-4xl"
                    : "text-white hover:bg-red-300 rounded-3xl hover:text-blue-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* HR Management */}
          <button
            onClick={() => setHrExpanded(!hrExpanded)}
            className="w-full text-left px-6 py-2 text-bold text-white font-medium flex items-center justify-between mt-4"
          >
            HR Management
            {hrExpanded ? <MdExpandMore /> : <MdChevronRight />}
          </button>
          <div className={`transition-all duration-300 ${hrExpanded ? "max-h-[200px]" : "max-h-0 overflow-hidden"}`}>
            {hrSubItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full text-left px-6 py-2 text-bold font-normal transition ${
                  activeSection === item.key
                    ? "border-l-4 border-blue-600 text-white hover:bg-amber-500 rounded-4xl"
                    : "text-white hover:bg-red-300 rounded-3xl hover:text-blue-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Asset Management */}
          <button
            onClick={() => setAssetExpanded(!assetExpanded)}
            className="w-full text-left px-6 py-2 text-sm font-medium text-white flex items-center justify-between mt-4"
          >
            Asset Management
            {assetExpanded ? <MdExpandMore /> : <MdChevronRight />}
          </button>
          <div className={`transition-all duration-300 ${assetExpanded ? "max-h-[200px]" : "max-h-0 overflow-hidden"}`}>
            {assetSubItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full text-left px-6 py-2 text-bold text-white font-normal transition ${
                  activeSection === item.key
                    ? "border-l-4 border-blue-600 text-white hover:bg-amber-500 rounded-4xl"
                    : "text-white hover:bg-red-300 rounded-3xl hover:text-blue-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-4">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
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
