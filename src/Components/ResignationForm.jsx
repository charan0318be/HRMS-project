// ResignationForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const ResignationForm = ({ employeeId }) => {
  const [reason, setReason] = useState("");
  const [lastWorkingDay, setLastWorkingDay] = useState("");
  const [message, setMessage] = useState("");
  const [resignation, setResignation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("[DEBUG] ResignationForm mounted. employeeId:", employeeId);
    if (employeeId) fetchResignation();
  }, [employeeId]);

  const fetchResignation = async () => {
    try {
      console.log("[DEBUG] Fetching resignation for employeeId:", employeeId);
      const res = await axios.get(`https://hrms-project-1-eca3.onrender.com
/api/resignations/my/${employeeId}`);
      if (res.data) {
        setResignation(res.data);
        console.log("[DEBUG] Current resignation fetched:", res.data);
      }
    } catch (err) {
      console.error("[ERROR] Fetching resignation failed:", err.response || err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId) {
      console.error("[ERROR] employeeId undefined. Cannot submit resignation.");
      alert("❌ Cannot submit resignation. Employee not logged in.");
      return;
    }

    setLoading(true);
    console.log("[DEBUG] Submitting resignation:", { employeeId, reason, lastWorkingDay });

    try {
      const res = await axios.post("https://hrms-project-1-eca3.onrender.com/api/resignations/apply", {
        employeeId,
        reason,
        lastWorkingDay,
      });

      console.log("[DEBUG] Resignation submitted successfully:", res.data);

      // ✅ Update local state immediately without waiting for fetch
      if (res.data && res.data.resignation) {
        setResignation(res.data.resignation);
        setMessage(res.data.message || "Resignation submitted successfully!");
        alert(res.data.message || "✅ Resignation submitted successfully!");
      }

      setReason("");
      setLastWorkingDay("");
    } catch (err) {
      console.error("[ERROR] Resignation submission failed:", err.response || err);
      alert("❌ Error submitting resignation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Resignation</h2>

      {resignation ? (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Reason</th>
              <th className="border p-2">Last Working Day</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="border p-2">{resignation.reason}</td>
              <td className="border p-2">{new Date(resignation.lastWorkingDay).toLocaleDateString()}</td>
              <td className="border p-2">{resignation.status}</td>
              <td className="border p-2">{new Date(resignation.submittedAt).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Reason</label>
            <textarea
              className="w-full border p-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why are you resigning?"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Last Working Day</label>
            <input
              type="date"
              className="w-full border p-2"
              value={lastWorkingDay}
              onChange={(e) => setLastWorkingDay(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600"}`}
          >
            {loading ? "Submitting..." : "Submit Resignation"}
          </button>
        </form>
      )}

      {message && <p className="mt-3 text-green-600">{message}</p>}
    </div>
  );
};

export default ResignationForm;
