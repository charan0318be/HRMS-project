import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminTrip = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3001/api/trips");
      setTrips(res.data);
    } catch (err) {
      console.error("Fetch trips failed:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrips();
    const interval = setInterval(fetchTrips, 5000); // Auto-refresh
    return () => clearInterval(interval);
  }, []);

  const handleApproveReject = async (tripId, status) => {
    try {
      await axios.put(`http://localhost:3001/api/trips/${tripId}`, { status });
      setShowModal(false);
      fetchTrips();
    } catch (err) {
      console.error("Update trip failed:", err);
    }
  };

  const openModal = (trip) => {
    setSelectedTrip(trip);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
        Admin Trip Management
      </h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white rounded shadow divide-y divide-gray-200 text-center">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Employee</th>
                <th className="px-4 py-2">Purpose</th>
                <th className="px-4 py-2">Destination</th>
                <th className="px-4 py-2">Start Date</th>
                <th className="px-4 py-2">End Date</th>
                <th className="px-4 py-2">Estimated Cost</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trips.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4 text-gray-500">
                    No trips found
                  </td>
                </tr>
              ) : (
                trips.map((trip) => (
                  <tr key={trip._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{trip.employeeName}</td>
                    <td className="px-4 py-2">{trip.purpose}</td>
                    <td className="px-4 py-2">{trip.destination}</td>
                    <td className="px-4 py-2">
                      {new Date(trip.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(trip.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{trip.estimatedCost}</td>
                    <td className="px-4 py-2">
                      {trip.status === "Pending" ? (
                        <button
                          onClick={() => openModal(trip)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          View
                        </button>
                      ) : (
                        <span className="font-semibold">{trip.status}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Approve/Reject */}
      {showModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96 relative shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4">Trip Details</h2>
            <div className="space-y-2 text-left">
              <p>
                <strong>Employee:</strong> {selectedTrip.employeeName}
              </p>
              <p>
                <strong>Purpose:</strong> {selectedTrip.purpose}
              </p>
              <p>
                <strong>Destination:</strong> {selectedTrip.destination}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(selectedTrip.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {new Date(selectedTrip.endDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Estimated Cost:</strong> {selectedTrip.estimatedCost}
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => handleApproveReject(selectedTrip._id, "Approved")}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleApproveReject(selectedTrip._id, "Rejected")}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrip;
