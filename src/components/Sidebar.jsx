import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white p-6 shadow-xl">
      <h1 className="text-2xl font-bold text-cyan-400 mb-10">
        Last Minute
      </h1>

      <nav className="space-y-4">

        <Link
          to="/dashboard"
          className="block p-3 rounded-lg hover:bg-slate-800 hover:text-cyan-400 transition"
        >
          🏠 Dashboard
        </Link>

        <Link
          to="/chat"
          className="block p-3 rounded-lg hover:bg-slate-800 hover:text-cyan-400 transition"
        >
          🤖 AI Assistant
        </Link>

        <Link
          to="/calendar"
          className="block p-3 rounded-lg hover:bg-slate-800 hover:text-cyan-400 transition"
        >
          📅 Calendar
        </Link>

        <Link
          to="/analytics"
          className="block p-3 rounded-lg hover:bg-slate-800 hover:text-cyan-400 transition"
        >
          📊 Analytics
        </Link>

        <Link
          to="/profile"
          className="block p-3 rounded-lg hover:bg-slate-800 hover:text-cyan-400 transition"
        >
          👤 Profile
        </Link>

      </nav>
    </aside>
  );
}