import React, { useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";

const AdminMeetings = ({ activeSubmenu = "Meeting", setActiveSection }) => {
  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    meetingLink: "",
    _id: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch meetings
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://hrms-project-1-eca3.onrender.com
/api/meetings");
      setMeetings(res.data || []);
    } catch (err) {
      console.error("Fetch meetings error:", err);
      setError("Failed to fetch meetings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();

    const onNewMeeting = (meeting) => {
      if (!meeting?._id) return;
      setMeetings((prev) => {
        if (prev.some((m) => m._id === meeting._id)) return prev;
        return [...prev, meeting];
      });
    };

    const onDeleteMeeting = (id) => {
      if (!id) return;
      setMeetings((prev) => prev.filter((m) => m._id !== id));
    };

    socket.on("newMeeting", onNewMeeting);
    socket.on("deleteMeeting", onDeleteMeeting);

    return () => {
      socket.off("newMeeting", onNewMeeting);
      socket.off("deleteMeeting", onDeleteMeeting);
    };
  }, []);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      let res;
      if (form._id) {
        // Update meeting
        res = await axios.put(
          `https://hrms-project-1-eca3.onrender.com
/api/meetings/${form._id}`,
          form
        );
        setMeetings((prev) =>
          prev.map((m) => (m._id === form._id ? res.data : m))
        );
      } else {
        // Create new meeting
        res = await axios.post("https://hrms-project-1-eca3.onrender.com
/api/meetings", form);
        setMeetings((prev) => [...prev, res.data]);
        try {
          socket.emit("newMeeting", res.data);
        } catch {}
      }

      setForm({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        meetingLink: "",
        _id: null,
      });

      if (setActiveSection) setActiveSection("Meeting");
    } catch (err) {
      console.error("Submit meeting error:", err);
      setError("Failed to save meeting");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Invalid meeting ID:", id);
      return;
    }
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;

    try {
      await axios.delete(`https://hrms-project-1-eca3.onrender.com
/api/meetings/${id}`);
      setMeetings((prev) => prev.filter((m) => m._id !== id));
      try {
        socket.emit("deleteMeeting", id);
      } catch {}
    } catch (err) {
      console.error("Delete meeting error:", err);
      alert(err.response?.data?.error || "Failed to delete meeting");
    }
  };

  const handleEdit = (meeting) => {
    setForm(meeting);
    if (setActiveSection) setActiveSection("New Meeting");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow">
      <h2 className="text-2xl text-center font-bold mb-4">Meetings</h2>

      {activeSubmenu === "New Meeting" ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-inner"
        >
          {error && <div className="text-red-600">{error}</div>}

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Meeting Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter meeting title"
              className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Enter meeting description"
              className="w-full p-2 border rounded resize-none focus:ring focus:ring-blue-200"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Meeting Link (optional)
            </label>
            <input
              type="text"
              name="meetingLink"
              value={form.meetingLink}
              onChange={handleChange}
              placeholder="Paste meeting URL"
              className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : form._id ? "Update Meeting" : "Create Meeting"}
            </button>
            <button
              type="button"
              onClick={() => setActiveSection && setActiveSection("Meeting")}
              className="px-5 py-2 border rounded hover:bg-gray-100"
            >
              Cancel / View Meetings
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">All Meetings</h3>
            <button
              onClick={() => setActiveSection && setActiveSection("New Meeting")}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              New Meeting
            </button>
          </div>

          {loading ? (
            <div>Loading meetings...</div>
          ) : meetings.length === 0 ? (
            <div className="text-gray-600">No meetings scheduled.</div>
          ) : (
            <ul className="space-y-2">
              {meetings
                .slice()
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((m) => (
                  <li
                    key={m._id}
                    className="border p-3 rounded flex flex-col md:flex-row md:justify-between"
                  >
                    <div>
                      <div className="font-semibold">{m.title}</div>
                      <div className="text-sm text-gray-600">
                        {m.date} ({m.startTime} - {m.endTime})
                      </div>
                      {m.description && <div className="mt-1">{m.description}</div>}
                      {m.meetingLink && (
                        <a
                          href={m.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 mt-1 inline-block"
                        >
                          Join Link
                        </a>
                      )}
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => handleEdit(m)}
                        className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 h-6"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m._id)}
                        className="bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700 h-6"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminMeetings;
