import axios from 'axios';
import React, { useEffect, useState } from 'react'

const MaternityLeave = ({ leaveType, onClose, onSubmit, initialData = {}, profileName }) => {
  const [form, setForm] = useState({
    leaveType: leaveType || '',
    startDate: '',
    endDate: '',
    duration: '',
    resumptionDate: '',
    reason: '',
    reliefOfficer: '',
    handoverFile: null,
    leaveId: null,
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        leaveType: initialData.leaveType || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        duration: initialData.duration || '',
        resumptionDate: initialData.resumptionDate || '',
        reason: initialData.reason || '',
        reliefOfficer: initialData.reliefOfficer || '',
        handoverFile: null,
        leaveId: initialData._id || null, // ✅ ensure leaveId is set
      });
    } else {
      setForm(prev => ({ ...prev, leaveType }));
    }
  }, [initialData, leaveType]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'leaveId' && value !== null) formData.append(key, value);
      });
      formData.append("name", profileName);
      formData.append("employeeId", localStorage.getItem("userId"));

      let res;

      if (form.leaveId) {
        console.log("Updating leaveId:", form.leaveId);

        // ✅ Update existing leave
        res = await axios.put(
          `http://localhost:3001/leave/${form.leaveId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        alert("Leave updated successfully!");
      } else {
        // 🆕 Create new leave
        res = await axios.post(
          "http://localhost:3001/leave/apply",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        alert("Leave submitted successfully!");
      }

      // Update parent table if leave data exists
      if (res.data.leave) onSubmit(res.data.leave);

      onClose(); // Close modal
    } catch (err) {
      console.error("Leave submit error:", err);
      alert("Failed to submit/update leave. Check console for details.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-[700px] h-[700px] rounded-lg shadow-lg p-8 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Leave Application ({form.leaveType} Leave)
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={profileName}
              readOnly
              className="w-full border rounded px-4 py-2 bg-gray-100 text-gray-700"
            />
          </div>

          {/* Leave Type */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Leave Type</label>
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
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                className="w-full border rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                className="w-full border rounded px-4 py-2"
              />
            </div>
          </div>

          {/* Duration & Resumption */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Duration (days)</label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                required
                className="w-full border rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Resumption Date</label>
              <input
                type="date"
                name="resumptionDate"
                value={form.resumptionDate}
                onChange={handleChange}
                required
                className="w-full border rounded px-4 py-2"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Reason for Leave</label>
            <textarea
              name="reason"
              rows="3"
              value={form.reason}
              onChange={handleChange}
              required
              className="w-full border rounded px-4 py-2"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Attach Handover Document</label>
            <input
              type="file"
              name="handoverFile"
              accept=".pdf,.jpg,.doc,.docx,.png"
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />
          </div>

          {/* Relief Officer */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Relief Officer</label>
            <input
              type="text"
              name="reliefOfficer"
              value={form.reliefOfficer}
              onChange={handleChange}
              list="relief-options"
              placeholder="Enter or select relief officer"
              required
              className="w-full border rounded px-4 py-2"
            />
            <datalist id="relief-options">
              <option value="John Doe" />
              <option value="Jane Smith" />
              <option value="Amit Kumar" />
            </datalist>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {form.leaveId ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaternityLeave
