import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  startTime: String,
  endTime: String,
  meetingLink: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "Scheduled" },
});

export default mongoose.model("Meeting", meetingSchema);
