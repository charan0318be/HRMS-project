import mongoose from "mongoose";

const targetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    kpiWeight: { type: Number, required: true },
    description: String,

    employees: [{ type: String }], // array of assigned employees (IDs or names)
    startDate: Date,
    endDate: Date,

    progress: { type: Number, default: 0 }, // employee updates this
    status: { type: String, default: "Pending" }, // "Pending", "In Progress", "Completed", "Approved"

    // 🔹 Manager review fields
    managerRemarks: { type: String, default: "" }, // feedback or comments
    managerApproved: { type: Boolean, default: false }, // true after approval

    // 🔹 Optional appraisal scoring fields
    rating: { type: Number, default: 0 }, // manager can rate 1–5
    appraisalScore: { type: Number, default: 0 } // final computed performance score
  },
  { timestamps: true }
);

export default mongoose.model("Target", targetSchema);
