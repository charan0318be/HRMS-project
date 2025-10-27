import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  date: { type: String, required: true },
  eventText: { type: String, required: true },
});

export default mongoose.model("Event", eventSchema);
