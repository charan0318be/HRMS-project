import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  purpose: { type: String, required: true },
  employeeName: { type: String },
  status: {
    type: String,
    enum: ["Planned", "Completed", "Cancelled"],
    default: "Planned",
  },
  createdAt: { type: Date, default: Date.now },
});

const Trip = mongoose.model("Trip", TripSchema);
export default Trip;
