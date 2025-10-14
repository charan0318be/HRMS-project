import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema({
  assetName: { type: String, required: true },
  assetType: { type: String, required: true },
  assignedTo: { type: String, default: "" },
  status: {
    type: String,
    enum: ["Available", "Assigned", "Under Maintenance"],
    default: "Available",
  },
  purchaseDate: { type: Date, default: Date.now },
});

const Asset = mongoose.model("Asset", AssetSchema);
export default Asset;
