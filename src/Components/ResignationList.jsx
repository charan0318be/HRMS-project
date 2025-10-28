import React, { useEffect, useState } from "react";
import axios from "axios";

const ResignationList = () => {
  const [resignations, setResignations] = useState([]);

  const fetchResignations = async () => {
    const res = await axios.get("https://hrms-project-1-eca3.onrender.com/api/resignations/all");
    setResignations(res.data);
  };

  const handleUpdate = async (id, status) => {
    await axios.put(`https://hrms-project-1-eca3.onrender.com
/api/resignations/update/${id}`, { status });
    fetchResignations();
  };
 

  useEffect(() => {
    fetchResignations();
  }, []);

  return (
    <div className="p-6 bg-white rounded shadow max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Resignation Requests</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Employee</th>
            <th className="border p-2">Reason</th>
            <th className="border p-2">Last Working Day</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {resignations.map((r) => (
            <tr key={r._id} className="hover:bg-gray-50">
              <td className="border p-2">{r.employeeId.name}</td>
              <td className="border p-2">{r.reason}</td>
              <td className="border p-2">{new Date(r.lastWorkingDay).toLocaleDateString()}</td>
              <td className="border p-2">{r.status}</td>
              <td className="border p-2 space-x-1">
                {r.status === "Pending" && (
                  <>
                    <button
                      className="bg-green-600 text-white px-2 py-1 rounded"
                      onClick={() => handleUpdate(r._id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleUpdate(r._id, "Rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResignationList;
