// routes/attendance.js
import express from "express";
import Attendance from "../models/Attendance.js";

const router = express.Router();

// POST /checkin
router.post("/checkin", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).send("userId is required");

  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD (UTC)

  try {
    const existing = await Attendance.findOne({ userId, date });
    if (existing) return res.status(400).send("Already checked in");

    const record = new Attendance({ userId, date, checkIn: new Date() });
    await record.save();

    res.status(200).send("Checked in successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// PUT /checkout
router.put("/checkout", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).send("userId is required");

  const date = new Date().toISOString().split("T")[0];

  try {
    const record = await Attendance.findOne({ userId, date });
    if (!record) return res.status(400).send("No check-in found for today");
    if (record.checkOut) return res.status(400).send("Already checked out");

    const checkOut = new Date();
    const totalHours = (checkOut - new Date(record.checkIn)) / (1000 * 60 * 60); // hours
    const status = totalHours < 4 ? "Half Day" : "Full Day";

    record.checkOut = checkOut;
    record.totalHours = totalHours.toFixed(2);
    record.status = status;

    await record.save();

    res.status(200).send("Checked out successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// GET /:userId
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).send("userId is required");

  try {
    const records = await Attendance.find({ userId }).sort({ date: -1 });
    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
