import React, { useState, useEffect } from 'react';
import { useProfile } from './ProfileContext';
import axios from 'axios';
import AnnualLeave from './AnnualLeave';
import socket from "../socket";

const leaveTypes = [
  { type: 'Annual', days: 60 },
  { type: 'Sick', days: 20 },
  { type: 'Maternity', days: 60 },
  { type: 'Casual', days: 30 },
];

const ApplyLeave = () => {
  const { profileName } = useProfile();
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [editEntry, setEditEntry] = useState(null);
  const [leaveHistory, setLeaveHistory] = useState([]);

  // Fetch leave history & setup socket
  useEffect(() => {
    let isMounted = true;

    const fetchUserLeaves = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(`http://localhost:3001/leave/user/${userId}`);
        if (isMounted) {
          const uniqueLeaves = Array.from(
            new Map(res.data.map(l => [l._id, l])).values()
          );
          setLeaveHistory(uniqueLeaves);
        }
      } catch (err) {
        console.error("❌ Error fetching user leaves:", err);
      }
    };

    fetchUserLeaves();

    // Socket listeners
    const handleLeaveAdded = (newLeave) => {
      setLeaveHistory(prev => {
        if (prev.find(l => l._id === newLeave._id)) return prev;
        return [newLeave, ...prev];
      });
    };

    const handleLeaveUpdated = (updatedLeave) => {
      setLeaveHistory(prev => prev.map(l => l._id === updatedLeave._id ? updatedLeave : l));
    };

    const handleLeaveDeleted = (data) => {
      setLeaveHistory(prev => prev.filter(l => l._id !== data.id));
    };

    socket.on("leaveAdded", handleLeaveAdded);
    socket.on("leaveUpdated", handleLeaveUpdated);
    socket.on("leaveDeleted", handleLeaveDeleted);

    return () => {
      isMounted = false;
      socket.off("leaveAdded", handleLeaveAdded);
      socket.off("leaveUpdated", handleLeaveUpdated);
      socket.off("leaveDeleted", handleLeaveDeleted);
    };
  }, []);

  const handleApplyClick = (type) => {
    setSelectedType(type);
    setEditEntry(null);
    setShowForm(true);
  };

  const handleEdit = (entry) => {
    setEditEntry(entry);
    setSelectedType(entry.leaveType);
    setShowForm(true);
  };

  const handleFormSubmit = (newLeave) => {
    // Only close form, leaveHistory updates via socket
    setShowForm(false);
    setEditEntry(null);
    alert(editEntry ? 'Leave updated successfully!' : 'Leave submitted successfully!');
  };

  const handleDelete = async (leaveId) => {
    if (!window.confirm("Are you sure you want to delete this leave?")) return;

    try {
      await axios.delete(`http://localhost:3001/leave/${leaveId}`);
      socket.emit("leaveDeleted", { id: leaveId }); // emit deletion
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete leave");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Apply for Leave</h1>

      {/* Leave Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {leaveTypes.map(({ type, days }) => (
          <div key={type} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">{type} Leave</h3>
              <p className="text-sm text-gray-500">{days} days available</p>
            </div>
            <button
              onClick={() => handleApplyClick(type)}
              className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Apply
            </button>
          </div>
        ))}
      </div>

      {/* Leave History Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Leave History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Duration (d)</th>
                <th className="px-4 py-2 border">Start Date</th>
                <th className="px-4 py-2 border">End Date</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Reason</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    No leave records yet.
                  </td>
                </tr>
              ) : (
                leaveHistory.map(entry => (
                  <tr key={entry._id} className="border-t">
                    <td className="px-4 py-2 border">{entry.name}</td>
                    <td className="px-4 py-2 border">{entry.duration}</td>
                    <td className="px-4 py-2 border">{entry.startDate}</td>
                    <td className="px-4 py-2 border">{entry.endDate}</td>
                    <td className="px-4 py-2 border">{entry.leaveType}</td>
                    <td className="px-4 py-2 border">{entry.reason}</td>
                    <td className="px-4 py-2 border">{entry.status}</td>
                    <td className="px-4 py-4 border flex gap-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-white font-bold border px-1 py-2 bg-green-600 rounded hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="text-black border rounded px-1 py-2 font-bold bg-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <AnnualLeave
          leaveType={selectedType}
          initialData={editEntry}
          profileName={profileName}
          onClose={() => { setShowForm(false); setEditEntry(null); }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default ApplyLeave;
