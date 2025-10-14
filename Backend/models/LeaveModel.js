import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  name: String,
  leaveType: String,
  startDate: String,
  endDate: String,
  duration: String,
  resumptionDate: String,
  reason: String,
  reliefOfficer: String,
  status: { type: String, default: "Pending" }
}, { timestamps: true });

export default mongoose.model("Leave", leaveSchema);
