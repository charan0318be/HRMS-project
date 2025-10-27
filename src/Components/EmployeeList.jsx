import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye } from "react-icons/fa"; // eye icon

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // for modal view
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAssignedEmployees = async () => {
      try {
        console.log("[DEBUG] Fetching assigned employees...");
        const res = await axios.get("http://localhost:3001/api/departments");
        console.log("[DEBUG] Department data:", res.data);

        const assigned = res.data.flatMap((dept) =>
          (dept.employees || [])
            .filter((emp) => emp.employeeId) // ignore null or unassigned
            .map((emp) => ({
              _id: emp.employeeId._id,
              name: emp.employeeId.name || "Unknown",
              email: emp.employeeId.email || "N/A",
              position: emp.employeeId.position || "Employee",
              role: emp.role || "Employee",
              department: dept.name,
            }))
        );

        setEmployees(assigned);
        console.log("[DEBUG] Flattened assigned employees:", assigned);
      } catch (err) {
        console.error(
          "[ERROR] Fetching assigned employees failed:",
          err.response || err
        );
      }
    };

    fetchAssignedEmployees();
  }, []);

  const handleView = (emp) => {
    setSelectedEmployee(emp);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-6xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Assigned Employees
      </h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Employee Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Position</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Department</th>
            <th className="border p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp._id} className="hover:bg-gray-50">
                <td className="border p-2">{emp.name}</td>
                <td className="border p-2">{emp.email}</td>
                <td className="border p-2">{emp.position}</td>
                <td className="border p-2">{emp.role}</td>
                <td className="border p-2">{emp.department}</td>
                <td className="border p-2 text-center">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleView(emp)}
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="text-center p-4 text-gray-500 font-medium"
              >
                No assigned employees yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              X
            </button>
            <h2 className="text-xl font-semibold mb-4">Employee Details</h2>
            <p><strong>Name:</strong> {selectedEmployee.name}</p>
            <p><strong>Email:</strong> {selectedEmployee.email}</p>
            <p><strong>Position:</strong> {selectedEmployee.position}</p>
            <p><strong>Role:</strong> {selectedEmployee.role}</p>
            <p><strong>Department:</strong> {selectedEmployee.department}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
