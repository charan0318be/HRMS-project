import React, { useState, useEffect } from "react";
import axios from "axios";

const AttendanceDashboard = ({ isAdmin = false }) => {
  const userId = localStorage.getItem("userId");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    try {
      if (isAdmin) {
        // ✅ Admin sees all employee attendance
        const res = await axios.get("http://localhost:3001/attendance");
        setRecords(res.data);
      } else {
        // ✅ User sees only their own attendance
        const res = await axios.get(`http://localhost:3001/attendance/${userId}`);
        setRecords(res.data);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      await axios.post("http://localhost:3001/attendance/checkin", { userId });
      await fetchAttendance();
      alert("Checked in successfully");
    } catch (err) {
      alert(err.response?.data || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      await axios.put("http://localhost:3001/attendance/checkout", { userId });
      await fetchAttendance();
      alert("Checked out successfully");
    } catch (err) {
      alert(err.response?.data || "Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {isAdmin ? "Employee Attendance Overview" : "Your Attendance Dashboard"}
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          {isAdmin
            ? "View all employees' attendance records."
            : "Track your working hours and attendance status."}
        </p>

        {/* ✅ Only show check-in/out for users */}
        {!isAdmin && (
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={handleCheckIn}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Check-in
            </button>
            <button
              onClick={handleCheckOut}
              disabled={loading}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Check-out
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isAdmin ? "All Attendance Records" : "Your Attendance Records"}
        </h2>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              {isAdmin && <th className="p-2">Employee ID</th>}
              <th className="p-2">Date</th>
              <th className="p-2">Check-in</th>
              <th className="p-2">Check-out</th>
              <th className="p-2">Hours</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? "6" : "5"} className="p-4 text-center text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r._id} className="border-t text-center">
                  {isAdmin && <td className="p-2">{r.userId}</td>}
                  <td className="p-2">{r.date}</td>
                  <td className="p-2">
                    {r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : "-"}
                  </td>
                  <td className="p-2">
                    {r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : "-"}
                  </td>
                  <td className="p-2">{r.totalHours || "-"}</td>
                  <td
                    className={`p-2 font-semibold ${
                      r.status === "Half Day" ? "text-yellow-600" : "text-green-600"
                    }`}
                  >
                    {r.status || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
