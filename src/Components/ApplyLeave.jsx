import React, { useState, useEffect } from 'react';
import { useProfile } from './ProfileContext';
import axios from 'axios';
import AnnualLeave from './AnnualLeave';

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

  // Fetch user's leave history from backend
  useEffect(() => {
    const fetchUserLeaves = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const res = await axios.get(`http://localhost:3001/leave/user/${userId}`);
        setLeaveHistory(res.data);
      } catch (err) {
        console.error('Error fetching user leaves:', err);
      }
    };
    fetchUserLeaves();
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
    setLeaveHistory((prev) => {
      if (editEntry && editEntry._id) {
        // Replace the edited leave
        return prev.map((entry) =>
          entry._id === editEntry._id ? newLeave : entry
        );
      } else {
        // Add new leave
        return [newLeave, ...prev];
      }
    });

    setShowForm(false);
    setEditEntry(null);
    alert(editEntry ? 'Leave updated successfully!' : 'Leave submitted successfully!');
  };

  // Delete handler
  const handleDelete = async (id) => {
  // Step 1: Ask user for confirmation
  const confirmDelete = window.confirm('Are you sure you want to delete this leave?');
  if (!confirmDelete) return; // Stop if user clicks "Cancel"

  console.log("Deleting leave with ID:", id);

  try {
    const res = await axios.delete(`http://localhost:3001/leave/${id}`);
    console.log("Delete response:", res.data);

    // Remove from local state
    setLeaveHistory(prev => prev.filter(entry => entry.id !== id));
    alert('Leave deleted successfully!');
  } catch (err) {
    console.error('Error deleting leave:', err.response || err);
    alert('Failed to delete leave.');
  }
};


  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Apply for Leave</h1>

      {/* Leave Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {leaveTypes.map(({ type, days }) => (
          <div
            key={type}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
          >
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
                <th className="px-4 py-2 border">Relief Officer</th>
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
                leaveHistory.map((entry, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2 border">{entry.name}</td>
                    <td className="px-4 py-2 border">{entry.duration}</td>
                    <td className="px-4 py-2 border">{entry.startDate}</td>
                    <td className="px-4 py-2 border">{entry.endDate}</td>
                    <td className="px-4 py-2 border">{entry.leaveType}</td>
                    <td className="px-4 py-2 border">{entry.reason}</td>
                    <td className="px-4 py-2 border">{entry.reliefOfficer}</td>
                    <td className="px-4 py-2 border">{entry.status}</td>
                    <td className="px-4 py-4 border   flex gap-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-white font-bold border  px-1 ph-2 bg-green-600  rounded hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="text-black border rounded px-1 ph-2 font-bold bg-red-600 hover:underline"
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
          onClose={() => {
            setShowForm(false);
            setEditEntry(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default ApplyLeave;
