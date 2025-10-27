import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  head: String,
  branch: String,
  status: { type: String, default: "Active" },
  employees: [
    {
      employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
      role: { type: String, default: "Employee" }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Department", departmentSchema);
