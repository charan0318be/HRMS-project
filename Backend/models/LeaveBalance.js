// models/LeaveBalance.js
import mongoose from "mongoose";

const LeaveBalanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  leaveType: { type: String, required: true },
  totalDays: { type: Number, default: 12 },
  usedDays: { type: Number, default: 0 }
});

export default mongoose.model("LeaveBalance", LeaveBalanceSchema);
