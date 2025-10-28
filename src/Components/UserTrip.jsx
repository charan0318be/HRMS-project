import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { useProfile } from "./ProfileContext";

const UserTrip = () => {
  const { profileName } = useProfile() || { profileName: "User" };

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    purpose: "",
    destination: "",
    startDate: "",
    endDate: "",
    estimatedCost: "",
    employeeName: profileName,
    status: "Pending",
  });

  // Fetch trips for the logged-in employee
  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://hrms-project-1-eca3.onrender.com/api/trips");
      setTrips(res.data.filter((t) => t.employeeName === profileName));
    } catch (err) {
      console.error("Fetch trips failed:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrips();
    const interval = setInterval(fetchTrips, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Add new trip
  const handleAddTrip = async (e) => {
    e.preventDefault();
    if (!formData.purpose || !formData.destination || !formData.startDate || !formData.endDate || !formData.estimatedCost) {
      alert("Please fill all fields");
      return;
    }
    try {
      await axios.post("https://hrms-project-1-eca3.onrender.com/api/trips/add", formData);
      setShowModal(false);
      setFormData({
        purpose: "",
        destination: "",
        startDate: "",
        endDate: "",
        estimatedCost: "",
        employeeName: profileName,
        status: "Pending",
      });
      fetchTrips();
    } catch (err) {
      console.error("Add trip failed:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Add Trip button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">My Trips</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-2xl flex items-center gap-2 hover:bg-blue-600"
        >
          <FaPlus /> Add Trip
        </button>
      </div>

      {/* Trips Table */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white rounded shadow divide-y divide-gray-200 text-center">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Purpose</th>
                <th className="px-4 py-2">Destination</th>
                <th className="px-4 py-2">Start Date</th>
                <th className="px-4 py-2">End Date</th>
                <th className="px-4 py-2">Estimated Cost</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trips.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4 text-gray-500">
                    No trips found
                  </td>
                </tr>
              ) : (
                trips.map((trip) => (
                  <tr key={trip._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{trip.purpose}</td>
                    <td className="px-4 py-2">{trip.destination}</td>
                    <td className="px-4 py-2">{new Date(trip.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{new Date(trip.endDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{trip.estimatedCost}</td>
                    <td className="px-4 py-2">{trip.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Trip Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4">Add New Trip</h2>
            <form onSubmit={handleAddTrip} className="space-y-3">
              <input
                type="text"
                placeholder="Purpose"
                required
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full border px-2 py-1 rounded"
              />
              <input
                type="text"
                placeholder="Destination"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full border px-2 py-1 rounded"
              />
              <input
                type="date"
                placeholder="Start Date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full border px-2 py-1 rounded"
              />
              <input
                type="date"
                placeholder="End Date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full border px-2 py-1 rounded"
              />
              <input
                type="number"
                placeholder="Estimated Cost"
                required
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                className="w-full border px-2 py-1 rounded"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2 w-full"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTrip;
