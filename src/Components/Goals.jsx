import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Goals = () => {
  const [targets, setTargets] = useState([]);

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const res = await axios.get("http://localhost:3001/targets");
        setTargets(res.data);
      } catch (err) {
        console.error(err);
        setTargets([]);
      }
    };
    fetchTargets();
  }, []);

  return (
    <div className="mx-6 mt-6 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">KPI Goals</h2>
      {targets.length === 0 ? (
        <p className="text-gray-600">No KPI Targets set yet.</p>
      ) : (
        <table className="w-full border border-gray-300 border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">KPI Weight</th>
              <th className="border border-gray-300 p-2">Employees</th>
              <th className="border border-gray-300 p-2">Start Date</th>
              <th className="border border-gray-300 p-2">End Date</th>
            </tr>
          </thead>
          <tbody>
            {targets.map((t) => (
              <tr className="hover:bg-gray-50" key={t._id}>
                <td className="p-2 border border-gray-300">{t.title}</td>
                <td className="p-2 border border-gray-300">{t.kpiWeight}</td>
                <td className="p-2 border border-gray-300">{t.employees.join(", ")}</td>
                <td className="p-2 border border-gray-300">{t.startDate}</td>
                <td className="p-2 border border-gray-300">{t.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Goals
