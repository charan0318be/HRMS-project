import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";

const Department = ({ initialTab = "view", hideTabs = false }) => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [editingDept, setEditingDept] = useState(null);
  const [selectedDeptDetails, setSelectedDeptDetails] = useState({
    name: "",
    description: "",
    head: "",
    branch: "",
    status: "Active",
  });

  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedRole, setSelectedRole] = useState("Employee");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const role = "admin"; // change this according to your auth logic

  // ------------------- Fetch Departments -------------------
  const fetchDepartments = async () => {
    try {
      console.log("[DEBUG] Fetching departments...");
      const res = await axios.get("https://hrms-project-1-eca3.onrender.com/api/departments");
      console.log("[DEBUG] Departments fetched:", res.data);
      setDepartments(res.data);
    } catch (err) {
      console.error("[ERROR] Fetching departments failed:", err.response || err);
    }
  };

  // ------------------- Fetch Employees -------------------
  const fetchEmployees = async () => {
    try {
      console.log("[DEBUG] Fetching employees...");
      const res = await axios.get("https://hrms-project-1-eca3.onrender.com/api/employees");
      console.log("[DEBUG] Employees fetched:", res.data);
      setEmployees(res.data);
    } catch (err) {
      console.error("[ERROR] Fetching employees failed:", err.response || err);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  useEffect(() => {
    setActiveTab(initialTab === "add" ? "add" : "view");
  }, [initialTab]);

  // ------------------- Handlers -------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedDeptDetails({ ...selectedDeptDetails, [name]: value });
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      console.log("[DEBUG] Adding department:", selectedDeptDetails);
      const res = await axios.post(
        "https://hrms-project-1-eca3.onrender.com/api/departments/add",
        selectedDeptDetails
      );
      console.log("[DEBUG] Department added:", res.data);
      setSelectedDeptDetails({
        name: "",
        description: "",
        head: "",
        branch: "",
        status: "Active",
      });
      setActiveTab("view");
      fetchDepartments();
    } catch (err) {
      console.error("[ERROR] Adding department failed:", err.response || err);
      alert(err.response?.data?.message || "Failed to add department");
    }
  };

  const handleEdit = (dept) => {
    console.log("[DEBUG] Editing department:", dept);
    setEditingDept(dept._id);
    setSelectedDeptDetails({
      name: dept.name,
      description: dept.description,
      head: dept.head,
      branch: dept.branch || "",
      status: dept.status || "Active",
    });
    setActiveTab("add");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log("[DEBUG] Updating department:", editingDept, selectedDeptDetails);
      const res = await axios.put(
        `https://hrms-project-1-eca3.onrender.com
/api/departments/${editingDept}`,
        selectedDeptDetails
      );
      console.log("[DEBUG] Department updated:", res.data);
      setEditingDept(null);
      setSelectedDeptDetails({
        name: "",
        description: "",
        head: "",
        branch: "",
        status: "Active",
      });
      setActiveTab("view");
      fetchDepartments();
    } catch (err) {
      console.error("[ERROR] Updating department failed:", err.response || err);
      alert(err.response?.data?.message || "Failed to update department");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      console.log("[DEBUG] Deleting department:", id);
      const res = await axios.delete(`https://hrms-project-1-eca3.onrender.com
/api/departments/${id}`);
      console.log("[DEBUG] Department deleted:", res.data);
      fetchDepartments();
    } catch (err) {
      console.error("[ERROR] Deleting department failed:", err.response || err);
    }
  };

  const handleAssignEmployee = async () => {
    if (!selectedEmployee) {
      alert("Please select an employee");
      return;
    }

    try {
      console.log("[DEBUG] Assigning employee:", {
        departmentId: selectedDepartment,
        employeeId: selectedEmployee,
        role: selectedRole,
      });

      const res = await axios.put(
        `https://hrms-project-1-eca3.onrender.com
/api/departments/assign/${selectedDepartment}`,
        { employees: [{ employeeId: selectedEmployee, role: selectedRole }] }
      );

      console.log("[DEBUG] Assignment response:", res.data);
      alert("Employee assigned successfully!");
      setShowAssignForm(false);
      setSelectedEmployee("");
      setSelectedRole("Employee");
      fetchDepartments();
    } catch (err) {
      console.error("[ERROR] Assign employee failed:", err.response || err);
      alert(err.response?.data?.message || "Failed to assign employee");
    }
  };

  // ------------------- Render -------------------
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Tabs */}
      {!hideTabs && (
        <div className="flex flex-wrap justify-center mb-6 gap-4">
          <button
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeTab === "view" ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("view")}
          >
            View Departments
          </button>
          {role === "admin" && (
            <button
              className={`px-6 py-2 rounded-full font-medium transition ${
                activeTab === "add" ? "bg-green-600 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => {
                setActiveTab("add");
                setEditingDept(null);
                setSelectedDeptDetails({ name: "", description: "", head: "", branch: "", status: "Active" });
              }}
            >
              {editingDept ? "Edit Department" : "Add Department"}
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Form */}
      {activeTab === "add" && role === "admin" && (
        <form
          onSubmit={editingDept ? handleUpdate : handleAddDepartment}
          className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto space-y-6 transition"
        >
          <h2 className="text-2xl font-semibold text-gray-700">{editingDept ? "Edit Department" : "Add New Department"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" name="name" value={selectedDeptDetails.name} onChange={handleChange} placeholder="Department Name" className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition" required />
            <input type="text" name="description" value={selectedDeptDetails.description} onChange={handleChange} placeholder="Description" className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition" />
            <input type="text" name="head" value={selectedDeptDetails.head} onChange={handleChange} placeholder="Head of Department" className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition" />
            <input type="text" name="branch" value={selectedDeptDetails.branch} onChange={handleChange} placeholder="Branch" className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition" />
            <select name="status" value={selectedDeptDetails.status} onChange={handleChange} className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-center">
            <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-md transition">{editingDept ? "Update Department" : "Add Department"}</button>
          </div>
        </form>
      )}

      {/* View Departments Table */}
      {activeTab === "view" && (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto mt-6 overflow-x-auto">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Department List</h3>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Description</th>
                <th className="border p-3 text-left">Head</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Date</th>
                <th className="border p-3 text-left">Branch</th>
                {role === "admin" && <th className="border p-3 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <tr key={dept._id} className="hover:bg-gray-50 transition">
                    <td className="border p-3">{dept.name}</td>
                    <td className="border p-3">{dept.description}</td>
                    <td className="border p-3">{dept.head}</td>
                    <td className="border p-3">{dept.status}</td>
                    <td className="border p-3">{new Date(dept.createdAt).toLocaleDateString()}</td>
                    <td className="border p-3">{dept.branch || "-"}</td>
                    {role === "admin" && (
                      <td className="border p-3 text-center space-x-2">
                        <button onClick={() => handleEdit(dept)} className="text-yellow-500 hover:text-yellow-600 text-lg" title="Edit Department"><FaEdit /></button>
                        <button onClick={() => handleDelete(dept._id)} className="text-red-500 hover:text-red-600 text-lg" title="Delete Department"><FaTrash /></button>
                        <button onClick={() => { setSelectedDepartment(dept._id); setShowAssignForm(true); }} className="text-blue-500 hover:text-blue-700 text-lg" title="Assign Employee"><FaUserPlus /></button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500">No departments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Employee Modal */}
     {showAssignForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={() => setShowAssignForm(false)}
      >
        X
      </button>

      <h2 className="text-xl font-semibold mb-4">Assign Employee to Department</h2>

      <div className="space-y-4">
        {/* Select Employee */}
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>{emp.name}</option>
          ))}
        </select>

        {/* Select Department */}
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>{dept.name}</option>
          ))}
        </select>

        {/* Select Role */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
        </select>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
          onClick={handleAssignEmployee}
        >
          Assign
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Department;
