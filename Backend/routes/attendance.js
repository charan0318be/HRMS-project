import express from "express";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

const router = express.Router();

// Helper: get YYYY-MM-DD format
function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// --- Check-in
router.post("/checkin", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "userId is required" });

  const date = getTodayDate();

  try {
    const existing = await Attendance.findOne({ userId, date });
    if (existing) return res.status(400).json({ message: "Already checked in today" });

    const record = new Attendance({
      userId,
      date,
      checkIn: new Date(),
      status: "Present",
    });

    await record.save();
    res.status(200).json({ message: "Checked in successfully", record });
  } catch (err) {
    console.error("Check-in error:", err);
    res.status(500).json({ message: "Server error during check-in", error: err.message });
  }
});

// --- Check-out
router.put("/checkout", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "userId is required" });

  const date = getTodayDate();

  try {
    const record = await Attendance.findOne({ userId, date });
    if (!record) return res.status(400).json({ message: "No check-in found for today" });
    if (record.checkOut) return res.status(400).json({ message: "Already checked out" });

    const checkOutTime = new Date();
    const totalHours = (checkOutTime - record.checkIn) / (1000 * 60 * 60);

    record.checkOut = checkOutTime;
    record.totalHours = parseFloat(totalHours.toFixed(2));
    record.status = totalHours < 4 ? "Half Day" : "Full Day";

    await record.save();
    res.status(200).json({ message: "Checked out successfully", record });
  } catch (err) {
    console.error("Check-out error:", err);
    res.status(500).json({ message: "Server error during check-out", error: err.message });
  }
});

// --- Stats (Admin Dashboard) - MUST be before /user/:userId
// --- Stats (Admin Dashboard)
router.get("/stats", async (req, res) => {
  try {
    // Total employees from Employee collection
    const totalEmployees = await Employee.countDocuments();

    const today = getTodayDate();
    const todaysAttendance = await Attendance.find({ date: today });

    const checkedIn = todaysAttendance.filter(a => a.checkIn).length;
    const onLeave = todaysAttendance.filter(a =>
      a.status.toLowerCase().includes("leave")
    ).length;

    res.json({ totalEmployees, checkedIn, onLeave });
  } catch (err) {
    console.error("Error fetching attendance stats:", err);
    res.status(500).json({ message: "Failed to fetch attendance stats", error: err.message });
  }
});


// --- Fetch attendance by userId
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const records = await Attendance.find({ userId }).sort({ date: -1 });
    res.status(200).json(records);
  } catch (err) {
    console.error("Fetch attendance error:", err);
    res.status(500).json({ message: "Server error fetching attendance", error: err.message });
  }
});

// --- Fetch all attendance (Admin)
router.get("/", async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    res.status(200).json(records);
  } catch (err) {
    console.error("Fetch all attendance error:", err);
    res.status(500).json({ message: "Server error fetching all attendance", error: err.message });
  }
});

export default router;
