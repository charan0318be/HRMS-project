import express from "express";
import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";

const router = express.Router();

// ------------------- CREATE Meeting -------------------
router.post("/", async (req, res) => {
  try {
    const meeting = new Meeting(req.body);
    await meeting.save();

    // Emit real-time event if socket attached
    req.io?.emit("newMeeting", meeting);

    res.status(201).json(meeting);
  } catch (err) {
    console.error("[ERROR] Create meeting:", err);
    res.status(500).json({ message: "Failed to create meeting", error: err.message });
  }
});

// ------------------- GET All Meetings -------------------
router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.json(meetings);
  } catch (err) {
    console.error("[ERROR] Fetch all meetings:", err);
    res.status(500).json({ message: "Failed to fetch meetings", error: err.message });
  }
});

// ------------------- GET Recent 5 Meetings -------------------
router.get("/recent", async (req, res) => {
  try {
    const recentMeetings = await Meeting.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const formatted = recentMeetings.map((m) => ({
      title: m.title,
      date: m.date ? m.date.toISOString().split("T")[0] : null,
      time: m.time,
      status: m.status || "Scheduled",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("[ERROR] Fetch recent meetings:", err);
    res.status(500).json({ message: "Failed to fetch recent meetings", error: err.message });
  }
});

// ------------------- UPDATE Meeting -------------------
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid meeting ID" });
    }

    const updated = await Meeting.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Meeting not found" });

    res.json(updated);
  } catch (err) {
    console.error("[ERROR] Update meeting:", err);
    res.status(500).json({ message: "Failed to update meeting", error: err.message });
  }
});

// ------------------- DELETE Meeting -------------------
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid meeting ID" });
    }

    const deleted = await Meeting.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Meeting not found" });

    res.json({ message: "Meeting deleted successfully" });
  } catch (err) {
    console.error("[ERROR] Delete meeting:", err);
    res.status(500).json({ message: "Failed to delete meeting", error: err.message });
  }
});

export default router;
