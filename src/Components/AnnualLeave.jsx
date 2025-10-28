import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from "../socket"; // import socket

const AnnualLeave = ({ leaveType, onClose, onSubmit, initialData = {} }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    leaveType: leaveType || "",
    startDate: "",
    endDate: "",
    duration: "",
    resumptionDate: "",
    reason: "",
    handoverFile: null,
    leaveId: null,
    name: "", // profile name will be fetched
  });

  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  // Fetch User Name
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedUser = localStorage.getItem("userDashboardUser");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          setForm(prev => ({ ...prev, name: userObj.name }));
          return;
        }

        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await axios.get(`https://hrms-project-1-eca3.onrender.com
/employees/${userId}`);
        setForm(prev => ({ ...prev, name: res.data.name || "" }));
      } catch (err) {
        console.error("❌ Error fetching user profile:", err);
      }
    };

    fetchUserName();
  }, []);

  // Populate initial data if editing
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm(prev => ({
        ...prev,
        leaveType: initialData.leaveType || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        duration: initialData.duration || "",
        resumptionDate: initialData.resumptionDate || "",
        reason: initialData.reason || "",
        handoverFile: null,
        leaveId: initialData._id || null,
      }));
    } else {
      setForm(prev => ({ ...prev, leaveType }));
    }
  }, [initialData, leaveType]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  // Submit Leave
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submittingRef.current) return; // prevent duplicate
    submittingRef.current = true;
    setSubmitting(true);

    try {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      if (end < start) {
        alert("End date cannot be before start date");
        setSubmitting(false);
        submittingRef.current = false;
        return;
      }

      const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

      const formData = new FormData();
      formData.append("leaveType", form.leaveType);
      formData.append("startDate", start.toISOString());
      formData.append("endDate", end.toISOString());
      formData.append("duration", durationDays);
      formData.append("resumptionDate", new Date(form.resumptionDate).toISOString());
      formData.append("reason", form.reason);
      if (form.handoverFile) formData.append("handoverFile", form.handoverFile);
      formData.append("name", form.name);
      formData.append("employeeId", localStorage.getItem("userId"));

      let res;
      if (form.leaveId) {
        res = await axios.put(`https://hrms-project-1-eca3.onrender.com
/leave/${form.leaveId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post("https://hrms-project-1-eca3.onrender.com/leave/apply", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Emit socket event after successful submission
      if (res.data.leave) {
        socket.emit("leaveAdded", res.data.leave);
      }

      if (onSubmit) onSubmit(res.data.leave);
      if (onClose) onClose();
      navigate("/applyleave");
    } catch (err) {
      console.error("❌ Leave submit error:", err);
      alert("Failed to submit leave: " + (err.response?.data?.message || "Check console"));
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-[700px] h-[700px] rounded-lg shadow-lg p-8 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Leave Application ({form.leaveType} Leave)
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={form.name}
            readOnly
            className="w-full border rounded px-4 py-2 bg-gray-100"
          />
          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          >
            <option value="">Select Type</option>
            <option value="Annual">Annual</option>
            <option value="Sick">Sick</option>
            <option value="Maternity">Maternity</option>
            <option value="Casual">Casual</option>
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2"
            />
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="duration"
              value={form.duration || ""}
              readOnly
              placeholder="Auto-calculated"
              className="border rounded px-4 py-2 bg-gray-100"
            />
            <input
              type="date"
              name="resumptionDate"
              value={form.resumptionDate}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2"
            />
          </div>
          <textarea
            name="reason"
            rows="3"
            value={form.reason}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          />
          <input
            type="file"
            name="handoverFile"
            accept=".pdf,.jpg,.doc,.docx,.png"
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-red-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-green-600 text-white rounded"
            >
              {submitting ? "Submitting..." : form.leaveId ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnualLeave;
