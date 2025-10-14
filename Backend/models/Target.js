import mongoose from "mongoose";

const targetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  kpiWeight: { type: Number, required: true },
  description: String,
  employees: [{ type: String }], // Array of employee IDs
  startDate: Date,
  endDate: Date
}, { timestamps: true });

export default mongoose.model("Target", targetSchema);
