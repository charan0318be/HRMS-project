import axios from 'axios';
import React, { useEffect, useState } from 'react'
import jsPDF from "jspdf";

const ViewPaySlip = () => {
    const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId"); // Get logged-in user ID

  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/payslip/employee/${userId}`
        );
        setPayslips(res.data);
      } catch (err) {
        console.error("Error fetching payslips:", err);
        setPayslips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayslips();
  }, [userId]);

  const handleDownload = (p) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Payslip", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Employee Name: ${p.employeeName || "N/A"}`, 20, 40);
    doc.text(`Month: ${p.month}`, 20, 50);
    doc.text(`Basic: ₹${p.basic}`, 20, 60);
    doc.text(`HRA: ₹${p.hra}`, 20, 70);
    doc.text(`Allowances: ₹${p.allowances}`, 20, 80);
    doc.text(`Deductions: ₹${p.deductions}`, 20, 90);
    doc.text(`Net Salary: ₹${p.netSalary}`, 20, 100);
    doc.text(
      `Date Issued: ${new Date(p.createdAt).toLocaleDateString()}`,
      20,
      110
    );

    doc.save(`${p.employeeName || "Payslip"}_${p.month}.pdf`);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Loading payslips...</p>
      </div>
    );
  }

  if (payslips.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">No payslips available yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 ">Your Payslips</h1>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Month</th>
              <th className="border p-2">Basic</th>
              <th className="border p-2">HRA</th>
              <th className="border p-2">Allowances</th>
              <th className="border p-2">Deductions</th>
              <th className="border p-2">Net Salary</th>
              <th className="border p-2">Date Issued</th>
              <th className="border p-2">Download</th>
            </tr>
          </thead>
          <tbody>
            {payslips.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="border p-2 text-center">{p.month}</td>
                <td className="border p-2 text-center">{p.basic}</td>
                <td className="border p-2 text-center">{p.hra}</td>
                <td className="border p-2 text-center">{p.allowances}</td>
                <td className="border p-2 text-center">{p.deductions}</td>
                <td className="border p-2 text-center font-bold">{p.netSalary}</td>
                <td className="border p-2 text-center text-sm text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDownload(p)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewPaySlip
