import mongoose from "mongoose";

const payslipSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },   // link to user
  month: { type: String, required: true },
  basic: { type: Number, required: true },
  hra: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model("Payslip", payslipSchema);
