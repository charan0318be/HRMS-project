import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Goals = () => {
  const [targets, setTargets] = useState([]);
  const [progressInputs, setProgressInputs] = useState({});

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const res = await axios.get("https://hrms-project-1-eca3.onrender.com/targets");
        setTargets(res.data);
      } catch (err) {
        console.error(err);
        setTargets([]);
      }
    };
    fetchTargets();
  }, []);

  const handleUpdateProgress = async (targetId) => {
    const progress = progressInputs[targetId];
    if (!progress || progress < 0 || progress > 100) {
      alert("Enter a valid progress between 0-100%");
      return;
    }

    try {
      await axios.put(`https://hrms-project-1-eca3.onrender.com
/targets/${targetId}/progress`, {
        progress: Number(progress),
      });
      alert("Progress updated successfully");
      setProgressInputs({ ...progressInputs, [targetId]: "" });

      // Refresh targets
      const res = await axios.get("https://hrms-project-1-eca3.onrender.com/targets");
      setTargets(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to update progress");
    }
  };

  return (
    <div className="mx-6 mt-6 bg-white p-6 rounded shadow">
      <h2 className="text-xl text-center font-bold mb-4">KPI Goals</h2>
      {targets.length === 0 ? (
        <p className="text-gray-600 text-center">No KPI Targets set yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 border-collapse text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Title</th>
                <th className="border border-gray-300 p-2">KPI Weight</th>
                <th className="border border-gray-300 p-2">Employees</th>
                <th className="border border-gray-300 p-2">Start Date</th>
                <th className="border border-gray-300 p-2">End Date</th>
                <th className="border border-gray-300 p-2">Progress</th>
                <th className="border border-gray-300 p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {targets.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{t.title}</td>
                  <td className="border border-gray-300 p-2">{t.kpiWeight}%</td>
                  <td className="border border-gray-300 p-2">{t.employees.join(", ")}</td>
                  <td className="border border-gray-300 p-2">{t.startDate}</td>
                  <td className="border border-gray-300 p-2">{t.endDate}</td>
                  <td className="border border-gray-300 p-2">{t.progress || 0}%</td>
                  <td className="border border-gray-300 p-2 flex justify-center items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={progressInputs[t._id] || ""}
                      onChange={(e) =>
                        setProgressInputs({ ...progressInputs, [t._id]: e.target.value })
                      }
                      className="w-16 p-1 border rounded text-center"
                    />
                    <button
                      onClick={() => handleUpdateProgress(t._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Goals;
