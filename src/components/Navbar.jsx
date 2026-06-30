export default function Navbar() {
  return (
    <div className="bg-slate-900 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
      <h2 className="text-2xl font-bold text-white">
        Dashboard
      </h2>

      <p className="text-cyan-400 font-semibold text-sm sm:text-base">
        AI Productivity Companion
      </p>
    </div>
  );
}