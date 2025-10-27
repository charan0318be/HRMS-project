import express from "express";
import mongoose from "mongoose";
import Asset from "../models/Asset.js";

const router = express.Router();

// ➕ Add Asset
router.post("/add", async (req, res) => {
  console.log("[DEBUG] /add body:", req.body); // log incoming payload

  try {
    const asset = new Asset(req.body);
    const saved = await asset.save();
    res.json(saved);
  } catch (err) {
    console.error("[ERROR] Saving asset failed:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});


// 📄 Get all assets
router.get("/", async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    console.error("[ERROR] Fetch assets failed:", err);
    res.status(500).json({ message: err.message });
  }
});

// 📝 Update asset
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid asset ID" });
    }

    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    console.log("[DEBUG] Asset updated:", asset);
    res.json(asset);
  } catch (err) {
    console.error("[ERROR] Update asset failed:", err);
    res.status(500).json({ message: err.message });
  }
});

// 🗑️ Delete asset
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid asset ID" });
    }

    await Asset.findByIdAndDelete(req.params.id);
    console.log("[DEBUG] Asset deleted:", req.params.id);
    res.json({ message: "Asset deleted" });
  } catch (err) {
    console.error("[ERROR] Delete asset failed:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
