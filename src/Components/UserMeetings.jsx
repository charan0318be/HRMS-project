import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

const UserMeetings = () => {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    fetchMeetings();

    socket.on("newMeeting", (meeting) => {
      setMeetings((prev) => [...prev, meeting]);
    });

    return () => socket.off("newMeeting");
  }, []);

  const fetchMeetings = async () => {
    const res = await axios.get("http://localhost:3001/api/meetings");
    setMeetings(res.data);
  };

  return (
    <div className="p-6 max-w-2xl text-center bg-white rounded-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Meetings</h2>
      <ul className="space-y-2">
        {meetings.map((m) => (
          <li key={m._id} className="border p-2 rounded">
            <b>{m.title}</b> — {m.date} ({m.startTime} - {m.endTime}) <br />
            {m.meetingLink && (
              <a href={m.meetingLink} className="text-blue-600" target="_blank">
                Join Link
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserMeetings;
