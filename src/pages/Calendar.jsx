import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";


import {
  Calendar,
  momentLocalizer,
} from "react-big-calendar";

import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  getTasks,
  deleteTask,
  toggleTask,
} from "../services/taskService";

import { generateStudyPlan } from "../services/geminiService";

const localizer = momentLocalizer(moment);

export default function CalendarPage() {

  const navigate = useNavigate();
  

  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);

  const [selectedTask, setSelectedTask] = useState(null);

  const [filter, setFilter] = useState("All");

  const [aiSuggestion, setAiSuggestion] = useState("");

  const [currentDate, setCurrentDate] = useState(new Date());

  const [view, setView] = useState("month");

  const [showAI, setShowAI] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function loadTasks() {

    const data = await getTasks();

    setTasks(data);

    const calendarEvents = data
      .filter(task => task.dueDate)
      .map(task => ({
        title: task.title,
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        allDay: true,
        resource: task,
      }));

    setEvents(calendarEvents);

  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function generateAISchedule() {

    if (tasks.length === 0) {
      alert("No tasks available.");
      return;
    }

    const plan = await generateStudyPlan(tasks);

    setAiSuggestion(plan);

    setShowAI(true);

  }

  async function completeTask() {

    if (!selectedTask) return;

    await toggleTask(selectedTask.id, true);

    setSelectedTask(null);

    loadTasks();

  }

  async function removeTask() {

    if (!selectedTask) return;

    const ok = window.confirm("Delete this task?");

    if (!ok) return;

    await deleteTask(selectedTask.id);

    setSelectedTask(null);

    loadTasks();

  }

  function filteredEvents() {

    if (filter === "All")
      return events;

    if (filter === "Pending")
      return events.filter(
        e => !e.resource.completed
      );

    if (filter === "Completed")
      return events.filter(
        e => e.resource.completed
      );

    return events.filter(
      e => e.resource.category === filter
    );

  }

  const eventStyleGetter = (event) => {
  let backgroundColor = "#6366F1"; // Default

  switch (event.resource.priority) {
    case "High":
      backgroundColor = "#EF4444"; // Red
      break;

    case "Medium":
      backgroundColor = "#F59E0B"; // Orange
      break;

    case "Low":
      backgroundColor = "#22C55E"; // Green
      break;

    default:
      backgroundColor = "#6366F1";
  }

  return {
    style: {
      backgroundColor,
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      padding: "4px 8px",
      fontWeight: "600",
      fontSize: "13px",
    },
  };


  }

  function goToday() {
    setCurrentDate(new Date());
  }

  function goPrevious() {

    const date = new Date(currentDate);

    if (view === "month")
      date.setMonth(date.getMonth() - 1);

    else if (view === "week")
      date.setDate(date.getDate() - 7);

    else
      date.setDate(date.getDate() - 1);

    setCurrentDate(date);

  }

  function goNext() {

    const date = new Date(currentDate);

    if (view === "month")
      date.setMonth(date.getMonth() + 1);

    else if (view === "week")
      date.setDate(date.getDate() + 7);

    else
      date.setDate(date.getDate() + 1);

    setCurrentDate(date);

  }

  const today = new Date().toISOString().split("T")[0];

  const todayTasks = tasks.filter(
    task => task.dueDate === today
  );

  const completed = tasks.filter(
    task => task.completed
  ).length;

  const pending = tasks.filter(
    task => !task.completed
  ).length;

  return (
<div className="min-h-screen bg-slate-950 text-white lg:flex">
  {/* ================= SIDEBAR ================= */}

<div className="hidden lg:block w-72 bg-slate-900 border-r border-slate-800 p-6">
    <h1 className="text-3xl font-bold text-cyan-400 mb-10">
      📅 Calendar
    </h1>

    <div className="space-y-3">

      <button
        onClick={() => navigate("/dashboard")}
        className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3 transition"
      >
        🏠 Dashboard
      </button>

      <button
        onClick={() => navigate("/chat")}
        className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3 transition"
      >
        🤖 AI Assistant
      </button>

      <button
        onClick={() => navigate("/analytics")}
        className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3 transition"
      >
        📊 Analytics
      </button>

      <button
        onClick={() => navigate("/profile")}
        className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3 transition"
      >
        👤 Profile
      </button>

    </div>

    <hr className="my-8 border-slate-700" />

    <h2 className="text-xl font-semibold mb-5">
      📌 Today's Tasks
    </h2>

    <div className="space-y-3">

      {todayTasks.length === 0 ? (

        <div className="text-gray-400 text-sm">
          No tasks due today.
        </div>

      ) : (

        todayTasks.map(task => (

          <div
            key={task.id}
            className="bg-slate-800 rounded-xl p-3"
          >
            <div className="font-semibold">
              {task.title}
            </div>

            <div className="text-sm text-gray-400 mt-1">
              {task.priority} Priority
            </div>
          </div>

        ))

      )}

    </div>

    <button
      onClick={generateAISchedule}
      className="mt-8 w-full bg-gradient-to-r from-cyan-500 to-violet-600 rounded-xl py-3 font-semibold hover:scale-105 transition"
    >
      🤖 AI Schedule
    </button>

  </div>
  {/* ================= MOBILE SIDEBAR ================= */}

{sidebarOpen && (
  <>
    {/* Overlay */}
    <div
      className="fixed inset-0 bg-black/60 z-40 lg:hidden"
      onClick={() => setSidebarOpen(false)}
    />

    {/* Drawer */}
    <div className="fixed left-0 top-0 h-full w-72 bg-slate-900 z-50 p-6 overflow-y-auto lg:hidden">

      <button
        onClick={() => setSidebarOpen(false)}
        className="mb-6 text-gray-400"
      >
        ✕ Close
      </button>

      <h1 className="text-3xl font-bold text-cyan-400 mb-8">
        📅 Calendar
      </h1>

      <div className="space-y-3">

        <button
          onClick={() => {
            navigate("/dashboard");
            setSidebarOpen(false);
          }}
          className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3"
        >
          🏠 Dashboard
        </button>

        <button
          onClick={() => {
            navigate("/chat");
            setSidebarOpen(false);
          }}
          className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3"
        >
          🤖 AI Assistant
        </button>

        <button
          onClick={() => {
            navigate("/analytics");
            setSidebarOpen(false);
          }}
          className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3"
        >
          📊 Analytics
        </button>

        <button
          onClick={() => {
            navigate("/profile");
            setSidebarOpen(false);
          }}
          className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3"
        >
          👤 Profile
        </button>

      </div>

      <hr className="my-8 border-slate-700" />

      <button
        onClick={() => {
          generateAISchedule();
          setSidebarOpen(false);
        }}
        className="w-full bg-gradient-to-r from-cyan-500 to-violet-600 rounded-xl py-3 font-semibold"
      >
        🤖 AI Schedule
      </button>

    </div>
  </>
)}

  {/* ================= MAIN CONTENT ================= */}

<div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
    <div className="flex items-center gap-4 mb-6">

  <button
    onClick={() => setSidebarOpen(true)}
    className="lg:hidden bg-slate-900 p-3 rounded-xl"
  >
    <FiMenu size={24} />
  </button>

  <h1 className="text-2xl sm:text-4xl font-bold">
    📅 Smart Calendar
  </h1>

</div>

    {/* ===== Statistics ===== */}

<div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
      <div className="bg-slate-900 rounded-2xl p-4 sm:p-6">
        <p className="text-gray-400">Total Tasks</p>
        <h2 className="text-2xl sm:text-4xl font-bold mt-2 text-cyan-400">
          {tasks.length}
        </h2>
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 sm:p-6">
        <p className="text-gray-400">Pending</p>
        <h2 className="text-2xl sm:text-4xl font-bold mt-2 text-yellow-400">
          {pending}
        </h2>
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 sm:p-6">
        <p className="text-gray-400">Completed</p>
        <h2 className="text-2xl sm:text-4xl font-bold mt-2 text-green-400">
          {completed}
        </h2>
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 sm:p-6">
        <p className="text-gray-400">Due Today</p>
        <h2 className="text-2xl sm:text-4xl font-bold mt-2 text-red-400">
          {todayTasks.length}
        </h2>
      </div>

    </div>

    {/* ===== Legend ===== */}

<div className="flex flex-wrap gap-4 sm:gap-8 mb-6">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-red-500"></div>
        High
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
        Medium
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-green-500"></div>
        Low
      </div>

    </div>

    {/* ===== Category Filters ===== */}

<div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
      {[
        "All",
        "Study",
        "Hackathon",
        "Work",
        "Meeting",
        "Health",
        "Personal",
        "Other",
        "Pending",
        "Completed",
      ].map(item => (

        <button
          key={item}
          onClick={() => setFilter(item)}
className={`px-3 sm:px-5 py-2 rounded-xl text-sm sm:text-base transition ${
              filter === item
              ? "bg-cyan-500"
              : "bg-slate-800 hover:bg-slate-700"
          }`}
        >
          {item}
        </button>

      ))}

    </div>

    
        {/* ================= CALENDAR ================= */}

<div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 p-3 sm:p-6 overflow-x-auto">
<div className="flex items-center justify-between gap-2 sm:gap-6 mb-4">
    <button
    onClick={goPrevious}
    className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700"
  >
    ←
  </button>

<h2 className="text-lg sm:text-3xl font-bold text-white text-center">
          {moment(currentDate).format("MMMM YYYY")}
  </h2>

  <button
    onClick={goNext}
className="px-3 sm:px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700"  >
    →
  </button>

</div>

      <Calendar
        localizer={localizer}
        events={filteredEvents()}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        onNavigate={setCurrentDate}
        view={view}
        onView={setView}
        toolbar={false}
        popup
        selectable
        style={{
  height:
    window.innerWidth < 768
      ? "65vh"
      : "80vh",
}}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) =>
          setSelectedTask(event.resource)
        }
      />

    </div>

    {/* ================= AI SCHEDULE MODAL ================= */}

    {showAI && (

      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

        <div className="bg-slate-900 rounded-2xl w-[800px] max-h-[85vh] overflow-y-auto p-8 shadow-2xl">

          <div className="flex justify-between items-center">

            <h2 className="text-3xl font-bold">
              🤖 AI Suggested Schedule
            </h2>

            <button
              onClick={() => setShowAI(false)}
              className="text-red-400 text-2xl hover:text-red-500"
            >
              ✖
            </button>

          </div>

          <hr className="my-5 border-slate-700" />

          <div className="whitespace-pre-wrap leading-8 text-gray-300">

            {aiSuggestion}

          </div>

        </div>

      </div>

    )}

    {/* ================= TASK DETAILS ================= */}

    {selectedTask && (

      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

        <div className="bg-slate-900 rounded-2xl w-[650px] p-8 shadow-2xl">

          <div className="flex justify-between items-center">

            <h2 className="text-3xl font-bold">
              📌 {selectedTask.title}
            </h2>

            <button
              onClick={() => setSelectedTask(null)}
              className="text-red-400 text-xl hover:text-red-500"
            >
              ✖
            </button>

          </div>

          <hr className="my-5 border-slate-700" />

          <div className="space-y-6">

            <div>

              <h3 className="text-cyan-400 font-semibold">
                Description
              </h3>

              <p className="text-gray-300 mt-2">
                {selectedTask.description || "No description available."}
              </p>

            </div>

            <div className="grid grid-cols-2 gap-5">

              <div className="bg-slate-800 rounded-xl p-4">

                <p className="text-gray-400">
                  Priority
                </p>

                <h3 className="text-xl font-bold mt-2">
                  {selectedTask.priority}
                </h3>

              </div>

              <div className="bg-slate-800 rounded-xl p-4">

                <p className="text-gray-400">
                  Category
                </p>

                <h3 className="text-xl font-bold mt-2">
                  {selectedTask.category}
                </h3>

              </div>

              <div className="bg-slate-800 rounded-xl p-4">

                <p className="text-gray-400">
                  Due Date
                </p>

                <h3 className="text-xl font-bold mt-2">
                  {selectedTask.dueDate}
                </h3>

              </div>

              <div className="bg-slate-800 rounded-xl p-4">

                <p className="text-gray-400">
                  Estimated Time
                </p>

                <h3 className="text-xl font-bold mt-2">
                  {selectedTask.estimatedTime}
                </h3>

              </div>

            </div>

            <div className="flex gap-4 pt-4">

              <button
                onClick={completeTask}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold transition"
              >
                ✅ Mark Complete
              </button>

              <button
                onClick={removeTask}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold transition"
              >
                🗑 Delete Task
              </button>

            </div>

          </div>

        </div>

      </div>

    )}
      </div>

</div>

  );
}