import mongoose from "mongoose";

const resignationSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  reason: { type: String, default: "" },
  lastWorkingDay: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  submittedAt: { type: Date, default: Date.now },
  hrComments: { type: String, default: "" },
});

export default mongoose.model("Resignation", resignationSchema);
