import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdChevronRight, MdExpandMore } from "react-icons/md";

import AdminDashboard from "./AdminDashboard";
import CompanyProfile from "./CompanyProfile";
import PerformanceManagement from "./PerformanceManagement";
import LeaveManagement from "./LeaveManagement";
import Department from "./Department";
import Calender from "./Calender";
import AttendanceDashboard from "./AttendanceDashboard";

import AssetManagement from "./AssetManagement";
import Trips from "./Trips";

const AdminSection = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [performanceExpanded, setPerformanceExpanded] = useState(false);
  const [leaveExpanded, setLeaveExpanded] = useState(false);
  const [departmentExpanded, setDepartmentExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

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

  const otherSections = [
    { label: "Dashboard", key: "dashboard" },
    { label: "Attendance", key: "Attendance" },
    { label: "Admin Profile", key: "admin-profile" },
    { label: "Company Profile", key: "company" },
    { label: "Calendar", key: "calender" },
    { label: "Asset Management", key: "assets" },
    { label: "Trip Management", key: "trips" },
    { label: "Extras", key: "extras" },
  ];

  // Render main content
  const renderSection = () => {
    if (PerformanceSubItems.some((i) => i.key === activeSection)) {
      return <PerformanceManagement initialTab={activeSection} hideTabs={true} />;
    }

    if (LeaveSubItems.some((i) => i.key === activeSection)) {
      return (
        <LeaveManagement
          initialTab={activeSection}
          hideTabs={true}
          setActiveSection={setActiveSection}
        />
      );
    }

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

    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "company":
        return <CompanyProfile isAdmin={true} />;
      case "calender":
        return <Calender isAdmin={true} />;
      case "Attendance":
        return <AttendanceDashboard isAdmin={true} />;
      case "assets":
        return <AssetManagement />;
      case "trips":
        return <Trips />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen">
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
            HRM
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Other Sections */}
          {otherSections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`w-full text-left px-6 py-2 text-sm font-medium transition ${
                activeSection === section.key
                  ? "text-black bg-blue-50"
                  : "text-gray-800 hover:bg-blue-50 hover:text-gray-900"
              }`}
            >
              {section.label}
            </button>
          ))}

          {/* Performance Management */}
          <button
            onClick={() => setPerformanceExpanded(!performanceExpanded)}
            className="w-full text-left px-6 py-2 text-sm font-medium flex items-center justify-between"
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
                className={`w-full text-left px-6 py-2 text-sm font-normal transition ${
                  activeSection === item.key
                    ? "border-l-4 border-blue-600 bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-300">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 relative overflow-y-auto h-screen z-10 bg-gray-50">
        <div className="p-6">{renderSection()}</div>
      </div>
    </div>
  );
};

export default AdminSection;
