import express from "express";
import Asset from "../models/Asset.js";

const router = express.Router();

// ➕ Add Asset
router.post("/add", async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📄 Get All Assets
router.get("/", async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🗑️ Delete Asset
router.delete("/:id", async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ message: "Asset deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
