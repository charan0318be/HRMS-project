import React, { useState } from "react";

const Calender = ({ isAdmin = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({}); // store events by date
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventText, setEventText] = useState("");

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    if (!isAdmin) return; // only admin can select
    setSelectedDate(day);
    setEventText(events[day] || "");
  };

  const handleAddEvent = () => {
    if (!eventText || !selectedDate) return;
    setEvents({ ...events, [selectedDate]: eventText });
    setSelectedDate(null);
    setEventText("");
  };

  const calendar = generateCalendar();

  return (
    <div className="w-full p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Prev
        </button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={handleNextMonth}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
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
                ${hasEvent ? "bg-blue-200 hover:bg-blue-300" : ""}
              `}
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
            Add Event for {selectedDate}{" "}
            {currentDate.toLocaleString("default", { month: "long" })}
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
