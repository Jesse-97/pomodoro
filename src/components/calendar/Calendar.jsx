import { useState, useEffect } from "react";
import "./Calendar.css";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [taskData, setTaskData] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("pomodoroTasks");
      return savedTasks ? JSON.parse(savedTasks) : {};
    } catch (e) {
      console.error("Failed to load tasks:", e);
      return {};
    }
  });
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    localStorage.setItem("pomodoroTasks", JSON.stringify(taskData));
  }, [taskData]);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const getDateString = (date) => date.toISOString().split("T")[0];

  const getCompletionPercentage = (date) => {
    const dateStr = getDateString(date);
    const tasks = taskData[dateStr];

    if (!tasks || tasks.length === 0) return 0;

    const completed = tasks.filter((t) => t.done).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getHeatmapColor = (percentage) => {
    if (percentage === 0) return "#e5e7eb";
    if (percentage <= 25) return "#9af4b2";
    if (percentage <= 50) return "#85e595";
    if (percentage <= 75) return "#56ea78";
    return "#08c03f";
  };

  const isToday = (date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date) => {
    return (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleAddTask = () => {
    if (!selectedDate || !newTaskText.trim()) return;

    const dateStr = getDateString(selectedDate);
    const updatedTasks = [...(taskData[dateStr] || [])];
    updatedTasks.push({ text: newTaskText, done: false });

    setTaskData({
      ...taskData,
      [dateStr]: updatedTasks,
    });
    setNewTaskText("");
  };

  const handleToggleTask = (index) => {
    if (!selectedDate) return;

    const dateStr = getDateString(selectedDate);
    const updatedTasks = [...(taskData[dateStr] || [])];
    updatedTasks[index].done = !updatedTasks[index].done;

    setTaskData({
      ...taskData,
      [dateStr]: updatedTasks,
    });
  };

  const handleDeleteTask = (index) => {
    if (!selectedDate) return;

    const dateStr = getDateString(selectedDate);
    const updatedTasks = (taskData[dateStr] || []).filter((_, i) => i !== index);

    if (updatedTasks.length === 0) {
      const newData = { ...taskData };
      delete newData[dateStr];
      setTaskData(newData);
    } else {
      setTaskData({
        ...taskData,
        [dateStr]: updatedTasks,
      });
    }
  };

  const days = [];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  for (let date = 1; date <= daysInMonth; date++) {
    days.push(new Date(year, month, date));
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const selectedDateStr = selectedDate ? getDateString(selectedDate) : null;
  const selectedTasks = selectedDateStr ? (taskData[selectedDateStr] || []) : [];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2 className="month">{monthName}</h2>
        <div className="calendar-controls">
          <button onClick={prevMonth} className="nav-btn">
            ←
          </button>
          <button onClick={nextMonth} className="nav-btn">
            →
          </button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {weekDays.map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((date, index) => (
          <div key={index} className="calendar-day-wrapper">
            {date ? (
              <div
                className={`calendar-day ${isToday(date) ? "today" : ""} ${
                  isSelected(date) ? "selected" : ""
                }`}
                style={{
                  backgroundColor: getHeatmapColor(getCompletionPercentage(date)),
                }}
                onClick={() => setSelectedDate(date)}
              >
                <span className="day-number">{date.getDate()}</span>
                <span className="day-percentage">
                  {getCompletionPercentage(date)}%
                </span>
              </div>
            ) : (
              <div className="calendar-day empty"></div>
            )}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="tasks-panel">
          <div className="panel-header">
            <h3>
              {selectedDate.toLocaleDateString("default", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </h3>
            {isToday(selectedDate) && (
              <span className="today-badge">Today</span>
            )}
          </div>

          <div className="add-task">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              placeholder="Add a new task..."
              className="task-input"
            />
            <button onClick={handleAddTask} className="add-btn">
              +
            </button>
          </div>

          <div className="tasks-list">
            {selectedTasks.length === 0 ? (
              <p className="no-tasks">No tasks for this day</p>
            ) : (
              selectedTasks.map((task, idx) => (
                <div key={idx} className="task-item">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => handleToggleTask(idx)}
                    className="task-checkbox"
                  />
                  <span className={`task-text ${task.done ? "done" : ""}`}>
                    {task.text}
                  </span>
                  <button
                    onClick={() => handleDeleteTask(idx)}
                    className="delete-btn"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="panel-footer">
            <p className="completion-info">
              {selectedTasks.filter((t) => t.done).length} of{" "}
              {selectedTasks.length} completed
            </p>
          </div>
        </div>
      )}

      <div className="heatmap-legend">
        <p>Task Completion:</p>
        <div className="legend-items">
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#e5e7eb" }}
            ></div>
            <span>0%</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#9af4b2" }}
            ></div>
            <span>1-25%</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#85e595" }}
            ></div>
            <span>25-50%</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#56ea78" }}
            ></div>
            <span>50-75%</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#08c03f" }}
            ></div>
            <span>75-100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
