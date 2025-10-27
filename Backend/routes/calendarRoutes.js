import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

// ✅ Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events); // always return an array
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add or update event
router.post("/", async (req, res) => {
  try {
    const { date, eventText } = req.body;
    let event = await Event.findOne({ date });

    if (event) {
      event.eventText = eventText;
      await event.save();
      return res.json(event);
    } else {
      const newEvent = new Event({ date, eventText });
      await newEvent.save();
      return res.json(newEvent);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
