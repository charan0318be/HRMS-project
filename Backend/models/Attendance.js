import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  date: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date },
  totalHours: { type: Number },
  status: { type: String, default: "Present" },
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);
