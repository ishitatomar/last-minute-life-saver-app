import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { FiMenu } from "react-icons/fi";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import StatsSection from "../components/dashboard/StatsSection";

import {
  addTask,
  getTasks,
  deleteTask,
} from "../services/taskService";

export default function Dashboard() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [category, setCategory] = useState("Study");

  async function loadTasks() {
    const data = await getTasks();
    setTasks(data);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function createTask() {
    if (!title.trim()) return;

    await addTask({
      title,
      description,
      priority,
      dueDate,
      estimatedTime,
      category,
      completed: false,
      createdAt: new Date(),
      userId: auth.currentUser.uid,
    });

    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setEstimatedTime("");
    setCategory("Study");

    loadTasks();
  }

  async function removeTask(id) {
    await deleteTask(id);
    loadTasks();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white lg:flex">
      {/* Mobile Sidebar Overlay */}
{sidebarOpen && (
  <>
    {/* Background */}
    <div
      className="fixed inset-0 bg-black/60 z-40 lg:hidden"
      onClick={() => setSidebarOpen(false)}
    />

    {/* Sidebar */}
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 z-50 lg:hidden shadow-2xl">
      <Sidebar />
    </div>
  </>
)}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">

<div className="flex items-center gap-3 mb-4">

  {/* Mobile Menu Button */}
  <button
    className="lg:hidden bg-slate-900 p-3 rounded-xl"
    onClick={() => setSidebarOpen(true)}
  >
    <FiMenu size={24} />
  </button>

  <div className="flex-1">
    <Navbar />
  </div>

</div>
        {/* Stats */}
        <div className="mt-6">
          <StatsSection tasks={tasks} />
        </div>

        {/* Add Task */}
        <section className="bg-slate-900 rounded-2xl p-5 sm:p-8 mt-8 shadow-lg">

          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Add New Task
          </h2>

          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg bg-slate-800 border border-slate-700 outline-none"
          />

          <textarea
            rows="4"
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg bg-slate-800 border border-slate-700 outline-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
            >
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
            />

            <input
              type="text"
              placeholder="Estimated Time"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
            >
              <option>Study</option>
              <option>Work</option>
              <option>Hackathon</option>
              <option>Meeting</option>
              <option>Health</option>
              <option>Personal</option>
              <option>Other</option>
            </select>

          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">

            <button
              onClick={createTask}
              className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold transition"
            >
              ➕ Add Task
            </button>

            <button
              onClick={() => navigate("/chat")}
              className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded-xl font-semibold transition"
            >
              🤖 Open AI Assistant
            </button>

          </div>

        </section>

        {/* Tasks */}
        <section className="mt-10">

          <h2 className="text-2xl sm:text-3xl font-bold mb-5">
            My Tasks
          </h2>

          {tasks.length === 0 ? (
            <div className="bg-slate-900 rounded-xl p-8 text-center text-gray-400">
              No tasks available.
            </div>
          ) : (
            <div className="space-y-5">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={removeTask}
                  refresh={loadTasks}
                />
              ))}
            </div>
          )}

        </section>

      </main>

    </div>
  );
}