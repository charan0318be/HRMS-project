import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaveManagement = ({ activeSubmenu = "leave-settings", onLeaveApplied }) => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [currentSubmenu, setCurrentSubmenu] = useState(activeSubmenu);
  const [formMode, setFormMode] = useState(null); // "view" or "recall"
  const [formData, setFormData] = useState({
    newResumptionDate: "",
    reason: "",
  });

  // -------------------- Debug Active Submenu --------------------
  useEffect(() => {
    console.log("[DEBUG] activeSubmenu changed:", activeSubmenu);
    setCurrentSubmenu(activeSubmenu);
    resetForm();
  }, [activeSubmenu]);

  // -------------------- Fetch Leaves --------------------
  useEffect(() => {
    const fetchLeaves = async () => {
      console.log("[DEBUG] Fetching leaves from backend...");
      try {
        const res = await axios.get("http://localhost:3001/leave/all");
        console.log("[DEBUG] Leaves fetched:", res.data);
        const uniqueLeaves = Array.from(new Map(res.data.map((l) => [l._id, l])).values());
        setLeaveHistory(uniqueLeaves);
      } catch (err) {
        console.error("[ERROR] Error fetching leaves:", err);
      }
    };
    fetchLeaves();
  }, []);

  // -------------------- Form Data for Recall --------------------
  useEffect(() => {
    console.log("[DEBUG] formMode or selectedLeave changed:", formMode, selectedLeave);
    if (formMode === "recall" && selectedLeave) {
      setFormData({
        newResumptionDate: selectedLeave.resumptionDate || "",
        reason: "",
      });
    }
  }, [formMode, selectedLeave]);

  // -------------------- Reset Form --------------------
  const resetForm = () => {
    console.log("[DEBUG] Resetting form...");
    setFormMode(null);
    setSelectedLeave(null);
    setFormData({ newResumptionDate: "", reason: "" });
  };

  // -------------------- Handle Recall Submission --------------------
  const handleRecallSubmit = async (e) => {
    e.preventDefault();
    console.log("[DEBUG] Recall submit clicked:", selectedLeave, formData);
    if (!selectedLeave) return;
    try {
      const recallData = {
        ...selectedLeave,
        reasonToRecall: formData.reason,
        newResumptionDate: formData.newResumptionDate,
      };
      console.log("[DEBUG] Sending recall data to backend:", recallData);
      const res = await axios.post("http://localhost:3001/recall", recallData);
      console.log("[DEBUG] Recall response:", res.data);
      onLeaveApplied?.();
      resetForm();
    } catch (err) {
      console.error("[ERROR] Recall submission failed:", err);
    }
  };

  // -------------------- Handle Status Update --------------------
  const handleStatusUpdate = async (leave, status) => {
    console.log("[DEBUG] Status update clicked:", leave, status);
    if (!leave) return;
    try {
      const res = await axios.put(
        `http://localhost:3001/leave/${leave._id}/status`,
        { status }
      );
      console.log("[DEBUG] Status update response:", res.data);
      setLeaveHistory((prev) =>
        prev.map((l) => (l._id === leave._id ? res.data : l))
      );
      onLeaveApplied?.();
      resetForm();
    } catch (err) {
      console.error("[ERROR] Status update failed:", err);
    }
  };

  // -------------------- Render Table --------------------
  const renderTable = (data, actionLabel, actionHandler) => {
    console.log("[DEBUG] Rendering table:", data);
    return (
      <div className="overflow-x-auto bg-white rounded shadow-md p-4">
        <table className="min-w-full text-left border-collapse border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Duration</th>
              <th className="px-4 py-2 border">Reason</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((entry) => (
                <tr key={entry._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 border">{entry.name}</td>
                  <td className="px-4 py-2 border">{entry.leaveType}</td>
                  <td className="px-4 py-2 border">{entry.duration}</td>
                  <td className="px-4 py-2 border">{entry.reason}</td>
                  <td className="px-4 py-2 border">{entry.status}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => {
                        console.log("[DEBUG] Table action clicked:", entry);
                        actionHandler(entry);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      {actionLabel}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // -------------------- Render Section --------------------
  const renderSection = () => {
    console.log("[DEBUG] Rendering section:", currentSubmenu, formMode);

    switch (currentSubmenu) {
      case "leave-setting":
        return (
          <div className="flex justify-center mt-20">
            <div className="bg-white p-6 rounded shadow-[0_2px_6px_rgba(0,0,0,0.5)] max-w-xl w-full">
              <h2 className="text-xl text-center font-bold mb-4">Configure Leave Plan</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  className="w-full border px-4 py-2 rounded"
                  placeholder="Leave Plan Name"
                  required
                />
                <input
                  type="number"
                  className="w-full border px-4 py-2 rounded"
                  placeholder="Duration (days)"
                  required
                />
                <select className="w-full border px-4 py-2 rounded" required>
                  <option value="">Select Leave Allocation</option>
                  <option value="senior">Senior Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="junior">Junior Level</option>
                </select>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                  Create
                </button>
              </form>
            </div>
          </div>
        );

      case "leave-history":
        if (!formMode)
          return renderTable(leaveHistory, "View", (entry) => {
            console.log("[DEBUG] View clicked:", entry);
            setSelectedLeave(entry);
            setFormMode("view");
          });
        break;

      case "leave-recall":
        const recallLeaves = leaveHistory.filter((l) => l.status === "Approved");
        if (!formMode)
          return renderTable(recallLeaves, "Recall", (entry) => {
            console.log("[DEBUG] Recall clicked:", entry);
            setSelectedLeave(entry);
            setFormMode("recall");
          });
        break;

      default:
        return <p className="text-gray-600">Select a submenu to manage leaves.</p>;
    }

    // -------------------- View Form --------------------
    if (formMode === "view" && selectedLeave) {
      console.log("[DEBUG] Rendering view form for:", selectedLeave);
      return (
        <div className="bg-white p-6 rounded shadow-md max-w-xl">
          <h2 className="text-xl font-bold mb-4">Review Leave Request</h2>
          <div className="space-y-1">
            {["Name", "Type", "Duration", "Reason", "Start Date", "End Date", "Resumption Date"].map(
              (label, idx) => (
                <p key={idx}>
                  <strong>{label}:</strong>{" "}
                  {selectedLeave[label.toLowerCase().replace(/ /g, "")] || ""}
                </p>
              )
            )}
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleStatusUpdate(selectedLeave, "Approved")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusUpdate(selectedLeave, "Rejected")}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reject
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    // -------------------- Recall Form --------------------
    if (formMode === "recall" && selectedLeave) {
      console.log("[DEBUG] Rendering recall form for:", selectedLeave);
      return (
        <form
          onSubmit={handleRecallSubmit}
          className="bg-white p-6 rounded shadow-md max-w-xl space-y-4"
        >
          <h2 className="text-xl font-bold mb-4">Recall Leave</h2>
          <p><strong>Name:</strong> {selectedLeave.name}</p>
          <p><strong>Start Date:</strong> {selectedLeave.startDate}</p>
          <p><strong>End Date:</strong> {selectedLeave.endDate}</p>
          <p><strong>Resumption Date:</strong> {selectedLeave.resumptionDate}</p>

          <input
            type="date"
            value={formData.newResumptionDate}
            onChange={(e) =>
              setFormData({ ...formData, newResumptionDate: e.target.value })
            }
            required
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="text"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            required
            className="w-full border px-4 py-2 rounded"
            placeholder="Reason to Recall"
          />
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Initiate
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      );
    }

    return null;
  };

  return (
    <div className="p-6 bg-white rounded-2xl min-h-screen ">
      <h1 className="text-3xl font-bold text-center mt-25 text-gray-800 mb-6 capitalize">
         {currentSubmenu.replace("-", " ")}
      </h1>
      {renderSection()}
    </div>
  );
};

export default LeaveManagement;
