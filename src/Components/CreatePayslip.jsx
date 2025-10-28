import React, { useState, useEffect } from "react";
import axios from "axios";

const CreatePayslip = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: "",
    month: "",
    basic: 0,
    hra: 0,
    allowances: 0,
    deductions: 0,
    netSalary: 0,
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await axios.get("https://hrms-project-1-eca3.onrender.com/employees");
      setEmployees(res.data);
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (["basic", "hra", "allowances", "deductions"].includes(name)) {
      const basic = name === "basic" ? Number(value) : Number(formData.basic);
      const hra = name === "hra" ? Number(value) : Number(formData.hra);
      const allowances = name === "allowances" ? Number(value) : Number(formData.allowances);
      const deductions = name === "deductions" ? Number(value) : Number(formData.deductions);
      setFormData(prev => ({ ...prev, netSalary: basic + hra + allowances - deductions }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://hrms-project-1-eca3.onrender.com/payslip", formData);
      alert("Payslip created successfully!");
      setFormData({
        employeeId: "",
        month: "",
        basic: 0,
        hra: 0,
        allowances: 0,
        deductions: 0,
        netSalary: 0,
      });
    } catch (err) {
      console.error(err);
      alert("Error creating payslip");
    }
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-[0_2px_6px_rgba(0,0,0,0.5)] rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Create Payslip</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <input
              type="month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Salary Components */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Basic</label>
              <input
                type="number"
                name="basic"
                value={formData.basic}
                onChange={handleChange}
                placeholder="Basic Salary"
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">HRA</label>
              <input
                type="number"
                name="hra"
                value={formData.hra}
                onChange={handleChange}
                placeholder="House Rent Allowance"
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allowances</label>
              <input
                type="number"
                name="allowances"
                value={formData.allowances}
                onChange={handleChange}
                placeholder="Other Allowances"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
              <input
                type="number"
                name="deductions"
                value={formData.deductions}
                onChange={handleChange}
                placeholder="Deductions"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Net Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Net Salary</label>
            <input
              type="number"
              name="netSalary"
              value={formData.netSalary}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-700"
            />
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
            >
              Create Payslip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePayslip;
