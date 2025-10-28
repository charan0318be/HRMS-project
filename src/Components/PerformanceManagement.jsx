import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TakeAppraisal from "./TakeAppraisal"; 
import CreatePayslip from "./CreatePayslip";
import image from "../assets/Screenshot 2025-09-17 142949.png";

const PerformanceManagement = ({ onUpdate, initialTab = "overview", hideTabs = false }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [targets, setTargets] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [newTarget, setNewTarget] = useState({
    title: "",
    kpiWeight: "",
    description: "",
    employee: "", 
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState({});
  const didFetch = useRef(false); // prevent double fetch in Strict Mode
  const [submitting, setSubmitting] = useState(false);

  const handleUpdateProgress = async (target) => {
  try {
    const progress = prompt("Enter progress (0-100%)", target.progress || 0);
    const progressNum = Number(progress);
    if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
      alert("Enter a valid progress between 0-100");
      return;
    }

    await axios.put(`https://hrms-project-1-eca3.onrender.com
/targets/${target._id}/progress`, {
      progress: progressNum,
    });

    // Update local state immediately
    setTargets(prev =>
      prev.map(t => 
        t._id === target._id 
          ? { 
              ...t, 
              progress: progressNum, 
              status: progressNum === 100 ? "Completed" : "In Progress" 
            } 
          : t
      )
    );

    alert("Progress updated successfully");
  } catch (err) {
    console.error("Failed to update progress:", err);
    alert("Failed to update progress");
  }
};


const handleApprove = async (target) => {
  try {
    if (target.status !== "Completed") {
      alert("Cannot approve target before it is completed");
      return;
    }

    const managerRemarks = prompt("Enter remarks (optional)", "");
    const rating = prompt("Enter rating (0-100)", "100");

    await axios.put(`https://hrms-project-1-eca3.onrender.com
/targets/${target._id}/approve`, {
      managerRemarks,
      rating: Number(rating),
    });

    setTargets(prev =>
      prev.map(t => t._id === target._id ? { ...t, status: "Approved" } : t)
    );

    alert("Target approved successfully");
  } catch (err) {
    console.error("Failed to approve target:", err);
    alert("Failed to approve target");
  }
};




  // ------------------ FETCH TARGETS ------------------
  const fetchTargets = async () => {
    try {
      const url = "https://hrms-project-1-eca3.onrender.com/targets";
      console.log("[DEBUG] Fetching targets from URL:", url);
      const res = await axios.get(url);
      console.log("[DEBUG] Targets fetched successfully:", res.data);
      setTargets(res.data); // replace state, not append
    } catch (err) {
      console.error("[ERROR] Failed to fetch targets:", err);
    }
  };

  // ------------------ FETCH EMPLOYEES ------------------
  const fetchEmployees = async () => {
    try {
      const url = "https://hrms-project-1-eca3.onrender.com/employees";
      console.log("[DEBUG] Fetching employees from URL:", url);
      const res = await axios.get(url);
      console.log("[DEBUG] Employees fetched successfully:", res.data);
      setEmployeesList(res.data);
    } catch (err) {
      console.error("[ERROR] Failed to fetch employees:", err);
    }
  };

  useEffect(() => {
    if (didFetch.current) return; // prevent double fetch
    fetchTargets();
    fetchEmployees();
    didFetch.current = true;
  }, []);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // ------------------ VALIDATION ------------------
  const validateField = (name, value) => {
    let error = "";
    if (name === "title" && value.length < 3) error = "Title must be at least 3 characters";
    if (name === "kpiWeight" && (value < 1 || value > 100)) error = "KPI Weight must be 1-100";
    if (name === "employee" && !value) error = "Select an employee";
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTarget({ ...newTarget, [name]: value });
    validateField(name, value);
  };

  // ------------------ SUBMIT TARGET ------------------
  const handleTargetSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // prevent double submit
    const hasError = Object.values(errors).some((err) => err);
    if (hasError) {
      console.warn("[WARN] Form has errors, submission blocked:", errors);
      alert("Please fix form errors before submitting");
      return;
    }

    try {
      setSubmitting(true);
      const payload = { ...newTarget, kpiWeight: Number(newTarget.kpiWeight), employees: [newTarget.employee] };
      console.log("[DEBUG] Submitting new target payload:", payload);

      const res = await axios.post("https://hrms-project-1-eca3.onrender.com/targets", payload);
      console.log("[DEBUG] Target submitted successfully:", res.data);

      // Reset form
      setNewTarget({ title: "", kpiWeight: "", description: "", employee: "", startDate: "", endDate: "" });
      setActiveTab("targets");

      fetchTargets(); // fetch latest targets
    } catch (err) {
      console.error("[ERROR] Error submitting target:", err);
      alert("Failed to submit target. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------ RENDER ------------------
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {!hideTabs && (
        <div className="flex space-x-4 mb-6">
          {["overview", "target-setup", "targets", "appraisal", "createpayslips"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white border"}`}
            >
              {tab === "overview" ? "Overview" :
               tab === "target-setup" ? "Target Setup" :
               tab === "targets" ? "Targets" :
               tab === "appraisal" ? "Appraisal" :
               "Create Payslips"}
            </button>
          ))}
        </div>
      )}

      <div className="p-6 rounded-2xl bg-white shadow ">
        {activeTab === "overview" && (
          <div className="flex justify-center">
            <img src={image} alt="Overview" className="max-w-full h-[100vh]" />
          </div>
        )}

        {activeTab === "target-setup" && (
          <div className="flex justify-center">
            <form className="space-y-4 w-full max-w-md p-6 bg-white rounded shadow" onSubmit={handleTargetSubmit}>
              <h2 className="text-xl font-semibold mb-4">Set New Performance Target</h2>
              <div>
                <label className="block font-medium mb-1">Title</label>
                <input type="text" name="title" value={newTarget.title} onChange={handleChange} className="w-full p-2 border rounded" required />
                {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
              </div>

              <div>
                <label className="block font-medium mb-1">KPI Weight (1-100)</label>
                <input type="number" name="kpiWeight" value={newTarget.kpiWeight} onChange={handleChange} className="w-full p-2 border rounded" required />
                {errors.kpiWeight && <span className="text-red-500 text-sm">{errors.kpiWeight}</span>}
              </div>

              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea name="description" value={newTarget.description} onChange={handleChange} className="w-full p-2 border rounded" rows={4} />
              </div>

              <div>
                <label className="block font-medium mb-1">Employee</label>
                <select name="employee" value={newTarget.employee} onChange={handleChange} className="w-full p-2 border rounded" required>
                  <option value="">Select employee</option>
                  {employeesList.map((emp) => (
                    <option key={emp._id} value={emp._id}>{emp.name}</option>
                  ))}
                </select>
                {errors.employee && <span className="text-red-500 text-sm">{errors.employee}</span>}
              </div>

              <div className="flex gap-2">
                <input type="date" name="startDate" value={newTarget.startDate} onChange={handleChange} className="w-1/2 p-2 border rounded" />
                <input type="date" name="endDate" value={newTarget.endDate} onChange={handleChange} className="w-1/2 p-2 border rounded" />
              </div>

              <button type="submit" disabled={submitting} className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700">
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        )}

       {activeTab === "targets" && (
  <div>
    <h2 className="text-xl font-semibold text-center mb-4">Manage Targets</h2>
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 p-2">Title</th>
          <th className="border border-gray-300 p-2">KPI Weight</th>
          <th className="border border-gray-300 p-2">Employees</th>
          <th className="border border-gray-300 p-2">Start Date</th>
          <th className="border border-gray-300 p-2">End Date</th>
          <th className="border border-gray-300 p-2">Status</th>
          <th className="border border-gray-300 p-2">Progress</th>
          <th className="border border-gray-300 p-2">Actions</th>
          

        </tr>
      </thead>
      <tbody>
        {targets.length > 0 ? (
          targets.map((t) => (
            <tr key={t._id} className="hover:bg-gray-50 text-center">
              <td className="border p-2">{t.title}</td>
              <td className="border p-2">{t.kpiWeight}%</td>
              <td className="border p-2">
                {Array.isArray(t.employees)
                  ? t.employees.map(e => e.name || e).join(", ")
                  : t.employees}
              </td>
              <td className="border p-2">{t.startDate ? new Date(t.startDate).toLocaleDateString() : "-"}</td>
              <td className="border p-2">{t.endDate ? new Date(t.endDate).toLocaleDateString() : "-"}</td>
              <td className="border p-2">{t.status || "Pending"}</td>
             <td className="border p-2">
  {t.progress !== undefined && t.progress !== null ? t.progress + "%" : ""}
            </td>

<td className="border p-2 space-x-2">
  {/* Employee Actions */}
  {t.userRole === "employee" && t.status !== "Completed" && (
    <button
      onClick={() => handleUpdateProgress(t)}
      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
    >
      Update Progress
    </button>
  )}
  {/* Manager Actions */}
  {t.userRole === "manager" && t.status === "Completed" && (
    <button
      onClick={() => handleApprove(t)}
      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
    >
      Approve
    </button>
  )}
</td>

            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="text-center p-4 text-gray-500">
              No targets found.
            </td>
          </tr>
        )}
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
