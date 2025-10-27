import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employeeId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Employee", 
      required: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    leaveType: { 
      type: String, 
      enum: ["Annual", "Sick", "Maternity", "Casual"], 
      required: true 
    },
    startDate: { 
      type: Date, 
      required: true 
    },
    endDate: { 
      type: Date, 
      required: true 
    },
    duration: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    resumptionDate: { 
      type: Date, 
      required: true 
    },
    reason: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["Pending", "Approved", "Rejected"], 
      default: "Pending" 
    },
    handoverFile: { 
      type: String, // path to uploaded file
      default: null 
    }
  },
  { 
    timestamps: true // automatically adds createdAt and updatedAt
  }
);

const LeaveModel = mongoose.model("Leave", leaveSchema);
export default LeaveModel;
