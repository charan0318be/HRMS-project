import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  destination: { type: String, required: true },
  purpose: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  estimatedCost: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Completed"],
    default: "Pending",
  },
});

const Trip = mongoose.model("Trip", TripSchema);
export default Trip;
