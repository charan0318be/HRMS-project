import express from "express";
import Resignation from "../models/Resignation.js";
import Employee from "../models/Employee.js";

const router = express.Router();

// Employee submits resignation
router.post("/apply", async (req, res) => {
  try {
    const { employeeId, reason, lastWorkingDay } = req.body;
    const resignation = new Resignation({ employeeId, reason, lastWorkingDay });
    await resignation.save();
    res.status(201).json({ message: "Resignation submitted", resignation });
  } catch (err) {
    res.status(500).json({ message: "Error applying resignation", error: err.message });
  }
});

// HR views all resignation requests
router.get("/all", async (req, res) => {
  try {
    const resignations = await Resignation.find()
      .populate("employeeId", "name email department")
      .sort({ submittedAt: -1 });
    res.json(resignations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching resignations", error: err.message });
  }
});

// HR approves/rejects resignation
router.put("/update/:id", async (req, res) => {
  try {
    const { status, hrComments } = req.body;
    const updated = await Resignation.findByIdAndUpdate(
      req.params.id,
      { status, hrComments },
      { new: true }
    ).populate("employeeId", "name email department");
    res.json({ message: "Resignation updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating resignation", error: err.message });
  }
});

// Employee views their own resignation status
router.get("/my/:employeeId", async (req, res) => {
  try {
    const resignation = await Resignation.findOne({ employeeId: req.params.employeeId })
      .populate("employeeId", "name email department");
    res.json(resignation);
  } catch (err) {
    res.status(500).json({ message: "Error fetching resignation", error: err.message });
  }
});

export default router;
