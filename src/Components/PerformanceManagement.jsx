import React, { useState, useEffect } from "react";
import axios from "axios";
import TakeAppraisal from "./TakeAppraisal"; 
import CreatePayslip from "./CreatePayslip";
import image from "../assets/Screenshot 2025-09-17 142949.png";

const PerformanceManagement = ({ onUpdate, initialTab = "overview", hideTabs = false }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [targets, setTargets] = useState([]);
  const [newTarget, setNewTarget] = useState({
    title: "",
    kpiWeight: "",
    description: "",
    employees: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState({});

  const fetchTargets = async () => {
    try {
      const res = await axios.get("http://localhost:3001/targets");
      setTargets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Real-time validation
  const validateField = (name, value) => {
    let error = "";
    if (name === "title" && value.length < 3) error = "Title must be at least 3 characters";
    if (name === "kpiWeight" && (value < 1 || value > 100)) error = "KPI Weight must be 1-100";
    if (name === "employees" && value.trim() === "") error = "Enter at least one employee";
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTarget({ ...newTarget, [name]: value });
    validateField(name, value);
  };

  const handleTargetSubmit = async (e) => {
    e.preventDefault();
    // Check if any errors exist
    const hasError = Object.values(errors).some((err) => err);
    if (hasError) {
      alert("Please fix form errors before submitting");
      return;
    }
    try {
      const payload = { ...newTarget, kpiWeight: Number(newTarget.kpiWeight) };
      await axios.post("http://localhost:3001/targets", payload);
      setNewTarget({
        title: "",
        kpiWeight: "",
        description: "",
        employees: "",
        startDate: "",
        endDate: "",
      });
      setActiveTab("targets");
      fetchTargets();
    } catch (err) {
      console.error("Error submitting target:", err);
      alert("Failed to submit target. Check console.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {!hideTabs && (
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded ${activeTab === "overview" ? "bg-blue-600 text-white" : "bg-white border"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("target-setup")}
            className={`px-4 py-2 rounded ${activeTab === "target-setup" ? "bg-blue-600 text-white" : "bg-white border"}`}
          >
            Target Setup
          </button>
          <button
            onClick={() => setActiveTab("targets")}
            className={`px-4 py-2 rounded ${activeTab === "targets" ? "bg-blue-600 text-white" : "bg-white border"}`}
          >
            Targets
          </button>
          <button
            onClick={() => setActiveTab("appraisal")}
            className={`px-4 py-2 rounded ${activeTab === "appraisal" ? "bg-blue-600 text-white" : "bg-white border"}`}
          >
            Appraisal
          </button>
          <button
            onClick={() => setActiveTab("createpayslips")}
            className={`px-4 py-2 rounded ${activeTab === "createpayslips" ? "bg-blue-600 text-white" : "bg-white border"}`}
          >
            Create Payslips
          </button>
        </div>
      )}

      <div className="p-6 rounded shadow bg-white">
        {activeTab === "overview" && (
          <div className="flex justify-center">
            <img src={image} alt="Overview" className="max-w-full h-[100vh]" />
          </div>
        )}

        {activeTab === "target-setup" && (
          <div className="flex justify-center">
            <form className="space-y-4 w-full max-w-md p-6 bg-white rounded shadow" onSubmit={handleTargetSubmit}>
              <h2 className="text-xl font-semibold mb-4">Set New Performance Target</h2>

              {/* Interactive Input Field */}
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  value={newTarget.title}
                  onChange={handleChange}
                  required
                  className="peer w-full p-2 border rounded outline-none focus:border-blue-600 transition"
                />
                <label className="absolute left-2 top-2 text-gray-400 text-sm peer-focus:-top-3 peer-focus:text-blue-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 transition">
                  Title
                </label>
                {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
              </div>

              <div className="relative">
                <input
                  type="number"
                  name="kpiWeight"
                  value={newTarget.kpiWeight}
                  onChange={handleChange}
                  required
                  className="peer w-full p-2 border rounded outline-none focus:border-blue-600 transition"
                />
                <label className="absolute left-2 top-2 text-gray-400 text-sm peer-focus:-top-3 peer-focus:text-blue-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 transition">
                  KPI Weight (1-100)
                </label>
                {errors.kpiWeight && <span className="text-red-500 text-sm">{errors.kpiWeight}</span>}
              </div>

              <div className="relative">
                <textarea
                  name="description"
                  value={newTarget.description}
                  onChange={handleChange}
                  className="peer w-full p-2 border rounded outline-none focus:border-blue-600 transition"
                  placeholder="Description"
                />
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="employees"
                  value={newTarget.employees}
                  onChange={handleChange}
                  required
                  className="peer w-full p-2 border rounded outline-none focus:border-blue-600 transition"
                />
                <label className="absolute left-2 top-2 text-gray-400 text-sm peer-focus:-top-3 peer-focus:text-blue-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 transition">
                  Employees (comma separated)
                </label>
                {errors.employees && <span className="text-red-500 text-sm">{errors.employees}</span>}
              </div>

              <div className="flex gap-2">
                <input
                  type="date"
                  name="startDate"
                  value={newTarget.startDate}
                  onChange={handleChange}
                  className="w-1/2 p-2 border rounded outline-none focus:border-blue-600 transition"
                />
                <input
                  type="date"
                  name="endDate"
                  value={newTarget.endDate}
                  onChange={handleChange}
                  className="w-1/2 p-2 border rounded outline-none focus:border-blue-600 transition"
                />
              </div>

              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition">
                Submit
              </button>
            </form>
          </div>
        )}

        {activeTab === "targets" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Manage Targets</h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Title</th>
                  <th className="border border-gray-300 p-2">KPI Weight</th>
                  <th className="border border-gray-300 p-2">Employees</th>
                  <th className="border border-gray-300 p-2">Start Date</th>
                  <th className="border border-gray-300 p-2">End Date</th>
                </tr>
              </thead>
              <tbody>
                {targets.map((t) => (
                  <tr className="hover:bg-gray-50" key={t._id}>
                    <td className="border border-gray-300 p-2">{t.title}</td>
                    <td className="border border-gray-300 p-2">{t.kpiWeight}</td>
                    <td className="border border-gray-300 p-2">{t.employees}</td>
                    <td className="border border-gray-300 p-2">{t.startDate?.split("T")[0]}</td>
                    <td className="border border-gray-300 p-2">{t.endDate?.split("T")[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "appraisal" && <TakeAppraisal isAdmin={true} onUpdate={onUpdate} />}
        {activeTab === "createpayslips" && <CreatePayslip />}
      </div>
    </div>
  );
};

export default PerformanceManagement;
