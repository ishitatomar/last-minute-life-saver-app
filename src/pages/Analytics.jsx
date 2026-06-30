import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { getTasks } from "../services/taskService";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const STATUS_COLORS = [
  "#22C55E",
  "#FACC15",
  "#EF4444",
];

export default function Analytics() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getTasks();
      setTasks(data);
    }

    load();
  }, []);

  // =======================
  // Statistics
  // =======================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    task => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    task => !task.completed
  ).length;

  const overdueTasks = tasks.filter(
    task =>
      !task.completed &&
      task.dueDate &&
      new Date(task.dueDate) < new Date()
  ).length;

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  // =======================
  // Pie Chart
  // =======================

  const pieData = [
    {
      name: "Completed",
      value: completedTasks,
    },
    {
      name: "Pending",
      value: pendingTasks,
    },
    {
      name: "Overdue",
      value: overdueTasks,
    },
  ];

  // =======================
  // Categories
  // =======================

  const categoryMap = {};

  tasks.forEach(task => {
    const category =
      task.category || "Other";

    categoryMap[category] =
      (categoryMap[category] || 0) + 1;
  });

  const categoryData =
    Object.keys(categoryMap).map(
      category => ({
        category,
        tasks: categoryMap[category],
      })
    );

  // =======================
  // Upcoming Tasks
  // =======================

  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .sort(
      (a, b) =>
        new Date(a.dueDate) -
        new Date(b.dueDate)
    )
    .slice(0, 5);
    return (
<div className="min-h-screen bg-slate-950 text-white lg:flex">
    {/* ================= SIDEBAR ================= */}

<div className="hidden lg:block w-72 bg-slate-900 border-r border-slate-800 p-6">
      <h1 className="text-3xl font-bold text-cyan-400 mb-10">
        📊 Analytics
      </h1>

      <div className="space-y-3">

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3 transition"
        >
          🏠 Dashboard
        </button>

        <button
          onClick={() => navigate("/calendar")}
          className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3 transition"
        >
          📅 Calendar
        </button>

        <button
          onClick={() => navigate("/chat")}
          className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3 transition"
        >
          🤖 AI Assistant
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3 transition"
        >
          👤 Profile
        </button>

      </div>

      <hr className="my-8 border-slate-700" />

      <div className="space-y-5">
        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">
            Overdue Tasks
          </p>

          <h2 className="text-4xl font-bold mt-2 text-red-400">
            {overdueTasks}
          </h2>
        </div>

      </div>

    </div>
{/* Mobile Sidebar */}

{sidebarOpen && (
  <>
    <div
      className="fixed inset-0 bg-black/60 z-40 lg:hidden"
      onClick={() => setSidebarOpen(false)}
    />

    <div className="fixed left-0 top-0 h-full w-72 bg-slate-900 z-50 p-6 lg:hidden">

      <button
        onClick={() => setSidebarOpen(false)}
        className="mb-6"
      >
        ✕ Close
      </button>

      <h1 className="text-3xl font-bold text-cyan-400 mb-8">
        📊 Analytics
      </h1>

      <div className="space-y-3">

        <button
          onClick={()=>{
            navigate("/dashboard");
            setSidebarOpen(false);
          }}
          className="w-full text-left bg-slate-800 rounded-xl p-3"
        >
          🏠 Dashboard
        </button>

        <button
          onClick={()=>{
            navigate("/calendar");
            setSidebarOpen(false);
          }}
          className="w-full text-left bg-slate-800 rounded-xl p-3"
        >
          📅 Calendar
        </button>

        <button
          onClick={()=>{
            navigate("/chat");
            setSidebarOpen(false);
          }}
          className="w-full text-left bg-slate-800 rounded-xl p-3"
        >
          🤖 AI Assistant
        </button>

        <button
          onClick={()=>{
            navigate("/profile");
            setSidebarOpen(false);
          }}
          className="w-full text-left bg-slate-800 rounded-xl p-3"
        >
          👤 Profile
        </button>

      </div>

    </div>
  </>
)}
    {/* ================= MAIN CONTENT ================= */}

<div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
<div className="flex items-center gap-4 mb-6">

  <button
    className="lg:hidden bg-slate-900 p-3 rounded-xl"
    onClick={() => setSidebarOpen(true)}
  >
    <FiMenu size={24} />
  </button>

  <h1 className="text-2xl sm:text-4xl font-bold">
    📊 Analytics Dashboard
  </h1>

</div>        
      {/* ================= KPI CARDS ================= */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">

        <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-lg">
          <p className="text-gray-400">
            Total Tasks
          </p>

<h2 className="text-2xl sm:text-4xl font-bold mt-2 text-cyan-400">            {totalTasks}
          </h2>
        </div>

        <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-lg">
          <p className="text-gray-400">
            Completed
          </p>

          <h2 className="text-2xl sm:text-4xl font-bold mt-2 text-green-400">
            {completedTasks}
          </h2>
        </div>

        <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-lg">
          <p className="text-gray-400">
            Pending
          </p>

          <h2 className="text-2xl sm:text-4xl font-bold mt-2 text-yellow-400">
            {pendingTasks}
          </h2>
        </div>

        <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-lg">
          <p className="text-gray-400">
            Completion
          </p>

<h2 className="text-2xl sm:text-4xl font-bold mt-2 text-violet-400">
              {completionRate}%
          </h2>
        </div>

      </div>

      {/* ================= CHARTS ================= */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}

        <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl">

<h2 className="text-xl sm:text-2xl font-bold mb-6">
              📌 Task Status
          </h2>

          <ResponsiveContainer width="100%" height={280}>

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={80}
                label
              >

                {pieData.map((entry, index) => (

                  <Cell
                    key={index}
                    fill={STATUS_COLORS[index]}
                  />

                ))}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* Category Chart */}

<div className="bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl">
<h2 className="text-xl sm:text-2xl font-bold mb-6">
              📚 Tasks by Category
          </h2>

          <ResponsiveContainer width="100%" height={280}>

            <BarChart data={categoryData}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                dataKey="category"
                stroke="#CBD5E1"
              />

              <YAxis
                stroke="#CBD5E1"
              />

              <Tooltip />

              <Bar
                dataKey="tasks"
                fill="#06B6D4"
                radius={[10,10,0,0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>
            {/* ================= PRODUCTIVITY ================= */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl">

<h2 className="text-xl sm:text-2xl font-bold mb-6">
              ⭐ Productivity
          </h2>

          <div className="w-full bg-slate-700 rounded-full h-5 overflow-hidden">

            <div
              className="bg-gradient-to-r from-cyan-500 to-violet-500 h-5 rounded-full transition-all duration-500"
              style={{
                width: `${completionRate}%`,
              }}
            />

          </div>

<div className="mt-6 flex justify-between text-sm sm:text-lg">
            <span className="text-gray-300">
              Progress
            </span>

            <span className="font-bold text-cyan-400">
              {completionRate}%
            </span>

          </div>

          <p className="mt-5 text-gray-400">
            {completionRate >= 80
              ? "🔥 Excellent! You're completing most of your tasks."
              : completionRate >= 50
              ? "👍 Good progress. Keep going!"
              : "💡 Try completing pending tasks to improve your productivity."}
          </p>

        </div>

        {/* ================= UPCOMING TASKS ================= */}

        <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl">

<h2 className="text-xl sm:text-2xl font-bold mb-6">            📅 Upcoming Deadlines
          </h2>

          {upcomingTasks.length === 0 ? (

            <div className="text-gray-400">
              No upcoming tasks.
            </div>

          ) : (

            upcomingTasks.map((task) => (

              <div
  key={task.id}
  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-slate-700 py-4"
>

                <div>

                  <h3 className="font-semibold">
                    {task.title}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {task.category}
                  </p>

                </div>

<div className="text-cyan-400 font-semibold text-sm sm:text-base">                  {task.dueDate}
                </div>

              </div>

            ))

          )}

        </div>

      </div>

      {/* ================= AI INSIGHTS ================= */}

      <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl">         

          <div className="bg-slate-800 rounded-xl p-4">
            💡 Recommendation:
            <br />
            Focus on completing high-priority and overdue tasks first to
            improve your productivity score.
          </div>

        

      </div>

    </div>

  </div>
);
}