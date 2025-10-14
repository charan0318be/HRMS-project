import React, { useState, useEffect } from 'react';
import axios from 'axios';

const tabs = ['Leave Settings', 'Leave Recall', 'Leave History', 'Relief Officers'];

const LeaveManagement = ({ onLeaveApplied }) => {
  const [activeTab, setActiveTab] = useState('Leave Settings');
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [formMode, setFormMode] = useState(null); // 'view' or 'recall'
  const [formData, setFormData] = useState({
    newResumptionDate: '',
    reliefOfficer: '',
    reason: ''
  });

  // Fetch all leaves on mount
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get('http://localhost:3001/leave/all');
        const uniqueLeaves = Array.from(new Map(res.data.map(l => [l._id, l])).values());
        setLeaveHistory(uniqueLeaves);
      } catch (err) {
        console.error('Error fetching leaves:', err);
      }
    };
    fetchLeaves();
  }, []);

  // Populate recall form
  useEffect(() => {
    if (formMode === 'recall' && selectedLeave) {
      setFormData({
        newResumptionDate: selectedLeave.resumptionDate || '',
        reliefOfficer: '',
        reason: ''
      });
    }
  }, [formMode, selectedLeave]);

  const handleRecallSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLeave) return;

    try {
      const recallData = {
        ...selectedLeave,
        reasonToRecall: formData.reason,
        newResumptionDate: formData.newResumptionDate,
        reliefOfficer: formData.reliefOfficer,
      };
      await axios.post('http://localhost:3001/recall', recallData);
      onLeaveApplied?.();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedLeave) return;
    try {
      const res = await axios.put(`http://localhost:3001/leave/${selectedLeave._id}/status`, { status });
      setLeaveHistory(prev =>
        prev.map(l => (l._id === selectedLeave._id ? res.data : l))
      );
      onLeaveApplied?.();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormMode(null);
    setSelectedLeave(null);
    setFormData({ newResumptionDate: '', reliefOfficer: '', reason: '' });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Leave Management</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => resetForm() || setActiveTab(tab)}
            className={`px-4 py-2 rounded-md font-semibold ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-yellow-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Leave History & Recall Table */}
      {(activeTab === 'Leave History' || activeTab === 'Leave Recall') && !formMode && (
        <table className="min-w-full text-sm border border-gray-200 mb-6">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Duration</th>
              <th className="px-4 py-2 border">Reason</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveHistory.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">No leave records yet.</td>
              </tr>
            ) : (
              leaveHistory.map(entry => (
                <tr key={entry._id} className="border-t">
                  <td className="px-4 py-2 border">{entry.name}</td>
                  <td className="px-4 py-2 border">{entry.leaveType}</td>
                  <td className="px-4 py-2 border">{entry.duration}</td>
                  <td className="px-4 py-2 border">{entry.reason}</td>
                  <td className="px-4 py-2 border">{entry.status}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => {
                        setSelectedLeave(entry);
                        setFormMode(activeTab === 'Leave History' ? 'view' : 'recall');
                      }}
                      className="text-yellow-600 hover:underline"
                    >
                      {activeTab === 'Leave History' ? 'View' : 'Recall'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* View Leave Form */}
      {formMode === 'view' && selectedLeave && (
        <div className="bg-white p-6 rounded shadow-md max-w-xl">
          <h2 className="text-xl font-bold mb-4">Review Leave Request</h2>
          <div className="space-y-1">
            {['Name','Type','Duration','Reason','Start Date','End Date','Resumption Date','Relief Officer'].map((label, idx) => (
              <p key={idx}><strong>{label}:</strong> {selectedLeave[label.toLowerCase().replace(/ /g,'')] || ''}</p>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            <button onClick={() => handleStatusUpdate('Approved')} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
            <button onClick={() => handleStatusUpdate('Rejected')} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
            <button onClick={resetForm} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
          </div>
        </div>
      )}

      {/* Recall Form */}
      {formMode === 'recall' && selectedLeave && (
        <form onSubmit={handleRecallSubmit} className="bg-white p-6 rounded shadow-md max-w-xl space-y-4">
          <h2 className="text-xl font-bold mb-4">Recall Leave</h2>
          <p><strong>Name:</strong> {selectedLeave.name}</p>
          <p><strong>Start Date:</strong> {selectedLeave.startDate}</p>
          <p><strong>End Date:</strong> {selectedLeave.endDate}</p>
          <p><strong>Resumption Date:</strong> {selectedLeave.resumptionDate}</p>

          <input
            type="date"
            value={formData.newResumptionDate}
            onChange={e => setFormData({...formData, newResumptionDate: e.target.value})}
            required
            className="w-full border px-4 py-2 rounded"
            placeholder="New Resumption Date"
          />
          <input
            type="text"
            value={formData.reliefOfficer}
            onChange={e => setFormData({...formData, reliefOfficer: e.target.value})}
            className="w-full border px-4 py-2 rounded"
            placeholder="Relief Officer"
          />
          <input
            type="text"
            value={formData.reason}
            onChange={e => setFormData({...formData, reason: e.target.value})}
            required
            className="w-full border px-4 py-2 rounded"
            placeholder="Reason to Recall"
          />

          <div className="flex gap-4">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Initiate</button>
            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      )}

      {/* Leave Settings */}
      {activeTab === 'Leave Settings' && (
        <div className="bg-white p-6 rounded shadow-md max-w-xl">
          <h2 className="text-xl font-bold mb-4">Configure Leave Plan</h2>
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <input type="text" className="w-full border px-4 py-2 rounded" placeholder="Leave Plan Name" required />
            <input type="number" className="w-full border px-4 py-2 rounded" placeholder="Duration (days)" required />
            <select className="w-full border px-4 py-2 rounded" required>
              <option value="">Select Leave Allocation</option>
              <option value="senior">Senior Level</option>
              <option value="mid">Mid Level</option>
              <option value="junior">Junior Level</option>
            </select>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Create</button>
          </form>
        </div>
      )}

      {/* Relief Officers */}
      {activeTab === 'Relief Officers' && (
        <div className="bg-white p-6 rounded shadow-md max-w-xl">
          <h2 className="text-xl font-bold mb-4">Relief Officers</h2>
          <p className="text-gray-600">Relief officer management goes here.</p>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
