import mongoose from "mongoose";

const appraisalSchema = new mongoose.Schema(
  {
    targetId: { type: mongoose.Schema.Types.ObjectId, ref: "Target", required: true },
    employeeId: { type: String, required: true },
    score: { type: Number, required: true },
    feedback: { type: String, required: true },
    assignedTask: { type: String },       // Admin assigns next task or comment
    adminRemarks: { type: String },       // Admin feedback
    status: { type: String, default: "submitted" }, // submitted | approved | needs improvement
    adminReviewed: { type: Boolean, default: false }, // true when admin saved feedback
    isAdminFinalized: { type: Boolean, default: false }, // ✅ new field - lock after admin save
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent duplicate appraisals for same employee & target
appraisalSchema.index({ employeeId: 1, targetId: 1 }, { unique: true });

export default mongoose.model("Appraisal", appraisalSchema);
