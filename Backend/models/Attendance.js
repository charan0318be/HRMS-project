// models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date },
  totalHours: { type: Number },
  status: { type: String },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
