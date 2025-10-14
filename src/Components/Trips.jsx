import React, { useState, useEffect } from "react";
import axios from "axios";
import { useProfile } from "./ProfileContext";

const Trips = () => {
  const { role } = useProfile() || { role: "user" };
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    purpose: "",
  });

  const fetchTrips = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/trips");
      setTrips(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTrips();

    const interval = setInterval(() => {
      fetchTrips();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAddTrip = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/trips/add", newTrip);
      setNewTrip({ destination: "", startDate: "", endDate: "", purpose: "" });
      fetchTrips();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/trips/${id}`);
      fetchTrips();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Trip Management</h2>

      {role === "admin" && (
        <form onSubmit={handleAddTrip} className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Destination"
            value={newTrip.destination}
            onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
            className="border rounded p-2 w-60"
            required
          />
          <input
            type="date"
            value={newTrip.startDate}
            onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
            className="border rounded p-2 w-60"
            required
          />
          <input
            type="date"
            value={newTrip.endDate}
            onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
            className="border rounded p-2 w-60"
            required
          />
          <input
            type="text"
            placeholder="Purpose"
            value={newTrip.purpose}
            onChange={(e) => setNewTrip({ ...newTrip, purpose: e.target.value })}
            className="border rounded p-2 w-60"
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Trip</button>
        </form>
      )}

      <table className="w-full border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Destination</th>
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
            <th className="border p-2">Purpose</th>
            {role === "admin" && <th className="border p-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip._id} className="text-center">
              <td className="border p-2">{trip.destination}</td>
              <td className="border p-2">{trip.startDate?.split("T")[0]}</td>
              <td className="border p-2">{trip.endDate?.split("T")[0]}</td>
              <td className="border p-2">{trip.purpose}</td>
              {role === "admin" && (
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(trip._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Trips;
