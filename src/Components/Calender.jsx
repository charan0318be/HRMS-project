import React, { useState, useEffect } from "react";
import axios from "axios";

const Calender = ({ isAdmin = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventText, setEventText] = useState("");

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Fetch all events from backend
 useEffect(() => {
axios.get("https://hrms-project-1-eca3.onrender.com
/api/calendar")
    .then((res) => {
      if (Array.isArray(res.data)) {
        const eventMap = {};
        res.data.forEach((item) => {
          const day = new Date(item.date).getDate();
          eventMap[day] = item.eventText;
        });
        setEvents(eventMap);
      }
    })
    .catch((err) => console.error(err));
}, [currentDate]);

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = getDaysInMonth(month, year);

    const calendar = [];
    let day = 1;

    for (let row = 0; row < 6; row++) {
      const week = [];
      for (let col = 0; col < 7; col++) {
        if ((row === 0 && col < firstDay) || day > totalDays) {
          week.push(null);
        } else {
          week.push(day);
          day++;
        }
      }
      calendar.push(week);
    }
    return calendar;
  };

  const handlePrevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDateClick = (day) => {
    if (!isAdmin) return;
    setSelectedDate(day);
    setEventText(events[day] || "");
  };

  const handleAddEvent = async () => {
  if (!eventText || !selectedDate) return;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const date = `${year}-${String(month).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;

  try {
    await axios.post("https://hrms-project-1-eca3.onrender.com
/api/calendar", { date, eventText });
    setEvents({ ...events, [selectedDate]: eventText });
    setSelectedDate(null);
    setEventText("");
  } catch (err) {
    console.error(err);
  }
};
  const calendar = generateCalendar();

  return (
    <div className="w-full p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          Prev
        </button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </h2>
        <button onClick={handleNextMonth} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          Next
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 text-center font-semibold border-b pb-1">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-1 text-center mt-2">
        {calendar.flat().map((day, idx) => {
          const hasEvent = day && events[day];
          return (
            <div
              key={idx}
              className={`h-16 flex flex-col items-center justify-center rounded cursor-pointer transition
                ${day ? "bg-gray-100 hover:bg-gray-200" : ""}
                ${hasEvent ? "bg-blue-200 hover:bg-blue-300" : ""}`}
              onClick={() => day && handleDateClick(day)}
            >
              <div className="font-semibold">{day || ""}</div>
              {hasEvent && (
                <div className="text-xs mt-1 bg-blue-600 text-white px-1 rounded truncate w-full">
                  {events[day]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Event (Admin Only) */}
      {isAdmin && selectedDate && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h3 className="mb-2 font-semibold">
            Add Event for {selectedDate} {currentDate.toLocaleString("default", { month: "long" })}
          </h3>
          <input
            type="text"
            value={eventText}
            onChange={(e) => setEventText(e.target.value)}
            className="border px-2 py-1 w-full rounded mb-2"
            placeholder="Event description"
          />
          <button
            onClick={handleAddEvent}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Save Event
          </button>
        </div>
      )}
    </div>
  );
};

export default Calender;
