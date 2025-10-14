import React, { useState, useEffect } from "react";
import axios from "axios";

const Department = ({ initialTab = "view", hideTabs = false, setActiveSection }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // "view" or "add"
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState("");

  // Sync activeTab with initialTab from AdminSection
  useEffect(() => {
    if (initialTab === "view-department" || initialTab === "view") {
      setActiveTab("view");
    } else if (initialTab === "add-department" || initialTab === "add") {
      setActiveTab("add");
    }
  }, [initialTab]);

  // Fetch departments from backend
  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:3001/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Handle adding a new department
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDept) return;
    try {
      await axios.post("http://localhost:3001/departments", { name: newDept });
      setNewDept("");
      fetchDepartments(); // Refresh the list

      // Navigate to View Departments after adding
      if (setActiveSection) {
        setActiveSection("view-department");
      } else {
        setActiveTab("view");
      }
    } catch (err) {
      console.error("Error adding department:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Department Management</h1>

      {/* Tabs */}
      {!hideTabs && (
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("view")}
            className={`px-4 py-2 rounded-md font-semibold ${
              activeTab === "view"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-yellow-400 hover:text-white"
            }`}
          >
            View Departments
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-4 py-2 rounded-md font-semibold ${
              activeTab === "add"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-yellow-400 hover:text-white"
            }`}
          >
            Add Department
          </button>
        </div>
      )}

      {/* View Departments */}
      {activeTab === "view" && (
        <div className="bg-white p-6 rounded shadow-md max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Departments List</h2>
          {departments.length === 0 ? (
            <p className="text-gray-500">No departments available.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {departments.map((dept) => (
                <li key={dept._id} className="py-2 flex justify-between items-center">
                  <span>{dept.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Add Department */}
      {activeTab === "add" && (
        <div className="bg-white p-6 rounded shadow-md max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Add New Department</h2>
          <form className="space-y-4" onSubmit={handleAddDepartment}>
            <input
              type="text"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              placeholder="Department Name"
              required
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  if (setActiveSection) setActiveSection("view-department");
                  else setActiveTab("view");
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Department;
