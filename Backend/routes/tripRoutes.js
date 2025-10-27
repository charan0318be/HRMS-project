import express from "express";
import Trip from "../models/Trip.js";
const router = express.Router();

// ➕ Add Trip
router.post("/add", async (req, res) => {
  try {
    const trip = new Trip(req.body);
    await trip.save();
    res.status(201).json(trip);
  } catch (err) {
    console.error("[ERROR] Add trip failed:", err);
    res.status(500).json({ message: err.message });
  }
});

// 📄 Get all Trips
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (err) {
    console.error("[ERROR] Fetch trips failed:", err);
    res.status(500).json({ message: err.message });
  }
});

// 📝 Update Trip Status
router.put("/:id", async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(trip);
  } catch (err) {
    console.error("[ERROR] Update trip failed:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
