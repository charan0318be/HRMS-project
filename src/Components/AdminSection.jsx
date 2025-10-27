import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdChevronRight, MdExpandMore } from "react-icons/md";

import AdminDashboard from "./AdminDashboard";
import CompanyProfile from "./CompanyProfile";
import PerformanceManagement from "./PerformanceManagement";
import LeaveManagement from "./LeaveManagement";
import Department from "./Department";
import Calender from "./Calender";
import AttendanceDashboard from "./AttendanceDashboard";
import AssetManagement from "./AssetManagement";

import AdminTrip from "./AdminTrip";
import ResignationList from "./ResignationList";
import UpdateProfile from "./UpdateProfile";
import AdminMeetings from "./AdminMeetings";

const AdminSection = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [performanceExpanded, setPerformanceExpanded] = useState(false);
  const [leaveExpanded, setLeaveExpanded] = useState(false);
  const [departmentExpanded, setDepartmentExpanded] = useState(false);
  const [hrExpanded, setHrExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notifications, setNotifications] = useState([]);
  const [AssetExpanded, setAssetExpanded] = useState(false);
  const [meetingExpanded, setMeetingExpanded] = useState(false);


  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:3001/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Submenu items
  const PerformanceSubItems = [
    { label: "Overview", key: "overview" },
    { label: "Set Target", key: "target-setup" },
    { label: "View Target", key: "targets" },
    { label: "View Appraisal", key: "appraisal" },
    { label: "Create Payslip", key: "createpayslips" },
  ];

  const LeaveSubItems = [
    { label: "Leave Settings", key: "leave-setting" },
    { label: "Leave History", key: "leave-history" },
    { label: "Leave Recall", key: "leave-recall" },
  ];

  const DepartmentSubItems = [
    { label: "View Departments", key: "view-department" },
    { label: "Add Department", key: "add-department" },
  ];

  const HRManagementSubItems = [
    { label: "Trips", key: "trips" },
    { label: "Resignation", key: "Resignation" },
  ];

  const AssetManagementSubItems = [
    { label: "Asset ", key: "Asset" },
    { label: "Asset Type", key: "Asset Type" },
  ];
  const MeetingSubItems = [
   { label: "Meetings", key: "Meeting" },
    { label: "New meeting", key: "New Meeting" },
  ];

  const otherSections = [
    { label: "Dashboard", key: "dashboard" },
    { label: "Attendance", key: "Attendance" },
    { label: "Admin Profile", key: "admin-profile" },
    { label: "Company Profile", key: "company" },
    { label: "Calender", key: "calender" },
  ];

  // Render main content
  const renderSection = () => {
    // Performance Management
    if (PerformanceSubItems.some((i) => i.key === activeSection)) {
      return <PerformanceManagement initialTab={activeSection} hideTabs={true} />;
    }
    if (activeSection === "Asset" || activeSection === "Asset Type") {
  return <AssetManagement activeTab={activeSection.toLowerCase()} />;
}


    // Leave Management
    if (LeaveSubItems.some((i) => i.key === activeSection)) {
      return (
        <LeaveManagement
        activeSubmenu={activeSection} // pass the selected submenu dynamically
        hideTabs={true}
        setActiveSection={setActiveSection}
        />
      );
    }

     if (MeetingSubItems.some((i) => i.key === activeSection)) {
      return (
        <AdminMeetings
        activeSubmenu={activeSection} // pass the selected submenu dynamically
        hideTabs={true}
        setActiveSection={setActiveSection}
        />
      );
    }

    // Department Management
    if (DepartmentSubItems.some((i) => i.key === activeSection)) {
      const tab = activeSection === "view-department" ? "view" : "add";
      return (
        <Department
          initialTab={tab}
          hideTabs={true}
          setActiveSection={(key) =>
            setActiveSection(key === "view" ? "view-department" : "add-department")
          }
        />
      );
    }

    // HR Management
    if (HRManagementSubItems.some((i) => i.key === activeSection)) {
      if (activeSection === "assetmanagement") return <AssetManagement />;
      if (activeSection === "trips") return <AdminTrip />;
    }

    // Other Sections
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "Resignation":
        return <ResignationList />;
       case "Meeting":
        return <AdminMeetings />;
      case "admin-profile":
        return <UpdateProfile />;
      case "company":
        return <CompanyProfile isAdmin={true} />;
      case "calender":
        return <Calender isAdmin={true} />;
      case "Attendance":
        return <AttendanceDashboard isAdmin={true} />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-black  rounded shadow-[g] transition-transform duration-300 z-20 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="px-6 py-6 hidden md:block">
          <h1
            className="text-6xl text-red-600 font-semibold cursor-pointer"
            onClick={() => setActiveSection("dashboard")}
          >
            HRM
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto h-[80vh]" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {/* Dashboard */}
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`w-full text-white text-bold text-left px-6 py-2  font-medium transition ${
              activeSection === "dashboard"
                ?  "border-l-4 border-blue-600  text-blue-600"
                : "text-white hover:bg-red-300 rounded-3xl hover:text-blue-900"
            }`}
          >
            Dashboard
          </button>

          {/* Performance Management */}
          <button
            onClick={() => setPerformanceExpanded(!performanceExpanded)}
            className="w-full text-left text-white px-6 text-bold py-2 text-bold font-medium flex items-center justify-between"
          >
            Performance Management
            {performanceExpanded ? <MdExpandMore /> : <MdChevronRight />}
          </button>
          <div
            className={`transition-all duration-300 ${
              performanceExpanded ? "max-h-[500px]" : "max-h-0 overflow-hidden"
            }`}
          >
            {PerformanceSubItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full text-left px-6 py-2 text-bold font-normal transition ${
                  activeSection === item.key
                    ? "border-l-4 border-blue-600  text-white hover:bg-amber-500 rounded-4xl "
                    : "text-white hover:bg-red-300 rounded-3xl hover:text-blue-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>


          <button
            onClick={() => setMeetingExpanded(!meetingExpanded)}
            className="w-full text-left text-white px-6 text-bold py-2 text-bold font-medium flex items-center justify-between"
          >
            Meeting
            {meetingExpanded ? <MdExpandMore /> : <MdChevronRight />}
          </button>
          <div
            className={`transition-all duration-300 ${
              meetingExpanded ? "max-h-[500px]" : "max-h-0 overflow-hidden"
            }`}
          >
            {MeetingSubItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full text-left px-6 py-2 text-bold font-normal transition ${
                  activeSection === item.key
                    ? "border-l-4 border-blue-600  text-white hover:bg-amber-500 rounded-4xl "
                    : "text-white hover:bg-red-300 rounded-3xl hover:text-blue-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Leave Management */}
          <button
            onClick={() => setLeaveExpanded(!leaveExpanded)}
            className="w-full text-left text-white px-6 py-2 text-bold font-medium flex items-center justify-between"
          >
            Leave Management
            {leaveExpanded ? <MdExpandMore /> : <MdChevronRight />}
          </button>
          <div
            className={`transition-all duration-300 ${
              leaveExpanded ? "max-h-[500px]" : "max-h-0 overflow-hidden"
            }`}
          >
            {LeaveSubItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full text-left px-6 py-2 text-bold font-normal transition ${
                  activeSection === item.key
                    ?"border-l-4 border-blue-600  text-white hover:bg-amber-500 rounded-4xl "
                    : "text-white hover:bg-red-300 rounded-3xl hover:text-blue-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Asset Management */}
          <button onClick={() => setAssetExpanded(!AssetExpanded)}className="w-full text-white text-left px-6 py-2 text-sm font-medium flex items-center justify-between"
                    >
             Asset Management
              {AssetExpanded ? <MdExpandMore /> : <MdChevronRight />}
          </button>
            <div className={`transition-all duration-300 ${ AssetExpanded ? "max-h-[200px]" : "max-h-0 overflow-hidden"
                  }`}
            >
             {AssetManagementSubItems.map((item) => (
               <button
             key={item.key}
               onClick={() => setActiveSection(item.key)}
                 className={`w-full text-left px-6 py-2 text-bold font-normal transition ${
                 activeSection === item.key
                 ? "border-l-4 border-blue-600  text-white hover:bg-amber-500 rounded-4xl "
                       : "text-white hover:bg-red-300 rounded-3xl hover:text-blue-900"
                   }`}
                >
                      {item.label}
                    </button>
                      ))}
                      </div>

          {/* Department */}
          <button
            onClick={() => setDepartmentExpanded(!departmentExpanded)}
            className="w-full text-white text-bold text-left px-6 py-2 text-sm font-medium flex items-center justify-between"
          >
            Department
            {departmentExpanded ? <MdExpandMore /> : <MdChevronRight />}
          </button>
          <div
            className={`transition-all duration-300 ${
              departmentExpanded ? "max-h-[200px]" : "max-h-0 overflow-hidden"
            }`}
          >
            {DepartmentSubItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full text-left px-6 py-2 text-bold font-normal transition ${
                  activeSection === item.key
                    ? "border-l-4 border-blue-600  text-white hover:bg-amber-500 rounded-4xl "
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
            className="w-full text-bold text-left text-white px-6 py-2 text-bold font-medium flex items-center justify-between"
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
                className={`w-full text-left px-6 py-2 text-bold font-normal transition ${
                  activeSection === item.key
                    ? "border-l-4 border-blue-600  text-white hover:bg-amber-500 rounded-4xl "
                    : "text-white hover:bg-red-300 rounded-3xl hover:text-blue-900"
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
                className={`w-full text-left px-6 py-2 text-bold font-medium transition ${
                  activeSection === section.key
                    ? "text-white hover:bg-amber-500 rounded-3xl "
                    : "text-white hover:bg-red-300 rounded-3xl hover:text-blue-900"
                }`}
              >
                {section.label}
              </button>
            ))}
           <div className="px-4 py-4 border-t border-gray-300">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

        </div>

        {/* Logout */}
       
      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 relative overflow-y-auto h-screen z-10">
        <div className="p-6">{renderSection()}</div>
      </div>
    </div>
  );
};

export default AdminSection;
